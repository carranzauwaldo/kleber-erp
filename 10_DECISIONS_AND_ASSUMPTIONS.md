# 10_DECISIONS_AND_ASSUMPTIONS.md --- Decisiones, supuestos y pendientes

**Proyecto:** KLEBER ERP\
**Estado:** Diseño base / Fase 0\
**Objetivo:** Mantener una fuente única y explícita de las decisiones
tomadas, supuestos temporales, restricciones y preguntas todavía
abiertas del proyecto.

------------------------------------------------------------------------

## 1. Regla de uso

Este documento evita que desarrolladores, Codex o Claude inventen
respuestas diferentes ante una misma ambigüedad.

Cada elemento se clasifica como:

``` text
DECIDED      → decisión vigente
ASSUMPTION   → supuesto provisional
OPEN         → pendiente de resolver
DEFERRED     → decidido posponer
REJECTED     → alternativa descartada por ahora
```

Una decisión puede cambiar, pero el cambio debe quedar documentado.

------------------------------------------------------------------------

# 2. Decisiones vigentes

## DEC-001 --- Nombre del proyecto

**Estado:** DECIDED

El nombre correcto es:

``` text
KLEBER
```

No utilizar `KLEVER`.

------------------------------------------------------------------------

## DEC-002 --- Naturaleza del producto

**Estado:** DECIDED

KLEBER será un sistema empresarial para administrar progresivamente:

-   flota;
-   maquinaria amarilla;
-   viajes;
-   tarifas;
-   caja operacional;
-   cartera;
-   costos;
-   mantenimiento;
-   obligaciones;
-   reportes;
-   integraciones.

No se tratará como un prototipo desechable.

------------------------------------------------------------------------

## DEC-003 --- Arquitectura inicial

**Estado:** DECIDED

Se utilizará un:

``` text
MONOLITO MODULAR
```

No microservicios durante MVP.

Razón:

-   menor costo;
-   menor complejidad;
-   transacciones más sencillas;
-   despliegue simple;
-   volumen inicial pequeño;
-   posibilidad de separación futura.

------------------------------------------------------------------------

## DEC-004 --- Base de datos

**Estado:** DECIDED

El modelo se diseñará para una base de datos relacional, con
**PostgreSQL como opción preferida**.

Razón:

-   relaciones fuertes;
-   transacciones;
-   integridad;
-   finanzas;
-   auditoría;
-   reporting;
-   consultas estructuradas.

El proveedor administrado definitivo sigue pendiente.

------------------------------------------------------------------------

## DEC-005 --- Multiempresa

**Estado:** DECIDED

KLEBER operará inicialmente para una sola organización, pero las
entidades empresariales principales incluirán `organization_id` cuando
corresponda.

No se construirá todavía:

-   billing SaaS;
-   onboarding automático;
-   planes;
-   aprovisionamiento masivo.

------------------------------------------------------------------------

## DEC-006 --- Fuente de verdad del código

**Estado:** DECIDED

Git será la fuente de verdad.

La colaboración Codex/Claude utilizará:

-   ramas separadas;
-   worktrees cuando haya trabajo paralelo;
-   commits pequeños;
-   revisión antes de merge.

------------------------------------------------------------------------

## DEC-007 --- Documentación persistente

**Estado:** DECIDED

Los agentes deberán leer documentación del repositorio en lugar de
depender de conversaciones largas.

Los documentos de Fase 0 forman parte del contexto oficial del proyecto.

------------------------------------------------------------------------

## DEC-008 --- Viaje como entidad operacional central

**Estado:** DECIDED

El viaje será una entidad central para:

-   operación;
-   tarifa;
-   gastos;
-   anticipos;
-   cartera;
-   rentabilidad;
-   conciliación;
-   integración Mora Mora.

Esto no significa que todos los módulos deban depender directamente de
`Trip`.

------------------------------------------------------------------------

## DEC-009 --- Modalidades comerciales

**Estado:** DECIDED

Se soportarán inicialmente:

``` text
FREIGHT_ONLY
FREIGHT_AND_MATERIAL
```

### FREIGHT_ONLY

KLEBER cobra transporte. El dinero recibido para adquirir material no
constituye automáticamente ingreso por venta del material.

### FREIGHT_AND_MATERIAL

KLEBER vende transporte + material y puede obtener margen en ambos
componentes.

------------------------------------------------------------------------

## DEC-010 --- Tarifas

**Estado:** DECIDED

La tarifa de flete depende principalmente de ruta/origen-destino, no del
tonelaje.

Las tarifas tendrán historial de vigencia.

Cada viaje conservará snapshot de la tarifa aplicada para impedir
cambios retroactivos.

------------------------------------------------------------------------

## DEC-011 --- Anticipos operacionales

**Estado:** DECIDED

El dinero entregado al conductor se modelará como anticipo operacional.

Flujo:

``` text
entrega
→ gastos
→ liquidación
→ devolución o diferencia
```

Los gastos pueden incluir:

-   combustible;
-   peajes;
-   material;
-   otros autorizados.

------------------------------------------------------------------------

## DEC-012 --- Cartera

**Estado:** DECIDED

KLEBER deberá soportar:

-   contado;
-   crédito;
-   anticipos;
-   pagos parciales;
-   saldos pendientes;
-   estado de cuenta por cliente.

------------------------------------------------------------------------

## DEC-013 --- Conductores

**Estado:** DECIDED

Los conductores son normalmente empleados fijos de KLEBER.

El modelo deberá permitir asociar conductor/empleado al viaje y
conservar historial.

------------------------------------------------------------------------

## DEC-014 --- Nómina

**Estado:** DEFERRED

La nómina completa no pertenece al MVP.

La arquitectura deberá permitir incorporar posteriormente:

-   seguridad social;
-   prima;
-   vacaciones;
-   cesantías;
-   intereses a cesantías;
-   otros conceptos laborales.

------------------------------------------------------------------------

## DEC-015 --- Reporte ejecutivo por activo

**Estado:** DECIDED

Cada activo deberá poder producir un resumen ejecutivo descargable en
PDF con información operacional y financiera relevante.

------------------------------------------------------------------------

# 3. Integración Mora Mora

## DEC-016 --- Integración mediante API

**Estado:** DECIDED

Mora Mora no escribirá directamente en la base de KLEBER.

La integración será mediante API/contrato explícito.

------------------------------------------------------------------------

## DEC-017 --- Mora Mora como fuente operacional

**Estado:** DECIDED

Mientras un viaje proveniente de Mora Mora permanezca abierto/no
conciliado, Mora Mora puede ser la fuente principal de determinados
datos operativos.

KLEBER conservará sus propios datos financieros y administrativos.

------------------------------------------------------------------------

## DEC-018 --- Identificadores externos

**Estado:** DECIDED

Los IDs de Mora Mora se almacenarán como referencias externas.

No serán la PK interna de KLEBER.

La combinación organización + fuente + ID externo deberá ser única
cuando corresponda.

------------------------------------------------------------------------

## DEC-019 --- Cierre

**Estado:** DECIDED

Una vez conciliado/cerrado en KLEBER:

-   Mora Mora no podrá modificar unilateralmente el viaje;
-   KLEBER mantiene control final;
-   el cierre deberá reflejarse en la integración.

------------------------------------------------------------------------

## DEC-020 --- Reapertura

**Estado:** DECIDED

Modificar un viaje cerrado requiere:

1.  solicitud/necesidad;
2.  autorización KLEBER;
3.  motivo;
4.  reapertura;
5.  modificación;
6.  nueva conciliación;
7.  nuevo cierre.

No existirán reaperturas silenciosas.

------------------------------------------------------------------------

## DEC-021 --- Eliminación

**Estado:** DECIDED

Los viajes y movimientos críticos no se eliminarán físicamente durante
operación normal.

Usar:

-   anulación;
-   reversión;
-   estados;
-   auditoría.

------------------------------------------------------------------------

## DEC-022 --- Idempotencia

**Estado:** DECIDED

La sincronización Mora Mora deberá soportar reintentos sin crear viajes
duplicados.

------------------------------------------------------------------------

## DEC-023 --- Fallos externos

**Estado:** DECIDED

La caída temporal de Mora Mora no deberá detener toda la operación de
KLEBER.

Los eventos pendientes se registrarán y reintentarán.

------------------------------------------------------------------------

# 4. Seguridad

## DEC-024 --- Autorización backend

**Estado:** DECIDED

La interfaz nunca será la única barrera de seguridad.

Cada operación deberá validar en backend:

``` text
usuario/servicio
+ organización
+ permiso
+ estado del recurso
+ regla de negocio
```

------------------------------------------------------------------------

## DEC-025 --- Roles iniciales

**Estado:** ASSUMPTION

Roles iniciales provisionales:

``` text
ADMIN
FINANCE
REGISTRO_1
```

Los nombres y matriz definitiva se validarán antes de producción.

------------------------------------------------------------------------

## DEC-026 --- Secretos

**Estado:** DECIDED

Ningún secreto podrá almacenarse en:

-   Git;
-   documentación;
-   frontend;
-   logs;
-   prompts;
-   commits.

------------------------------------------------------------------------

## DEC-027 --- Auditoría

**Estado:** DECIDED

Operaciones críticas deberán registrar quién, cuándo, qué, resultado y
motivo cuando corresponda.

------------------------------------------------------------------------

## DEC-028 --- Tarjetas

**Estado:** DECIDED

Si se registra que un gasto fue pagado con tarjeta corporativa, KLEBER
almacenará únicamente información administrativa necesaria.

No almacenar:

-   número completo;
-   CVV;
-   credenciales bancarias.

------------------------------------------------------------------------

# 5. Infraestructura

## DEC-029 --- Ambientes

**Estado:** DECIDED

Existirán:

``` text
LOCAL
STAGING
PRODUCTION
```

con bases y secretos separados.

------------------------------------------------------------------------

## DEC-030 --- Objetivo de costo

**Estado:** DECIDED

Durante desarrollo/MVP se buscará un costo ideal de infraestructura de:

``` text
USD 0–10/mes
```

sin sacrificar controles esenciales.

------------------------------------------------------------------------

## DEC-031 --- Kubernetes

**Estado:** REJECTED

No utilizar Kubernetes en MVP.

------------------------------------------------------------------------

## DEC-032 --- Multi-región

**Estado:** DEFERRED

No desplegar infraestructura multi-región durante MVP.

------------------------------------------------------------------------

## DEC-033 --- IaC

**Estado:** DEFERRED

Terraform/OpenTofu u otra infraestructura como código se incorporará
cuando la cantidad/complejidad de recursos justifique su mantenimiento.

------------------------------------------------------------------------

## DEC-034 --- Object storage

**Estado:** DECIDED

Los documentos persistentes no dependerán del filesystem efímero del
backend.

Se utilizará object storage.

------------------------------------------------------------------------

## DEC-035 --- Backups

**Estado:** DECIDED

Producción deberá tener backup automático y prueba de restauración.

------------------------------------------------------------------------

# 6. Agentes IA

## DEC-036 --- Codex y Claude

**Estado:** DECIDED

Ambos podrán participar en KLEBER.

Distribución inicial preferida:

``` text
Codex  → backend, DB, API, integración, seguridad
Claude → producto, frontend, UX, workflows, reportes
```

No es una restricción permanente.

------------------------------------------------------------------------

## DEC-037 --- Tareas acotadas

**Estado:** DECIDED

No se asignarán órdenes como "construye todo KLEBER".

Cada tarea deberá tener objetivo, archivos permitidos, criterios y
pruebas.

------------------------------------------------------------------------

## DEC-038 --- Razonamiento

**Estado:** DECIDED

El nivel de razonamiento se ajustará al riesgo.

Esfuerzo alto se reservará principalmente para:

-   arquitectura;
-   seguridad;
-   finanzas;
-   concurrencia;
-   migraciones;
-   Mora Mora;
-   debugging complejo;
-   producción.

------------------------------------------------------------------------

## DEC-039 --- Producción

**Estado:** DECIDED

Los agentes no desplegarán producción ni crearán recursos pagos sin
autorización explícita.

------------------------------------------------------------------------

# 7. Supuestos operacionales por confirmar

## ASM-001 --- Inventario exacto de maquinaria

**Estado:** OPEN

Se han mencionado referencias inconsistentes sobre la cantidad exacta
de:

-   pajaritas;
-   Bobcats.

No hardcodear inventario inicial hasta confirmar físicamente los
activos.

------------------------------------------------------------------------

## ASM-002 --- Propiedad de vehículos

**Estado:** ASSUMPTION

Información inicial:

-   una volqueta;
-   una tractomula 100 % KLEBER;
-   una tractomula con participación aproximada del 50 %.

La estructura exacta de propiedad deberá validarse al cargar datos
reales.

------------------------------------------------------------------------

## ASM-003 --- Mora Mora como cliente principal

**Estado:** ASSUMPTION

Actualmente Mora Mora representa gran parte o la mayoría de la operación
de tractomulas/volqueta.

El sistema no debe quedar técnicamente acoplado a que siempre sea el
único cliente.

------------------------------------------------------------------------

## ASM-004 --- Viajes diarios

**Estado:** ASSUMPTION

Un vehículo puede realizar aproximadamente entre 2 y 4 viajes
independientes al día según operación.

No usar este rango como límite del sistema.

------------------------------------------------------------------------

## ASM-005 --- Programación

**Estado:** DECIDED

El flujo actual no requiere planificación de viajes a largo plazo.

Normalmente el destino se define cerca del momento de operación.

Un módulo avanzado de dispatch/scheduling queda fuera del MVP.

------------------------------------------------------------------------

## ASM-006 --- Tarifas ilustrativas

**Estado:** OPEN

Valores previamente mencionados para Doral, Santa Fe de Antioquia o
Medellín son ejemplos y **no constituyen tarifas oficiales**.

No cargarlos como seed productivo sin validación.

------------------------------------------------------------------------

## ASM-007 --- Créditos y obligaciones

**Estado:** ASSUMPTION

Existen obligaciones asociadas a adquisición, impuestos, mantenimiento y
reparación de activos.

El modelo deberá soportarlas aunque los saldos reales se cargarán
posteriormente.

------------------------------------------------------------------------

## ASM-008 --- Reparaciones pendientes

**Estado:** ASSUMPTION

Se mencionó una obligación cercana a COP 10 millones por reparaciones de
maquinaria.

Debe verificarse antes de registrar como saldo real.

------------------------------------------------------------------------

# 8. Decisiones técnicas abiertas

## OPEN-001 --- Stack frontend

Pendiente seleccionar framework y versión.

Criterios:

-   mantenibilidad;
-   ecosistema;
-   productividad;
-   soporte;
-   costo;
-   compatibilidad con agentes.

------------------------------------------------------------------------

## OPEN-002 --- Stack backend

Pendiente seleccionar framework/lenguaje definitivo.

Debe favorecer:

-   API robusta;
-   validación;
-   PostgreSQL;
-   tests;
-   modularidad;
-   OpenAPI.

------------------------------------------------------------------------

## OPEN-003 --- ORM/query layer

Pendiente elegir.

No seleccionar únicamente porque sea popular; evaluar migraciones,
tipos, transacciones y soporte PostgreSQL.

------------------------------------------------------------------------

## OPEN-004 --- Proveedor PostgreSQL/Auth/Storage

Pendiente comparar alternativas.

Supabase es candidato, no decisión definitiva.

------------------------------------------------------------------------

## OPEN-005 --- Hosting frontend

Vercel/Netlify u opción equivalente por decidir.

------------------------------------------------------------------------

## OPEN-006 --- Hosting backend

Pendiente.

Debe evaluarse junto con el stack elegido y costos.

------------------------------------------------------------------------

## OPEN-007 --- Estrategia de autenticación

Pendiente definir:

-   proveedor;
-   sesión vs JWT;
-   refresh;
-   MFA;
-   recuperación.

------------------------------------------------------------------------

## OPEN-008 --- Row Level Security

Pendiente determinar si se utilizará RLS como defensa adicional.

No reemplazará autorización backend.

------------------------------------------------------------------------

## OPEN-009 --- Observabilidad

Pendiente definir proveedor/herramientas concretas.

Comenzar con capacidades nativas cuando sean suficientes.

------------------------------------------------------------------------

## OPEN-010 --- Dominio

Pendiente definir dominio/subdominios reales.

------------------------------------------------------------------------

# 9. Preguntas funcionales abiertas

## OPEN-011 --- Inventario definitivo

Confirmar lista completa de:

-   vehículos;
-   maquinaria;
-   estado;
-   propiedad;
-   créditos;
-   valor de adquisición.

------------------------------------------------------------------------

## OPEN-012 --- Matriz de usuarios

Confirmar:

-   personas iniciales;
-   roles;
-   permisos;
-   quién puede cerrar;
-   quién puede reabrir;
-   quién puede anular.

------------------------------------------------------------------------

## OPEN-013 --- Cierre mensual

Definir exactamente:

-   fecha de corte;
-   quién concilia;
-   quién aprueba;
-   posibilidad de cierre parcial;
-   tratamiento de diferencias.

------------------------------------------------------------------------

## OPEN-014 --- Estructura real de Mora Mora

Antes de implementar integración productiva obtener:

-   OpenAPI/documentación;
-   endpoints;
-   autenticación;
-   payloads;
-   IDs;
-   estados;
-   timestamps;
-   reglas de edición;
-   mecanismo de cierre/bloqueo;
-   sandbox.

------------------------------------------------------------------------

## OPEN-015 --- Materiales

Confirmar catálogo inicial y unidades:

-   triturado;
-   arena;
-   piedra;
-   gravilla;
-   otros.

------------------------------------------------------------------------

## OPEN-016 --- Fuentes/orígenes

Confirmar lugares de compra/cargue y cómo se identifican comercialmente.

------------------------------------------------------------------------

## OPEN-017 --- Combustible

Definir si se requiere:

-   galones/litros;
-   precio unitario;
-   estación;
-   odómetro;
-   factura/soporte;
-   tarjeta específica.

------------------------------------------------------------------------

## OPEN-018 --- Peajes

Definir si basta gasto total o si se requiere catálogo de peajes por
ruta.

------------------------------------------------------------------------

## OPEN-019 --- Mantenimiento

Confirmar reglas preventivas por:

-   kilometraje;
-   horas;
-   fecha;
-   tipo de activo.

------------------------------------------------------------------------

## OPEN-020 --- Maquinaria por horas

Confirmar modelo comercial de pajaritas/Bobcats:

-   hora;
-   jornada;
-   servicio fijo;
-   operador;
-   combustible;
-   transporte.

No asumir que su operación es igual a la de tractomulas.

------------------------------------------------------------------------

## OPEN-021 --- Participación 50 %

Definir tratamiento contable/gerencial del activo compartido:

-   ingresos;
-   gastos;
-   utilidad;
-   obligaciones;
-   distribución al socio.

------------------------------------------------------------------------

## OPEN-022 --- Reporte ejecutivo

Definir diseño y KPIs exactos del PDF después de tener datos reales.

Base esperada:

-   ingresos;
-   costos;
-   utilidad;
-   cartera;
-   mantenimiento;
-   obligaciones;
-   utilización.

------------------------------------------------------------------------

# 10. Fuera del MVP confirmado

**Estado:** DEFERRED

-   nómina completa;
-   facturación electrónica;
-   integración DIAN;
-   GPS/telemetría avanzada;
-   app móvil nativa;
-   IA predictiva;
-   data warehouse;
-   microservicios;
-   SaaS billing;
-   onboarding automatizado;
-   multi-región;
-   mantenimiento predictivo;
-   optimización automática de rutas.

Pueden adelantarse solo si aparece una necesidad empresarial que cambie
la prioridad.

------------------------------------------------------------------------

# 11. Proceso para nuevas decisiones

Cuando aparezca una decisión relevante:

``` text
ID
Fecha
Estado
Contexto
Decisión
Alternativas
Motivo
Consecuencias
Revisión futura
```

Si afecta arquitectura de forma significativa, crear además un ADR
independiente.

------------------------------------------------------------------------

# 12. Proceso para cambiar una decisión

No sobrescribir silenciosamente la historia.

Ejemplo:

``` text
DEC-004
Estado anterior: PostgreSQL preferido
Nueva decisión: ...
Motivo: ...
Fecha: ...
Impacto: ...
Migración requerida: sí/no
```

------------------------------------------------------------------------

# 13. Prioridad ante contradicciones

Si dos documentos parecen contradecirse:

1.  verificar cuál fue actualizado más recientemente;
2.  consultar este registro;
3.  revisar ADR;
4.  no inventar;
5.  resolver la contradicción antes de implementar lógica crítica.

------------------------------------------------------------------------

# 14. Criterio de cierre de Fase 0

No es necesario resolver todos los `OPEN`.

Sí deben resolverse antes de comenzar la parte que dependa directamente
de ellos.

Ejemplo:

> No es necesario definir hoy todos los campos de combustible para
> implementar autenticación, pero sí antes de cerrar el diseño
> definitivo del módulo de gastos.

------------------------------------------------------------------------

## Criterio final

> Las decisiones importantes de KLEBER deben vivir en el repositorio y
> no únicamente en la memoria de una persona, una conversación o un
> agente IA.

Cuando exista incertidumbre, se documentará como incertidumbre en lugar
de convertir una suposición en una regla del sistema.
