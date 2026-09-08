# 08_AI_AGENTS_AND_DEVELOPMENT_WORKFLOW.md --- Flujo de desarrollo con agentes IA

**Proyecto:** KLEBER ERP\
**Estado:** Diseño base / Fase 0\
**Objetivo:** Definir cómo Codex, Claude y el responsable humano
colaborarán sobre KLEBER de forma segura, eficiente, verificable y con
bajo consumo de contexto/tokens.

------------------------------------------------------------------------

## 1. Principio rector

Los agentes IA aceleran el desarrollo, pero **Git, la documentación y
las pruebas son la fuente de verdad**.

Ningún agente debe depender de recordar conversaciones extensas para
comprender el proyecto.

``` text
Documentación
     ↓
Tarea acotada
     ↓
Rama/worktree
     ↓
Implementación
     ↓
Pruebas
     ↓
Review
     ↓
Merge
```

------------------------------------------------------------------------

## 2. Agentes principales

### Codex

Preferencia inicial:

-   arquitectura técnica;
-   backend;
-   base de datos;
-   migraciones;
-   APIs;
-   integración Mora Mora;
-   seguridad;
-   auditoría;
-   infraestructura;
-   debugging técnico complejo.

### Claude

Preferencia inicial:

-   requisitos;
-   flujos de negocio;
-   frontend;
-   UX/UI;
-   formularios;
-   dashboards;
-   reportes;
-   documentación funcional;
-   revisión de experiencia de usuario.

Esta división no es rígida. Ambos pueden trabajar en cualquier área
cuando exista una razón concreta.

------------------------------------------------------------------------

## 3. Autoridad humana

La IA no decide unilateralmente:

-   alcance;
-   gastos;
-   proveedor cloud;
-   arquitectura crítica;
-   cambios financieros;
-   cambios de seguridad;
-   producción;
-   eliminación de datos;
-   reglas de negocio ambiguas.

Las decisiones de impacto deberán ser aprobadas o registradas
explícitamente.

------------------------------------------------------------------------

## 4. Contexto persistente

Antes de desarrollar, los agentes deberán consultar solo la
documentación relevante.

Documentos base:

``` text
00_PROJECT_CHARTER.md
01_SCOPE_AND_ROADMAP.md
02_ARCHITECTURE.md
03_DATABASE.md
04_API_AND_INTEGRATIONS.md
05_SECURITY.md
06_INFRASTRUCTURE_AND_DEPLOYMENT.md
07_COST_OPTIMIZATION.md
08_AI_AGENTS_AND_DEVELOPMENT_WORKFLOW.md
```

Los documentos posteriores completarán estándares, decisiones y backlog.

No copiar todo el contenido de estos archivos dentro de cada prompt.

------------------------------------------------------------------------

## 5. Contexto mínimo necesario

Una tarea deberá indicar explícitamente qué leer.

Ejemplo:

``` text
Lee:
- 02_ARCHITECTURE.md
- 03_DATABASE.md
- módulo trips/README.md

No necesitas leer el resto del repositorio salvo que encuentres
una dependencia directa necesaria.
```

Esto reduce tokens y exploración innecesaria.

------------------------------------------------------------------------

## 6. Una tarea = un objetivo

Evitar prompts como:

> Construye todo el módulo financiero.

Preferir:

> Implementa el caso de uso para registrar un anticipo operativo
> asociado a un viaje abierto.

Las tareas pequeñas son:

-   más baratas;
-   más fáciles de probar;
-   más fáciles de revisar;
-   más fáciles de revertir;
-   menos propensas a conflictos.

------------------------------------------------------------------------

## 7. Contrato obligatorio de tarea

Formato recomendado:

``` text
TAREA:
<nombre>

OBJETIVO:
<resultado concreto>

LEE:
- archivo A
- archivo B

PUEDES MODIFICAR:
- ruta A
- ruta B

NO MODIFIQUES:
- rutas/módulos protegidos

REGLAS:
- reglas específicas

CRITERIOS DE ACEPTACIÓN:
1. ...
2. ...
3. ...

PRUEBAS:
- ...

ENTREGA:
- resumen
- archivos modificados
- pruebas ejecutadas
- riesgos/pending
```

------------------------------------------------------------------------

## 8. Archivos permitidos

Cada tarea debe limitar el radio de modificación.

Si el agente descubre que necesita cambiar un archivo no autorizado:

1.  no lo modifica silenciosamente;
2.  explica por qué;
3.  propone el cambio;
4.  se amplía la tarea si procede.

------------------------------------------------------------------------

## 9. Git como coordinación

Ramas recomendadas:

``` text
codex/<task>
claude/<task>
fix/<task>
```

Ejemplos:

``` text
codex/trip-rate-history
claude/trip-registration-ui
codex/mora-mora-idempotency
```

No trabajar directamente en `main`.

------------------------------------------------------------------------

## 10. Worktrees

Cuando ambos agentes trabajen en paralelo, usar Git worktrees o copias
de trabajo aisladas.

Ejemplo conceptual:

``` text
repo/
worktrees/
  codex-trip-api/
  claude-trip-ui/
```

Cada agente tendrá:

-   rama propia;
-   directorio propio;
-   alcance propio.

Esto reduce colisiones.

------------------------------------------------------------------------

## 11. Evitar edición simultánea

No asignar el mismo archivo a Codex y Claude simultáneamente salvo
revisión intencional.

Especialmente:

-   schemas;
-   migraciones;
-   auth;
-   configuración;
-   archivos raíz;
-   contratos API.

------------------------------------------------------------------------

## 12. Dependencias entre tareas

Cuando una tarea dependa de otra:

``` text
TASK-A → merge
          ↓
TASK-B
```

No hacer que Claude implemente contra un contrato que Codex todavía está
modificando sin coordinación.

------------------------------------------------------------------------

## 13. Contratos primero

Para frontend/backend paralelo:

1.  definir contrato;
2.  documentar schema/API;
3.  congelar temporalmente;
4.  backend implementa;
5.  frontend implementa;
6.  pruebas integradas.

Así ambos agentes pueden avanzar sin adivinar.

------------------------------------------------------------------------

## 14. Commits

Los agentes deberán producir commits pequeños y descriptivos.

Ejemplos:

``` text
feat(trips): add route rate snapshot
test(trips): cover closed trip update rejection
fix(sync): make Mora Mora upsert idempotent
```

Evitar commits gigantes con cambios no relacionados.

------------------------------------------------------------------------

## 15. Diff antes de merge

Antes de integrar:

-   revisar archivos modificados;
-   detectar cambios inesperados;
-   comprobar secretos;
-   revisar migraciones;
-   verificar tests;
-   confirmar que no se eliminó funcionalidad.

Nunca aceptar cambios únicamente porque "las pruebas pasan".

------------------------------------------------------------------------

## 16. Revisión cruzada

Puede usarse:

``` text
Codex implementa → Claude revisa
Claude implementa → Codex revisa
```

Especialmente útil en:

-   lógica financiera;
-   UX compleja;
-   seguridad;
-   integraciones;
-   migraciones.

El revisor no debe reescribir todo por preferencia estilística.

------------------------------------------------------------------------

## 17. Niveles de razonamiento

### Bajo

-   formato;
-   renombrados;
-   documentación simple;
-   boilerplate;
-   cambios mecánicos.

### Medio

-   CRUD;
-   formularios;
-   endpoints;
-   tests;
-   consultas normales;
-   componentes UI.

### Alto

-   arquitectura;
-   seguridad;
-   conciliación;
-   dinero;
-   concurrencia;
-   migraciones complejas;
-   integración Mora Mora;
-   debugging difícil;
-   revisión de producción.

------------------------------------------------------------------------

## 18. Estrategia de tokens

Para cada tarea:

-   no pegar conversaciones anteriores;
-   referenciar documentación;
-   evitar pedir explicaciones largas;
-   pedir resultados concretos;
-   limitar exploración;
-   no pedir múltiples alternativas si una solución estándar basta;
-   reutilizar contratos existentes.

------------------------------------------------------------------------

## 19. Salida breve del agente

Después de implementar, el agente deberá responder preferentemente:

``` text
Implementado:
- ...

Archivos:
- ...

Pruebas:
- ...

Pendiente/Riesgo:
- ...
```

No generar ensayos extensos después de cada cambio.

------------------------------------------------------------------------

## 20. Prohibiciones

Los agentes no deberán:

-   crear servicios pagos;
-   desplegar producción sin autorización;
-   borrar bases;
-   eliminar auditoría;
-   modificar secretos;
-   saltarse auth;
-   desactivar tests para lograr verde;
-   cambiar reglas financieras sin documentación;
-   inventar contratos de Mora Mora;
-   introducir microservicios sin ADR;
-   añadir dependencias innecesarias.

------------------------------------------------------------------------

## 21. Base de datos

Migraciones requieren atención especial.

Antes:

-   leer `03_DATABASE.md`;
-   verificar modelo actual;
-   revisar migraciones previas.

Después:

-   probar migración;
-   probar constraints;
-   revisar impacto;
-   indicar si es destructiva.

Dos agentes no crearán migraciones concurrentes sobre las mismas
entidades sin coordinación.

------------------------------------------------------------------------

## 22. Mora Mora

Toda tarea de sincronización debe leer:

``` text
02_ARCHITECTURE.md
03_DATABASE.md
04_API_AND_INTEGRATIONS.md
05_SECURITY.md
```

No asumir campos reales de la API externa.

Si falta el contrato real, implementar interfaz/adaptador o mock
claramente identificado, no inventar integración productiva.

------------------------------------------------------------------------

## 23. Seguridad

Cambios de autenticación, permisos o secretos requieren:

-   alcance explícito;
-   pruebas negativas;
-   revisión;
-   esfuerzo de razonamiento adecuado.

No aceptar un endpoint solo porque funciona con un usuario autorizado;
probar también acceso no autorizado.

------------------------------------------------------------------------

## 24. Finanzas

Para operaciones monetarias:

-   tipos decimales;
-   transacciones;
-   constraints;
-   auditoría;
-   pruebas de borde;
-   reversión/anulación;
-   permisos.

Los agentes no deben simplificar lógica financiera para ahorrar código.

------------------------------------------------------------------------

## 25. Tests

Cada tarea deberá añadir o actualizar pruebas cuando cambie
comportamiento.

Pirámide inicial:

``` text
muchas unitarias
+
integración en reglas importantes
+
pocos E2E críticos
```

Prioridad E2E:

-   login;
-   crear viaje;
-   conciliación/cierre;
-   anticipo/liquidación;
-   pago/cartera;
-   Mora Mora;
-   permisos.

------------------------------------------------------------------------

## 26. Definition of Done del agente

Una tarea no está terminada hasta:

-   compilar/build;
-   lint;
-   typecheck;
-   tests relevantes;
-   criterios cumplidos;
-   diff revisable;
-   documentación actualizada si cambió contrato;
-   sin secretos;
-   sin TODO crítico oculto.

------------------------------------------------------------------------

## 27. Manejo de ambigüedad

Si una regla no está definida:

1.  buscar documentación;
2.  revisar `DECISIONS.md`;
3.  no inventar silenciosamente;
4.  registrar la duda;
5.  proponer la opción más simple/reversible.

Las dudas no críticas pueden resolverse mediante una decisión
provisional documentada.

------------------------------------------------------------------------

## 28. ADR

Cambios arquitectónicos deberán generar/actualizar un ADR.

Ejemplos:

-   proveedor DB;
-   framework;
-   auth;
-   almacenamiento;
-   patrón de eventos;
-   integración;
-   multi-tenancy.

No crear ADR para decisiones triviales.

------------------------------------------------------------------------

## 29. Deuda técnica

Si se acepta una solución provisional:

``` text
TODO técnico
motivo
riesgo
condición para corregir
```

Debe registrarse en backlog.

No ocultar deuda bajo comentarios vagos.

------------------------------------------------------------------------

## 30. Debugging

Flujo recomendado:

``` text
reproducir
↓
aislar
↓
formular hipótesis
↓
instrumentar
↓
corregir causa
↓
añadir prueba regresión
```

Evitar modificaciones aleatorias de múltiples archivos.

------------------------------------------------------------------------

## 31. Reversibilidad

Preferir cambios reversibles.

Antes de una operación destructiva:

-   backup;
-   plan;
-   migración;
-   rollback;
-   aprobación.

------------------------------------------------------------------------

## 32. Frontend

Claude/Codex deberán respetar:

-   componentes reutilizables;
-   estados loading/error/empty;
-   validación UX;
-   accesibilidad básica;
-   responsive;
-   permisos de UI coherentes con backend.

La UI nunca reemplaza autorización server-side.

------------------------------------------------------------------------

## 33. Diseño corporativo

KLEBER deberá verse como software empresarial:

-   limpio;
-   consistente;
-   sobrio;
-   legible;
-   rápido;
-   sin animaciones innecesarias;
-   dashboards orientados a decisión.

El logo/identidad visual se trabajará como tarea independiente.

------------------------------------------------------------------------

## 34. Documentación viva

Cuando cambie una regla:

``` text
código + pruebas + documentación
```

deberán quedar sincronizados.

No mantener documentación histórica falsa.

------------------------------------------------------------------------

## 35. Sesión de trabajo recomendada

Para una sesión corta:

``` text
1. escoger tarea
2. definir contrato
3. asignar agente
4. implementar
5. ejecutar tests
6. revisar diff
7. merge
8. actualizar backlog
```

------------------------------------------------------------------------

## 36. Paralelización recomendada

Ejemplo:

``` text
Codex
└─ API de viajes

Claude
└─ UI de viajes

Contrato compartido
└─ OpenAPI/schema ya aprobado
```

Otro:

``` text
Codex
└─ cálculo financiero

Claude
└─ dashboard financiero

Datos/DTOs
└─ definidos antes
```

------------------------------------------------------------------------

## 37. Evitar sobreparalelización

No abrir diez tareas simultáneas para un proyecto pequeño.

Mantener pocas ramas activas reduce:

-   conflictos;
-   contexto;
-   retrabajo;
-   integraciones rotas.

------------------------------------------------------------------------

## 38. Backlog

Cada tarea tendrá:

``` text
ID
Título
Prioridad
Dependencias
Agente sugerido
Esfuerzo IA
Archivos probables
Criterios
Estado
```

Esto permitirá seleccionar trabajo sin reconstruir contexto.

------------------------------------------------------------------------

## 39. Estados de tarea

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

## 40. Priorización

Orden:

``` text
P0 seguridad/integridad/bloqueante
P1 MVP crítico
P2 MVP conveniente
P3 post-MVP
P4 futuro
```

------------------------------------------------------------------------

## 41. Primera etapa de implementación

Después de Fase 0:

1.  inicializar repositorio;
2.  stack;
3.  CI;
4.  auth;
5.  organization;
6.  primer vertical slice;
7.  viajes;
8.  tarifas;
9.  caja operacional;
10. cartera;
11. Mora Mora;
12. mantenimiento/reportes.

El backlog definitivo controlará el orden exacto.

------------------------------------------------------------------------

## 42. Revisión preproducción

Para componentes críticos se recomienda una revisión independiente de
IA/humano sobre:

-   auth;
-   tenant isolation;
-   finanzas;
-   migraciones;
-   Mora Mora;
-   cierre/reapertura;
-   backups;
-   despliegue.

------------------------------------------------------------------------

## 43. Métricas del proceso

Medir cuando sea útil:

-   tareas completadas;
-   bugs regresivos;
-   PR reabiertos;
-   costo de IA;
-   tokens aproximados;
-   tiempo por tarea;
-   fallos en CI.

No convertir métricas en burocracia durante MVP.

------------------------------------------------------------------------

## 44. Regla final para los agentes

> Si una tarea requiere cambiar arquitectura, seguridad, datos
> financieros o un contrato compartido, el agente debe detener la
> improvisación y convertir el cambio en una decisión explícita.

KLEBER utilizará IA para aumentar velocidad de desarrollo, no para
perder control sobre el software.
