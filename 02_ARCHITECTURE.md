# 02_ARCHITECTURE.md --- Arquitectura del sistema KLEVER ERP

**Proyecto:** KLEVER ERP\
**Estado:** Arquitectura base / Fase 0\
**Objetivo:** Definir una arquitectura empresarial, modular, escalable,
mantenible y de bajo costo para el MVP, evitando sobreingeniería.

------------------------------------------------------------------------

## 1. Principios arquitectónicos

1.  **MVP rápido, arquitectura seria.** La primera versión debe entregar
    valor pronto sin crear deuda técnica innecesaria.
2.  **Modularidad estricta.** Cada dominio funcional tendrá límites
    claros y podrá evolucionar sin desordenar el resto del sistema.
3.  **Separación por capas.** La lógica de negocio no dependerá
    directamente del framework, UI, proveedor cloud ni base de datos.
4.  **SaaS-ready, no SaaS-prematuro.** El modelo contemplará
    `organization_id`/tenant donde corresponda, pero inicialmente
    operará KLEVER.
5.  **Cost-first.** Se preferirán servicios gratuitos o económicos
    mientras cumplan seguridad, respaldo y estabilidad.
6.  **Auditabilidad.** Las operaciones financieras y críticas deberán
    ser trazables.
7.  **No borrado destructivo de información crítica.** Se usarán
    estados, anulaciones y registros de auditoría.
8.  **Integraciones desacopladas.** Mora Mora y futuras integraciones se
    conectarán mediante APIs/adaptadores, no mediante dependencias
    internas.
9.  **IA desacoplada.** La IA queda prevista como capacidad futura, pero
    no será requisito del MVP.
10. **Observabilidad desde el inicio.** Errores y operaciones críticas
    deben poder diagnosticarse sin revisar manualmente todo el sistema.

------------------------------------------------------------------------

## 2. Estilo arquitectónico

Se utilizará inicialmente un **monolito modular**.

No se crearán microservicios en el MVP. Para el volumen inicial de
KLEVER añadirían costo, complejidad operativa y consumo innecesario de
recursos.

Cada módulo tendrá fronteras internas suficientemente claras para
permitir que, si el crecimiento lo exige, pueda extraerse posteriormente
como servicio independiente.

### Capas principales

``` text
┌──────────────────────────────────────────┐
│              PRESENTATION                │
│        Web / UI / API Controllers        │
├──────────────────────────────────────────┤
│              APPLICATION                 │
│     Use Cases / Commands / Services      │
├──────────────────────────────────────────┤
│                 DOMAIN                   │
│ Entities / Rules / Value Objects / Ports │
├──────────────────────────────────────────┤
│             INFRASTRUCTURE               │
│ DB / APIs / Storage / Providers / Auth   │
└──────────────────────────────────────────┘
```

Capas transversales:

``` text
Security
Audit
Observability
Integrations
Configuration
Testing
Future AI
```

------------------------------------------------------------------------

## 3. Dominios funcionales

La plataforma se dividirá inicialmente en los siguientes módulos:

### Identity & Access

Usuarios, autenticación, roles y permisos.

### Organizations

Empresa/tenant, configuración corporativa y parámetros generales.

### People

Conductores, empleados y demás personas relacionadas con la operación.

### Assets

Tractomulas, volquetas, maquinaria amarilla y futuros tipos de activos.

Debe admitir propiedad:

-   100 % KLEVER.
-   Participación parcial.
-   Futuras modalidades de terceros.

### Clients

Clientes y relaciones comerciales.

Mora Mora será inicialmente el cliente operativo principal, sin quedar
codificado como excepción rígida.

### Routes & Rates

Origen, destino, rutas comerciales y tarifas.

La tarifa del flete será fija por ruta mientras esté vigente y deberá
conservar historial de vigencias.

### Trips

Núcleo operativo del MVP.

Cada desplazamiento comercial constituye un viaje independiente.

Debe soportar, como mínimo:

-   Solo flete.
-   Flete + venta de material.
-   Cliente.
-   Vehículo.
-   Conductor.
-   Ruta.
-   Fecha/hora.
-   Material.
-   Cantidad/peso cuando exista.
-   Valor del flete.
-   Valor del material.
-   Estado.
-   Fuente del registro.
-   Referencia externa de Mora Mora.
-   Conciliación y cierre.

### Operational Cash

Anticipos y liquidaciones operativas.

Formas iniciales:

-   Efectivo.
-   Tarjeta corporativa.

Conceptos iniciales:

-   Combustible.
-   Peajes.
-   Compra de material.
-   Otros gastos autorizados.
-   Devolución de saldo.
-   Saldo pendiente/reembolso.

### Finance

Ingresos, egresos, cuentas por cobrar, obligaciones, créditos y centros
de costo.

Cada activo debe poder producir una hoja financiera propia.

### Maintenance

Mantenimientos preventivos/correctivos, reparaciones, costos,
proveedores, fechas y estado.

### Reports

Dashboards y reportes operativos/financieros.

Debe contemplarse un botón para generar **Resumen Ejecutivo PDF por
activo**.

### Integrations

Mora Mora y futuras APIs externas.

### Audit

Historial de operaciones críticas.

------------------------------------------------------------------------

## 4. Viaje como agregado operativo central

El viaje será una de las entidades principales del sistema.

No obstante, la arquitectura no debe hacer que toda la plataforma
dependa directamente de `Trip`. Finanzas, activos, empleados y
mantenimiento conservarán sus propios dominios.

Ejemplo conceptual:

``` text
Cliente
   │
   ▼
Viaje ─────► Ruta/Tarifa
   │
   ├──────► Vehículo
   ├──────► Conductor
   ├──────► Material
   ├──────► Anticipo
   ├──────► Gastos
   └──────► Movimiento financiero
```

------------------------------------------------------------------------

## 5. Integración Mora Mora ↔ KLEVER

Mora Mora será inicialmente la fuente primaria de ciertos datos
operativos de los viajes.

### Regla de propiedad del dato

**Antes de conciliación/cierre:** Mora Mora puede crear y modificar los
datos operativos sincronizados.

**Después de aceptación/cierre por KLEVER:** KLEVER obtiene control
sobre la reapertura del registro.

Mora Mora no podrá modificar unilateralmente un registro cerrado.

Flujo:

``` text
MORA MORA
   │
   │ crea/modifica
   ▼
SINCRONIZACIÓN API
   │
   ▼
KLEVER
   │
   ├─ pendiente
   ├─ sincronizado
   ├─ en conciliación
   └─ cerrado/aprobado
          │
          ▼
     BLOQUEO EN MORA MORA
```

Si Mora Mora requiere una corrección posterior:

``` text
Solicitud de reapertura
        ↓
Autorización KLEVER
        ↓
Reapertura controlada
        ↓
Corrección
        ↓
Nueva conciliación
        ↓
Nuevo cierre
```

Toda la secuencia deberá quedar auditada.

### Requisitos técnicos de integración

-   Identificador externo inmutable.
-   Idempotencia.
-   Versionado de API.
-   Registro de última sincronización.
-   Estado de sincronización.
-   Reintentos controlados.
-   Manejo explícito de conflictos.
-   Autenticación máquina-a-máquina.
-   Validación de payloads.
-   Logs sin exponer secretos.

No se permitirá que Mora Mora escriba directamente en las tablas
internas de KLEVER.

------------------------------------------------------------------------

## 6. Estrategia de datos

Se priorizará una base de datos relacional.

El modelo contiene relaciones financieras, operativas y de auditoría que
se benefician de:

-   integridad referencial;
-   transacciones;
-   restricciones;
-   consultas agregadas;
-   conciliaciones;
-   históricos.

### Regla multiempresa

Las entidades susceptibles de pertenecer a una organización deberán
incluir un identificador de organización.

Nunca se confiará únicamente en filtros del frontend para aislar
información entre organizaciones.

### Históricos

No sobrescribir valores históricos cuando estos afecten resultados
previos.

Ejemplo:

``` text
Ruta Medellín
Tarifa:
2026-01-01 → 2026-12-31 = X
2027-01-01 → ...        = Y
```

Un viaje histórico conserva la tarifa aplicada al momento de su
operación.

------------------------------------------------------------------------

## 7. Estrategia de infraestructura

La selección definitiva del proveedor se documentará mediante
ADR/DECISION antes de implementación.

Se evaluarán principalmente alternativas de bajo costo que proporcionen:

-   PostgreSQL o equivalente relacional.
-   Autenticación segura.
-   almacenamiento de archivos;
-   backups;
-   API/backend;
-   despliegue automatizable;
-   variables de entorno;
-   métricas y logs;
-   crecimiento gradual.

No se seleccionará Firebase únicamente por disponer de plan gratuito si
su modelo de datos incrementa complejidad para la naturaleza relacional
del ERP.

Netlify/Vercel podrán evaluarse como capa de frontend/despliegue, pero
no se considerarán por sí solos sustitutos de la arquitectura de datos.

AWS podrá utilizarse cuando su costo y complejidad estén justificados
por el crecimiento.

------------------------------------------------------------------------

## 8. Seguridad

La seguridad será transversal.

Requisitos base:

-   Autenticación.
-   RBAC.
-   Principio de mínimo privilegio.
-   Separación por organización.
-   Validación server-side.
-   Secretos fuera del repositorio.
-   HTTPS.
-   Protección contra operaciones no autorizadas.
-   Auditoría de acciones críticas.
-   Backups.
-   Dependencias actualizadas.
-   Protección de endpoints de integración.
-   Rate limiting donde corresponda.

Roles iniciales previstos:

``` text
ADMIN
FINANCE
REGISTRO_1
```

Los permisos exactos se definirán posteriormente mediante matriz RBAC.

------------------------------------------------------------------------

## 9. Auditoría

Eventos críticos deberán registrar, según corresponda:

-   organización;
-   usuario;
-   acción;
-   entidad;
-   identificador;
-   valor anterior;
-   valor nuevo;
-   fecha/hora;
-   motivo;
-   origen;
-   correlation/request ID.

Especialmente:

-   cierres;
-   reaperturas;
-   anulaciones;
-   cambios de tarifas;
-   modificaciones financieras;
-   sincronizaciones;
-   permisos;
-   movimientos de caja.

------------------------------------------------------------------------

## 10. Observabilidad

El sistema deberá diferenciar:

### Logs técnicos

Errores, API, sincronización, tiempos de respuesta.

### Auditoría de negocio

Quién cambió qué y por qué.

### Métricas

Errores, disponibilidad, sincronizaciones fallidas y, posteriormente,
métricas operativas.

No guardar:

-   contraseñas;
-   tokens;
-   secretos;
-   números completos de tarjetas;
-   información sensible innecesaria.

La retención de logs deberá controlarse para evitar costos inesperados.

------------------------------------------------------------------------

## 11. Arquitectura de archivos

Estructura conceptual:

``` text
klever-erp/
│
├── docs/
│
├── apps/
│   ├── web/
│   └── api/
│
├── modules/
│   ├── identity/
│   ├── organizations/
│   ├── people/
│   ├── assets/
│   ├── clients/
│   ├── routes/
│   ├── trips/
│   ├── operational-cash/
│   ├── finance/
│   ├── maintenance/
│   ├── reports/
│   ├── integrations/
│   └── audit/
│
├── shared/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── security/
│
├── tests/
├── scripts/
└── .github/
```

Dentro de cada módulo:

``` text
module/
├── domain/
├── application/
├── infrastructure/
├── presentation/
└── tests/
```

La estructura exacta se adaptará al stack elegido. No se crearán
carpetas vacías únicamente por cumplir el diagrama.

------------------------------------------------------------------------

## 12. Comunicación entre módulos

Regla:

> Un módulo no debe depender de detalles internos de infraestructura de
> otro módulo.

Preferencias:

1.  Interfaces/use cases internos.
2.  Eventos de dominio cuando aporten desacoplamiento real.
3.  APIs para sistemas externos.

No introducir buses, colas o brokers en el MVP salvo necesidad
demostrable.

------------------------------------------------------------------------

## 13. API

La API deberá ser:

-   versionada;
-   validada;
-   autenticada;
-   documentada;
-   consistente;
-   idempotente donde corresponda.

Ejemplo conceptual:

``` text
/api/v1/trips
/api/v1/assets
/api/v1/routes
/api/v1/finance
/api/v1/integrations/mora-mora
```

No se considera este ejemplo un contrato definitivo.

------------------------------------------------------------------------

## 14. Archivos y documentos

Los documentos generados ---por ejemplo, resúmenes ejecutivos PDF y
soportes--- no deberán almacenarse como blobs dentro de las tablas
principales.

Se utilizará almacenamiento de objetos/archivos y en base de datos se
conservarán metadatos y referencias.

------------------------------------------------------------------------

## 15. IA futura

La IA no bloqueará el MVP.

Casos futuros posibles:

-   mantenimiento predictivo;
-   proyección de flujo de caja;
-   detección de anomalías;
-   análisis de rentabilidad;
-   recomendaciones operativas;
-   generación asistida de reportes;
-   análisis de comportamiento de costos.

La arquitectura deberá permitir consumir datos mediante
servicios/interfaces controladas sin acoplar modelos de IA al núcleo del
dominio.

------------------------------------------------------------------------

## 16. Estrategia Codex + Claude

Los agentes trabajan sobre el mismo repositorio Git, pero mediante
ramas/tareas independientes.

Ejemplo:

``` text
main
├── codex/<task>
└── claude/<task>
```

Reglas:

-   Una tarea = un objetivo pequeño.
-   No asignar simultáneamente el mismo archivo a ambos agentes.
-   Revisar `git diff` antes de integrar.
-   Commits pequeños.
-   No realizar refactorizaciones fuera del alcance solicitado.
-   Leer documentos de arquitectura antes de modificar módulos.
-   Si una decisión contradice documentación existente, detener
    implementación y registrar/proponer la decisión.
-   No permitir que un agente reescriba masivamente código funcional sin
    justificación.

------------------------------------------------------------------------

## 17. Uso eficiente de modelos de IA

No utilizar el máximo esfuerzo para tareas mecánicas.

### Esfuerzo bajo

-   renombrados;
-   documentación menor;
-   cambios localizados;
-   formato;
-   pruebas sencillas.

### Esfuerzo medio

-   implementación normal;
-   endpoints;
-   componentes;
-   consultas;
-   pruebas de módulo.

### Esfuerzo alto

Solo cuando esté justificado:

-   arquitectura;
-   seguridad;
-   concurrencia;
-   conciliación;
-   migraciones complejas;
-   bugs difíciles;
-   diseño financiero;
-   integración Mora Mora;
-   revisión previa a producción.

Las instrucciones a Codex/Claude deberán limitar:

-   archivos permitidos;
-   objetivo;
-   criterios de aceptación;
-   pruebas requeridas;
-   archivos prohibidos;
-   tamaño esperado del cambio.

------------------------------------------------------------------------

## 18. Reglas contra sobreingeniería

No implementar en el MVP sin necesidad demostrada:

-   Kubernetes.
-   Microservicios.
-   Kafka.
-   Event sourcing completo.
-   CQRS distribuido.
-   Data warehouse.
-   Infraestructura multi-región.
-   Modelos de IA propios.
-   Arquitecturas serverless complejas.
-   Sistemas de colas por simple anticipación.

Se podrán adoptar posteriormente mediante decisión arquitectónica
documentada.

------------------------------------------------------------------------

## 19. Evolución prevista

``` text
FASE 0
Arquitectura + documentación + repositorio + infraestructura base

        ↓

MVP
Operación + viajes + activos + caja + finanzas + reportes

        ↓

INTEGRACIÓN
Mora Mora bidireccional + conciliación/cierre

        ↓

EXPANSIÓN
Mantenimiento avanzado + obligaciones + nómina + documentos

        ↓

INTELIGENCIA
Analítica avanzada + IA

        ↓

PRODUCTO
Multiempresa comercial / SaaS si existe demanda real
```

------------------------------------------------------------------------

## 20. Criterio rector

Toda decisión futura deberá equilibrar:

``` text
SEGURIDAD
   +
CORRECCIÓN DE DATOS
   +
MANTENIBILIDAD
   +
VELOCIDAD DE ENTREGA
   +
BAJO COSTO
```

Cuando dos alternativas sean técnicamente válidas, se escogerá
inicialmente la que entregue estos objetivos con **menor complejidad
operativa y menor costo total**, siempre que no comprometa seguridad,
integridad financiera ni capacidad razonable de evolución.
