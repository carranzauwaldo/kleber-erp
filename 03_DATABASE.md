# 03_DATABASE.md — Diseño de datos de KLEVER ERP

**Proyecto:** KLEVER ERP  
**Estado:** Diseño base / Fase 0  
**Propósito:** Establecer el modelo de datos, sus reglas de integridad, trazabilidad y evolución antes de crear tablas o migraciones.

---

## 1. Decisión base

KLEVER utilizará una **base de datos relacional**, preferiblemente PostgreSQL o un servicio compatible.

Razones principales:

- relaciones fuertes entre viajes, activos, personas, clientes y movimientos financieros;
- transacciones;
- integridad referencial;
- conciliaciones y cierres;
- históricos;
- auditoría;
- reportes financieros y operativos.

La selección definitiva del proveedor se realizará en el documento de infraestructura/costos. El dominio no deberá depender de funciones propietarias innecesarias del proveedor.

---

## 2. Principios no negociables

1. Las entidades de negocio usarán identificadores internos inmutables, preferiblemente UUID.
2. Las tablas multiempresa incluirán `organization_id` cuando corresponda.
3. El aislamiento de organizaciones se aplicará en backend/base de datos, nunca solo en frontend.
4. No se borrarán físicamente viajes, movimientos financieros, cierres, conciliaciones ni auditorías.
5. Los valores históricos que afecten resultados previos no se recalcularán usando configuraciones actuales.
6. Dinero se almacenará en tipos decimales exactos, nunca `float`.
7. Fechas financieras conservarán fecha de negocio; eventos técnicos conservarán timestamp con zona horaria.
8. Toda modificación crítica debe ser atribuible a un usuario o integración.
9. Las migraciones serán versionadas y reproducibles.
10. No se modificará producción manualmente salvo procedimiento excepcional documentado.

---

## 3. Convenciones

Convención sugerida:

- tablas: `snake_case`, plural;
- columnas: `snake_case`;
- claves primarias: `id`;
- claves foráneas: `<entity>_id`;
- creación: `created_at`;
- actualización: `updated_at`;
- actor creador cuando aplique: `created_by`;
- actor modificador cuando aplique: `updated_by`;
- organización: `organization_id`.

No usar nombres ambiguos como `data`, `value`, `type` o `status` sin contexto suficiente.

---

## 4. Núcleo multiempresa

### `organizations`

Representa una empresa/tenant.

Campos conceptuales:

```text
id
legal_name
trade_name
identifier_type
identifier_number
status
currency_code
timezone
created_at
updated_at
```

KLEVER será la primera organización.

No se construirá todavía administración SaaS completa, planes, billing ni onboarding comercial.

---

## 5. Identidad y acceso

### `users`

Cuenta de acceso al sistema.

```text
id
email
name
status
last_login_at
created_at
updated_at
```

### `organization_users`

Permite que una cuenta pueda pertenecer a una o más organizaciones en el futuro.

```text
id
organization_id
user_id
status
created_at
```

### `roles`

Roles iniciales previstos:

```text
ADMIN
FINANCE
REGISTRO_1
```

### `user_roles`

Asocia roles por organización.

Los permisos específicos se definirán en SECURITY/RBAC; no deben codificarse únicamente mediante condiciones dispersas en el frontend.

---

## 6. Personas y empleados

### `people`

Datos generales de personas relacionadas con la organización.

```text
id
organization_id
first_name
last_name
identification_type
identification_number
phone
email
status
```

### `employees`

Información laboral.

```text
id
organization_id
person_id
employee_code
position
hire_date
termination_date
employment_status
```

El MVP necesita asociar conductores con viajes. Nómina completa, prestaciones, seguridad social, prima, vacaciones, cesantías e intereses se implementarán posteriormente sin tener que rediseñar la identidad del empleado.

---

## 7. Clientes

### `clients`

```text
id
organization_id
legal_name
trade_name
identifier_type
identifier_number
payment_terms
status
created_at
updated_at
```

Mora Mora será inicialmente el cliente operativo principal, pero no se codificará como cliente especial dentro del dominio.

---

## 8. Activos

### `assets`

Entidad común para vehículos y maquinaria.

```text
id
organization_id
asset_code
asset_type
name
plate
brand
model
year
serial_number
status
acquisition_date
acquisition_cost
notes
created_at
updated_at
```

Tipos iniciales:

```text
TRACTOMULA
VOLQUETA
PAJARITA
BOBCAT
```

El catálogo deberá poder ampliarse sin migraciones destructivas.

### Propiedad compartida

No asumir que todo activo pertenece 100 % a KLEVER.

### `asset_ownerships`

```text
id
asset_id
owner_type
owner_reference
ownership_percentage
valid_from
valid_to
```

Esto permite representar la tractomula de participación 50 % y futuras copropiedades.

La rentabilidad del activo y la distribución económica son conceptos diferentes; no deben mezclarse automáticamente.

---

## 9. Rutas

### `locations`

Catálogo reutilizable de lugares.

```text
id
organization_id
name
municipality
department
country
latitude
longitude
status
```

Las coordenadas serán opcionales en el MVP.

### `routes`

```text
id
organization_id
origin_location_id
destination_location_id
name
status
```

### `route_rates`

Historial de tarifas de flete.

```text
id
organization_id
route_id
amount
currency_code
valid_from
valid_to
status
created_by
created_at
```

Reglas:

- una ruta puede tener múltiples tarifas históricas;
- una tarifa tiene vigencia;
- evitar solapamientos de vigencias activas salvo decisión explícita;
- actualizar una tarifa no modifica viajes históricos.

---

## 10. Materiales

### `materials`

```text
id
organization_id
code
name
unit_of_measure
status
```

Ejemplos: arena, triturado, piedra, gravilla.

No se construirá un ERP de inventario completo para KLEVER en el MVP salvo que se vuelva necesario.

---

## 11. Viajes

### `trips`

Entidad operativa central.

```text
id
organization_id
external_source
external_id
client_id
asset_id
driver_employee_id
route_id
trip_date
started_at
completed_at
commercial_mode
material_id
quantity
unit_of_measure
freight_amount
material_sale_amount
total_revenue_amount
currency_code
status
source_version
source_updated_at
reconciliation_status
closed_at
closed_by
created_at
updated_at
```

### Modalidades comerciales

Inicialmente:

```text
FREIGHT_ONLY
FREIGHT_AND_MATERIAL
```

En `FREIGHT_ONLY`, el dinero recibido para comprar material por cuenta del cliente no debe convertirse automáticamente en ingreso por venta de material.

En `FREIGHT_AND_MATERIAL`, KLEVER sí vende material además del transporte.

Esta distinción es crítica para reportes de ingresos y rentabilidad.

### Precio histórico del viaje

Aunque exista `route_rate`, el viaje conservará los importes efectivamente aplicados. No dependerá de consultar la tarifa vigente actual para reconstruir su historia.

### Estados conceptuales

```text
DRAFT
ACTIVE
COMPLETED
PENDING_RECONCILIATION
RECONCILED
CLOSED
CANCELLED
```

La lista definitiva deberá implementarse mediante máquina de estados/reglas explícitas, no mediante cambios arbitrarios desde UI.

---

## 12. Integración con Mora Mora

### Identidad externa

Para registros provenientes de Mora Mora se conservarán como mínimo:

```text
external_source = MORA_MORA
external_id
source_version
source_updated_at
```

Debe existir una restricción única equivalente a:

```text
organization_id + external_source + external_id
```

para evitar duplicados por reintentos.

### `integration_sync_records`

Registro técnico de sincronización.

```text
id
organization_id
integration
entity_type
external_id
internal_id
direction
status
source_version
attempt_count
last_attempt_at
last_success_at
error_code
```

No almacenar secretos ni payloads sensibles completos en logs.

### Bloqueo posterior al cierre

Cuando KLEVER cierre un viaje conciliado, el estado deberá ser comunicado a Mora Mora.

Mora Mora deberá rechazar modificaciones directas mientras el registro permanezca bloqueado.

---

## 13. Conciliaciones y cierres

### `reconciliation_periods`

Permite conciliación periódica, inicialmente mensual.

```text
id
organization_id
client_id
period_start
period_end
status
opened_at
closed_at
closed_by
```

### `reconciliation_items`

```text
id
reconciliation_period_id
trip_id
status
notes
```

Un viaje cerrado dentro de una conciliación no podrá editarse mediante el flujo normal.

### Reapertura

### `reopen_requests`

```text
id
organization_id
entity_type
entity_id
requested_by
requested_at
reason
status
reviewed_by
reviewed_at
decision_notes
```

La autorización de KLEVER será requisito para editar en Mora Mora un viaje previamente cerrado.

---

## 14. Anticipos operativos

### `operational_advances`

```text
id
organization_id
trip_id
employee_id
amount
payment_method
issued_at
issued_by
status
```

Formas iniciales:

```text
CASH
CORPORATE_CARD
```

Un anticipo no es automáticamente un gasto. Es dinero entregado para ejecutar la operación y posteriormente debe liquidarse.

---

## 15. Gastos del viaje

### `trip_expenses`

```text
id
organization_id
trip_id
expense_category_id
amount
payment_method
expense_date
vendor_name
support_document_ref
notes
created_by
created_at
```

Categorías iniciales:

- combustible;
- peajes;
- compra de material;
- parqueadero;
- otros autorizados.

El diseño deberá permitir distinguir gasto propio de KLEVER frente a dinero administrado por cuenta de un cliente.

---

## 16. Liquidación del anticipo

### `advance_settlements`

```text
id
organization_id
advance_id
total_advance
total_supported_expenses
returned_amount
additional_reimbursement_amount
balance
status
settled_at
settled_by
```

Debe cumplirse una ecuación de conciliación consistente. Las reglas exactas serán implementadas en dominio y cubiertas por pruebas.

---

## 17. Finanzas

El MVP no intentará reemplazar un software contable certificado.

Sí deberá generar información administrativa confiable.

### `financial_transactions`

Libro operacional interno de movimientos económicos.

```text
id
organization_id
transaction_type
transaction_date
amount
currency_code
client_id
asset_id
trip_id
employee_id
reference_type
reference_id
status
created_at
```

Ejemplos:

- ingreso por flete;
- ingreso por material;
- combustible;
- peaje;
- reparación;
- cuota de crédito;
- impuesto;
- gasto administrativo.

No duplicar movimientos cuando puedan derivarse de una única fuente de verdad sin una razón contable/operativa explícita.

---

## 18. Cuentas por cobrar

### `receivables`

```text
id
organization_id
client_id
trip_id
origin_type
origin_id
amount
outstanding_amount
due_date
status
created_at
```

### `payments`

```text
id
organization_id
client_id
amount
payment_date
payment_method
reference
created_at
```

### `payment_allocations`

Permite que un pago cubra uno o varios saldos y que un saldo reciba varios pagos.

```text
id
payment_id
receivable_id
amount
```

No asumir relación 1:1 entre pago y viaje.

---

## 19. Créditos y obligaciones

### `financial_obligations`

Permitirá registrar obligaciones asociadas o no a un activo.

```text
id
organization_id
asset_id
obligation_type
creditor
principal_amount
start_date
end_date
payment_frequency
status
```

### `obligation_payments`

```text
id
obligation_id
due_date
paid_date
principal_amount
interest_amount
other_amount
status
```

Servirá para créditos de compra de vehículos y otras obligaciones futuras.

---

## 20. Mantenimiento y reparaciones

### `maintenance_orders`

```text
id
organization_id
asset_id
maintenance_type
opened_at
closed_at
provider_id
description
status
odometer_or_hours
```

### `maintenance_costs`

```text
id
maintenance_order_id
category
amount
description
```

Debe ser posible registrar reparaciones ya adeudadas, como obligaciones pendientes, sin obligar a que estén pagadas al momento del registro.

---

## 21. Centros de costo y rentabilidad

Cada activo funcionará inicialmente como dimensión analítica/centro de costo.

El sistema deberá poder calcular, sin almacenar innecesariamente valores derivados:

```text
Ingresos del activo
- gastos operativos
- mantenimiento/reparaciones
- obligaciones atribuibles
- otros costos
= resultado operativo/administrativo
```

La definición exacta de utilidad deberá indicar qué conceptos incluye para evitar mostrar como "ganancia" una cifra contablemente ambigua.

Para activos compartidos deberá poder mostrarse:

1. resultado total del activo;
2. participación económica atribuible a KLEVER cuando aplique.

---

## 22. Documentos y archivos

### `documents`

Metadatos, no binarios pesados.

```text
id
organization_id
entity_type
entity_id
document_type
storage_key
original_filename
mime_type
size_bytes
checksum
uploaded_by
created_at
```

Los archivos vivirán en object storage.

Los PDF ejecutivos podrán generarse bajo demanda y conservarse solo cuando exista una razón de negocio para archivarlos.

---

## 23. Auditoría

### `audit_logs`

```text
id
organization_id
actor_type
actor_id
action
entity_type
entity_id
before_data
after_data
reason
source
correlation_id
created_at
```

La auditoría deberá ser append-only desde la aplicación normal.

No registrar secretos.

Para cambios financieros críticos se preferirá guardar snapshots suficientes para reconstruir qué ocurrió.

---

## 24. Integridad y restricciones

La base de datos deberá reforzar reglas que no deban depender exclusivamente del código.

Ejemplos:

- `ownership_percentage` entre 0 y 100;
- importes no negativos cuando conceptualmente corresponda;
- claves externas válidas;
- identificadores externos únicos;
- períodos válidos (`valid_to >= valid_from`);
- porcentajes y cantidades con precisión definida;
- estados válidos;
- unicidad de documentos/placas cuando aplique dentro de la organización.

Las restricciones deben complementarse con reglas de dominio, no sustituirlas.

---

## 25. Transacciones

Operaciones que modifican varias entidades relacionadas deberán ejecutarse atómicamente cuando corresponda.

Ejemplos:

- cerrar conciliación + bloquear viajes;
- registrar pago + asignarlo a cuentas por cobrar;
- liquidar anticipo + registrar movimientos asociados;
- aprobar reapertura + cambiar estado controladamente.

No dejar estados parcialmente aplicados.

---

## 26. Concurrencia

Aunque el volumen inicial sea bajo, se protegerán operaciones sensibles contra doble ejecución.

Mecanismos posibles:

- restricciones únicas;
- idempotency keys;
- optimistic locking/version columns;
- transacciones;
- locks puntuales solo cuando sean necesarios.

Especial atención a sincronización Mora Mora, cierres y pagos.

---

## 27. Índices

Crear índices basados en consultas reales, no indiscriminadamente.

Candidatos iniciales:

```text
organization_id
trip_date
asset_id
client_id
driver_employee_id
status
external_source + external_id
reconciliation_status
due_date
created_at
```

Los índices compuestos deberán reflejar filtros frecuentes incluyendo `organization_id` cuando corresponda.

---

## 28. Backups y recuperación

La infraestructura seleccionada deberá permitir backups automáticos o un mecanismo equivalente verificable.

Antes de producción se definirá:

- frecuencia;
- retención;
- restauración;
- responsable;
- prueba periódica de recuperación.

Un backup que nunca se ha probado restaurar no se considerará una estrategia completa.

---

## 29. Ambientes

Como mínimo:

```text
LOCAL
PRODUCTION
```

Preferible cuando el flujo lo justifique:

```text
LOCAL
STAGING
PRODUCTION
```

Producción tendrá base y credenciales independientes.

Nunca usar datos productivos sensibles como fixtures de desarrollo.

---

## 30. Migraciones

Reglas:

1. Toda modificación de esquema mediante migración versionada.
2. Migraciones revisables en Git.
3. No editar una migración ya aplicada en producción para cambiar su historia.
4. Cambios destructivos requieren plan de transición/rollback.
5. Migraciones de datos grandes deberán separarse cuando sea necesario.
6. Antes de una migración crítica, confirmar respaldo recuperable.

---

## 31. Seed data

Se permitirán seeds para:

- roles;
- catálogos controlados;
- ambiente local/demo.

No introducir información real sensible en seeds del repositorio.

---

## 32. Reportes

Los reportes deberán consultar fuentes de verdad existentes.

Evitar tablas duplicadas de "reportes" durante el MVP salvo necesidad de rendimiento demostrada.

Si el volumen crece, podrán incorporarse:

- vistas;
- materialized views;
- tablas analíticas;
- warehouse.

No antes de necesitarlo.

---

## 33. Preparación para IA

No crear una base vectorial en el MVP solo por prever IA.

Los datos estructurados deben permanecer correctamente normalizados y auditables.

Cuando exista un caso real de IA se decidirá qué datos exponer, anonimizar o transformar.

---

## 34. Diagrama conceptual resumido

```text
ORGANIZATION
 ├── USERS / ROLES
 ├── EMPLOYEES
 ├── CLIENTS
 ├── ASSETS ── OWNERSHIPS
 │     ├── MAINTENANCE
 │     └── OBLIGATIONS
 ├── LOCATIONS ── ROUTES ── ROUTE_RATES
 ├── MATERIALS
 └── TRIPS
       ├── ADVANCES ── SETTLEMENTS
       ├── EXPENSES
       ├── RECEIVABLES ── PAYMENTS
       ├── FINANCIAL_TRANSACTIONS
       └── RECONCILIATION

MORA MORA
    │
    └── INTEGRATION_SYNC_RECORDS ── TRIPS

ALL CRITICAL DOMAINS ── AUDIT_LOGS
```

---

## 35. Orden recomendado de implementación de datos

```text
1. organizations
2. identity / roles
3. people / employees
4. clients
5. assets / ownerships
6. locations / routes / route_rates
7. materials
8. trips
9. integration metadata
10. operational advances / expenses / settlements
11. receivables / payments
12. financial transactions
13. reconciliation / reopen workflow
14. maintenance / obligations
15. documents
16. audit
```

No es obligatorio crear todas las tablas antes de comenzar el MVP. Cada módulo debe añadir únicamente las estructuras que necesita su incremento funcional.

---

## 36. Reglas para Codex y Claude

Antes de modificar el modelo de datos, el agente debe:

1. identificar el módulo afectado;
2. revisar este documento y decisiones relacionadas;
3. explicar brevemente la migración requerida;
4. evitar cambios fuera del alcance;
5. añadir/actualizar pruebas;
6. verificar aislamiento por organización;
7. verificar auditoría si la operación es crítica;
8. comprobar que no rompe históricos;
9. no introducir dependencia innecesaria del proveedor cloud;
10. registrar una decisión arquitectónica si el cambio contradice este diseño.

Una tarea de IA no deberá pedir "crear toda la base de datos" en un solo prompt. Se dividirá por módulo y criterio de aceptación para reducir errores y consumo de tokens.

---

## 37. Pendientes deliberados

Se definirán en documentos posteriores antes de implementación definitiva:

- proveedor de PostgreSQL;
- proveedor de autenticación;
- object storage;
- política exacta de backups;
- esquema RBAC detallado;
- contratos API Mora Mora;
- retención de auditoría/logs;
- stack backend/ORM;
- precisión decimal estándar por tipo de dato;
- estrategia exacta de soft-delete para entidades maestras.

---

## 38. Criterio de aceptación de esta arquitectura de datos

El diseño debe permitir responder de forma confiable preguntas como:

- ¿Cuántos viajes hizo cada tractomula hoy/mes?
- ¿Cuánto produjo cada activo?
- ¿Cuánto costó operarlo?
- ¿Qué viajes son solo flete y cuáles incluyen venta de material?
- ¿Qué anticipos faltan por liquidar?
- ¿Cuánto debe cada cliente?
- ¿Qué obligaciones tiene cada activo?
- ¿Cuánto se ha gastado en reparaciones?
- ¿Cuál era la tarifa aplicable cuando ocurrió un viaje histórico?
- ¿Qué cambió Mora Mora antes del cierre?
- ¿Quién cerró o reabrió un registro y por qué?
- ¿Qué parte del resultado corresponde a KLEVER en un activo compartido?

Si una futura modificación impide responder estas preguntas con trazabilidad, deberá revisarse antes de integrarse.
