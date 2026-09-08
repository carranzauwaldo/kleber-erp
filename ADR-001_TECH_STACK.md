# ADR-001 --- Stack técnico inicial de KLEBER

**Tarea:** KLB-001\
**Fecha:** 2026-09-07\
**Estado:** PROPUESTO PARA APROBACIÓN\
**Alcance:** Stack de aplicación. El proveedor cloud definitivo se
decide en KLB-002.

## 1. Decisión propuesta

Adoptar un stack TypeScript de extremo a extremo:

``` text
Frontend     Next.js 16.3 Active LTS + React + TypeScript
Backend      NestJS 11 + TypeScript
API          REST + OpenAPI
Database     PostgreSQL
ORM          Prisma 8
Monorepo     pnpm workspaces
Testing      Vitest/Jest según compatibilidad + integración + Playwright E2E
Git/CI       GitHub + GitHub Actions
```

La versión exacta de cada dependencia se fijará en el lockfile al crear
el repositorio. No usar rangos que permitan upgrades mayores
automáticos.

## 2. Por qué este stack

KLEBER es un ERP relacional con reglas financieras, auditoría, permisos,
integraciones y crecimiento modular. Conviene mantener frontend y
backend separados conceptualmente aunque residan en el mismo monorepo.

NestJS aporta una estructura explícita para módulos, servicios, guards,
validación e integración. Next.js aporta una interfaz React madura y
buen soporte para desarrollo asistido por agentes.

TypeScript compartido reduce cambios de contexto entre frontend/backend
y facilita que Codex y Claude trabajen sobre contratos tipados.

PostgreSQL sigue siendo la base apropiada para transacciones, integridad
y reporting.

Prisma 8 utiliza contratos inspeccionables y tipados y tiene PostgreSQL
como objetivo principal, lo que encaja bien con un flujo de desarrollo
asistido por agentes.

## 3. Arquitectura resultante

``` text
apps/
  web/              Next.js
  api/              NestJS

packages/
  contracts/        DTOs/schemas compartidos cuando corresponda
  config/           configuración compartida no secreta
  testing/          utilidades de test

docs/
  ...

database/
  migrations/       según flujo definitivo del ORM
```

No crear paquetes compartidos adicionales hasta que exista reutilización
real.

## 4. Alternativa A --- Next.js full-stack

**Descripción:** Next.js para UI y backend mediante Route
Handlers/Server Functions.

**Ventajas:** - menor cantidad de proyectos; - despliegue sencillo; -
TypeScript único; - excelente velocidad inicial.

**Desventajas para KLEBER:** - fronteras backend/dominio menos
explícitas; - mayor riesgo de mezclar UI, autorización y reglas
empresariales; - la integración Mora Mora y los procesos financieros
crecerán fuera de un CRUD web simple; - puede resultar más difícil
mantener disciplina modular con varios agentes.

**Resultado:** No recomendada como arquitectura principal, aunque sería
válida para un producto más pequeño.

## 5. Alternativa B --- Next.js + NestJS

**Ventajas:** - separación clara frontend/backend; - módulos backend
explícitos; - guards/policies adecuados para RBAC; - OpenAPI natural; -
buena testabilidad; - TypeScript end-to-end; - apropiado para
integraciones y reglas empresariales; - permite desplegar web/API
independientemente si más adelante se necesita.

**Desventajas:** - dos aplicaciones; - algo más de boilerplate; -
despliegue ligeramente más complejo.

**Resultado:** RECOMENDADA.

## 6. Alternativa C --- React/Vite + FastAPI

**Ventajas:** - FastAPI tiene excelente experiencia OpenAPI; - Python es
fuerte para futuras funciones de datos/IA; - frontend muy desacoplado.

**Desventajas:** - dos lenguajes principales; - contratos
TypeScript/Python requieren coordinación; - mayor cambio de contexto
para agentes y mantenimiento; - la futura IA puede existir como
componente Python independiente sin obligar al ERP central a utilizar
Python.

**Resultado:** Buena alternativa, pero no ofrece suficiente ventaja para
justificar dos stacks principales.

## 7. Frontend

Usar Next.js 16.3 Active LTS o su parche de seguridad vigente al momento
de inicializar el repositorio.

Principios:

-   App Router;
-   TypeScript estricto;
-   componentes server/client solo donde corresponda;
-   evitar lógica financiera crítica en frontend;
-   backend NestJS como autoridad de negocio;
-   formularios con validación UX y validación definitiva en API;
-   no convertir Next.js en un segundo backend paralelo.

## 8. Backend

NestJS será el backend principal.

Organización conceptual:

``` text
src/modules/
  identity/
  organizations/
  people/
  assets/
  clients/
  routes/
  trips/
  operational-cash/
  finance/
  maintenance/
  reports/
  integrations/
  audit/
```

Cada módulo crecerá internamente por capas cuando lo necesite.

No crear microservicios.

## 9. API

REST será la interfaz inicial.

Motivos:

-   contratos claros;
-   integración Mora Mora;
-   fácil depuración;
-   OpenAPI;
-   idempotencia;
-   herramientas maduras;
-   menor complejidad que GraphQL para el dominio actual.

GraphQL queda fuera del MVP salvo necesidad demostrada.

## 10. ORM

Propuesta: Prisma 8.

Condiciones:

-   revisar su flujo de migraciones actual al inicializar;
-   inspeccionar SQL/migraciones críticas;
-   no asumir que el ORM sustituye constraints de PostgreSQL;
-   usar transacciones explícitas en operaciones financieras;
-   SQL directo permitido cuando exista una necesidad justificada.

Si durante KLB-002/KLB-020 aparece una limitación seria de Prisma 8 para
las reglas definidas, se deberá abrir un ADR antes de cambiar a
Drizzle/Kysely u otra capa.

## 11. Validación

Los payloads externos deberán validarse en runtime.

La librería concreta se elegirá durante bootstrap procurando evitar
duplicación entre NestJS, OpenAPI y contratos frontend.

No introducir múltiples sistemas de schemas sin necesidad.

## 12. Testing

Estrategia:

``` text
Unit
  reglas de dominio y cálculos

Integration
  NestJS + PostgreSQL real de pruebas

Contract
  API e integración Mora Mora

E2E
  Playwright para pocos flujos críticos
```

No basar reglas de PostgreSQL exclusivamente en mocks.

## 13. Monorepo

Usar pnpm workspaces inicialmente.

No incorporar Nx/Turborepo desde el día uno salvo que exista una
necesidad concreta que pnpm workspaces no resuelva.

Esto mantiene menor complejidad y costo cognitivo.

## 14. Node.js

Usar una versión LTS compatible con todas las dependencias elegidas.
Prisma 8 actualmente requiere Node.js 24 o superior en su quickstart,
por lo que la línea base propuesta para el repositorio será Node.js 24
LTS o superior compatible.

La versión se fijará mediante archivo de versión/engines.

## 15. Seguridad

Este ADR no modifica `05_SECURITY.md`.

En particular:

-   autorización en NestJS;
-   no confiar en controles de UI;
-   secretos fuera del repositorio;
-   tenant scoping;
-   auditoría;
-   HTTPS;
-   validación runtime.

## 16. IA futura

La selección de TypeScript para el ERP no obliga a implementar modelos
de IA en Node.js.

Si una función futura necesita Python:

``` text
KLEBER API
   ↓ contrato explícito
servicio/job Python especializado
```

solo cuando exista necesidad real.

## 17. Portabilidad

Next.js 16 dispone de mecanismos de despliegue fuera de un único
proveedor. El backend NestJS también puede ejecutarse como aplicación
Node estándar.

La arquitectura no debe depender de funciones propietarias de un
proveedor salvo ADR explícito.

## 18. Costo

La selección del stack no obliga a contratar Vercel, Supabase ni Prisma
Postgres.

KLB-002 comparará proveedores y planes vigentes.

Objetivo de desarrollo/MVP continúa siendo infraestructura de costo
mínimo, con gasto productivo únicamente cuando seguridad, backups o
estabilidad lo requieran.

## 19. Riesgos

### Prisma 8

Es una generación nueva del ORM y su flujo difiere de versiones
anteriores.

**Mitigación:** fijar versión, revisar migraciones y evitar APIs
experimentales sin necesidad.

### Dos aplicaciones

Next.js + NestJS requiere más estructura que Next.js full-stack.

**Mitigación:** monorepo sencillo y contratos claros.

### Duplicación de tipos

Puede ocurrir entre DTOs backend y frontend.

**Mitigación:** compartir únicamente contratos estables; no compartir
entidades internas del dominio.

### Sobrearquitectura

NestJS facilita crear muchas abstracciones.

**Mitigación:** monolito modular y principio YAGNI.

## 20. Decisiones derivadas

Si este ADR se aprueba:

``` text
KLB-001 → DONE
KLB-002 → siguiente tarea
```

KLB-002 deberá seleccionar concretamente:

-   proveedor PostgreSQL;
-   Auth;
-   Storage;
-   estrategia de staging;
-   costo inicial;
-   backups;
-   límites;
-   riesgo de lock-in.

## 21. Decisiones todavía abiertas

-   proveedor cloud;
-   proveedor Auth;
-   hosting frontend;
-   hosting backend;
-   librería runtime de schemas;
-   estrategia exacta de sesiones;
-   RLS;
-   observabilidad;
-   dominio.

## 22. Resultado

**Recomendación final:**

``` text
Next.js 16.3 + TypeScript
          │
          │ REST/OpenAPI
          ▼
NestJS 11 + TypeScript
          │
          ▼
       Prisma 8
          │
          ▼
      PostgreSQL
```

Este stack mantiene KLEBER suficientemente simple para el MVP, pero con
fronteras sólidas para finanzas, seguridad, Mora Mora y crecimiento
futuro.
