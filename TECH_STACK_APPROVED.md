# ✅ TECH STACK KLEBER ERP — APROBADO Y DOCUMENTADO

**Versión:** 1.0  
**Fecha:** 2026-09-07  
**Estado:** ✅ DECISIÓN FINALIZADA  
**Presupuesto:** $0/mes (totalmente gratis indefinido)

---

## 🎯 RESUMEN EJECUTIVO

Se ha definido un **stack tecnológico profesional, totalmente gratis y escalable** para KLEBER ERP:

### Stack elegido
```
FRONTEND:    Next.js 14 + React 18 + TypeScript + Tailwind CSS
BACKEND:     Node.js 20 LTS + Express.js + TypeScript + Prisma
DATABASE:    PostgreSQL (Supabase gratis)
HOSTING:     Vercel (Frontend) + Railway (Backend) + Supabase (DB)
CI/CD:       GitHub Actions (automático)
MONOREPO:    UN SOLO REPOSITORIO con pnpm workspaces
AMBIENTES:   Local, Staging (preview), Production (main)
```

### Costo total
- **Frontend:** $0 (Vercel gratuito)
- **Backend:** $0 (Railway $5/mes de crédito gratuito)
- **Database:** $0 (Supabase 500MB gratis)
- **CI/CD:** $0 (GitHub Actions gratis)
- **TOTAL:** **$0/mes indefinido**

### Por qué este stack
1. ✅ **Costo cero** (todas las herramientas tienen free tier generoso)
2. ✅ **Rápido de desarrollar** (Next.js es full-stack)
3. ✅ **TypeScript everywhere** (type-safety frontend + backend)
4. ✅ **Comunidad enorme** (fácil encontrar soluciones)
5. ✅ **Monorepo simple** (Codex + Claude sin fricción)
6. ✅ **Escalable** (crece sin reescritura)

---

## 📋 DECISIONES ESPECÍFICAS

### 1. BACKEND: Node.js + Express.js

**Elegido:** ✅ Node.js 20 LTS + Express.js

**¿Por qué?**
- ✅ Rápido de desarrollar (menor time-to-market)
- ✅ TypeScript soporte nativo
- ✅ Comunidad ENORME (millones de librerías)
- ✅ Excelente para APIs REST
- ✅ Vercel/Railway tienen soporte excelente
- ✅ Single language (JS/TS frontend + backend)

**Alternativas consideradas:**
- ❌ Python (overkill para MVP, añade complejidad)
- ❌ Go (mejor aprender después, ahora Node es más accesible)
- ❌ AWS Lambda (overkill y riesgos de costo)

---

### 2. FRONTEND: Next.js 14 + React 18

**Elegido:** ✅ Next.js 14 + React 18 + TypeScript

**¿Por qué?**
- ✅ Full-stack framework (frontend + backend en 1 repo)
- ✅ Deploy gratis en Vercel (permisos ya existen)
- ✅ Servidor automático (API Routes = backend dentro de Next)
- ✅ TypeScript integrado
- ✅ Dev experience SUPERIOR a React puro
- ✅ Documentación excelente

**Styling:** Tailwind CSS + Shadcn/ui
- Moderno, customizable, sin bundle gigante

**Alternativas consideradas:**
- ❌ React puro (necesitarías servidor separado)
- ❌ Vue (menos comunidad, menos librerías)
- ❌ Angular (overkill, curva aprendizaje larga)

---

### 3. DATABASE: PostgreSQL (Supabase gratis)

**Elegido:** ✅ Supabase (PostgreSQL administrado)

**¿Por qué?**
- ✅ PostgreSQL REAL (no NoSQL) = integridad relacional necesaria
- ✅ 500MB gratis (suficiente para MVP)
- ✅ Backups automáticos
- ✅ NO cobra por CPU (a diferencia de AWS RDS)
- ✅ Auth integrada (opcional)
- ✅ Storage 5GB gratis (para documentos/PDFs)
- ✅ Comunidad grande

**Alternativas consideradas:**
- ⚠️ Neon (también gratis, PostgreSQL, similar a Supabase)
- ❌ Firebase Firestore (NoSQL, problemas para finanzas)
- ❌ AWS RDS (Free tier solo 12 meses, riesgos de costo)
- ❌ MongoDB (NoSQL, no recomendado para datos financieros)

**Decisión:** Supabase es más completo (incluye auth, storage, etc.)

---

### 4. ORM: Prisma

**Elegido:** ✅ Prisma

**¿Por qué?**
- ✅ Type-safe (TypeScript)
- ✅ Migrations automáticas
- ✅ Excelente DX (developer experience)
- ✅ Soporta PostgreSQL, MySQL, SQLite
- ✅ Compatible con Node.js, Python, Go

**Alternativas consideradas:**
- ❌ TypeORM (más flexible pero más complejo)
- ❌ Sequelize (legacy, menos mantenido)
- ❌ SQL directo (no type-safe, error-prone)

---

### 5. AUTH: NextAuth.js

**Elegido:** ✅ NextAuth.js v5 + Supabase

**¿Por qué?**
- ✅ Gratis (open source)
- ✅ Integrado en Next.js
- ✅ Máximo control
- ✅ Soporta OAuth (Google, GitHub, etc.)
- ✅ JWT + Session storage
- ✅ RBAC (roles y permisos) fácil implementar

**Alternativas consideradas:**
- ⚠️ Supabase Auth (también gratis, simpler pero menos flexible)
- ❌ Auth0 (pago después de plan gratuito)
- ❌ AWS Cognito (complejo, costo oculto)

---

### 6. HOSTING: Vercel + Railway + Supabase

#### Frontend: Vercel
- ✅ Gratis (100GB bandwidth)
- ✅ Deploy automático
- ✅ Preview en cada PR
- ✅ Permisos ya existen en el equipo
- ✅ Edge computing gratis

#### Backend: Railway
- ✅ $5/mes crédito GRATIS (suficiente para MVP)
- ✅ Deploy automático en cada push
- ✅ Mejor UX que Render
- Alternativa: Render (también gratis pero más lento)

#### Database: Supabase
- ✅ 500MB gratis
- ✅ Backups automáticos
- ✅ Totalmente administrado

**¿Por qué NO AWS?**
- ❌ Free tier tiene límites estrictos
- ❌ Riesgos de surprise billing
- ❌ Demasiado complejo para MVP
- ✅ Mejor: Aprender después con casos reales

---

### 7. CI/CD: GitHub Actions

**Elegido:** ✅ GitHub Actions

**¿Por qué?**
- ✅ Gratis (2000 minutos/mes)
- ✅ Integración nativa con GitHub
- ✅ YAML simple
- ✅ Suficiente para MVP

**Workflow:**
```
Cada push:
  → Lint + Tests en GitHub Actions

Si todo pasa + push a main:
  → Deploy Frontend a Vercel
  → Deploy Backend a Railway
  → Database migrations (Prisma migrate)

Si push a PR:
  → Preview automático en Vercel
  → Tests + Lint check
```

---

### 8. MONOREPO: UN SOLO REPOSITORIO

**Elegido:** ✅ UN SOLO REPOSITORIO (monorepo)

**Estructura:**
```
kleber-erp/ (UN repositorio)
├── apps/
│   ├── frontend/          (Next.js)
│   └── backend/           (Express.js)
├── packages/
│   ├── shared/            (tipos compartidas)
│   └── database/          (Prisma schema)
├── docs/
├── decisions/
├── guides/
└── .github/workflows/
```

**¿Por qué?**
- ✅ Backend + Frontend comparten tipos
- ✅ Codex + Claude colaboran sin fricción
- ✅ Cambios atómicos (1 commit = 1 feature)
- ✅ CI/CD unificado
- ✅ Escalable (si crece, sacas apps después)

**¿Por qué NO múltiples repos?**
- ❌ Sincronización manual de tipos = problemas
- ❌ Múltiples PRs por cambio = fricción
- ❌ Versiones desincronizadas
- ❌ Más complejo para coordinar

**Herramienta:** pnpm workspaces (más rápido que npm, mejor que yarn)

---

### 9. AMBIENTES: Local, Staging, Production

**Configuración:**

```
LOCAL:
  Frontend:    npm run dev (localhost:3000)
  Backend:     npm run dev (localhost:3001)
  DB:          PostgreSQL local O Supabase dev env
  Files:       .env.local (NO en git)

STAGING:
  Frontend:    Vercel Preview (rama staging)
  Backend:     Railway Preview (rama staging)
  DB:          Supabase staging database
  URL:         https://staging.app

PRODUCTION:
  Frontend:    Vercel Production (main branch)
  Backend:     Railway Production (main branch)
  DB:          Supabase production database
  URL:         https://kleber-app.vercel.app
```

**Flujo:**
```
1. Developer hace cambio en rama claude/01-feature
2. Abre PR
3. GitHub Actions: Lint + Tests
4. Vercel + Railway: Preview automático
5. Revisor prueba en preview
6. Merge a main
7. GitHub Actions: Lint + Tests + Build
8. Deploy automático a production
9. Usuarios ven cambio en 2-5 minutos
```

---

## 📚 DOCUMENTACIÓN CREADA

Todas estas decisiones están documentadas en:

| Documento | Propósito |
|-----------|-----------|
| `decisions/ADR-001_TECH_STACK.md` | **Decisión completa del stack** (LÉELO) |
| `guides/development/MONOREPO_VS_MULTIREPOSITORY.md` | **Explicación de monorepo vs múltiples repos** |
| `guides/api-design/API_DESIGN_GUIDE.md` | **Cómo diseñar APIs REST** |
| `guides/development/DEVELOPMENT_GUIDE.md` | **Cómo trabajar, estructura de módulos** |
| `guides/git-workflow/GIT_WORKFLOW_GUIDE.md` | **Git workflow para Codex + Claude** |
| `CLAUDE.md` | **Instrucciones para Claude** |
| `CODEX.md` | **Instrucciones para Codex** |

---

## 🚀 PRÓXIMOS PASOS (en orden)

### FASE 1: Setup repositorio (1-2 días)

- [ ] Crear repositorio GitHub `kleber-erp`
- [ ] Inicializar monorepo con estructura
- [ ] Setup Next.js en `apps/frontend/`
- [ ] Setup Express.js en `apps/backend/`
- [ ] Crear `packages/shared/`
- [ ] Conectar Supabase
- [ ] Setup GitHub Actions
- [ ] Deploy inicial a Vercel + Railway

**Responsable:** Codex (setup) + Claude (guías)

---

### FASE 2: Autenticación (2-3 días)

- [ ] NextAuth.js setup
- [ ] Login/logout UI
- [ ] RBAC (roles y permisos)
- [ ] JWT + tokens
- [ ] Proteger endpoints

**Responsable:** Ambos en paralelo

---

### FASE 3: MVP Core (1-2 semanas)

- [ ] Modelo de datos Prisma
- [ ] Primeros endpoints API (viajes, activos)
- [ ] Frontend CRUD básico
- [ ] Integración Supabase
- [ ] Tests unitarios
- [ ] Documentación API

**Responsable:** Ambos en paralelo (coordinar en CURRENT_WORK.md)

---

### FASE 4: Integración Mora Mora (por definir)

- [ ] API contract
- [ ] Sync bidireccional
- [ ] Idempotencia
- [ ] Error handling

---

## ✅ VALIDACIÓN

### Criterios de éxito

- ✅ Todo deploy es automático (git push = live)
- ✅ Crear endpoint: 5 minutos
- ✅ Factura mensual: $0
- ✅ Frontend + Backend sincronizados automáticamente
- ✅ Nuevo dev: clone 1 repo + npm install = listo

---

### Testing del stack

Antes de iniciar MVP:
1. [ ] Deploy Next.js a Vercel (verificar)
2. [ ] Deploy Express a Railway (verificar)
3. [ ] Conectar Supabase (verificar)
4. [ ] Auth funciona end-to-end (verificar)
5. [ ] GitHub Actions deploy automático (verificar)

---

## 📊 COMPARATIVA FINAL

### Costo vs Alternativas

| Stack | Costo/mes | Ventajas | Desventajas |
|-------|-----------|----------|------------|
| **ELEGIDO:** Node + Next + Supabase | $0 | Cero costo, rápido, type-safe, comunidad | Node consume más RAM |
| AWS + amplify | $0-500 | Escalable | Riesgo de surprise billing |
| Firebase | $0-100 | Gratis inicialmente | NoSQL, problemas financieros |
| Django + Vue | $0 | Python es bueno | Overkill, curva aprendizaje |
| Go + React | $0 | Ultra rápido | Go es complejo para aprender |

**Veredicto:** Stack elegido es ÓPTIMO para presupuesto $0

---

## 🎓 APRENDIZAJE

Este stack permite aprender:

- **TypeScript:** Type safety, interfaces
- **Full-stack:** Frontend + Backend en JS
- **Arquitectura:** Monorepo, microservicios futuros
- **DevOps:** GitHub Actions, deployments
- **Databases:** PostgreSQL, Prisma, migraciones
- **Cloud:** Vercel, Railway (gratis)
- **AWS después:** Cuando tengas experiencia

---

## 🔄 REVISIÓN

Esta decisión será revisada cuando:
- ✅ MVP esté en producción con usuarios reales
- ✅ Volumen de datos exceda 500MB
- ✅ Performance sea insuficiente
- ✅ Costos suban (si es que suben)

Hasta entonces: **CONGELADA, NO CAMBIAR sin ADR nueva**

---

## ✍️ APROBACIONES

| Rol | Nombre | Fecha | Aprobación |
|-----|--------|-------|-----------|
| Arquitecto | Claude | 2026-09-07 | ✅ Recomendado |
| Usuario | [Tu nombre] | [Fecha] | ⏳ Pendiente |
| Implementación | Codex | [Fecha] | ⏳ Pendiente |

---

## 📞 PREGUNTAS?

**Sobre el stack:**
- Lee `decisions/ADR-001_TECH_STACK.md`

**Sobre monorepo:**
- Lee `guides/development/MONOREPO_VS_MULTIREPOSITORY.md`

**Sobre desarrollo:**
- Lee `guides/development/DEVELOPMENT_GUIDE.md`

**Sobre Git:**
- Lee `guides/git-workflow/GIT_WORKFLOW_GUIDE.md`

---

## 🎉 CONCLUSIÓN

**KLEBER ERP tiene un stack profesional, gratis e indefinido, listo para MVP.**

Próximo paso: **Crear repositorio e inicializar.**

---

**Documento generado:** 2026-09-07  
**Versión:** 1.0  
**Estado:** ✅ APROBADO  
**Siguiente revisión:** Cuando MVP esté con usuarios reales

