# ✅ FASE 0.5: CHECKLIST PARA CODEX

**Versión:** 1.0  
**Estado:** LISTO PARA EJECUTAR  
**Responsable:** Codex  
**Duración:** 1-2 días  

---

## 🎯 OBJETIVO

Tener un **repositorio funcional con deploy automático** en 1-2 días.

```
Día 1: GitHub + Next.js + Express + Supabase (local)
Día 2: Vercel + Railway + GitHub Actions (cloud)
```

---

## 📋 PREPARACIÓN (ANTES DE EMPEZAR)

### Decide cuenta para servicios externos

Elige correo para Vercel, Railway, Supabase:

```
Opción A: kleber.dev@gmail.com
Opción B: kleber.platform@email.com
Opción C: proyecto.kleber@mail.com
Opción D: Otro: ___________
```

**Guardar en:** Gestor de contraseñas (1Password, Bitwarden, etc)

### Verifica que tienes

- [ ] Git instalado (`git --version`)
- [ ] Node.js 20 LTS (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] pnpm instalado (`npm install -g pnpm`)
- [ ] Tu usuario GitHub con permisos

---

## ✅ CHECKLIST FASE 0.5

### PASO 1: GitHub Repository (30 min)

```
URL de referencia: FASE_0.5_SETUP_REPOSITORIO.md (Paso 1)

□ Acceder a https://github.com/new
□ Nombre: kleber-erp
□ Descripción: ERP modular para gestión de transportes
□ Visibilidad: PUBLIC
□ Initialize with:
  □ gitignore: Node.js
  □ License: MIT
  □ NO README
□ Click "Create repository"
□ Clonar localmente: git clone https://github.com/[user]/kleber-erp.git
□ Verificar: cd kleber-erp && git log (debe estar vacío)

RESULTADO: Repositorio vacío en GitHub
```

---

### PASO 2: Monorepo Structure (20 min)

```
URL de referencia: FASE_0.5_SETUP_REPOSITORIO.md (Paso 2)

□ Crear carpetas:
  □ mkdir -p apps/frontend apps/backend packages/shared
  □ mkdir -p docs decisions guides structure .github/workflows

□ Copiar documentación:
  □ cp -r [ruta-anterior]/docs ./
  □ cp -r [ruta-anterior]/decisions ./
  □ cp -r [ruta-anterior]/guides ./
  □ cp [ruta-anterior]/README.md .
  □ cp [ruta-anterior]/CLAUDE.md .
  □ cp [ruta-anterior]/CODEX.md .

□ Crear pnpm-workspace.yaml (ver archivo de referencia)

□ Crear package.json raíz (ver archivo de referencia)

RESULTADO: Estructura monorepo lista
```

---

### PASO 3: Frontend - Next.js (45 min)

```
URL de referencia: FASE_0.5_SETUP_REPOSITORIO.md (Paso 3)

□ cd apps/frontend
□ npx create-next-app@latest . --typescript --tailwind --eslint --app
□ Responder prompts:
  □ TypeScript: Yes
  □ ESLint: Yes
  □ Tailwind: Yes
  □ App Router: Yes

□ Crear .env.local:
  NEXT_PUBLIC_API_URL=http://localhost:3001
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=dev_secret_change_in_prod

□ Test local:
  □ npm run dev
  □ Verificar http://localhost:3000 funciona
  □ Ctrl+C para detener

RESULTADO: Next.js corriendo en localhost:3000
```

---

### PASO 4: Backend - Express (45 min)

```
URL de referencia: FASE_0.5_SETUP_REPOSITORIO.md (Paso 4)

□ cd ../../apps/backend
□ Crear package.json (ver archivo de referencia)
□ npm install

□ Crear estructura:
  □ mkdir -p src/routes src/controllers src/services src/middleware
  □ Crear src/index.ts (ver archivo de referencia)

□ Crear .env.local:
  DATABASE_URL=postgresql://user:password@localhost:5432/kleber_local
  NODE_ENV=development
  PORT=3001
  FRONTEND_URL=http://localhost:3000

□ Test local:
  □ npm run dev
  □ Verificar http://localhost:3001/api/health retorna JSON
  □ Ctrl+C para detener

RESULTADO: Express corriendo en localhost:3001
```

---

### PASO 5: Supabase Setup (30 min)

```
URL de referencia: FASE_0.5_SETUP_REPOSITORIO.md (Paso 5)

NOTA: Hacer en navegador, NO en terminal

□ Ir a https://supabase.com
□ Sign up con [correo secundario]
□ Verificar email
□ Dashboard → New project
  □ Name: kleber-erp-dev
  □ Region: US-East (o más cercano)
  □ Password: [generar fuerte, guardar]
  □ Create project (esperar 2-3 minutos)

□ Una vez listo:
  □ Settings → Database
  □ Copiar "Connection string" (URI format)
  □ Actualizar apps/backend/.env.local:
    DATABASE_URL=[string copiado]

□ Crear Prisma schema:
  □ cd ../../apps/backend
  □ npx prisma init
  □ Editar prisma/schema.prisma (ver archivo de referencia)
  □ npx prisma generate
  □ npx prisma migrate dev --name init

□ Verificar en Supabase dashboard:
  □ Debe aparecer tabla "organizations"

RESULTADO: Database conectado y sincronizado
```

---

### PASO 6: GitHub Actions (30 min)

```
URL de referencia: FASE_0.5_SETUP_REPOSITORIO.md (Paso 6)

□ En raíz del proyecto:
  □ mkdir -p .github/workflows
  
□ Crear .github/workflows/test.yml (ver archivo de referencia)

□ Commit y push:
  □ git add .
  □ git commit -m "chore: Initialize monorepo..."
  □ git push origin main

□ Verificar en GitHub:
  □ Ir a repo → Actions
  □ Debe mostrar workflow ejecutándose
  □ Esperar que termine (debe pasar)

RESULTADO: CI/CD funcionando en GitHub
```

---

### PASO 7: Vercel Deploy - Frontend (15 min)

```
URL de referencia: FASE_0.5_SETUP_REPOSITORIO.md (Paso 8)

NOTA: Hacer en navegador

□ Ir a https://vercel.com
□ Sign up → GitHub
□ Autorizar con GitHub personal
□ Crear team: "Kleber" (recomendado)

□ Dashboard → Add New Project
  □ Seleccionar: kleber-erp
  □ Framework: Next.js
  □ Root directory: apps/frontend
  □ Environment variables:
    □ NEXT_PUBLIC_API_URL=http://localhost:3001
  □ Deploy

□ Esperar a que termine
□ Copiar URL (ej: https://kleber-erp.vercel.app)

RESULTADO: Frontend en vivo en Vercel
```

---

### PASO 8: Railway Deploy - Backend (20 min)

```
URL de referencia: FASE_0.5_SETUP_REPOSITORIO.md (Paso 9)

NOTA: Hacer en navegador

□ Ir a https://railway.app
□ Sign up → GitHub
□ Autorizar con GitHub personal

□ Dashboard → New Project
  □ Deploy from GitHub repo
  □ Seleccionar: kleber-erp
  □ Configure:
    □ Root directory: apps/backend
    □ Build: npm run build
    □ Start: npm run start

□ Add environment variables:
  □ DATABASE_URL=[copiar de Supabase]
  □ PORT=3001

□ Deploy
□ Esperar a que termine
□ Copiar URL (ej: https://kleber-erp-api.railway.app)

RESULTADO: Backend en vivo en Railway
```

---

### PASO 9: Validación Final (15 min)

```
URL de referencia: FASE_0.5_SETUP_REPOSITORIO.md (Paso 10)

□ Test endpoints:
  □ curl https://[backend-url]/api/health
  □ Debe retornar JSON con {"status":"ok",...}

□ Test frontend:
  □ Abrir https://[frontend-url] en navegador
  □ Debe mostrar página de Next.js

□ Verificar GitHub:
  □ Ver commits
  □ Ver Actions completados exitosamente

□ Verificar Supabase:
  □ Dashboard → Database
  □ Debe haber tablas creadas

□ Verificar Vercel:
  □ Dashboard → debe mostrar proyecto deployado

□ Verificar Railway:
  □ Dashboard → debe mostrar proyecto deployado

RESULTADO: Sistema 100% funcional end-to-end
```

---

## 📝 PRIMER COMMIT MESSAGE

```
chore: Initialize monorepo with Next.js, Express, Supabase

- Setup pnpm workspaces with apps/ and packages/
- Create frontend with Next.js 14 + TypeScript + Tailwind CSS
- Create backend with Express.js + TypeScript + Prisma ORM
- Create shared package for types and utilities
- Initialize Prisma schema with Organization model
- Add .env examples for local development
- Add GitHub Actions workflow for testing
- Include all documentation and guides
- Setup .gitignore for Node.js projects

Refs: PHASE_0.5
```

---

## 🚨 TROUBLESHOOTING COMÚN

### "npm install no funciona"
```
Solución:
1. Eliminar node_modules: rm -rf node_modules
2. Limpiar cache: npm cache clean --force
3. Reinstalar: npm install
4. Si aún falla, usar: pnpm install
```

### "Supabase dice "Invalid Connection String""
```
Solución:
1. Ir a Supabase → Settings → Database
2. Copiar nuevamente la URI
3. Asegurarse que NO tiene espacios extra
4. Probar con: psql [uri]
```

### "Vercel deployment falla"
```
Solución:
1. Revisar logs en Vercel → Deployments
2. Usualmente es variable de entorno faltante
3. Agregar en Vercel → Settings → Environment Variables
4. Reintentar deploy
```

### "Railway dice "can't connect to database""
```
Solución:
1. Supabase debe estar ACTIVO (no hibernado)
2. DATABASE_URL debe ser correcta
3. Revisar Railway → Logs para ver error específico
4. Puede tardar 1-2 minutos en conectar
```

### "GitHub Actions falla en tests"
```
Solución:
1. Revisar qué test específicamente falla
2. Leer logs completos en GitHub → Actions
3. Usualmente es por dependencia faltante
4. Agregar a package.json y reintentar
```

---

## ⏰ TIMELINE RECOMENDADO

### Día 1 (4-5 horas)
- [x] Pasos 1-4 (GitHub + Frontend + Backend)
- [x] Test local (ambas apps corriendo)
- [x] Primer commit + push
- [x] GitHub Actions ejecutándose

### Día 2 (3-4 horas)
- [x] Paso 5 (Supabase setup)
- [x] Pasos 7-8 (Vercel + Railway)
- [x] Validación end-to-end
- [x] Documentación actualizada

---

## 📞 PUNTOS DE CONTACTO

### Si algo no funciona
- [ ] Revisar `FASE_0.5_SETUP_REPOSITORIO.md` (paso específico)
- [ ] Revisar troubleshooting (arriba)
- [ ] Avisar a Claude con screenshot del error
- [ ] NO reintentar 10 veces (va a ser lo mismo)

### Si necesitas cambiar algo
- [ ] Revisar `ADR-001_TECH_STACK.md`
- [ ] Si es decisión grande, crear ADR nueva
- [ ] Si es pequeño, solo documentar en commit

---

## ✅ DEFINICIÓN DE "COMPLETO"

Fase 0.5 está **100% completa** cuando:

```
✅ Repositorio en GitHub personal (público)
✅ Frontend corriendo en https://[vercel-url]
✅ Backend corriendo en https://[railway-url]
✅ Database conectada a Supabase
✅ GitHub Actions pasa todos los tests
✅ Todos los commits están pusheados
✅ Documentación está actualizada
✅ URLs públicas son estables
✅ Health check endpoint retorna JSON
```

---

## 📊 ESTADO POST-FASE 0.5

Tendrás:

```
✅ GitHub personal: kleber-erp (tu portafolio)
✅ Frontend: Vercel (https://kleber-erp.vercel.app)
✅ Backend: Railway (https://kleber-erp-api.railway.app)
✅ Database: Supabase (PostgreSQL 500MB)
✅ CI/CD: GitHub Actions (tests automáticos)
✅ Documentación: Completa en repo
✅ Monorepo: Pnpm workspaces funcionando
✅ Costos: $0 (todos free tiers)
```

---

## 🎯 PRÓXIMO PASO: FASE 1

Una vez Fase 0.5 completada:

```
⏳ Fase 1: Autenticación (NextAuth + RBAC)
   - Login/logout UI
   - JWT tokens
   - Roles y permisos
   - Tests
   
   Duración: 2-3 días
```

---

## ❓ DUDAS?

Revisar en orden:
1. Este archivo (FASE_0.5_CHECKLIST_CODEX.md)
2. `FASE_0.5_SETUP_REPOSITORIO.md`
3. `ADR-001_TECH_STACK.md`
4. Avisar a Claude

---

**¡A EJECUTAR! 🚀**

Fecha inicio: [Hoy]  
Fecha estimada terminación: [Hoy + 2 días]  
Responsable: Codex  
Supervisor: Claude

