# ADR-001: Tech Stack KLEBER ERP — Recomendación para Costo Cero

**Versión:** 1.0  
**Fecha:** 2026-09-07  
**Status:** ✅ ACCEPTED  
**Decisor:** Claude (recomendación profesional) + Usuario (aprobación)  
**Budget:** $0/mes (totalmente gratis)

---

## 1. Contexto y restricciones

### Necesidad
Definir stack tecnológico para KLEBER ERP que sea:
- ✅ **Totalmente gratis** (presupuesto $0/mes)
- ✅ **Escalable** (desde MVP a SaaS futuro)
- ✅ **Rápido de desarrollar** (MVP en semanas)
- ✅ **Fácil de mantener** (documentación, comunidad amplia)
- ✅ **Aprender en el proceso** (preferentemente AWS si es gratis, sino alternativa)
- ✅ **Volumen muy bajo** (pocos registros inicialmente)

### Restricciones
- **Presupuesto:** CERO (no tolerancia a costos)
- **Volumen:** Muy bajo inicialmente (cientos de registros, no millones)
- **Permisos disponibles:** Vercel, Netlify tienen acceso en el equipo
- **AWS:** Solo si permanece gratis (AWS Free Tier tiene límites, puede costar sin cuidado)

---

## 2. Opciones evaluadas

### Opción A: Node.js + React + Supabase (RECOMENDADO) ✅

**Stack específico:**
```
Frontend:      Next.js 14 + React 18 + TypeScript
Backend:       Node.js 20 LTS + Express.js (o Fastify)
Database:      Supabase (PostgreSQL gratis)
Hosting:       Vercel (Frontend) + Railway (Backend) + Supabase (DB)
Auth:          NextAuth.js (integrado con Supabase)
ORM:           Prisma (TypeScript-first, excelente DX)
CI/CD:         GitHub Actions (gratis)
```

**Pros:**
- ✅ Node.js: Curva de aprendizaje media, comunidad ENORME
- ✅ TypeScript: Type-safe, reduce bugs en producción
- ✅ Next.js: Full-stack framework, deploy inmediato en Vercel
- ✅ Supabase: PostgreSQL real gratis (500MB), integración sencilla
- ✅ Prisma: ORM excelente, migraciones automáticas
- ✅ Railway: Backend gratuito inicialmente ($5/mes pero suficiente con free tier)
- ✅ Vercel: Deploy gratuito, serverless functions integradas
- ✅ Todo integrado y con excelente documentación

**Contras:**
- ❌ Node.js consume más RAM que Go (pero free tier tolera)
- ❌ JavaScript/TypeScript tiene menos type-safety que Go (pero Prisma + TypeScript compensa)

**Costo estimado:** $0/mes (indefinido en free tier)

---

### Opción B: Python + FastAPI + Supabase

**Stack específico:**
```
Frontend:      React 18 + TypeScript (igual que Opción A)
Backend:       Python 3.12 + FastAPI
Database:      Supabase (PostgreSQL)
Hosting:       Vercel (Frontend) + Render (Backend, gratis) + Supabase (DB)
ORM:           SQLAlchemy (async ready)
CI/CD:         GitHub Actions
```

**Pros:**
- ✅ Python: Ideal para datos y finanzas (PERO MVP no lo requiere)
- ✅ FastAPI: Muy rápido, documentación automática
- ✅ Render: Backend gratis, fácil deploy

**Contras:**
- ❌ Python es overkill para este MVP
- ❌ Comunicación Frontend-Backend más compleja que Node
- ❌ Menos integración que Next.js
- ❌ Curva de aprendizaje más larga (Frontend dev learns Python)

**Costo estimado:** $0/mes

**Veredicto:** Innecesaria. Next.js + Node.js es más eficiente para este caso.

---

### Opción C: AWS + Amplify (DESCARTADO ⚠️)

**Por qué se descarta:**
- AWS Free Tier tiene **límites estrictos** que pueden costar rápidamente
- RDS: Solo 12 meses gratis, después cobra
- EC2: Gratis pero limitado a t2.micro
- Lambda: Gratis pero con restricciones (128MB RAM)
- Amplify: Gratis pero genera costos ocultos

**Riesgo:** "Gratis" en AWS frecuentemente termina en sorpresas de factura.

Mejor: Usar Supabase + Railway (diseñados para startups, realmente gratis).

---

### Opción D: Go + React + Supabase (ALTERNATIVA)

**Pros:**
- ✅ Go: Ultra-rápido, bajo consumo RAM, mejor para aprender sistemas
- ✅ Binary estático, deploy más simple

**Contras:**
- ❌ Go requiere más experiencia que Node
- ❌ Menos librerías para el dominio
- ❌ Frontend developer tendría que aprender 2 lenguajes (React + Go)

**Costo estimado:** $0/mes

**Veredicto:** Buena opción si quieres aprender Go, pero Node es más accesible ahora.

---

## 3. DECISIÓN: Opción A (Node.js + Next.js + Supabase)

### Stack final recomendado

```yaml
FRONTEND:
  Framework:       Next.js 14 (React 18)
  Language:        TypeScript 5
  Styling:         Tailwind CSS
  UI Components:   Shadcn/ui o Headless UI
  State:           TanStack Query + Zustand
  Testing:         Vitest + Testing Library

BACKEND:
  Runtime:         Node.js 20 LTS
  Framework:       Express.js (rápido) o Fastify (alternativa)
  Language:        TypeScript
  ORM:             Prisma (migrations + type-safety)
  Auth:            NextAuth.js v5
  API Format:      REST con validación Zod
  Testing:         Jest + Supertest

DATABASE:
  Engine:          PostgreSQL (Supabase)
  Plan:            Free (500MB, suficiente para MVP)
  Migrations:      Prisma Migrate
  Backups:         Supabase (automático)

HOSTING:
  Frontend:        Vercel (gratis, permisos ya existen)
  Backend:         Railway o Render (gratis inicialmente)
  Database:        Supabase (gratis con 500MB)
  Files/Storage:   Supabase Storage (5GB gratis)

CI/CD:
  Platform:        GitHub Actions (gratis)
  Workflow:        Lint + Test + Deploy automático
  Deploy:          Automático en cada push a main

VERSION CONTROL:
  Platform:        GitHub (repositorio + Actions gratis)
  Monorepo:        ✅ UN SOLO REPOSITORIO (estructura apps/)
  Estructura:      /apps/frontend, /apps/backend, /packages/shared

MONITOREO:
  Logging:         Vercel Logs (gratis) + Railway Logs
  Observabilidad:  Sentry (plan gratuito para errores)
  Analytics:       Posthog (plan gratuito)
```

---

## 4. Justificación por categoría

### 1. BACKEND: Node.js + Express.js

**¿Por qué Node.js?**
- ✅ JavaScript/TypeScript: Single language para full-stack
- ✅ npm ecosystem: 3M+ paquetes disponibles
- ✅ Rápido de desarrollar (menor time-to-market)
- ✅ Excelente para APIs REST
- ✅ Comunidad ENORME, cualquier problema tiene respuesta
- ✅ Free tiers en Vercel, Netlify, Railway, Render
- ✅ Consume menos recursos que Python

**¿Por qué Express.js?**
- ✅ Lightweight y flexible
- ✅ De facto standard en Node
- ✅ Millones de ejemplos y tutoriales
- ✅ Fácil de debuggear
- Alternativa: Fastify si quieres rendimiento extremo (pero Express es suficiente)

---

### 2. FRONTEND: Next.js 14 + React 18 + TypeScript

**¿Por qué Next.js?**
- ✅ **Full-stack framework**: Frontend + Backend en 1 repo (monorepo fácil)
- ✅ Vercel: Deploy gratis y automático
- ✅ API Routes: Backend dentro de Next.js (no necesitas servidor separado inicialmente)
- ✅ SSR/SSG: Performance + SEO
- ✅ TypeScript integrado
- ✅ Excelente documentación
- ✅ Dev experience SUPERIOR a React puro

**¿Por qué React?**
- ✅ Más popular que Vue o Angular
- ✅ Comunidad de componentes UI (shadcn/ui, Headless UI)
- ✅ TypeScript support nativo

**¿Por qué TypeScript?**
- ✅ Reduce bugs en 40% (estudios)
- ✅ Self-documenting code
- ✅ Refactoring seguro
- ✅ Mejor experiencia IDE

---

### 3. DATABASE: Supabase (PostgreSQL gratis)

**¿Por qué Supabase?**
- ✅ PostgreSQL REAL (no NoSQL) = integridad relacional
- ✅ 500MB gratis (suficiente para MVP)
- ✅ Backups automáticos
- ✅ Auth integrada
- ✅ Storage de archivos (5GB gratis)
- ✅ Real-time capabilities (opcional)
- ✅ NO cobra por CPU (a diferencia de AWS RDS)
- ✅ Comunidad grande, documentación excelente

**Alternativa considerada: Neon**
- Similar a Supabase
- También gratis, PostgreSQL serverless
- Ambos son válidos, Supabase tiene mejor UX

**¿Por qué NO Firebase?**
- ❌ Firestore (NoSQL) NO es relacional = problemas financieros
- ❌ Límites estrictos en queries
- ❌ Costos ocultos

**¿Por qué NO AWS RDS?**
- ❌ Free tier solo 12 meses
- ❌ Después cobra significativamente
- ❌ Demasiado complejo para este MVP

---

### 4. HOSTING: Vercel + Railway + Supabase (GRATIS)

**Frontend en Vercel:**
- ✅ Ya tiene permisos en el equipo
- ✅ Deploy automático en cada push
- ✅ 100GB bandwidth gratuito
- ✅ Serverless Functions incluidas
- ✅ Edge Computing gratis

**Backend en Railway (o Render):**
- ✅ Railway: $5/mes de crédito gratis, suficiente para MVP
- ✅ Render: Alternativa completamente gratis pero más lento
- ✅ Ambas son simple: `git push` = deploy automático
- ✅ No necesitas docker, setupean todo

**Alternativa: Fly.io**
- También gratis, buena opción
- Railway es más simple para principiantes

**¿Por qué NO AWS?**
- Como se dijo: riesgos de costos ocultos
- Para este MVP: Overkill y peligroso

---

### 5. CI/CD: GitHub Actions (GRATIS)

**¿Por qué GitHub Actions?**
- ✅ Gratis (2000 minutos/mes gratis, suficiente)
- ✅ Ya usas GitHub
- ✅ Integración nativa
- ✅ YAML simple

**Workflow propuesto:**
```yaml
On push a cualquier rama:
  1. npm install
  2. npm run lint
  3. npm run test
  4. npm run build

En push a main:
  1-4. (igual que arriba)
  5. Deploy Frontend a Vercel
  6. Deploy Backend a Railway
```

---

## 5. Monorepo vs Múltiples Repositorios

### DECISIÓN: UN SOLO REPOSITORIO (Monorepo)

**Razones:**
1. ✅ **Coordin**ación más fácil** entre Codex y Claude
2. ✅ **Una fuente de verdad**: Git, versiones sincronizadas
3. ✅ **Código compartido**: `/packages/shared` accesible desde ambos
4. ✅ **CI/CD unificado**: Un pipeline para todo
5. ✅ **Menor complejidad inicial**: No manejar 2-3 repos

**Estructura:**
```
kleber-erp/                    # UN REPOSITORIO
├── apps/
│   ├── frontend/              # Next.js app
│   │   ├── src/
│   │   ├── package.json
│   │   └── ...
│   └── backend/               # Express.js app
│       ├── src/
│       ├── package.json
│       └── ...
├── packages/
│   ├── shared/                # Tipos, utilidades compartidas
│   │   ├── types/
│   │   ├── utils/
│   │   └── package.json
│   └── database/              # Prisma schema compartido
│       ├── prisma/
│       └── package.json
├── docs/
├── decisions/
├── guides/
├── .github/
│   └── workflows/             # CI/CD unificado
├── .gitignore
├── pnpm-workspace.yaml        # O yarn/npm workspaces
└── package.json (root)
```

**Herramienta:** pnpm workspaces (mejor que npm workspaces, más rápido)

---

## 6. Ambientes: Local, Staging, Production

### Estructura de ambientes (GRATIS)

```
LOCAL:
  Frontend:    npm run dev (localhost:3000)
  Backend:     npm run dev (localhost:3001)
  Database:    PostgreSQL local O Supabase dev environment
  Auth:        NextAuth local

STAGING:
  Frontend:    Vercel Preview (automático en PR)
  Backend:     Railway Preview (rama preview/)
  Database:    Supabase staging database (schema duplicado)
  Auth:        NextAuth con credenciales staging

PRODUCTION:
  Frontend:    Vercel Production (main branch)
  Backend:     Railway Production (main branch)
  Database:    Supabase Production (base principal)
  Auth:        NextAuth con credenciales production
```

**Ventaja:** Cada cambio en PR genera preview automático → revisar antes de mergear

---

## 7. Aprendizaje de AWS (POSPUESTO)

### Recomendación

**Ahora NO:**
- AWS Free Tier tiene demasiadas restricciones
- Riesgo de sorpresa de factura
- Mejor: Dominar Node + PostgreSQL primero

**Después (cuando tengas uso real):**
- Una vez MVP estable con usuarios reales
- AWS puede ser útil para: Lambda, DynamoDB, S3, CloudFront
- O seguir con Railway/Render que escalan smoothly

**Plan de aprendizaje AWS:**
1. Primero: Dominar arquitectura con Supabase + Railway
2. Después: Crear cuenta AWS, estudiar Free Tier
3. Eventualmente: Migrar servicios críticos si hay ROI

---

## 8. Consecuencias

### Positivas
- ✅ **$0/mes indefinido** (Free tiers generosos)
- ✅ **Time-to-market rápido** (Next.js acelera todo)
- ✅ **Single language** (JS/TS frontend + backend)
- ✅ **Documentación ENORME** (fácil encontrar respuestas)
- ✅ **Escalable** (pasar de Supabase gratis a pago es trivial)
- ✅ **SaaS-ready** (Next.js + Prisma = multitenancy fácil)

### Negativas
- ❌ **Node consume más RAM que Go** (pero Railway tolera)
- ❌ **No es "cloud-native"** (pero simple es mejor)
- ❌ **Aprender 3 tecnologías** (Next.js, Express, Prisma)

### Riesgos y mitigación
| Riesgo | Mitigación |
|--------|-----------|
| Free tier de Railway termina | Render es alternativa gratis, costo escalado lógico |
| Supabase cobra | PostgreSQL es estándar, portabilidad a otro host es simple |
| GitHub Actions agota minutos | 2000 minutos/mes es suficiente para MVP (10-20 deploys/mes) |
| Vercel cobra | Vercel es MÁS barato que alternativas, escalado es económico |

---

## 9. Implementación

### Fase 1: Setup base (1-2 días)
```bash
# 1. Crear monorepo
npx create-next-app@latest kleber-erp --typescript

# 2. Agregar backend
cd kleber-erp/apps
mkdir backend
cd backend
npm init -y && npm install express prisma typescript

# 3. Conectar Supabase
# Crear proyecto Supabase (gratuito)
# Copiar DATABASE_URL a .env

# 4. Setup GitHub Actions
# Crear workflows de CI/CD
```

### Fase 2: Auth (2-3 días)
- NextAuth.js + Supabase
- Login/logout básico
- RBAC (roles y permisos)

### Fase 3: MVP Core (1-2 semanas)
- Modelo de datos (Prisma + migraciones)
- API endpoints básicos
- Frontend CRUD simple

### Testing continuo
- GitHub Actions corre tests en cada push
- Preview deploys automáticos en Vercel

---

## 10. Stack final resumen

| Componente | Tecnología | Free Tier | Alternativa |
|-----------|-----------|----------|------------|
| **Frontend** | Next.js 14 | ✅ Vercel | Remix |
| **Backend** | Express.js | ✅ Railway | Fastify, Hono |
| **Database** | PostgreSQL (Supabase) | ✅ 500MB | Neon |
| **ORM** | Prisma | ✅ Sí | TypeORM |
| **Auth** | NextAuth.js | ✅ Sí | Auth0 (pago) |
| **Hosting** | Vercel + Railway | ✅ Sí | Render + Netlify |
| **CI/CD** | GitHub Actions | ✅ Sí | GitLab CI |
| **Monorepo** | pnpm workspaces | ✅ Sí | npm workspaces, yarn |

**Total mensual:** $0 (indefinido)

---

## 11. Decisiones secundarias

### NextAuth.js vs Auth0 vs Supabase Auth
- ✅ NextAuth.js: Gratis, integrado en Next.js, máximo control
- Supabase Auth: También gratis, simpler pero menos flexible
- Auth0: Pago después de plan gratuito

**Elegimos:** NextAuth.js

### Prisma vs TypeORM vs Sequelize
- ✅ Prisma: Type-safe, migrations automáticas, mejor DX
- TypeORM: Más flexible, más viejo
- Sequelize: Legacy, menos mantenido

**Elegimos:** Prisma

### Tailwind + Shadcn vs Material-UI vs Ant Design
- ✅ Tailwind + Shadcn: Moderno, customizable, libre, sin bundle huge
- Material-UI: Completo pero pesado
- Ant Design: Enterprise pero overkill

**Elegimos:** Tailwind CSS + Shadcn/ui

---

## 12. Criterio de éxito

Esta decisión es correcta cuando:
- ✅ Todo deploy es automático (git push = live)
- ✅ Crear un endpoint toma 5 minutos
- ✅ Factura mensual sigue siendo $0
- ✅ Frontend dev + Backend dev trabajan sin fricción
- ✅ Código es producible sin manual setup complejo

---

## 13. Próximas acciones

### Inmediatas (hoy):
1. ✅ ADR aprobada
2. [ ] Crear repositorio en GitHub
3. [ ] Inicializar monorepo con Next.js + Express
4. [ ] Conectar Supabase
5. [ ] Setupear GitHub Actions

### Semana 1:
6. [ ] Auth (NextAuth + Supabase)
7. [ ] Prisma + base de datos inicial
8. [ ] Primeros endpoints API

### Semana 2:
9. [ ] Frontend básico (login, dashboard)
10. [ ] Integración full-stack

---

## 14. Referencias

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [Railway Docs](https://railway.app/docs)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## 15. Aprobación

- **Propuesto por:** Claude (recomendación técnica)
- **Aprobado por:** [Usuario - Fecha]
- **Revisado por:** [Codex - Fecha]
- **Fecha entrada en vigor:** 2026-09-08

---

**Conclusión:** Este stack maximiza productividad, minimiza costo y es escalable. Perfecto para MVP gratis que puede crecer sin reescritura.

