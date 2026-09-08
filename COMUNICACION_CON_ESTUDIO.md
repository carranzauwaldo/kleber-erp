# 📞 COMUNICACIÓN CON EL ESTUDIO — Cuándo avisar y qué decir

**Versión:** 1.0  
**Propósito:** Clarificar qué requiere aprobación del estudio y qué NO  
**Actualizado:** 2026-09-07

---

## 🎯 REGLA GENERAL

### ✅ NO necesita avisar (puedes proceder solo)

```
1. Desarrollo en local (tu máquina)
2. Commits en tu GitHub personal
3. Cuentas personales de servicios (Vercel, Railway, Supabase)
4. Decisiones técnicas ya documentadas en ADRs
5. Cambios menores de código
6. Tests locales
7. Documentación y guías
```

### ⚠️ SÍ necesita avisar (coordinar primero)

```
1. Costos incurridos (cualquier monto)
2. Cambios arquitectónicos MAYORES (no en plan)
3. Credenciales compartidas con el estudio
4. MVP listo para usuarios REALES
5. Cambios en presupuesto o timeline
6. Nuevas dependencias de pago
```

---

## 📋 MATRIZ DE DECISIONES

### FASE 0.5 (Setup Repositorio)

| Acción | ¿Avisar? | Por qué |
|--------|----------|---------|
| Crear GitHub personal | ❌ NO | Tu portafolio |
| Crear Vercel account | ❌ NO | Gratis, personal |
| Crear Railway account | ❌ NO | Gratis, personal |
| Crear Supabase account | ❌ NO | Gratis, personal |
| Deploy frontend | ❌ NO | Automático, gratis |
| Deploy backend | ❌ NO | Automático, gratis |
| Ejecutar tests | ❌ NO | Local, gratis |
| Primer push a main | ❌ NO | Ya visto, aprobado |

**Conclusión:** Fase 0.5 se hace **COMPLETA SIN AVISAR**

---

### FASE 1 (Autenticación)

| Acción | ¿Avisar? | Por qué |
|--------|----------|---------|
| Setup NextAuth | ❌ NO | Ya en plan |
| Crear login/logout | ❌ NO | MVP core |
| Implementar RBAC | ❌ NO | Requisito charter |
| Tests de auth | ❌ NO | Standard |
| Si todo funciona | ⏳ INFORMAR | Estado de progress |

**Conclusión:** Fase 1 se hace **SIN AVISAR**, pero **informas cuando termina**

---

### FASE 2 (MVP Viajes)

| Acción | ¿Avisar? | Por qué |
|--------|----------|---------|
| Crear modelos Prisma | ❌ NO | Ya en plan |
| Endpoints API | ❌ NO | Desarrollo normal |
| Frontend CRUD | ❌ NO | Desarrollo normal |
| Tests integración | ❌ NO | Standard |
| **Si está listo para usuarios reales** | ✅ SÍ | Cambio de estado |

**Conclusión:** Fase 2 se hace **SIN AVISAR**, pero **sí avisar cuando MVP está LISTO para producción**

---

## 📧 CUÁNDO Y QUÉ COMUNICAR

### COMUNICACIÓN 0: Ahora (Fase 0.5 iniciada)

**Cuándo:** Antes de crear el repo

**A quién:** Contacto en el estudio

**Mensaje:**

```
Hola [Nombre],

Iniciamos Fase 0.5 de KLEBER ERP (setup del repositorio).

📋 Plan:
- Crear repositorio en GitHub personal (portafolio)
- Setup frontend (Next.js), backend (Express), database (Supabase)
- Tests automáticos con GitHub Actions
- Deploy a Vercel + Railway (ambos gratis)

💰 Costos: $0 (todos free tiers)

📅 Timeline: 1-2 días

No requiere intervención del estudio. Aviso cuando Fase 0.5 esté completa.

---
Saludos,
[Tu nombre]
```

---

### COMUNICACIÓN 1: Fase 0.5 completada

**Cuándo:** Después que todo funcione en Vercel + Railway

**A quién:** Mismo contacto

**Mensaje:**

```
Hola [Nombre],

✅ Fase 0.5 completada: Repositorio y infraestructura lista.

🎯 Hitos logrados:
- Repositorio: github.com/tu-usuario/kleber-erp
- Frontend: https://kleber-erp.vercel.app (Next.js en Vercel)
- Backend: https://kleber-erp-api.railway.app (Express en Railway)
- Database: Supabase PostgreSQL (500MB, backups automáticos)
- CI/CD: GitHub Actions (tests automáticos en cada push)

📊 Estructura:
- Monorepo con pnpm workspaces
- Frontend + Backend sincronizados
- Documentación completa
- Código en tu GitHub personal

💰 Costos acumulados: $0

📅 Próximo: Fase 1 (Autenticación NextAuth + RBAC)

Cualquier pregunta, aviso.

---
Saludos,
[Tu nombre]
```

---

### COMUNICACIÓN 2: MVP completo y listo

**Cuándo:** Cuando Fase 2 esté 100% y listo para usuarios reales

**A quién:** Mismo contacto (posiblemente escalable)

**Mensaje:**

```
Hola [Nombre],

✅ MVP KLEBER ERP COMPLETADO Y LISTO PARA PRODUCCIÓN.

📋 Funcionalidades:
- Autenticación segura (NextAuth + RBAC)
- Gestión de viajes (CRUD)
- Gestión de activos
- Gastos operativos básicos
- Reportes iniciales
- Auditoría completa

🔒 Seguridad:
- Autenticación JWT
- RBAC con permisos
- Validación server-side
- Datos encriptados en tránsito (HTTPS)

📊 Infraestructura:
- Frontend: Vercel (Uptime 99.9%)
- Backend: Railway
- Database: Supabase (backups automáticos)
- Monitoreo: GitHub Actions + Sentry

💰 Costos mensuales: $0-5 (Railway $5/mes si es necesario)

📈 Escalabilidad: Preparada para millones de registros

🚀 Listo para:
- [ ] Piloto controlado con KLEBER
- [ ] Integración Mora Mora (próxima fase)
- [ ] Usuarios reales

¿Confirmamos entrada a producción?

---
Saludos,
[Tu nombre]
```

---

## ⚠️ CASOS ESPECIALES (SÍ AVISAR)

### Caso 1: "Necesito cambiar la arquitectura"

**Si:** Pasar de monorepo a microservicios (por ejemplo)

**Aviso obligatorio:**
```
Necesito cambiar arquitectura porque [razón técnica sólida].

Impacto:
- Reescritura: [estimación horas]
- Costos: [si hay]
- Timeline: [nuevo timeline]
- Riesgo: [alto/medio/bajo]

Alternativa considerada: [explica por qué no]

Recomendación: [qué debería hacer]
```

---

### Caso 2: "Se me acabó el crédito de Railway"

**Si:** Railway cobra más de lo esperado

**Aviso obligatorio:**
```
Aviso: Crédito Railway se está agotando por [razón].

Opciones:
1. Cambiar a Render (gratis, más lento)
2. Pagar Railway ($10-20/mes)
3. Reducir recursos backend

Recomendación: [tu sugerencia]
```

---

### Caso 3: "Necesito hacer un cambio en prisma/schema"

**Si:** Cambiar modelo de datos SIGNIFICATIVAMENTE (NO cambios menores)

**SÍ avisar si:**
- Afecta cómo se almacenan datos financieros
- Requiere migración compleja
- Puede causar data loss

**NO avisar si:**
- Es agregar columnas nuevas
- Es cambios menores documentados
- Es refactor interno

---

### Caso 4: "Los tests están fallando"

**SÍ avisar si:**
- Falla algo de seguridad (auth, permisos)
- Falla algo financiero (cálculos, conciliación)

**NO avisar si:**
- Test de UI que falla
- Mock que necesita actualizar
- Librería que cambió versión

---

## 🚨 COMUNICACIÓN DE EMERGENCIA

Si ocurre algo inesperado:

```
URGENTE: [Problema específico]

Situación:
- [Qué pasó]
- [Cuándo]
- [Impacto actual]

Ya hicimos:
- [Soluciones intentadas]
- [Resultados]

Necesitamos:
- [ ] Aprobación para [acción]
- [ ] Contacto con [persona]
- [ ] Presupuesto extra
```

---

## 📅 SCHEDULE DE COMUNICACIONES PLANEADAS

### Semanal (automático)

Cada viernes al mediodía:
- Email breve con estado
- Líneas de código agregadas
- Próximas tareas de la semana
- Cualquier bloqueador

**Formato:**

```
KLEBER ERP — Status Semanal [Semana X]

✅ Logrado esta semana:
- Tarea 1
- Tarea 2

🔄 En progreso:
- Tarea 3

📅 Próxima semana:
- Tarea 4
- Tarea 5

🚨 Bloqueadores:
- Ninguno
```

---

### Al completar cada FASE

- Fase 0 completada → Comunicación (ya se hizo)
- Fase 0.5 completada → Comunicación 1 (después de 2 días)
- Fase 1 completada → Email breve
- Fase 2 completada → Comunicación 2 (Listo para producción)

---

## 💡 TIPS PARA COMUNICAR BIEN

### ✅ HACER

```
"Se agregó autenticación JWT con NextAuth.js.
Funciona bien, todo testeado, listo para Fase 2."

"Decidimos usar Prisma como ORM. Motivo: type-safety
y migraciones automáticas. Documentado en ADR-001."

"Necesitamos $X por [razón]. Presupuesto aceptable?"
```

### ❌ EVITAR

```
"No sé qué pasó, falló algo."
→ Aclara qué, dónde, por qué

"Cambié todo al patrón X por vaguadas."
→ Explica decisión, documenta

"¿Cuánto me das de presupuesto?"
→ Propón cantidad específica con justificación
```

---

## 🎯 RESUMEN: COMUNICACIÓN POR FASE

```
FASE 0.5 (Setup):
  Antes:      Avisa que empieza
  Durante:    Sin contacto
  Después:    Env email con resultado

FASE 1 (Auth):
  Antes:      Sin avisar (ya planeado)
  Durante:    Sin contacto (a menos que haya bloqueo)
  Después:    Email breve "Fase 1 lista"

FASE 2 (MVP):
  Antes:      Sin avisar
  Durante:    Sin contacto normal (avisar bloqueadores)
  Después:    Comunicación formal: "MVP listo para producción"

FASE 3+ (Integración Mora Mora):
  Antes:      Confirmar antes de empezar
  Durante:    Status semanal
  Después:    Validación con stakeholders
```

---

## ✅ COMUNICACIÓN FASE 0.5 LISTA PARA ENVIAR

Puedes usar este template AHORA:

```
Asunto: KLEBER ERP - Iniciando Fase 0.5 (Setup Repositorio)

Cuerpo:

Hola [Nombre del contacto],

Le escribo para avisar que iniciamos Fase 0.5 de KLEBER ERP.

📋 QUÉ SE HARÁ:
- Crear repositorio GitHub (portafolio personal)
- Setup monorepo con frontend (Next.js) + backend (Express)
- Conectar database Supabase (gratis, 500MB)
- Deploy automático a Vercel (frontend) y Railway (backend)
- Configurar CI/CD con GitHub Actions

⏱️ TIMELINE: 1-2 días

💰 COSTOS: $0 (todos servicios con free tier)

🔐 SEGURIDAD: Credenciales propias, código versionado

📊 ENTREGA: Repositorio funcional con deploy automático

El estudio no requiere intervención. Aviso cuando esté listo.

Cualquier pregunta, me avisa.

Saludos,
[Tu nombre]
```

---

**Documento de referencia:** Usa esto cada vez que quieras comunicar.  
**Actualización:** Modifica según necesidad.  
**Confidencialidad:** Esta información es del proyecto KLEBER.

