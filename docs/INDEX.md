# Índice de Documentación — KLEVER ERP

**Versión:** 0.1  
**Última actualización:** 2026-09-07  
**Estado:** Fase 0 — Fundaciones

---

## 🎯 Empezar aquí

1. **Para entender el proyecto:** [`00_foundation/00_PROJECT_CHARTER.md`](#00_foundation)
2. **Para ver el roadmap:** [`01_scope/01_SCOPE_AND_ROADMAP.md`](#01_scope)
3. **Para entender la arquitectura:** [`02_architecture/02_ARCHITECTURE.md`](#02_architecture)
4. **Para desarrollar:** [`../CLAUDE.md`](../CLAUDE.md) o [`../CODEX.md`](../CODEX.md)

---

## 📑 Documentación por sección

### 00_foundation — Fundación
**Propósito:** Visión, principios, contexto empresarial

| Documento | Propósito | Para quién |
|-----------|-----------|-----------|
| [`00_PROJECT_CHARTER.md`](00_foundation/00_PROJECT_CHARTER.md) | Visión, propósito, principios no negociables | Todos — lectura obligatoria |
| | | |

---

### 01_scope — Alcance y roadmap
**Propósito:** Qué se construirá, en qué orden, límites del MVP

| Documento | Propósito | Para quién |
|-----------|-----------|-----------|
| [`01_SCOPE_AND_ROADMAP.md`](01_scope/01_SCOPE_AND_ROADMAP.md) | MVP, fases, prioridades, orden de construcción | Developers, PMs, stakeholders |
| [`11_EXECUTION_BACKLOG.md`](01_scope/11_EXECUTION_BACKLOG.md) | Backlog inicial con criterios de aceptación | Developers, project managers |

---

### 02_architecture — Arquitectura técnica
**Propósito:** Cómo está estructurado el sistema, módulos, datos, APIs

| Documento | Propósito | Para quién |
|-----------|-----------|-----------|
| [`02_ARCHITECTURE.md`](02_architecture/02_ARCHITECTURE.md) | Módulos, capas, comunicación, principios | Architects, developers |
| [`03_DATABASE.md`](02_architecture/03_DATABASE.md) | Modelo de datos, convenciones, integridad | Backend developers, DBAs |
| [`04_API_AND_INTEGRATIONS.md`](02_architecture/04_API_AND_INTEGRATIONS.md) | Contratos de API, Mora Mora integration | Backend developers, integrations |

---

### 03_infrastructure — Operación y despliegue
**Propósito:** Infraestructura, seguridad, despliegue, observabilidad, costos

| Documento | Propósito | Para quién |
|-----------|-----------|-----------|
| [`05_SECURITY.md`](03_infrastructure/05_SECURITY.md) | Seguridad, RBAC, auditoría, compliance | Architects, security reviewers |
| [`06_INFRASTRUCTURE_AND_DEPLOYMENT.md`](03_infrastructure/06_INFRASTRUCTURE_AND_DEPLOYMENT.md) | Infraestructura, ambientes, deployment | DevOps, developers |
| [`07_COST_OPTIMIZATION.md`](03_infrastructure/07_COST_OPTIMIZATION.md) | Estrategia de costos, free tiers, scaling | Architects, stakeholders |

---

### 04_standards — Estándares y procesos
**Propósito:** Cómo trabajar juntos, estándares de código, workflows

| Documento | Propósito | Para quién |
|-----------|-----------|-----------|
| [`08_AI_AGENTS_AND_DEVELOPMENT_WORKFLOW.md`](04_standards/08_AI_AGENTS_AND_DEVELOPMENT_WORKFLOW.md) | Workflow Codex + Claude en paralelo | Developers, project managers |
| [`09_CODING_AND_TESTING_STANDARDS.md`](04_standards/09_CODING_AND_TESTING_STANDARDS.md) | Estándares de código, testing, linting | All developers |

---

## 📖 Guías prácticas

Ubicación: `../guides/`

| Documento | Propósito | Para quién |
|-----------|-----------|-----------|
| [`../guides/development/DEVELOPMENT_GUIDE.md`](../guides/development/DEVELOPMENT_GUIDE.md) | Cómo desarrollar, estructura de módulos, testing | Developers |
| [`../guides/git-workflow/GIT_WORKFLOW_GUIDE.md`](../guides/git-workflow/GIT_WORKFLOW_GUIDE.md) | Git workflow, branches, PRs, coordinación | All developers |
| [`../guides/api-design/API_DESIGN_GUIDE.md`](../guides/api-design/API_DESIGN_GUIDE.md) | Diseño de APIs, endpoints, responses | Backend developers |

---

## 🔍 Decisiones arquitectónicas

Ubicación: `../decisions/`

| Documento | Estado | Propósito |
|-----------|--------|-----------|
| [`../decisions/000_ADR_TEMPLATE.md`](../decisions/000_ADR_TEMPLATE.md) | Template | Cómo documentar decisiones |
| [`../decisions/ADR-001_TECH_STACK.md`](../decisions/ADR-001_TECH_STACK.md) | Por completar | Tech stack (backend, frontend, DB, hosting) |
| [`../decisions/CURRENT_WORK.md`](../decisions/CURRENT_WORK.md) | Activo | Estado actual de trabajo Codex + Claude |

---

## 🚀 Instrucciones por rol

| Rol | Documento | Contenido |
|-----|-----------|----------|
| **Claude** | [`../CLAUDE.md`](../CLAUDE.md) | Instrucciones específicas, alcance, estándares |
| **Codex** | [`../CODEX.md`](../CODEX.md) | Instrucciones específicas, dominio, responsabilidades |
| **Project Manager** | [Este índice + 00_PROJECT_CHARTER + 01_SCOPE] | Visión y roadmap |
| **Architect** | [02_ARCHITECTURE + decisions/] | Diseño del sistema y decisiones |
| **DevOps/Infra** | [03_infrastructure + 06_INFRASTRUCTURE_AND_DEPLOYMENT] | Infraestructura y deployment |

---

## 📊 Matriz de lectura recomendada

### Lectura obligatoria (para todos)
- [ ] `00_PROJECT_CHARTER.md` — 20 min

### Lectura por rol

**Developers (Codex/Claude)**
- [ ] `02_ARCHITECTURE.md` — 30 min
- [ ] Tu archivo (`CLAUDE.md` o `CODEX.md`) — 20 min
- [ ] `guides/development/DEVELOPMENT_GUIDE.md` — 30 min
- [ ] `guides/git-workflow/GIT_WORKFLOW_GUIDE.md` — 20 min

**Architects**
- [ ] `02_ARCHITECTURE.md` — 45 min
- [ ] `03_DATABASE.md` — 30 min
- [ ] `04_API_AND_INTEGRATIONS.md` — 30 min
- [ ] `05_SECURITY.md` — 30 min

**Project Managers**
- [ ] `01_SCOPE_AND_ROADMAP.md` — 45 min
- [ ] `07_COST_OPTIMIZATION.md` — 20 min
- [ ] `decisions/CURRENT_WORK.md` — 10 min

---

## 🔗 Cómo navegar la documentación

### Por pregunta

**"¿Cuál es el objetivo del proyecto?"**
→ `00_PROJECT_CHARTER.md` sección 1-3

**"¿Qué se construye primero?"**
→ `01_SCOPE_AND_ROADMAP.md` sección 9 (orden de construcción)

**"¿Cómo estructuro un módulo?"**
→ `DEVELOPMENT_GUIDE.md` sección 5 + `structure/`

**"¿Qué tecnología usamos?"**
→ `decisions/ADR-001_TECH_STACK.md` (por confirmar)

**"¿Cómo hago PR?"**
→ `guides/git-workflow/GIT_WORKFLOW_GUIDE.md` sección 6

**"¿Qué permisos necesito para cada operación?"**
→ `05_SECURITY.md` + `decisions/KLB-005_USERS_ROLES_PERMISSIONS.md`

**"¿Cómo diseño una API?"**
→ `guides/api-design/API_DESIGN_GUIDE.md`

---

## 📝 Cómo contribuir a la documentación

1. Edita el archivo relevante
2. Commit: `[DOCS] Update <filename> — reason`
3. Abre PR
4. Después de aprobación, mergea

Si documenten una **decisión arquitectónica nueva**, crea ADR:
1. Copia `decisions/000_ADR_TEMPLATE.md`
2. Completa con número (`ADR-NNN_Title.md`)
3. Commit y PR

---

## 🗂️ Estructura de archivos

```
docs/
├── 00_foundation/
│   └── 00_PROJECT_CHARTER.md
├── 01_scope/
│   ├── 01_SCOPE_AND_ROADMAP.md
│   └── 11_EXECUTION_BACKLOG.md
├── 02_architecture/
│   ├── 02_ARCHITECTURE.md
│   ├── 03_DATABASE.md
│   └── 04_API_AND_INTEGRATIONS.md
├── 03_infrastructure/
│   ├── 05_SECURITY.md
│   ├── 06_INFRASTRUCTURE_AND_DEPLOYMENT.md
│   └── 07_COST_OPTIMIZATION.md
├── 04_standards/
│   ├── 08_AI_AGENTS_AND_DEVELOPMENT_WORKFLOW.md
│   └── 09_CODING_AND_TESTING_STANDARDS.md
└── INDEX.md (este archivo)

decisions/
├── 000_ADR_TEMPLATE.md
├── ADR-001_TECH_STACK.md
├── KLB-002_INFRASTRUCTURE_PROVIDER_COMPARISON.md
├── KLB-003_DEPLOYMENT_OPTIONS_AND_ENVIRONMENT_STRATEGY.md
├── KLB-004_INITIAL_ASSET_AND_MASTER_DATA_INTAKE_SPECIFICATION.md
├── KLB-005_INITIAL_USERS_ROLES_AND_PERMISSION_MATRIX.md
└── CURRENT_WORK.md

guides/
├── development/
│   └── DEVELOPMENT_GUIDE.md
├── git-workflow/
│   └── GIT_WORKFLOW_GUIDE.md
└── api-design/
    └── API_DESIGN_GUIDE.md
```

---

## 🔄 Actualizaciones frecuentes

Estos documentos cambian frecuentemente:
- `decisions/CURRENT_WORK.md` — Estado actual (diariamente)
- `decisions/ADR-*.md` — Nuevas decisiones (cuando sea necesario)

Estos son relativamente estables:
- `00_PROJECT_CHARTER.md` — Principios (raras veces)
- `02_ARCHITECTURE.md` — Solo si hay rediseño
- `guides/` — Cuando los procesos cambian

---

## 📞 Preguntas?

- **Pregunta técnica:** Abre issue en GitHub
- **Decisión arquitectónica:** Crea ADR en `decisions/`
- **Mejora de documentación:** Propón cambio en PR
- **Urgente:** Contacta al equipo directamente

---

**Última actualización:** 2026-09-07  
**Próxima revisión:** 2026-09-08 (post-stack-decision)

