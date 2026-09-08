# ✅ FASE 1: AUTENTICACIÓN Y RBAC

**Versión:** 1.0  
**Estado:** EN DESARROLLO  
**Duración estimada:** 2-3 días  
**Responsable:** Claude + Codex (paralelo)

---

## 🎯 OBJETIVO

Implementar autenticación segura con NextAuth.js y RBAC (Role-Based Access Control) para proteger la aplicación.

---

## ✅ CHECKLIST FASE 1

### 1. NextAuth Configuration (Frontend)
- [ ] Instalar next-auth@4.24.0
- [ ] Crear `src/lib/auth.ts` con configuración
- [ ] Crear `app/api/auth/[...nextauth]/route.ts`
- [ ] Configurar provider (Credentials por ahora)

### 2. Login/Logout UI
- [ ] ✅ Crear página `/login` (HECHO)
- [ ] ✅ Actualizar Header con logo (HECHO)
- [ ] Agregar link "Logout" en Header (después de login)
- [ ] Crear página `/register` (básica)
- [ ] Redirigir a login si no autenticado

### 3. Backend Authentication
- [ ] Crear endpoint `POST /api/auth/login`
- [ ] Crear endpoint `POST /api/auth/register`
- [ ] Crear endpoint `POST /api/auth/verify`
- [ ] Generar JWT tokens
- [ ] Validar tokens en middleware

### 4. RBAC - Roles y Permisos
- [ ] Crear enum de roles: ADMIN, MANAGER, DRIVER, VIEWER
- [ ] Agregar `role` a modelo User en Prisma
- [ ] Crear middleware de autenticación
- [ ] Proteger endpoints por rol

### 5. Protected Routes
- [ ] Proteger `/dashboard`
- [ ] Proteger `/assets`
- [ ] Proteger `/trips`
- [ ] Proteger `/reports`
- [ ] Proteger endpoints del backend

### 6. Tests
- [ ] Test login flow
- [ ] Test token validation
- [ ] Test role-based access
- [ ] Test logout

### 7. Documentación
- [ ] Actualizar README con instrucciones de setup
- [ ] Documentar API de autenticación
- [ ] Crear guía de RBAC

---

## 📊 ARQUITECTURA DE AUTENTICACIÓN

```
┌─────────────────────────────────┐
│    Frontend (Next.js)           │
│  ┌─────────────────────────┐    │
│  │   Login Page            │    │
│  │  - Email + Password     │    │
│  │  - NextAuth signIn()    │    │
│  └─────────────────────────┘    │
│            ↓                    │
│  ┌─────────────────────────┐    │
│  │   Session Management    │    │
│  │  - useSession()         │    │
│  │  - Protected Routes     │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
            ↓
┌─────────────────────────────────┐
│    Backend (Express)            │
│  ┌─────────────────────────┐    │
│  │   POST /auth/login      │    │
│  │  - Validate credentials │    │
│  │  - Generate JWT token   │    │
│  │  - Return token         │    │
│  └─────────────────────────┘    │
│            ↓                    │
│  ┌─────────────────────────┐    │
│  │   JWT Verification      │    │
│  │  - Middleware           │    │
│  │  - Extract role         │    │
│  │  - Check permissions    │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

---

## 🔐 SEGURIDAD

✅ JWT tokens con expiration
✅ Contraseñas hasheadas (bcrypt)
✅ HTTPS en producción
✅ CORS configurado
✅ RBAC en endpoints críticos
✅ Audit logging de login/logout

---

## 📝 USUARIO DE DEMO

Para testing:

```
Email: demo@kleber.app
Password: Demo123!@
Role: ADMIN
```

---

## 🚀 PRÓXIMA FASE

**Fase 2: MVP Viajes**
- CRUD completo para Trips
- Integración frontend-backend
- Validaciones completas

