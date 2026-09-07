# FASE 0.5: Setup Repositorio — PLAN DE ACCIÓN

**Versión:** 1.0  
**Estado:** LISTO PARA EJECUTAR  
**Duración estimada:** 1-2 días  
**Responsable principal:** Codex  
**Responsable secundario:** Claude  

---

## 🎯 OBJETIVO DE FASE 0.5

Tener un **repositorio GitHub funcional** con:
- ✅ Monorepo inicializado
- ✅ Frontend (Next.js) runnable
- ✅ Backend (Express.js) runnable
- ✅ Database conectada a Supabase
- ✅ GitHub Actions configurado
- ✅ Deploy test a Vercel + Railway funcionando

**Resultado:** Todo está en la nube, listo para Fase 1 (Auth)

---

## 📋 CHECKLIST CUENTAS Y SERVICIOS

### Cuentas a crear/usar

| Servicio | Correo | Tipo | Notas |
|----------|--------|------|-------|
| **GitHub** | Tu correo personal | Personal | Para portafolio ✅ |
| **Vercel** | Otro correo (Clever) | Cuenta empresa | Deploy frontend |
| **Railway** | Otro correo (Clever) | Cuenta empresa | Deploy backend |
| **Supabase** | Otro correo (Clever) | Cuenta empresa | Database |
| **GitHub Actions** | Usa GitHub personal | Automático | Free tier |

### ¿Por qué 2 correos?
```
Tu GitHub personal (carranzauwaldo@gmail.com)
├── Repositorio kleber-erp
├── Commits + PRs
└── Tu portafolio profesional

Servicios empresariales (correo-clever@...)
├── Vercel (deploys frontend)
├── Railway (deploys backend)
├── Supabase (database)
└── OAuth/tokens seguros
```

---

## 🔑 PASO 0: PREPARACIÓN

### 0.1 Decide tu correo secundario

Opciones:
- [ ] `kleber.dev@email.com` (crear correo nuevo para el proyecto)
- [ ] `proyecto.kleber@email.com`
- [ ] Otro: ___________

**Recomendación:** Crea correo nuevo para mantener orden.

Ej: `kleber.dev.platform@gmail.com` (o similar)

---

## 📥 PASO 1: CREAR REPOSITORIO EN TU GITHUB PERSONAL

### 1.1 En GitHub.com (tu cuenta personal)

```
1. Ir a https://github.com/new
2. Nombre: kleber-erp
3. Descripción: ERP modular para gestión de transportes
4. Visibilidad: PUBLIC (para portafolio)
5. Inicializar con: 
   - [ ] NO README (lo creas luego)
   - [ ] gitignore: Node.js
   - [ ] License: MIT
6. Click "Create repository"
```

**Resultado:** Repositorio vacío en `github.com/tu-usuario/kleber-erp`

### 1.2 Clonar en tu máquina

```bash
# En tu terminal
git clone https://github.com/tu-usuario/kleber-erp.git
cd kleber-erp

# Verificar
git log  # (vacío, es normal)
```

---

## 🏗️ PASO 2: INICIALIZAR MONOREPO

### 2.1 Setup de carpetas base

```bash
# Crear estructura
mkdir -p apps/frontend apps/backend packages/shared
mkdir -p docs decisions guides structure .github/workflows

# Crear archivos base
touch apps/frontend/README.md
touch apps/backend/README.md
touch packages/shared/README.md
```

### 2.2 Crear pnpm-workspace.yaml (en raíz)

```bash
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF
```

### 2.3 Crear package.json raíz

```bash
cat > package.json << 'EOF'
{
  "name": "kleber-erp",
  "version": "0.1.0",
  "description": "ERP modular para gestión de transportes",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r --parallel build",
    "lint": "pnpm -r --parallel lint",
    "test": "pnpm -r --parallel test",
    "format": "pnpm -r --parallel format"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "prettier": "^3.0.0"
  }
}
EOF
```

### 2.4 Copiar documentación a repo

```bash
# Copiar todos los archivos de docs/ que hicimos
cp -r /ruta/anterior/docs ./
cp -r /ruta/anterior/decisions ./
cp -r /ruta/anterior/guides ./
cp README.md .
cp CLAUDE.md .
cp CODEX.md .
```

---

## ⚙️ PASO 3: SETUP FRONTEND (Next.js)

### 3.1 Crear Next.js en apps/frontend

```bash
cd apps/frontend

# Crear Next.js proyecto
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-git

# Responder prompts:
# ✅ TypeScript: Yes
# ✅ ESLint: Yes
# ✅ Tailwind: Yes
# ✅ App Router: Yes
```

### 3.2 Configurar env

```bash
# En apps/frontend/
cat > .env.local << 'EOF'
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Auth (NextAuth - por implementar en Fase 1)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev_secret_change_in_prod
EOF
```

### 3.3 Test local

```bash
cd apps/frontend
npm run dev
# Verificar: http://localhost:3000 funciona
```

---

## 🔧 PASO 4: SETUP BACKEND (Express.js)

### 4.1 Crear Express.js en apps/backend

```bash
cd apps/backend

# Crear package.json
cat > package.json << 'EOF'
{
  "name": "@kleber/backend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src",
    "format": "prettier --write src"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "@prisma/client": "^5.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.4.0",
    "typescript": "^5.2.0",
    "tsx": "^3.14.0",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0",
    "@prisma/cli": "^5.0.0"
  }
}
EOF

npm install
```

### 4.2 Crear estructura base

```bash
mkdir -p src/routes src/controllers src/services src/middleware

cat > src/index.ts << 'EOF'
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`)
})
EOF
```

### 4.3 Configurar env

```bash
# En apps/backend/
cat > .env.local << 'EOF'
# Database (Supabase - por configurar)
DATABASE_URL=postgresql://user:password@localhost:5432/kleber_local

# Environment
NODE_ENV=development
PORT=3001

# Frontend origin
FRONTEND_URL=http://localhost:3000
EOF
```

### 4.4 Test local

```bash
cd apps/backend
npm run dev
# Verificar: http://localhost:3001/api/health retorna JSON
```

---

## 💾 PASO 5: SETUP DATABASE (Supabase)

### 5.1 Crear cuenta Supabase

**Con correo DIFERENTE (kleber.dev@email.com):**

```
1. Ir a https://supabase.com
2. Click "Sign up"
3. Email: kleber.dev@email.com (NO tu gmail personal)
4. Password: [segura, guardar en gestor de contraseñas]
5. Verificar email
```

### 5.2 Crear proyecto

```
1. Dashboard → New project
2. Name: kleber-erp-dev
3. Database Password: [generar contraseña fuerte]
4. Region: US-East (o la más cercana)
5. Click "Create new project" (espera 2-3 min)
```

### 5.3 Obtener DATABASE_URL

```
1. Ir a Settings → Database
2. Copiar "Connection string" (URI style)
3. Guardar en apps/backend/.env.local

Ejemplo:
DATABASE_URL=postgresql://postgres:PASSWORD@db.XXXX.supabase.co:5432/postgres
```

### 5.4 Crear Prisma schema inicial

```bash
# En backend
npx prisma init

# Editar prisma/schema.prisma
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Minimal modelo para MVP
model Organization {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
EOF

# Generar cliente
npx prisma generate

# Ver BD (opcional)
npx prisma studio
```

---

## 🔗 PASO 6: GITHUB ACTIONS (CI/CD)

### 6.1 Crear workflow de test

```bash
# En .github/workflows/
mkdir -p .github/workflows

cat > .github/workflows/test.yml << 'EOF'
name: Test & Lint

on:
  push:
    branches: [main, staging, "claude/**", "codex/**"]
  pull_request:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm build
      - run: pnpm test --run
EOF
```

### 6.2 Crear workflow de deploy (próximamente)

Por ahora SKIP, lo haremos en Fase 0.5b cuando conectemos Vercel + Railway.

---

## 🚀 PASO 7: PRIMER COMMIT

```bash
# En raíz del repo
git add .
git commit -m "chore: Initialize monorepo with Next.js, Express, Supabase

- Setup pnpm workspaces
- Create frontend (Next.js 14 + TypeScript + Tailwind)
- Create backend (Express.js + TypeScript + Prisma)
- Create shared package for types
- Add documentation and guides
- Add GitHub Actions workflows
- Add .env examples

Refs: PHASE_0.5"

git push origin main
```

**Resultado en GitHub:**
```
kleber-erp/
├── apps/
│   ├── frontend/    (Next.js, runnable)
│   └── backend/     (Express.js, runnable)
├── packages/
│   └── shared/      (types compartidas)
├── docs/            (documentación)
├── guides/
├── decisions/
└── ... (todo lo que creamos)
```

---

## 🌐 PASO 8: CONECTAR VERCEL (Frontend)

### 8.1 Crear cuenta Vercel

**Con correo DIFERENTE (kleber.dev@email.com):**

```
1. Ir a https://vercel.com
2. "Sign Up" → GitHub
3. Autorizar con tu GitHub personal
4. Crear team (opcional, pero recomendado: "Kleber")
```

### 8.2 Deploy frontend

```
1. Dashboard → Add New Project
2. Seleccionar repositorio: kleber-erp
3. Framework: Next.js
4. Root Directory: apps/frontend
5. Environment Variables: (NEXT_PUBLIC_API_URL=...)
6. Deploy
```

**Resultado:** Frontend en `https://kleber-erp.vercel.app` (URL pública)

---

## 🚂 PASO 9: CONECTAR RAILWAY (Backend)

### 9.1 Crear cuenta Railway

**Con correo DIFERENTE (kleber.dev@email.com):**

```
1. Ir a https://railway.app
2. "Sign up" → GitHub
3. Autorizar con tu GitHub personal
```

### 9.2 Deploy backend

```
1. Dashboard → New Project
2. Deploy from GitHub repo
3. Seleccionar: kleber-erp
4. Configure settings:
   - Root directory: apps/backend
   - Build command: npm run build
   - Start command: npm run start
5. Add environment variable:
   - DATABASE_URL (copiar de Supabase)
   - PORT=3001
6. Deploy
```

**Resultado:** Backend en `https://kleber-erp-api.railway.app` (URL pública)

---

## ✅ PASO 10: VALIDACIÓN FINAL

### 10.1 Test end-to-end

```bash
# En tu máquina
curl https://kleber-erp-api.railway.app/api/health
# Debe retornar: {"status":"ok","timestamp":"..."}

# Visita
https://kleber-erp.vercel.app
# Debe cargar la página
```

### 10.2 Verificar GitHub

```bash
# En tu repo GitHub personal
git log
# Debe mostrar commit de setup

# GitHub → Actions
# Debe haber ejecutado workflow de test
```

### 10.3 Verificar Supabase

```bash
# Supabase dashboard → Database
# Debe mostrar tabla "Organization" creada
```

---

## 📊 RESUMEN DE CUENTAS CREADAS

Después de Fase 0.5, tendrás:

```
✅ GitHub personal (tu portafolio)
   └── kleber-erp (repositorio público)

✅ Vercel (kleber.dev@email.com)
   └── Deploy automático frontend
   
✅ Railway (kleber.dev@email.com)
   └── Deploy automático backend
   
✅ Supabase (kleber.dev@email.com)
   └── PostgreSQL + backups automáticos

✅ GitHub Actions
   └── Tests automáticos en cada push
```

---

## 🎯 CUÁNDO AVISAR AL ESTUDIO

### AHORA (Antes de iniciar):
- ✅ Todo se puede hacer sin avisar
- ✅ GitHub personal = tu portafolio
- ✅ Cuentas externas con correo propio
- ✅ Free tiers no cobran nada

### NO necesita avisar si:
- Todo funciona en local
- Deployments son gratis
- No hay costos incurridos
- El código es tuyo (en tu GitHub)

### SÍ avisa si/cuando:
- [ ] Necesitas pagar algo (NO debería pasar)
- [ ] Necesitas credenciales compartidas con el estudio
- [ ] MVP está listo para producción real (Fase 3)
- [ ] Hay cambios arquitectónicos mayores

---

## 💰 OPTIMIZACIÓN DE CRÉDITOS

### Free tiers garantizados (nunca cobran):

| Servicio | Free Tier | Límite |
|----------|-----------|--------|
| **GitHub** | ✅ GRATIS | Ilimitado |
| **GitHub Actions** | ✅ GRATIS | 2000 min/mes |
| **Vercel** | ✅ GRATIS | 100GB bandwidth |
| **Railway** | ⚠️ $5/mes crédito | Suficiente MVP |
| **Supabase** | ✅ GRATIS | 500MB + backups |

### Cómo NO gastar créditos:

1. **No usar AWS** (riesgo de costo)
2. **No cambiar de proveedor constantemente** (setup = frivolidad)
3. **Monitorear Railway** (revisar dashboard cada semana)
4. **No hacer deploy cada 5 minutos** (GitHub Actions tiene límite)

---

## 📅 TIMELINE FASE 0.5

```
Día 1 (Codex):
  - [ ] Pasos 0-4 (repositorio + frontend + backend)
  - [ ] Primeros tests locales
  - [ ] Primer commit + push

Día 2 (Codex + Claude):
  - [ ] Pasos 5-9 (Supabase + Vercel + Railway)
  - [ ] GitHub Actions configurado
  - [ ] Validación end-to-end
  - [ ] Documentación actualizada

Resultado: MVP estructura lista → Fase 1 (Auth)
```

---

## 🎯 PRÓXIMO PASO DESPUÉS DE FASE 0.5

Una vez todo funcione:

1. ✅ Fase 0.5 completada (estructura en la nube)
2. ⏳ Fase 1: Autenticación (NextAuth + RBAC)
3. ⏳ Fase 2: MVP Viajes (CRUD + Supabase)

---

## 📞 DUDAS COMUNES

**P: ¿Puedo usar mi GitHub personal?**
R: SÍ, ese es el punto. Así acumulas portafolio.

**P: ¿Necesito pagar por Vercel/Railway?**
R: NO, free tiers son suficientes para MVP.

**P: ¿Qué pasa si me equivoco en un paso?**
R: Puedes eliminar el repo y empezar de nuevo. Todo es reversible.

**P: ¿Cuándo avisar al estudio?**
R: Cuando haya costos reales o necesites credenciales compartidas.

**P: ¿Y si el volumen crece?**
R: Railway cobra después, pero escalas sin reescritura.

---

**Documento de referencia:** Este archivo será tu guía paso a paso.  
**Responsable:** Codex ejecuta, Claude revisa.  
**Tiempo:** 1-2 días (puede hacerse en paralelo).

¿Listo para ejecutar Fase 0.5? 🚀

