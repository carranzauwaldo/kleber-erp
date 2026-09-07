# Trabajo Activo — Coordinación Codex + Claude

**Última actualización:** 2026-09-07  
**Próxima revisión:** Diaria

---

## Estado general

| Aspecto | Estado | Notas |
|---------|--------|-------|
| Fase actual | **0 — Fundaciones** | Documentación y estructura |
| Stack técnico | **POR CONFIRMAR** | Aguardando decisiones 5 categorías |
| Bloqueadores | Ninguno por ahora | Depende de stack decision |
| Riesgo | BAJO | Todo es documentación, no código funcional |

---

## Trabajo de Claude

| Elemento | Rama | Estado | Plazo | Archivos |
|----------|------|--------|-------|----------|
| Estructura docs | N/A | ✅ Completado | - | `docs/`, `guides/` |
| Guías de desarrollo | N/A | ✅ Completado | - | `guides/development/` |
| Git workflow guide | N/A | ✅ Completado | - | `guides/git-workflow/` |
| Stack decision template | N/A | 🔄 En progreso | 2026-09-08 | `decisions/ADR-001_*.md` |
| README maestro | N/A | 🔄 En progreso | 2026-09-08 | `README.md` |

**Próximas tareas:**
- [ ] Crear template para módulos backend
- [ ] Crear template para módulos frontend
- [ ] Crear guía de API design
- [ ] Organizar documentos en índice maestro

---

## Trabajo de Codex

| Elemento | Rama | Estado | Plazo | Archivos |
|----------|------|--------|-------|----------|
| (Pendiente decisiones stack) | - | ⏸️ Waiting | - | - |

**Próximas tareas (post-stack-decision):**
- [ ] Setup inicial del repositorio (gitignore, etc.)
- [ ] Estructura de carpetas para backend
- [ ] Setup de base de datos
- [ ] Inicializar ORM/migrations

---

## Dependencias y coordinación

### Bloqueadores actuales
- 🔴 **Stack técnico definido** — Necesario antes de iniciar código
  - Backend: [A CONFIRMAR]
  - Frontend: [A CONFIRMAR]
  - Database: [A CONFIRMAR]
  - Hosting: [A CONFIRMAR]

### Puntos de coordinación esperados (post-stack)

| Archivo | Claude | Codex | Notas |
|---------|--------|-------|-------|
| `shared/domain/**` | Review | Implementación | Módulos pueden compartir value objects |
| `shared/types/**` | Coordinar | Coordinar | Tipos compartidas entre backend/frontend |
| `docs/` | Mantener | Contribuir | Documentación de cambios arquitectónicos |
| `.github/workflows/` | Review | Implementación | CI/CD pipeline |

---

## Ramas activas

```
Ninguna aún (fase de documentación)

Próximas (post-stack-decision):
- codex/01-repo-setup
- codex/02-db-schema
- claude/01-api-structure
- claude/02-frontend-setup
```

---

## Decisiones recientes

| Fecha | Decisión | Estado | Documento |
|-------|----------|--------|-----------|
| 2026-09-07 | Crear estructura docs + guides | ✅ Hecho | Sesión Claude |
| 2026-09-07 | Crear CLAUDE.md y CODEX.md | ✅ Hecho | Sesión Claude |
| (Pending) | Tech stack selection | ⏳ Pendiente | `decisions/ADR-001_*.md` |

---

## Métricas de progreso (Fase 0)

```
Documentación Base
├── ✅ Project Charter
├── ✅ Scope & Roadmap
├── ✅ Architecture
├── ✅ Database Design
├── ✅ Security
├── ✅ Infrastructure
├── ✅ Coding Standards
└── ✅ Workflows Guide

Guías de Desarrollo
├── ✅ Development Guide
├── ✅ Git Workflow
├── ✅ CLAUDE.md
├── ✅ CODEX.md
├── 🔄 ADR Template
├── 🔄 API Design Guide
├── 🔄 Module Templates
└── 🔄 Testing Guide

Stack & Setup
├── ⏳ Backend framework
├── ⏳ Frontend framework
├── ⏳ Database + Hosting
└── ⏳ CI/CD pipeline
```

---

## Comunicación

### Próxima reunión (sincronización)
**Fecha:** 2026-09-08  
**Temas:**
1. Confirmación de stack técnico (5 categorías)
2. Plan de implementación post-Fase-0
3. Ajustes a procesos/workflows si es necesario

### Canales
- 📧 Chat/Issues en GitHub — Asincrono
- 📅 Reuniones — Sincrónico si es necesario
- 📝 `decisions/CURRENT_WORK.md` — Fuente de verdad de estado

---

## Notas y observaciones

- La estructura de documentación está lista antes de código, evitando sobrearchitectura prematura.
- Una vez confirmado el stack, se pueden paralelizar tareas claramente.
- No hay conflictos previstos en documentación; ambos pueden contribuir sin coordinación estricta.
- El primer código será probablemente: setup, autenticación y modelo base de datos.

---

**Última actualización:** 2026-09-07 por Claude  
**Próxima actualización:** 2026-09-08 o cuando haya cambios significativos

