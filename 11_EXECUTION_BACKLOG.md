# 11_EXECUTION_BACKLOG.md --- Backlog de ejecución

**Proyecto:** KLEBER ERP\
**Estado:** Fase 0 / Plan inicial de ejecución\
**Objetivo:** Convertir la arquitectura y decisiones de KLEBER en tareas
pequeñas, ordenadas, verificables y aptas para ejecución con Codex y
Claude.

------------------------------------------------------------------------

# 1. Principio de ejecución

No se desarrollará KLEBER como una sola tarea.

El proyecto avanzará mediante unidades pequeñas:

``` text
documentar
→ implementar
→ probar
→ revisar
→ integrar
→ desplegar en staging
→ validar
```

Cada tarea debe producir un resultado comprobable.

------------------------------------------------------------------------

# 2. Estados

``` text
BACKLOG
READY
IN_PROGRESS
REVIEW
BLOCKED
DONE
```

Solo una persona/agente será responsable primario de una tarea
`IN_PROGRESS`.

------------------------------------------------------------------------

# 3. Prioridades

``` text
P0 = seguridad, integridad o bloqueo
P1 = MVP crítico
P2 = MVP conveniente
P3 = post-MVP
P4 = futuro
```

------------------------------------------------------------------------

# 4. Esfuerzo IA

``` text
LOW
MEDIUM
HIGH
```

`HIGH` se reservará para arquitectura, seguridad, finanzas,
concurrencia, migraciones complejas, Mora Mora y revisión productiva.

------------------------------------------------------------------------

# 5. Fase A --- Cerrar decisiones técnicas

## KLB-001 --- Elegir stack frontend/backend

**Prioridad:** P0\
**Agente sugerido:** Codex\
**Esfuerzo:** HIGH\
**Dependencias:** Fase 0 documental

Comparar opciones concretas y seleccionar stack estable.

### Criterios

-   Type safety.
-   PostgreSQL.
-   OpenAPI.
-   testing.
-   mantenibilidad.
-   ecosistema.
-   soporte IA.
-   costo de despliegue.

### Entrega

ADR con decisión y alternativas descartadas.

------------------------------------------------------------------------

## KLB-002 --- Elegir proveedor PostgreSQL/Auth/Storage

**Prioridad:** P0\
**Agente sugerido:** Codex\
**Esfuerzo:** HIGH\
**Dependencias:** KLB-001

Evaluar alternativas reales con precios/límites vigentes en el momento
de implementación.

### Entrega

ADR + estimación de costo mensual.

------------------------------------------------------------------------

## KLB-003 --- Elegir hosting

**Prioridad:** P0\
**Agente sugerido:** Codex\
**Esfuerzo:** MEDIUM\
**Dependencias:** KLB-001, KLB-002

Definir:

-   frontend;
-   backend;
-   staging;
-   production.

------------------------------------------------------------------------

## KLB-004 --- Confirmar inventario inicial

**Prioridad:** P1\
**Responsable:** Humano\
**Esfuerzo:** LOW

Confirmar:

-   volqueta;
-   tractomulas;
-   pajaritas;
-   Bobcats;
-   propiedad;
-   estado;
-   créditos;
-   obligaciones.

No bloquear inicio técnico, pero completar antes de cargar producción.

------------------------------------------------------------------------

## KLB-005 --- Confirmar usuarios/roles iniciales

**Prioridad:** P1\
**Responsable:** Humano

Confirmar usuarios reales y permisos.

Validar nombres:

``` text
ADMIN
FINANCE
REGISTRO_1
```

------------------------------------------------------------------------

# 6. Fase B --- Bootstrap del repositorio

## KLB-010 --- Crear repositorio y estructura

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** MEDIUM\
**Dependencias:** KLB-001

Crear estructura modular según `02_ARCHITECTURE.md`.

No implementar todavía módulos completos.

------------------------------------------------------------------------

## KLB-011 --- Incorporar documentación Fase 0

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** LOW\
**Dependencias:** KLB-010

Agregar al repositorio:

``` text
docs/
  00_PROJECT_CHARTER.md
  01_SCOPE_AND_ROADMAP.md
  02_ARCHITECTURE.md
  03_DATABASE.md
  04_API_AND_INTEGRATIONS.md
  05_SECURITY.md
  06_INFRASTRUCTURE_AND_DEPLOYMENT.md
  07_COST_OPTIMIZATION.md
  08_AI_AGENTS_AND_DEVELOPMENT_WORKFLOW.md
  09_CODING_AND_TESTING_STANDARDS.md
  10_DECISIONS_AND_ASSUMPTIONS.md
  11_EXECUTION_BACKLOG.md
```

------------------------------------------------------------------------

## KLB-012 --- Configurar calidad

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** MEDIUM

Configurar:

-   formatter;
-   lint;
-   typecheck;
-   test runner;
-   build;
-   editor config.

------------------------------------------------------------------------

## KLB-013 --- Configurar CI

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** MEDIUM

Pipeline:

``` text
install
lint
typecheck
tests
build
```

------------------------------------------------------------------------

## KLB-014 --- Configurar secretos y ambientes

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Crear:

``` text
.env.example
LOCAL
STAGING
PRODUCTION
```

Sin secretos reales en Git.

------------------------------------------------------------------------

# 7. Fase C --- Persistencia y autenticación

## KLB-020 --- Inicializar PostgreSQL y migraciones

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Implementar infraestructura de migraciones.

No crear todas las tablas en una migración gigante.

------------------------------------------------------------------------

## KLB-021 --- Organizations

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** MEDIUM

Implementar entidad organización y scoping base.

------------------------------------------------------------------------

## KLB-022 --- Auth

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Implementar autenticación conforme a `05_SECURITY.md`.

------------------------------------------------------------------------

## KLB-023 --- RBAC

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Implementar:

-   roles;
-   permisos;
-   middleware/policies;
-   pruebas negativas.

------------------------------------------------------------------------

## KLB-024 --- Tenant isolation tests

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Probar que una organización no pueda acceder a recursos de otra.

Aunque inicialmente exista una sola organización, la prueba debe
existir.

------------------------------------------------------------------------

## KLB-025 --- Auditoría base

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Crear infraestructura append-only para eventos críticos.

------------------------------------------------------------------------

# 8. Fase D --- Primer vertical slice

## KLB-030 --- Modelo básico de activos

**Prioridad:** P1\
**Agente:** Codex\
**Esfuerzo:** MEDIUM

Implementar:

-   assets;
-   asset ownership;
-   estados;
-   repositorio;
-   API;
-   tests.

------------------------------------------------------------------------

## KLB-031 --- UI de activos

**Prioridad:** P1\
**Agente:** Claude\
**Esfuerzo:** MEDIUM\
**Dependencias:** contrato KLB-030

Crear:

-   listado;
-   creación;
-   edición permitida;
-   detalle;
-   estados loading/error/empty.

------------------------------------------------------------------------

## KLB-032 --- People/employees base

**Prioridad:** P1\
**Agente:** Codex\
**Esfuerzo:** MEDIUM

Permitir registrar personas y empleados/conductores sin construir
nómina.

------------------------------------------------------------------------

## KLB-033 --- UI personas/conductores

**Prioridad:** P1\
**Agente:** Claude\
**Esfuerzo:** MEDIUM

------------------------------------------------------------------------

## KLB-034 --- Deploy vertical slice a staging

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Validar:

``` text
login
→ permisos
→ activo
→ DB
→ auditoría
→ frontend
→ backend
→ CI/CD
→ staging
```

Este hito valida la arquitectura real antes de ampliar el ERP.

------------------------------------------------------------------------

# 9. Fase E --- Clientes, ubicaciones y rutas

## KLB-040 --- Clientes

**Prioridad:** P1\
**Agente:** Codex\
**Esfuerzo:** MEDIUM

Modelo + API + tests.

------------------------------------------------------------------------

## KLB-041 --- UI clientes

**Prioridad:** P1\
**Agente:** Claude\
**Esfuerzo:** MEDIUM

------------------------------------------------------------------------

## KLB-042 --- Ubicaciones

**Prioridad:** P1\
**Agente:** Codex\
**Esfuerzo:** MEDIUM

Origen/destino reutilizable.

------------------------------------------------------------------------

## KLB-043 --- Rutas

**Prioridad:** P1\
**Agente:** Codex\
**Esfuerzo:** MEDIUM

Relacionar origen/destino.

------------------------------------------------------------------------

## KLB-044 --- Historial de tarifas

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Implementar vigencias y prohibir modificación retroactiva de viajes
existentes.

------------------------------------------------------------------------

## KLB-045 --- UI rutas/tarifas

**Prioridad:** P1\
**Agente:** Claude\
**Esfuerzo:** MEDIUM

Mostrar tarifa vigente e historial.

------------------------------------------------------------------------

# 10. Fase F --- Viajes

## KLB-050 --- Modelo Trip

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Soportar:

``` text
FREIGHT_ONLY
FREIGHT_AND_MATERIAL
```

y snapshot de tarifa.

------------------------------------------------------------------------

## KLB-051 --- State machine de viaje

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Definir transiciones válidas y proteger viajes cerrados.

------------------------------------------------------------------------

## KLB-052 --- Crear viaje API

**Prioridad:** P1\
**Agente:** Codex\
**Esfuerzo:** MEDIUM

------------------------------------------------------------------------

## KLB-053 --- UI registro de viaje

**Prioridad:** P1\
**Agente:** Claude\
**Esfuerzo:** MEDIUM

Optimizar para registro rápido.

------------------------------------------------------------------------

## KLB-054 --- Listado/filtros de viajes

**Prioridad:** P1\
**Agente:** Claude\
**Esfuerzo:** MEDIUM

Filtros:

-   fecha;
-   activo;
-   conductor;
-   cliente;
-   ruta;
-   estado;
-   modalidad.

------------------------------------------------------------------------

## KLB-055 --- Detalle de viaje

**Prioridad:** P1\
**Agente:** Claude\
**Esfuerzo:** MEDIUM

Preparar vista para integrar gastos, pagos, conciliación y auditoría.

------------------------------------------------------------------------

## KLB-056 --- Tests E2E de viaje

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Crear → consultar → actualizar → cerrar → rechazar edición posterior.

------------------------------------------------------------------------

# 11. Fase G --- Caja operacional

## KLB-060 --- Anticipos

**Prioridad:** P1\
**Agente:** Codex\
**Esfuerzo:** HIGH

Registrar entrega de dinero al conductor.

------------------------------------------------------------------------

## KLB-061 --- Gastos de viaje

**Prioridad:** P1\
**Agente:** Codex\
**Esfuerzo:** HIGH

Categorías iniciales:

-   combustible;
-   peajes;
-   material;
-   otros.

------------------------------------------------------------------------

## KLB-062 --- Liquidación

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Calcular:

``` text
anticipo
- gastos válidos
= saldo
```

Soportar devolución/diferencia.

------------------------------------------------------------------------

## KLB-063 --- UI liquidación

**Prioridad:** P1\
**Agente:** Claude\
**Esfuerzo:** MEDIUM

------------------------------------------------------------------------

## KLB-064 --- Tests financieros de caja

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Cubrir:

-   cero;
-   sobrante;
-   faltante;
-   duplicación;
-   viaje cerrado;
-   permisos.

------------------------------------------------------------------------

# 12. Fase H --- Cartera y recaudos

## KLB-070 --- Accounts receivable

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Crear cuentas por cobrar vinculadas a operación.

------------------------------------------------------------------------

## KLB-071 --- Pagos

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Soportar:

-   total;
-   parcial;
-   anticipo;
-   múltiples asignaciones cuando se defina.

------------------------------------------------------------------------

## KLB-072 --- Estado de cuenta cliente

**Prioridad:** P1\
**Agente:** Codex\
**Esfuerzo:** MEDIUM

------------------------------------------------------------------------

## KLB-073 --- UI cartera

**Prioridad:** P1\
**Agente:** Claude\
**Esfuerzo:** MEDIUM

Mostrar:

-   saldo;
-   vencidos;
-   pendientes;
-   pagos;
-   viajes asociados.

------------------------------------------------------------------------

## KLB-074 --- Tests cartera

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Evitar doble aplicación y saldos inconsistentes.

------------------------------------------------------------------------

# 13. Fase I --- Mora Mora

## KLB-080 --- Obtener contrato real

**Prioridad:** P0\
**Responsable:** Humano + equipo Mora Mora

Necesario:

-   endpoints;
-   auth;
-   payloads;
-   IDs;
-   estados;
-   versionado;
-   cierre;
-   sandbox.

No comenzar integración productiva sin esta información.

------------------------------------------------------------------------

## KLB-081 --- MoraMoraGateway

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH\
**Dependencias:** KLB-080

Implementar adaptador aislado.

------------------------------------------------------------------------

## KLB-082 --- Import idempotente

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Reenviar el mismo evento no debe duplicar viaje.

------------------------------------------------------------------------

## KLB-083 --- Actualización de viajes abiertos

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Actualizar únicamente campos bajo propiedad operacional de Mora Mora.

------------------------------------------------------------------------

## KLB-084 --- Conciliación

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Comparar/confirmar datos antes del cierre.

------------------------------------------------------------------------

## KLB-085 --- Cierre y remote lock

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Registrar:

``` text
local_close
remote_lock_status
```

Manejar fallos parciales.

------------------------------------------------------------------------

## KLB-086 --- Reapertura

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Autorización + motivo + auditoría + nueva conciliación.

------------------------------------------------------------------------

## KLB-087 --- UI conciliación

**Prioridad:** P1\
**Agente:** Claude\
**Esfuerzo:** HIGH

Mostrar claramente:

-   diferencias;
-   origen de datos;
-   estado;
-   cierre;
-   reapertura.

------------------------------------------------------------------------

## KLB-088 --- Contract/integration tests

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Cubrir duplicados, versiones viejas, fallos, retry y cierre.

------------------------------------------------------------------------

# 14. Fase J --- Mantenimiento y obligaciones

## KLB-090 --- Órdenes de mantenimiento

**Prioridad:** P1\
**Agente:** Codex\
**Esfuerzo:** MEDIUM

------------------------------------------------------------------------

## KLB-091 --- Costos de mantenimiento

**Prioridad:** P1\
**Agente:** Codex\
**Esfuerzo:** HIGH

Asociar correctamente al activo/cost center.

------------------------------------------------------------------------

## KLB-092 --- Obligaciones del activo

**Prioridad:** P1\
**Agente:** Codex\
**Esfuerzo:** HIGH

Soportar:

-   crédito;
-   impuesto;
-   reparación;
-   seguro;
-   otros.

------------------------------------------------------------------------

## KLB-093 --- UI mantenimiento

**Prioridad:** P1\
**Agente:** Claude\
**Esfuerzo:** MEDIUM

------------------------------------------------------------------------

## KLB-094 --- Alertas preventivas

**Prioridad:** P2\
**Agente:** Codex\
**Esfuerzo:** MEDIUM

Después de confirmar reglas por kilometraje/horas/fecha.

------------------------------------------------------------------------

# 15. Fase K --- Reportes y dashboard

## KLB-100 --- KPIs base

**Prioridad:** P1\
**Agente:** Codex\
**Esfuerzo:** HIGH

Calcular:

-   ingresos;
-   gastos;
-   utilidad;
-   cartera;
-   viajes;
-   costos por activo.

------------------------------------------------------------------------

## KLB-101 --- Dashboard ejecutivo

**Prioridad:** P1\
**Agente:** Claude\
**Esfuerzo:** HIGH

Priorizar información accionable, no decoración.

------------------------------------------------------------------------

## KLB-102 --- Estado financiero por activo

**Prioridad:** P1\
**Agente:** Codex\
**Esfuerzo:** HIGH

------------------------------------------------------------------------

## KLB-103 --- PDF ejecutivo

**Prioridad:** P1\
**Agente:** Claude + Codex\
**Esfuerzo:** HIGH

Codex: datos/servicio.\
Claude: presentación.

------------------------------------------------------------------------

## KLB-104 --- Rentabilidad por ruta

**Prioridad:** P2\
**Agente:** Codex\
**Esfuerzo:** HIGH

------------------------------------------------------------------------

## KLB-105 --- Rentabilidad por cliente

**Prioridad:** P2\
**Agente:** Codex\
**Esfuerzo:** HIGH

------------------------------------------------------------------------

# 16. Fase L --- Hardening y piloto

## KLB-110 --- Security review

**Prioridad:** P0\
**Agente:** Codex + revisión independiente\
**Esfuerzo:** HIGH

Revisar:

-   auth;
-   RBAC;
-   tenant;
-   IDOR;
-   inputs;
-   archivos;
-   secretos;
-   Mora Mora;
-   logs.

------------------------------------------------------------------------

## KLB-111 --- Financial integrity review

**Prioridad:** P0\
**Agente:** Codex\
**Esfuerzo:** HIGH

Revisar dinero, transacciones, saldos, anulaciones y cierres.

------------------------------------------------------------------------

## KLB-112 --- Backup/restore drill

**Prioridad:** P0\
**Responsable:** Humano + Codex\
**Esfuerzo:** HIGH

Restaurar realmente una copia en ambiente seguro.

------------------------------------------------------------------------

## KLB-113 --- Performance smoke test

**Prioridad:** P1\
**Agente:** Codex\
**Esfuerzo:** MEDIUM

No requiere escala masiva; detectar errores obvios.

------------------------------------------------------------------------

## KLB-114 --- UAT

**Prioridad:** P0\
**Responsable:** Usuarios KLEBER

Probar operación real en staging.

------------------------------------------------------------------------

## KLB-115 --- Correcciones piloto

**Prioridad:** P0/P1 según hallazgo\
**Agente:** Codex/Claude

------------------------------------------------------------------------

## KLB-116 --- Go-live checklist

**Prioridad:** P0\
**Responsable:** Humano + agentes

Confirmar:

-   dominio;
-   HTTPS;
-   backup;
-   restore;
-   auth;
-   roles;
-   auditoría;
-   staging;
-   CI;
-   rollback;
-   costos;
-   alertas;
-   soporte.

------------------------------------------------------------------------

# 17. Post-MVP

## KLB-200 --- Nómina

**Prioridad:** P3

------------------------------------------------------------------------

## KLB-201 --- GPS/telemetría

**Prioridad:** P3

------------------------------------------------------------------------

## KLB-202 --- Facturación electrónica/DIAN

**Prioridad:** P3

Implementar únicamente conforme a requisitos legales/técnicos vigentes.

------------------------------------------------------------------------

## KLB-203 --- Aplicación móvil

**Prioridad:** P3

------------------------------------------------------------------------

## KLB-204 --- IA de mantenimiento

**Prioridad:** P4

------------------------------------------------------------------------

## KLB-205 --- Proyección de flujo de caja

**Prioridad:** P4

------------------------------------------------------------------------

## KLB-206 --- Detección de anomalías

**Prioridad:** P4

------------------------------------------------------------------------

## KLB-207 --- Recomendaciones de rentabilidad

**Prioridad:** P4

------------------------------------------------------------------------

## KLB-208 --- SaaS comercial

**Prioridad:** P4

Solo ante demanda real.

------------------------------------------------------------------------

# 18. Ruta crítica resumida

``` text
KLB-001 Stack
    ↓
KLB-002 Proveedor
    ↓
KLB-010 Repo
    ↓
KLB-012 Calidad
    ↓
KLB-020 DB
    ↓
KLB-022 Auth
    ↓
KLB-023 RBAC
    ↓
KLB-025 Audit
    ↓
KLB-030 Assets
    ↓
KLB-034 Staging vertical slice
    ↓
KLB-044 Rates
    ↓
KLB-050 Trips
    ↓
KLB-062 Operational settlement
    ↓
KLB-070 Receivables
    ↓
KLB-080 Mora Mora contract
    ↓
KLB-081–088 Integration
    ↓
KLB-090 Maintenance
    ↓
KLB-100 Reporting
    ↓
KLB-110 Hardening
    ↓
KLB-114 UAT
    ↓
KLB-116 GO LIVE
```

------------------------------------------------------------------------

# 19. Primeras tareas para Codex

Después de aprobar Fase 0:

### Prompt 1

``` text
TAREA: KLB-001

Objetivo:
Proponer el stack técnico definitivo para KLEBER ERP.

Lee únicamente:
- docs/00_PROJECT_CHARTER.md
- docs/02_ARCHITECTURE.md
- docs/03_DATABASE.md
- docs/04_API_AND_INTEGRATIONS.md
- docs/05_SECURITY.md
- docs/06_INFRASTRUCTURE_AND_DEPLOYMENT.md
- docs/07_COST_OPTIMIZATION.md
- docs/09_CODING_AND_TESTING_STANDARDS.md
- docs/10_DECISIONS_AND_ASSUMPTIONS.md

No escribas código todavía.

Compara máximo 3 alternativas.
Evalúa:
- PostgreSQL
- type safety
- API/OpenAPI
- auth
- testing
- despliegue
- costo
- mantenibilidad
- integración Mora Mora
- soporte para agentes IA

Entrega:
1. recomendación
2. tabla comparativa
3. riesgos
4. ADR propuesto
5. decisiones que todavía requieren aprobación
```

------------------------------------------------------------------------

# 20. Primera tarea para Claude

Mientras Codex evalúa stack, Claude puede trabajar sin tocar código:

``` text
TAREA: Preparación UX del vertical slice

Lee:
- docs/00_PROJECT_CHARTER.md
- docs/01_SCOPE_AND_ROADMAP.md
- docs/08_AI_AGENTS_AND_DEVELOPMENT_WORKFLOW.md
- docs/10_DECISIONS_AND_ASSUMPTIONS.md

Objetivo:
Definir el flujo UX mínimo para:
- login
- listado de activos
- crear activo
- detalle de activo
- listado de viajes
- crear viaje

No selecciones framework.
No escribas implementación.
No inventes reglas financieras.

Entrega:
- mapa de pantallas
- campos
- estados
- validaciones UX
- acciones por rol
- dudas pendientes
```

Estas dos tareas pueden ejecutarse en paralelo porque no modifican el
mismo código.

------------------------------------------------------------------------

# 21. Regla de actualización del backlog

Después de cada tarea:

-   cambiar estado;
-   registrar dependencia nueva;
-   añadir tarea si surge trabajo real;
-   eliminar tareas que dejen de tener sentido;
-   evitar que el backlog se convierta en historial infinito.

------------------------------------------------------------------------

# 22. Qué no hacer al comenzar

No iniciar simultáneamente:

-   todos los módulos;
-   nómina;
-   IA;
-   GPS;
-   microservicios;
-   app móvil;
-   SaaS;
-   facturación electrónica.

Primero validar un vertical slice completo.

------------------------------------------------------------------------

# 23. Hito 1

**KLEBER Technical Foundation**

Se considera logrado cuando:

-   repositorio existe;
-   stack decidido;
-   CI funciona;
-   DB funciona;
-   auth funciona;
-   RBAC funciona;
-   auditoría funciona;
-   activo puede registrarse;
-   staging está desplegado.

------------------------------------------------------------------------

# 24. Hito 2

**KLEBER Operations MVP**

Se considera logrado cuando:

-   clientes;
-   rutas;
-   tarifas;
-   viajes;
-   conductores;
-   anticipos;
-   gastos;
-   liquidaciones;

funcionan de extremo a extremo.

------------------------------------------------------------------------

# 25. Hito 3

**KLEBER Financial MVP**

Cuando:

-   cartera;
-   pagos;
-   obligaciones;
-   costos por activo;
-   reportes básicos;

son consistentes y probados.

------------------------------------------------------------------------

# 26. Hito 4

**KLEBER Integrated MVP**

Cuando Mora Mora:

-   crea/importa;
-   actualiza;
-   reintenta;
-   concilia;
-   cierra;
-   bloquea;
-   reabre controladamente;

sin duplicar ni corromper información.

------------------------------------------------------------------------

# 27. Hito 5

**KLEBER Production Ready**

Cuando:

-   seguridad revisada;
-   backups probados;
-   UAT aprobado;
-   costos controlados;
-   monitoreo activo;
-   rollback disponible;
-   checklist de producción completo.

------------------------------------------------------------------------

# 28. Criterio final

> La velocidad de KLEBER se medirá por funcionalidades correctas que
> llegan a staging y producción, no por cantidad de código generado por
> IA.

Cada tarea debe reducir incertidumbre o entregar una capacidad usable
sin comprometer la arquitectura definida en Fase 0.
