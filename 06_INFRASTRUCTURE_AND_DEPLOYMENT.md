# 06_INFRASTRUCTURE_AND_DEPLOYMENT.md --- Infraestructura y despliegue

**Proyecto:** KLEBER ERP\
**Estado:** Diseño base / Fase 0\
**Objetivo:** Definir una infraestructura empresarial, reproducible y
económica para desarrollar, probar y desplegar KLEBER sin
sobredimensionar el MVP.

------------------------------------------------------------------------

## 1. Principio rector

La infraestructura inicial deberá priorizar:

``` text
SEGURIDAD
+ BAJO COSTO
+ SIMPLICIDAD
+ BACKUPS
+ OBSERVABILIDAD
+ PORTABILIDAD
+ ESCALABILIDAD GRADUAL
```

No se contratará infraestructura compleja por anticipar un volumen que
todavía no existe.

------------------------------------------------------------------------

## 2. Características esperadas del MVP

El volumen inicial será bajo:

-   una empresa operativa: KLEBER;
-   pocos usuarios simultáneos;
-   flota pequeña;
-   pocos viajes diarios;
-   almacenamiento documental moderado;
-   generación ocasional de PDF;
-   integración con Mora Mora;
-   crecimiento progresivo.

Por tanto, el MVP debe poder operar inicialmente en planes gratuitos o
de costo muy bajo.

------------------------------------------------------------------------

## 3. Ambientes obligatorios

``` text
LOCAL
STAGING
PRODUCTION
```

### LOCAL

Desarrollo de Codex/Claude y pruebas del desarrollador.

### STAGING

Pruebas integradas antes de producción.

Debe utilizar:

-   base separada;
-   secretos separados;
-   almacenamiento separado;
-   integración Mora Mora de pruebas;
-   datos sintéticos/anonimizados.

### PRODUCTION

Datos reales y operación de KLEBER.

Nunca compartir base, secretos o almacenamiento con staging.

------------------------------------------------------------------------

## 4. Arquitectura lógica inicial

``` text
                    ┌─────────────────┐
                    │     Usuario     │
                    └────────┬────────┘
                             │ HTTPS
                             ▼
                    ┌─────────────────┐
                    │    Frontend     │
                    │      Web        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Backend/API   │
                    └───┬─────────┬───┘
                        │         │
              ┌─────────┘         └─────────┐
              ▼                             ▼
     ┌─────────────────┐           ┌─────────────────┐
     │   PostgreSQL    │           │ Object Storage  │
     └─────────────────┘           └─────────────────┘
              ▲
              │
     ┌────────┴────────┐
     │ Integraciones   │
     │ Mora Mora       │
     └─────────────────┘
```

Autenticación, auditoría y observabilidad atraviesan todas las capas.

------------------------------------------------------------------------

## 5. Estrategia de proveedor

No se fijará proveedor únicamente por familiaridad.

Se evaluará el conjunto completo:

-   PostgreSQL;
-   autenticación;
-   almacenamiento;
-   backend;
-   frontend;
-   backups;
-   logs;
-   CI/CD;
-   límites gratuitos;
-   costos al crecer;
-   facilidad de migración.

### Candidatos

Podrán evaluarse:

-   Supabase;
-   Vercel;
-   Netlify;
-   servicios PostgreSQL administrados;
-   AWS;
-   otras alternativas técnicamente equivalentes.

### Preferencia arquitectónica

Para el dominio de KLEBER se priorizará **PostgreSQL** sobre una base
NoSQL cuando no exista una razón técnica fuerte en sentido contrario.

Firebase no queda prohibido, pero deberá justificar claramente su
ventaja antes de seleccionarse.

------------------------------------------------------------------------

## 6. Decisión de stack cloud

La selección definitiva deberá quedar registrada en `DECISIONS.md`
mediante ADR antes de crear producción.

La evaluación incluirá:

``` text
Costo mensual inicial
Costo estimado al crecer
Límites gratuitos
Backups
Auth
PostgreSQL
Storage
Egress
Logs
Región
Disponibilidad
Vendor lock-in
Migración
Experiencia operativa
```

------------------------------------------------------------------------

## 7. Recomendación inicial de evaluación

Para el MVP, la primera arquitectura a evaluar será:

``` text
Frontend      → Vercel o alternativa equivalente
Backend/API   → despliegue económico compatible con el stack
Database      → PostgreSQL administrado
Auth          → servicio administrado compatible
Storage       → object storage
Git           → GitHub privado
CI/CD         → GitHub Actions + proveedor de hosting
```

Si Supabase satisface base de datos, autenticación, storage y backups
con costos adecuados, podrá consolidar varias piezas y reducir
complejidad.

Esto es una hipótesis de evaluación, no una autorización automática para
contratar servicios.

------------------------------------------------------------------------

## 8. Repositorio

Un repositorio Git privado será la fuente de verdad del código.

Estructura de ramas:

``` text
main
develop/staging     (solo si realmente aporta valor)
codex/<task>
claude/<task>
fix/<task>
```

Para un equipo pequeño puede eliminarse `develop` si el flujo con
preview/staging es suficiente.

No añadir ramas permanentes innecesarias.

------------------------------------------------------------------------

## 9. Protección de main

`main` deberá:

-   representar código desplegable;
-   requerir pruebas exitosas;
-   evitar commits directos cuando el flujo esté estabilizado;
-   recibir cambios pequeños;
-   permitir rollback.

Codex y Claude no trabajarán simultáneamente sobre `main`.

------------------------------------------------------------------------

## 10. CI/CD

Pipeline mínimo:

``` text
checkout
↓
install
↓
lint
↓
typecheck
↓
unit tests
↓
integration tests relevantes
↓
build
↓
security/dependency checks básicos
↓
deploy
```

No ejecutar procesos costosos en cada commit si no aportan valor.

Separar pruebas rápidas de suites más pesadas cuando crezcan.

------------------------------------------------------------------------

## 11. Preview deployments

Cuando el proveedor lo permita sin costo significativo:

-   cada PR podrá generar preview;
-   preview nunca utilizará producción;
-   las variables serán de staging/prueba;
-   previews deberán poder eliminarse automáticamente.

------------------------------------------------------------------------

## 12. Variables de entorno

Ejemplo conceptual:

``` text
DATABASE_URL
AUTH_SECRET
STORAGE_*
MORA_MORA_API_URL
MORA_MORA_CLIENT_ID
MORA_MORA_CLIENT_SECRET
APP_ENV
LOG_LEVEL
```

No se documentarán valores reales.

Se mantendrá:

``` text
.env.example
```

solo con nombres y ejemplos ficticios.

------------------------------------------------------------------------

## 13. Base de datos

Producción utilizará PostgreSQL administrado salvo ADR que determine
otra opción.

Requisitos:

-   TLS;
-   backups;
-   migraciones;
-   constraints;
-   índices;
-   usuario de aplicación con privilegios mínimos;
-   separación staging/production;
-   monitoreo básico.

------------------------------------------------------------------------

## 14. Migraciones

Las modificaciones de esquema deberán realizarse mediante migraciones
versionadas.

Nunca:

-   editar producción manualmente como procedimiento normal;
-   depender de cambios no versionados;
-   borrar columnas críticas sin estrategia de migración.

Flujo:

``` text
migration
↓
local
↓
tests
↓
staging
↓
backup/check
↓
production
```

------------------------------------------------------------------------

## 15. Datos semilla

Se permitirán seeds para:

-   roles;
-   permisos;
-   catálogos;
-   organización inicial;
-   datos sintéticos.

No incluir credenciales reales.

Los seeds productivos deberán ser idempotentes cuando sea posible.

------------------------------------------------------------------------

## 16. Storage

Usar object storage para:

-   soportes;
-   documentos;
-   PDFs persistidos;
-   futuras evidencias;
-   archivos asociados.

No usar el filesystem efímero del servidor como almacenamiento
permanente.

------------------------------------------------------------------------

## 17. Estrategia de PDFs

El Resumen Ejecutivo PDF podrá:

1.  generarse bajo demanda; o
2.  persistirse únicamente cuando exista necesidad de conservar una
    versión formal.

Esto evita consumo innecesario de almacenamiento.

------------------------------------------------------------------------

## 18. Backups

Antes de producción deberán existir:

-   backups automáticos;
-   retención definida;
-   procedimiento de restauración;
-   prueba de restore.

Para el MVP, el proveedor administrado puede realizar el backup
primario.

Cuando el riesgo/volumen crezca, evaluar copia externa adicional.

------------------------------------------------------------------------

## 19. RPO/RTO inicial

Valores definitivos se aprobarán antes de producción.

Objetivo inicial razonable para MVP:

``` text
RPO: ≤ 24 horas
RTO: ≤ 8 horas
```

Si la operación demuestra que perder un día de datos es inaceptable,
aumentar frecuencia de backup y ajustar el objetivo.

------------------------------------------------------------------------

## 20. Observabilidad

Mínimo:

-   errores backend;
-   errores de frontend relevantes;
-   health checks;
-   fallos de integración;
-   sincronizaciones pendientes;
-   despliegues;
-   uso de recursos;
-   auditoría de negocio.

No contratar plataformas avanzadas de observabilidad mientras logs y
métricas nativas sean suficientes.

------------------------------------------------------------------------

## 21. Retención de logs

La retención deberá limitarse.

Ejemplo:

``` text
Debug      → solo local/staging
Info       → retención corta
Warnings   → retención media
Errors     → suficiente para diagnóstico
Audit      → política independiente
```

No usar logging ilimitado.

------------------------------------------------------------------------

## 22. Alertas

Alertas iniciales:

-   producción caída;
-   errores repetitivos;
-   base de datos inaccesible;
-   integración Mora Mora fallando;
-   backup fallido;
-   storage cercano al límite;
-   consumo anormal;
-   despliegue fallido.

Evitar alertas excesivas que generen ruido.

------------------------------------------------------------------------

## 23. Integración Mora Mora

Configurar endpoints independientes:

``` text
MORA_MORA_STAGING
MORA_MORA_PRODUCTION
```

Nunca permitir que KLEBER staging cierre o modifique viajes de Mora Mora
producción.

------------------------------------------------------------------------

## 24. Sincronización resiliente

Si Mora Mora está fuera de línea:

-   KLEBER continúa funcionando en lo posible;
-   se registra el fallo;
-   queda operación pendiente;
-   se reintenta;
-   se alerta si supera umbral.

No bloquear toda la plataforma por una dependencia externa temporalmente
caída.

------------------------------------------------------------------------

## 25. Dominio y HTTPS

Producción utilizará:

-   dominio/subdominio corporativo;
-   HTTPS obligatorio;
-   renovación automática de certificado;
-   redirección HTTP → HTTPS.

Ejemplo conceptual:

``` text
app.<dominio-kleber>
api.<dominio-kleber>
```

La decisión real se tomará al disponer del dominio.

------------------------------------------------------------------------

## 26. Región

Preferir región razonablemente cercana a Colombia y compatible con los
servicios seleccionados.

No distribuir infraestructura en varias regiones durante el MVP.

------------------------------------------------------------------------

## 27. Escalamiento

Orden preferido:

``` text
1. optimizar consultas
2. añadir índices
3. corregir N+1
4. optimizar assets
5. cachear donde tenga sentido
6. subir plan/recursos
7. separar procesos pesados
8. evaluar servicios independientes
```

No saltar directamente a microservicios.

------------------------------------------------------------------------

## 28. Costos

Crear presupuestos y alertas del proveedor desde el inicio.

Vigilar especialmente:

-   base de datos;
-   almacenamiento;
-   egress;
-   logs;
-   funciones/serverless;
-   builds;
-   backups;
-   APIs externas;
-   IA futura.

No habilitar escalamiento ilimitado sin alertas.

------------------------------------------------------------------------

## 29. Presupuesto inicial objetivo

Durante desarrollo/MVP:

``` text
Objetivo ideal: USD 0–10/mes
```

Si una decisión requiere superar este rango, debe documentarse el
motivo.

En producción se aceptará un costo superior cuando seguridad, backups o
estabilidad lo justifiquen.

El costo más bajo no prevalece sobre integridad de datos.

------------------------------------------------------------------------

## 30. FinOps básico

Registrar mensualmente:

``` text
servicio
plan
costo
consumo
límite
responsable
fecha de renovación
alerta configurada
```

No depender de recordar manualmente suscripciones.

------------------------------------------------------------------------

## 31. Egress

Evitar:

-   descargas repetidas;
-   mover archivos innecesariamente entre proveedores;
-   consultas que retornan datos masivos;
-   polling agresivo con Mora Mora.

Preferir:

-   sincronización incremental;
-   filtros;
-   paginación;
-   webhooks cuando sean adecuados.

------------------------------------------------------------------------

## 32. Serverless

Serverless es aceptable si:

-   reduce costo;
-   simplifica operación;
-   tiempos de ejecución son suficientes;
-   no dificulta integraciones;
-   no genera costos impredecibles.

No dividir cada función del ERP en una función serverless independiente
sin necesidad.

------------------------------------------------------------------------

## 33. Tareas programadas

Cron/jobs futuros:

-   sincronización de respaldo;
-   alertas;
-   vencimientos;
-   mantenimiento;
-   reportes;
-   limpieza controlada.

Usar el mecanismo más sencillo disponible en el proveedor.

------------------------------------------------------------------------

## 34. Rollback

Cada despliegue productivo deberá poder revertirse.

Código:

``` text
release anterior
↓
rollback
```

Base de datos:

Las migraciones destructivas requieren estrategia especial; no asumir
que revertir código revierte automáticamente el esquema.

------------------------------------------------------------------------

## 35. Feature flags

No introducir una plataforma de feature flags paga en MVP.

Si se requieren:

-   configuración simple;
-   flags en base/config;
-   control por ambiente.

------------------------------------------------------------------------

## 36. Contenedores

Docker podrá utilizarse para reproducibilidad local/backend si aporta
valor.

No es obligatorio contenerizar todo si el proveedor y stack ya ofrecen
un flujo reproducible.

No usar Kubernetes en MVP.

------------------------------------------------------------------------

## 37. Infraestructura como código

En Fase 0/MVP se documentará toda configuración.

Adoptar Terraform/OpenTofu u otra IaC cuando:

-   haya múltiples recursos;
-   recrear ambiente sea difícil;
-   existan varios entornos complejos;
-   el beneficio supere el mantenimiento.

No introducir IaC únicamente por apariencia empresarial.

------------------------------------------------------------------------

## 38. Accesos cloud

Cuentas individuales cuando sea posible.

Evitar compartir:

-   contraseñas;
-   usuario root;
-   tokens personales.

Activar MFA para cuentas administrativas del proveedor.

------------------------------------------------------------------------

## 39. GitHub Actions

Secrets del pipeline deberán estar en el almacén de secretos de
GitHub/proveedor.

Los workflows deberán:

-   tener permisos mínimos;
-   fijar versiones confiables de actions;
-   evitar imprimir variables sensibles.

------------------------------------------------------------------------

## 40. Agentes IA y despliegue

Codex/Claude:

-   no podrán desplegar producción automáticamente durante construcción
    inicial;
-   no podrán crear recursos pagos sin autorización;
-   no podrán modificar billing;
-   no podrán borrar bases;
-   no podrán rotar secretos sin tarea explícita;
-   deberán indicar migraciones generadas;
-   deberán ejecutar pruebas antes de proponer merge.

Las tareas de infraestructura se asignarán de forma pequeña y
verificable.

------------------------------------------------------------------------

## 41. Estrategia de trabajo paralelo

Ejemplo:

``` text
Codex:
  backend / database / API / tests

Claude:
  frontend / UX / workflows / reports
```

La división podrá cambiar según la tarea.

Regla superior:

> Ninguno modifica archivos asignados activamente al otro sin
> coordinación.

Git será el mecanismo de integración.

------------------------------------------------------------------------

## 42. Checklist de creación inicial

Orden:

``` text
1. Crear repositorio privado
2. Crear estructura de carpetas
3. Añadir documentación
4. Definir stack mediante ADR
5. Inicializar aplicaciones
6. Configurar lint/typecheck/tests
7. Crear PostgreSQL de desarrollo
8. Configurar auth
9. Crear storage
10. Configurar variables
11. Crear staging
12. Configurar CI
13. Implementar primer módulo vertical
14. Probar despliegue
15. Configurar backups/alertas
16. Preparar producción
```

------------------------------------------------------------------------

## 43. Primer vertical slice recomendado

No construir todos los módulos horizontalmente primero.

Crear un flujo pequeño completo:

``` text
Login
↓
Usuario autorizado
↓
Crear/consultar activo
↓
Crear viaje
↓
Persistir
↓
Consultar viaje
↓
Auditar
↓
Deploy staging
```

Esto valida temprano:

-   frontend;
-   backend;
-   auth;
-   DB;
-   permisos;
-   auditoría;
-   CI/CD;
-   infraestructura.

------------------------------------------------------------------------

## 44. Criterios para producción

No desplegar datos reales hasta confirmar:

-   seguridad base;
-   backups;
-   restore;
-   roles;
-   aislamiento;
-   HTTPS;
-   migraciones;
-   monitoreo;
-   auditoría;
-   pruebas;
-   staging;
-   rollback;
-   costos/alertas;
-   integración segura.

------------------------------------------------------------------------

## 45. Escenarios de crecimiento

### Etapa A --- KLEBER actual

Una organización, pocos activos y usuarios.

### Etapa B --- KLEBER ampliado

Más activos, maquinaria, empleados, documentos e integraciones.

### Etapa C --- varias empresas

Activar comercialmente capacidades multiempresa ya previstas.

### Etapa D --- SaaS

Solo si existe demanda real:

-   onboarding;
-   billing;
-   planes;
-   aislamiento reforzado;
-   métricas por tenant;
-   soporte;
-   SLA;
-   automatización de aprovisionamiento.

------------------------------------------------------------------------

## 46. Decisiones pendientes obligatorias

Antes de implementar infraestructura definitiva deberán resolverse
mediante ADR:

``` text
ADR-001 Stack frontend/backend
ADR-002 Proveedor PostgreSQL/Auth/Storage
ADR-003 Hosting frontend
ADR-004 Hosting backend
ADR-005 Estrategia de backups
ADR-006 Observabilidad
ADR-007 Dominio y ambientes
ADR-008 CI/CD
```

------------------------------------------------------------------------

## Criterio rector

> La infraestructura de KLEBER debe parecer pequeña en costo y
> operación, pero seria en seguridad, reproducibilidad y recuperación.

No construir hoy infraestructura para miles de empresas. Construir una
base que funcione correctamente para KLEBER y que pueda crecer sin tener
que rehacer el sistema.
