# KLB-003 --- Deployment Options and Environment Strategy

**Proyecto:** KLEBER ERP\
**Fecha:** 2026-09-07\
**Estado:** DISEÑO --- SIN SELECCIÓN DE PROVEEDOR\
**Dependencias:** KLB-001, KLB-002\
**Objetivo:** Definir cómo se separarán, desplegarán y promoverán los
ambientes de KLEBER sin decidir todavía AWS, Supabase, Neon, Vercel u
otro proveedor.

------------------------------------------------------------------------

## 1. Decisión de diseño

KLEBER tendrá tres ambientes lógicos principales:

``` text
LOCAL
STAGING
PRODUCTION
```

Podrán existir deployments temporales de `PREVIEW` para pull requests
cuando el proveedor seleccionado lo permita a bajo costo.

No se necesita inicialmente una infraestructura corporativa con cinco o
más ambientes permanentes.

------------------------------------------------------------------------

## 2. Flujo general

``` text
Desarrollo local
      ↓
Pull Request
      ↓
CI
      ↓
Preview opcional
      ↓
Merge
      ↓
STAGING
      ↓
Validación
      ↓
Aprobación
      ↓
PRODUCTION
```

Producción nunca será el ambiente de pruebas.

------------------------------------------------------------------------

## 3. LOCAL

LOCAL es el ambiente principal de desarrollo.

Debe permitir trabajar sin depender constantemente de infraestructura
cloud.

Componentes deseados:

``` text
Next.js local
NestJS local
PostgreSQL local o DB de desarrollo aislada
Storage emulado/local cuando sea posible
Mocks de servicios externos
```

Objetivos:

-   desarrollo rápido;
-   costo cero;
-   pruebas;
-   migraciones;
-   debugging;
-   trabajo de Codex/Claude;
-   operación sin afectar datos reales.

------------------------------------------------------------------------

## 4. Datos locales

Nunca copiar automáticamente una base productiva completa al computador
de desarrollo.

Utilizar:

-   seeds;
-   fixtures;
-   factories;
-   datos sintéticos.

Si excepcionalmente se requiere información productiva para reproducir
un problema, deberá anonimizarse/minimizarse y manejarse mediante un
procedimiento autorizado.

------------------------------------------------------------------------

## 5. PREVIEW

PREVIEW es opcional y efímero.

Puede crearse automáticamente para una Pull Request:

``` text
PR
 ↓
build
 ↓
preview URL
 ↓
review
 ↓
PR cerrado
 ↓
preview eliminado
```

No necesita existir para todos los cambios backend si aumenta costos sin
aportar valor.

------------------------------------------------------------------------

## 6. STAGING

STAGING será el ambiente de preproducción.

Objetivos:

-   pruebas integradas;
-   validación de migraciones;
-   Mora Mora sandbox;
-   UAT;
-   validación de releases;
-   pruebas de deployment;
-   generación de PDFs;
-   pruebas de permisos.

Debe parecerse a producción en configuración lógica, aunque tenga menos
capacidad.

------------------------------------------------------------------------

## 7. Datos de staging

Preferencia:

``` text
datos sintéticos
+
casos representativos
```

No utilizar producción como dataset habitual.

Staging tendrá:

-   credenciales propias;
-   base propia;
-   storage propio;
-   secretos propios;
-   endpoints externos de prueba cuando existan.

------------------------------------------------------------------------

## 8. PRODUCTION

PRODUCTION manejará:

-   usuarios reales;
-   viajes reales;
-   cartera;
-   costos;
-   documentos;
-   integraciones reales.

Controles:

-   acceso mínimo;
-   backups;
-   auditoría;
-   HTTPS;
-   secretos aislados;
-   monitoreo;
-   rollback;
-   aprobación previa al despliegue.

------------------------------------------------------------------------

## 9. Separación de bases

Regla:

``` text
LOCAL DB      ≠
STAGING DB    ≠
PRODUCTION DB
```

Nunca configurar una aplicación local para apuntar accidentalmente a
producción.

------------------------------------------------------------------------

## 10. Variables de entorno

Cada ambiente tendrá configuración independiente.

Ejemplo conceptual:

``` text
DATABASE_URL
AUTH_*
STORAGE_*
MORA_MORA_*
APP_ENV
LOG_LEVEL
```

El repositorio contendrá únicamente:

``` text
.env.example
```

sin credenciales reales.

------------------------------------------------------------------------

## 11. Git

Modelo inicial:

``` text
main
feature/*
codex/*
claude/*
fix/*
```

`main` representa código integrable/releasable.

No crear inicialmente una estrategia GitFlow compleja salvo necesidad
demostrada.

------------------------------------------------------------------------

## 12. Protección de main

Configurar cuando el repositorio esté operativo:

-   Pull Request;
-   CI obligatorio;
-   review para cambios críticos;
-   impedir force push;
-   impedir borrado accidental.

------------------------------------------------------------------------

## 13. CI

Toda Pull Request relevante ejecutará:

``` text
install
formatter/check
lint
typecheck
unit tests
integration tests relevantes
build
```

Las migraciones deberán validarse antes de producción.

------------------------------------------------------------------------

## 14. CD

Despliegue recomendado:

``` text
main
 ↓
STAGING automático o semiautomático
 ↓
validación
 ↓
aprobación manual
 ↓
PRODUCTION
```

La promoción a producción no será autónoma durante el MVP.

------------------------------------------------------------------------

## 15. Artefacto probado

Siempre que la plataforma lo permita, producción debe recibir el mismo
código/artefacto que fue validado previamente.

Evitar recompilar de forma diferente introduciendo cambios entre staging
y producción.

------------------------------------------------------------------------

## 16. Migraciones

Orden de producción:

``` text
backup/restore point cuando corresponda
↓
validaciones
↓
migración compatible
↓
aplicación
↓
health checks
↓
smoke tests
```

Las migraciones destructivas requieren estrategia específica.

------------------------------------------------------------------------

## 17. Backward compatibility

Cuando una migración pueda afectar una versión desplegada:

preferir patrón:

``` text
expand
↓
deploy
↓
migrate data
↓
contract
```

en lugar de eliminar inmediatamente columnas/contratos usados.

------------------------------------------------------------------------

## 18. Rollback

Cada release importante deberá responder:

-   ¿cómo revertimos aplicación?;
-   ¿cómo tratamos la DB?;
-   ¿la migración es reversible?;
-   ¿hay backup?;
-   ¿qué ocurre con operaciones realizadas después del deploy?

No asumir que `git revert` revierte automáticamente datos.

------------------------------------------------------------------------

## 19. Feature flags

Usar solo cuando reduzcan riesgo real.

Ejemplo:

``` text
MORA_MORA_SYNC_ENABLED=false
```

en staging inicial.

Todo flag deberá tener plan de eliminación.

------------------------------------------------------------------------

## 20. Mora Mora por ambiente

``` text
LOCAL
→ mock/fixture

STAGING
→ sandbox/test endpoint

PRODUCTION
→ endpoint productivo
```

Si Mora Mora no dispone de sandbox, construir un simulador/adapter de
prueba controlado.

------------------------------------------------------------------------

## 21. Storage por ambiente

Cada ambiente remoto tendrá namespace/bucket independiente.

Nunca mezclar documentos de prueba con documentos productivos.

------------------------------------------------------------------------

## 22. Auth por ambiente

Credenciales y configuración separadas.

Los usuarios de staging no deben ser automáticamente usuarios
productivos.

------------------------------------------------------------------------

## 23. Logs

### LOCAL

Logs detallados para debugging.

### STAGING

Logs suficientes para integración y UAT.

### PRODUCTION

Logs estructurados y controlados, sin secretos ni información sensible
innecesaria.

------------------------------------------------------------------------

## 24. Health checks

Backend deberá exponer checks apropiados para determinar:

-   proceso activo;
-   conectividad DB;
-   dependencias críticas cuando corresponda.

No exponer información sensible en `/health`.

------------------------------------------------------------------------

## 25. Preview frontend

Si se utiliza Vercel u otro proveedor con preview deployments, cada PR
de frontend podrá disponer de una URL temporal.

Esto facilita revisión de Claude/humano sin tocar producción.

------------------------------------------------------------------------

## 26. Preview backend

No es obligatorio crear un backend completo por cada PR.

Se evaluará según:

-   costo;
-   necesidad;
-   aislamiento DB;
-   velocidad.

Para cambios simples, CI + staging puede ser suficiente.

------------------------------------------------------------------------

## 27. AWS

Si AWS resulta seleccionado posteriormente, la separación lógica de
ambientes se mantiene.

No es obligatorio comenzar con múltiples cuentas AWS para un equipo tan
pequeño, aunque producción deberá quedar claramente aislada y con
permisos más restrictivos.

Una separación multi-account podrá adoptarse cuando el riesgo/equipo lo
justifique.

------------------------------------------------------------------------

## 28. Supabase

Si Supabase resulta seleccionado:

-   desarrollo puede utilizar CLI/local;
-   staging y production deben permanecer separados;
-   branching/preview podrá evaluarse según plan/costo;
-   las migraciones serán versionadas en Git.

------------------------------------------------------------------------

## 29. Neon

Si Neon resulta seleccionado:

-   aprovechar branching/DB aislada cuando sea económicamente
    conveniente;
-   production permanecerá protegida;
-   verificar estrategia de restore y retención antes de go-live.

------------------------------------------------------------------------

## 30. Vercel

Si Vercel resulta seleccionado para frontend:

``` text
Local       → Development
PR          → Preview
main/release→ Production
```

Si se requiere staging persistente, deberá configurarse explícitamente
según plan y estrategia seleccionada.

------------------------------------------------------------------------

## 31. Costos de ambientes

Principio:

> No pagar 24/7 por ambientes no productivos que pueden apagarse o
> escalar a cero.

Priorizar:

-   local;
-   preview efímero;
-   staging pequeño;
-   serverless;
-   scale-to-zero;
-   eliminación automática de recursos temporales.

------------------------------------------------------------------------

## 32. Producción mínima

No confundir producción pequeña con producción insegura.

Aunque KLEBER tenga cinco usuarios, producción requiere:

-   backups;
-   auth;
-   HTTPS;
-   permisos;
-   auditoría;
-   monitoreo mínimo;
-   recuperación.

------------------------------------------------------------------------

## 33. Acceso de agentes IA

Codex y Claude podrán:

-   preparar cambios;
-   ejecutar local;
-   preparar CI;
-   generar configuración;
-   analizar staging.

No podrán autónomamente:

-   desplegar producción;
-   eliminar DB;
-   cambiar billing;
-   modificar secretos productivos;
-   ejecutar migraciones destructivas productivas.

------------------------------------------------------------------------

## 34. Release checklist

Antes de producción:

``` text
[ ] CI verde
[ ] diff revisado
[ ] migraciones revisadas
[ ] staging aprobado
[ ] pruebas críticas aprobadas
[ ] backup confirmado
[ ] rollback definido
[ ] secretos correctos
[ ] configuración correcta
[ ] observabilidad activa
[ ] aprobación humana
```

------------------------------------------------------------------------

## 35. Hotfix

Flujo:

``` text
incidente
↓
rama fix
↓
prueba
↓
review
↓
staging cuando sea viable
↓
aprobación
↓
production
↓
regression test
```

La urgencia no elimina auditoría ni pruebas mínimas.

------------------------------------------------------------------------

## 36. Recuperación

Los procedimientos de deployment deberán documentar:

-   redeploy;
-   rollback;
-   restauración DB;
-   restauración documentos;
-   rotación de secreto comprometido;
-   desactivación temporal de integración.

------------------------------------------------------------------------

## 37. Dominio

La estructura exacta se definirá después.

Conceptualmente:

``` text
app.<dominio>        → frontend
api.<dominio>        → backend
staging.<dominio>    → staging
```

No comprar/configurar dominios dentro de esta tarea.

------------------------------------------------------------------------

## 38. DNS y HTTPS

Producción deberá utilizar HTTPS.

Los certificados deben renovarse automáticamente cuando la plataforma lo
permita.

------------------------------------------------------------------------

## 39. Observabilidad

Inicialmente:

-   health;
-   logs;
-   errores;
-   disponibilidad;
-   consumo;
-   alertas críticas.

No contratar APM empresarial mientras no exista necesidad.

------------------------------------------------------------------------

## 40. Estrategia recomendada sin proveedor

La estrategia lógica queda:

``` text
DEVELOPER
   │
   ▼
LOCAL
   │
   ├── tests
   │
   ▼
PULL REQUEST
   │
   ├── CI
   ├── preview opcional
   │
   ▼
MAIN
   │
   ▼
STAGING
   │
   ├── migrations
   ├── integration
   ├── UAT
   │
   ▼
MANUAL APPROVAL
   │
   ▼
PRODUCTION
```

------------------------------------------------------------------------

## 41. Decisiones que permanecen abiertas

Este documento no decide:

-   AWS vs Supabase vs Neon;
-   Vercel vs otro frontend hosting;
-   hosting NestJS;
-   Auth provider;
-   Storage provider;
-   región;
-   dominio;
-   proveedor de observabilidad.

------------------------------------------------------------------------

## 42. Resultado

``` text
KLB-003 = STRATEGY DOCUMENTED
PROVIDER = UNDECIDED
INFRASTRUCTURE CREATED = NO
COST INCURRED = NO
```

------------------------------------------------------------------------

## 43. Próximo paso

Con la estrategia de ambientes definida, la siguiente actividad
documental puede ser:

**KLB-004 --- Initial Asset and Master Data Intake Specification**

Su objetivo será definir exactamente qué información se deberá recopilar
de vehículos, maquinaria, propietarios, créditos y estado inicial antes
de cargar datos reales, manteniendo pendientes las cantidades que
todavía no han sido confirmadas.

------------------------------------------------------------------------

## Criterio final

> KLEBER debe poder experimentar rápido en local y staging, pero
> producción debe ser deliberada, aislada y recuperable.

La infraestructura concreta puede cambiar; la disciplina de promoción
entre ambientes debe permanecer.
