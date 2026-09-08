# Monorepo vs Múltiples Repositorios — KLEBER ERP

**Versión:** 0.1  
**Propósito:** Explicar qué es un monorepo, cómo funciona, y por qué lo elegimos  
**Última actualización:** 2026-09-07

---

## 1. ¿Qué es un Monorepo?

### Definición simple
Un **monorepo** es **UN SOLO repositorio de Git** que contiene **MÚLTIPLES proyectos/aplicaciones** dentro.

### Definición técnica
En lugar de tener:
- `kleber-backend` (repo 1)
- `kleber-frontend` (repo 2)
- `kleber-shared` (repo 3)

Tienes:
- `kleber-erp` (repo único)
  - `/apps/backend`
  - `/apps/frontend`
  - `/packages/shared`

---

## 2. Visualización: Monorepo vs Múltiples Repos

### ❌ MÚLTIPLES REPOSITORIOS (complicado)

```
GitHub
├── kleber-backend (repo 1)
│   ├── src/
│   ├── package.json
│   └── .git/ ← Repositorio 1
│
├── kleber-frontend (repo 2)
│   ├── src/
│   ├── package.json
│   └── .git/ ← Repositorio 2
│
└── kleber-shared (repo 3)
    ├── types/
    ├── utils/
    ├── package.json
    └── .git/ ← Repositorio 3
```

**Problemas:**
```
1. Cambio tipos en shared/
2. Tengo que actualizar backend (git commit + push)
3. Tengo que actualizar frontend (git commit + push)
4. 3 commits, 3 PRs, 3 reviews = FRICCIÓN

Si olvido actualizar uno → INCONSISTENCIA
```

---

### ✅ MONOREPO (simple)

```
GitHub
└── kleber-erp (repo único)
    ├── apps/
    │   ├── backend/
    │   │   ├── src/
    │   │   └── package.json
    │   └── frontend/
    │       ├── src/
    │       └── package.json
    ├── packages/
    │   └── shared/
    │       ├── types/
    │       ├── utils/
    │       └── package.json
    ├── docs/
    ├── guides/
    ├── .github/workflows/
    ├── package.json (root)
    └── .git/ ← UN SOLO repositorio
```

**Ventajas:**
```
1. Cambio tipos en shared/
2. Todo está en UN commit
3. Una PR para revisar
4. Backend + Frontend + Shared sincronizados automáticamente
```

---

## 3. Comparación lado a lado

| Aspecto | Múltiples Repos | Monorepo |
|--------|-----------------|---------|
| **Número de repos** | 3+ | 1 |
| **Commits para un cambio** | 3 | 1 |
| **PRs que revisar** | 3 | 1 |
| **Sincronización de versiones** | Manual (problemática) | Automática |
| **Código compartido** | Npm package (complicado) | import directo |
| **CI/CD** | 3 pipelines | 1 pipeline |
| **Onboarding nuevo dev** | Clone 3 repos | Clone 1 repo |
| **Complejidad inicial** | Baja | Baja |
| **Complejidad escalando** | ALTA | MEDIA |

---

## 4. ¿Cuándo usar cada uno?

### Usa MÚLTIPLES REPOS si:
- ❌ Cada proyecto tiene ciclo de vida completamente independiente
- ❌ Equipos diferentes manejan cada repo (no aplicable aquí)
- ❌ Necesitas diferentes políticas de acceso (no aplicable aquí)

### Usa MONOREPO si: ✅
- ✅ Backend + Frontend comparten tipos/lógica
- ✅ Quieres que cambios viajen juntos
- ✅ Tienes 1-2 equipos (Codex + Claude)
- ✅ Es un proyecto coherente (KLEBER ERP)

**Para KLEBER:** Claramente MONOREPO

---

## 5. Estructura KLEBER Monorepo (completa)

```
kleber-erp/
│
├── apps/                           # Aplicaciones del proyecto
│   ├── frontend/                   # Next.js app (React UI)
│   │   ├── src/
│   │   │   ├── app/               # Next.js App Router
│   │   │   ├── components/        # React components
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   └── pages/
│   │   ├── public/
│   │   ├── .env.local.example
│   │   ├── next.config.js
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── backend/                    # Express.js app (API)
│       ├── src/
│       │   ├── routes/
│       │   ├── controllers/
│       │   ├── services/
│       │   ├── middleware/
│       │   └── index.ts
│       ├── prisma/                 # Database migrations
│       │   └── schema.prisma
│       ├── .env.local.example
│       ├── tsconfig.json
│       ├── package.json
│       └── README.md
│
├── packages/                       # Código compartido (reutilizable)
│   ├── shared/                    # Tipos, interfaces, constantes
│   │   ├── src/
│   │   │   ├── types/             # Interfaces compartidas
│   │   │   ├── utils/             # Funciones reutilizables
│   │   │   ├── constants/         # Constantes globales
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── database/                  # Prisma configuración compartida
│       ├── prisma/
│       │   └── schema.prisma
│       ├── src/
│       │   └── index.ts
│       └── package.json
│
├── docs/                          # Documentación
│   ├── 00_foundation/
│   ├── 01_scope/
│   ├── 02_architecture/
│   ├── 03_infrastructure/
│   ├── 04_standards/
│   └── INDEX.md
│
├── decisions/                     # ADRs y decisiones arquitectónicas
│   ├── 000_ADR_TEMPLATE.md
│   ├── ADR-001_TECH_STACK.md
│   └── CURRENT_WORK.md
│
├── guides/                        # Guías de desarrollo
│   ├── development/
│   ├── git-workflow/
│   ├── api-design/
│   └── (este archivo)
│
├── .github/                       # GitHub workflows
│   └── workflows/
│       ├── lint.yml               # Linting CI
│       ├── test.yml               # Testing CI
│       ├── deploy-frontend.yml    # Deploy a Vercel
│       └── deploy-backend.yml     # Deploy a Railway
│
├── .gitignore                     # Ignore global para todo el mono
├── pnpm-workspace.yaml            # Configuración de workspaces
├── package.json (root)            # Scripts compartidos
├── tsconfig.json (root)           # TypeScript config base
├── turbo.json                     # Turbo config (opcional, para build rápido)
│
├── README.md                      # Este archivo
├── CLAUDE.md                      # Instrucciones Claude
├── CODEX.md                       # Instrucciones Codex
└── .env.example                   # Variables de ejemplo
```

---

## 6. Cómo funciona el monorepo en práctica

### Setup local (una sola vez)

```bash
# 1. Clonar TODO (un solo comando)
git clone https://github.com/usuario/kleber-erp.git
cd kleber-erp

# 2. Instalar dependencias de TODO
pnpm install
# pnpm instala dependencias en:
# - apps/frontend/
# - apps/backend/
# - packages/shared/
# TODO a la vez

# 3. Iniciar desarrollo
pnpm dev
# Ambas aplicaciones corren en paralelo
# Frontend: localhost:3000
# Backend: localhost:3001
```

### Hacer un cambio que afecta frontend + backend

```bash
# 1. Crear rama
git checkout -b claude/01-add-trip-type

# 2. Cambiar tipo en shared/
# packages/shared/src/types/trip.ts
# Agrego: export type TripStatus = "draft" | "active" | "closed"

# 3. Usar en backend
# apps/backend/src/routes/trips.ts
// import { TripStatus } from "@kleber/shared"
const trip: TripStatus = "draft"

# 4. Usar en frontend
# apps/frontend/src/components/TripForm.tsx
// import { TripStatus } from "@kleber/shared"
const status: TripStatus = "active"

# 5. UN SOLO COMMIT
git add .
git commit -m "[TYPES] Add TripStatus enum

- Define TripStatus in shared/types
- Used by backend and frontend
- Ensures type consistency across apps"

# 6. UN SOLO PUSH
git push origin claude/01-add-trip-type

# 7. Una PR (revisor ve TODO en contexto)
# - Cambio en shared/
# - Cambio en backend/
# - Cambio en frontend/
# TODO en una vista
```

---

## 7. Ambientes: Local, Staging, Production

En monorepo, tienes diferentes `.env` para cada ambiente:

### Local (tu máquina)

```
kleber-erp/
├── .env.local                  # Tu configuración local
├── .env.staging                # Config para staging
└── .env.production             # Config para prod (en secretos GitHub)
```

**`.env.local` (tu máquina):**
```
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend
DATABASE_URL=postgresql://localhost:5432/kleber_local
NODE_ENV=development

# Auth
NEXTAUTH_SECRET=local_secret_only_for_dev
NEXTAUTH_URL=http://localhost:3000
```

**Ejecutar localmente:**
```bash
pnpm dev
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Database: PostgreSQL local
```

---

### Staging (ambiente de pruebas)

**Cómo funciona:**
```
1. Haces PR en rama "staging"
2. GitHub Actions corre tests
3. Si pasan, automáticamente deploy a staging
4. Frontend: https://staging.kleber-app.vercel.app
5. Backend: https://staging-api.railway.app
6. Database: Supabase staging database
```

**Cambios antes de ir a production:**
```
main branch (production)
├── Merge PR
├── GitHub Actions triggers
├── Deploy a production (Vercel + Railway)
└── Database: Supabase production

staging branch (testing)
├── Merge PR
├── GitHub Actions triggers
├── Deploy a staging (Vercel Preview + Railway Preview)
└── Database: Supabase staging (schema duplicado)
```

---

### Production (en vivo)

**Solo en `main` branch:**
```bash
# Merge a main
git checkout main
git pull origin main

# GitHub Actions automáticamente:
# 1. Corre lint + tests
# 2. Corre build en ambas apps
# 3. Deploy frontend a Vercel production
# 4. Deploy backend a Railway production
# 5. Usuarios ven cambios en 2-5 minutos
```

---

## 8. CI/CD en Monorepo

### GitHub Actions Workflow (simplificado)

```yaml
name: CI/CD

on:
  push:
    branches: [main, staging, "claude/**", "codex/**"]

jobs:
  lint-test:
    runs-on: ubuntu-latest
    steps:
      # 1. Checkout código
      - uses: actions/checkout@v3
      
      # 2. Setup Node
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      # 3. Install deps (TODO en monorepo)
      - run: pnpm install
      
      # 4. Lint (TODO)
      - run: pnpm lint
      
      # 5. Test (TODO)
      - run: pnpm test
      
      # 6. Build (TODO)
      - run: pnpm build
  
  deploy-frontend:
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/staging'
    needs: lint-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v4
        with:
          # Deploy frontend a Vercel
          working-directory: apps/frontend
  
  deploy-backend:
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/staging'
    needs: lint-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        # Script para deployar backend
        run: npm run deploy:backend
```

**Resultado:**
- `push a cualquier rama` → Lint + Tests (opcional deploy)
- `push a main` → Lint + Tests + Deploy production
- `push a staging` → Lint + Tests + Deploy staging

---

## 9. Ventajas de monorepo para Codex + Claude

### Sin monorepo (complicado)

```
Claude trabaja en:
- kleber-frontend (rama claude/01-auth)

Codex trabaja en:
- kleber-backend (rama codex/01-auth)

Ambos tocan authentication...

¿Quién tiene la verdad? 
¿Cómo sync?
¿Qué versión de tipos?

FRICCIÓN 😞
```

### Con monorepo (fluido)

```
Claude trabaja en:
- apps/frontend + packages/shared (rama claude/01-auth)

Codex trabaja en:
- apps/backend + packages/shared (rama codex/02-trips)

Mismo repositorio:
- Ven cambios del otro en tiempo real
- Tipos compartidas = coherencia automática
- Una rama = una feature completa
- Un PR = contexto completo

FLUIDEZ 😊
```

---

## 10. Herramientas para monorepo

### pnpm workspaces (RECOMENDADO)

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**Ventajas:**
- ✅ Más rápido que npm
- ✅ Ahorro de espacio (link simbólico a deps)
- ✅ Strict - evita dependencias implícitas

**Comando:**
```bash
pnpm install          # Install all
pnpm add dep          # Add to root
pnpm add -w dep       # Add to all workspaces
pnpm --filter apps/frontend add lodash  # Add solo a frontend
```

---

### Turbo (opcional, para build rápido)

```bash
# Ejecuta tasks en paralelo intelligentemente
turbo run build --filter=apps/frontend

# Solo rebuilda lo que cambió (cache)
# Segunda ejecución: 2ms (vs 30s sin caché)
```

---

## 11. Migración de múltiples repos a monorepo

Si tenías repos separados:

```bash
# 1. Crear repo nuevo
mkdir kleber-erp && cd kleber-erp

# 2. Inicializar Git
git init

# 3. Traer código de otros repos
git remote add backend /path/to/kleber-backend
git fetch backend
git merge --allow-unrelated-histories backend/main

# (mover a apps/backend/)

# 4. Repetir para frontend, shared, etc.

# 5. Crear estructura monorepo
mkdir -p apps packages
mv backend apps/
# ... etc

# 6. Crear pnpm-workspace.yaml
# 7. Install, build, test
pnpm install && pnpm build
```

**Es un poco manual pero vale la pena.**

---

## 12. Desventajas (y cómo mitigarlas)

| Desventaja | Mitigación |
|-----------|----------|
| Repo grande (tamaño en disco) | No es problema hasta millones de files (KLEBER nunca llega) |
| CI/CD corre TODO | Usar filtros en GitHub Actions para solo lo que cambió |
| Acceso/permisos difíciles | KLEBER no lo necesita (es proyecto único) |
| Algunos IDEs lentos | VS Code maneja bien, WebStorm también |

---

## 13. Conclusión

### Para KLEBER ERP: DEFINITIVAMENTE MONOREPO

Razones:
1. ✅ Backend + Frontend + Shared fuertemente acoplados
2. ✅ Codex + Claude colaboran sin fricción
3. ✅ Cambios atómicos (tipos + backend + frontend = 1 commit)
4. ✅ CI/CD simplificado
5. ✅ Más fácil aprender de la codebase completa
6. ✅ Scaling natural (si crece a microservicios, sacas apps/ después)

---

## 14. Pasos siguientes

1. ✅ Crear repo `kleber-erp` en GitHub
2. ✅ Inicializar monorepo con estructura
3. ✅ Setup Next.js en `apps/frontend/`
4. ✅ Setup Express en `apps/backend/`
5. ✅ Crear `packages/shared/` para tipos
6. ✅ Conectar Supabase
7. ✅ Setup GitHub Actions
8. ✅ Primer deploy a Vercel + Railway

---

**¿Preguntas?** Lee `CLAUDE.md`, `CODEX.md` o abre issue.

