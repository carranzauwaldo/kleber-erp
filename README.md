# KLEBER ERP — Sistema empresarial modular para transportes

**Versión:** 0.1-alpha  
**Estado:** Fase 0 — Fundaciones  
**Última actualización:** 2026-09-07

---

## 📋 Índice rápido

- [¿Qué es KLEBER ERP?](#qué-es-kleber-erp)
- [Empezar](#empezar)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Stack técnico (por confirmar)](#stack-técnico-por-confirmar)
- [Documentación](#documentación)
- [Instrucciones por rol](#instrucciones-por-rol)
- [Git workflow](#git-workflow)
- [Comunicación y coordinación](#comunicación-y-coordinación)

---

## ¿Qué es KLEBER ERP?

KLEBER ERP es una plataforma empresarial modular diseñada para gestionar operaciones de transporte de materiales, flota, maquinaria y finanzas operativas.

**Objetivo:** Ayudar a empresas como KLEBER a registrar, conciliar y analizar viajes, activos, gastos y resultados financieros de forma confiable, auditable y escalable.

**Etapa actual:** Fase 0 (fundaciones y arquitectura). No hay código de negocio funcional aún.

### Características clave

✅ **Bajo costo:** Infraestructura gratuita/económica inicialmente  
✅ **Escalable:** Arquitectura lista para crecer  
✅ **Auditable:** Historial completo de operaciones  
✅ **Modular:** Módulos desacoplados, fácil de mantener  
✅ **SaaS-ready:** Preparado para multiempresa en el futuro  
✅ **Seguro:** Seguridad por diseño desde el inicio  

---

## Empezar

### Para desarrolladores (Fase 0)

**Lectura obligatoria (en este orden):**
1. [`docs/00_foundation/00_PROJECT_CHARTER.md`](docs/00_foundation/00_PROJECT_CHARTER.md) — Visión y principios
2. [`docs/02_architecture/02_ARCHITECTURE.md`](docs/02_architecture/02_ARCHITECTURE.md) — Módulos y límites
3. Tu guía según rol:
   - Si eres **Claude:** [`CLAUDE.md`](CLAUDE.md)
   - Si eres **Codex:** [`CODEX.md`](CODEX.md)

**Luego:**
- [`guides/development/DEVELOPMENT_GUIDE.md`](guides/development/DEVELOPMENT_GUIDE.md) — Cómo trabajar
- [`guides/git-workflow/GIT_WORKFLOW_GUIDE.md`](guides/git-workflow/GIT_WORKFLOW_GUIDE.md) — Flujo de branches

**Consultas rápidas:**
```bash
# Ver decisiones arquitectónicas
ls decisions/

# Ver documentación completa
ls docs/

# Ver guías disponibles
ls guides/
```

### Para stakeholders/coordinadores

**Lectura recomendada:**
1. [`docs/00_foundation/00_PROJECT_CHARTER.md`](docs/00_foundation/00_PROJECT_CHARTER.md) — Visión
2. [`docs/01_scope/01_SCOPE_AND_ROADMAP.md`](docs/01_scope/01_SCOPE_AND_ROADMAP.md) — Roadmap
3. [`docs/03_infrastructure/06_INFRASTRUCTURE_AND_DEPLOYMENT.md`](docs/03_infrastructure/06_INFRASTRUCTURE_AND_DEPLOYMENT.md) — Plan infraestructura
4. [`decisions/CURRENT_WORK.md`](decisions/CURRENT_WORK.md) — Estado actual

---

## Estructura del proyecto

```
klever-erp/
│
├── docs/                          # Documentación maestra
│   ├── 00_foundation/             # Charter, principios
│   ├── 01_scope/                  # Roadmap, requisitos
│   ├── 02_architecture/           # Arquitectura, datos, APIs
│   ├── 03_infrastructure/         # Infraestructura, seguridad, deploy
│   └── 04_standards/              # Estándares de código, testing
│
├── decisions/                     # Decisiones arquitectónicas (ADRs)
│   ├── 000_ADR_TEMPLATE.md       # Plantilla para nuevas decisiones
│   ├── ADR-001_TECH_STACK.md     # Stack técnico (por confirmar)
│   └── CURRENT_WORK.md           # Coordinación Codex + Claude
│
├── guides/                        # Guías prácticas
│   ├── development/              # Cómo desarrollar
│   ├── git-workflow/             # Flujo de branches
│   └── api-design/               # Diseño de APIs (por crear)
│
├── structure/                    # Plantillas y ejemplos
│   ├── backend-module-template/  # Estructura de módulo backend
│   └── frontend-component-template/ # Estructura de componente frontend
│
├── .github/                      # GitHub workflows y templates
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template/
│
├── scripts/                      # Scripts útiles
│
├── CLAUDE.md                     # Instrucciones para Claude
├── CODEX.md                      # Instrucciones para Codex
└── README.md                     # Este archivo

# Los siguientes se crearán una vez confirmado el stack:
# ├── backend/                    # API / Backend
# ├── frontend/                   # Web / UI
# ├── shared/                     # Código compartido
# ├── tests/                      # Tests integración
# ├── scripts/                    # Deployment y setup
# └── .env.example                # Template de variables
```

---

## Stack técnico (por confirmar)

El stack específico será confirmado por el usuario en 5 categorías. Mientras tanto:

| Aspecto | Requerimiento | Candidatos |
|---------|---------------|-----------|
| **Backend** | [A CONFIRMAR] | Node.js, Python, Go, Java |
| **Frontend** | [A CONFIRMAR] | React, Next.js, Vue, Angular |
| **Database** | PostgreSQL o compatible | Supabase, Neon, Railway, VPS |
| **Hosting** | Bajo costo, escalable | Vercel, Netlify, Fly.io, Railway |
| **DevOps** | CI/CD automatizado | GitHub Actions, GitLab CI |

**Cómo se decidirá:** Cada categoría será evaluada en ADR antes de ser implementada.

---

## Documentación

### Fundamentos
- [`00_PROJECT_CHARTER.md`](docs/00_foundation/00_PROJECT_CHARTER.md) — Visión, propósito, principios no negociables
- [`01_SCOPE_AND_ROADMAP.md`](docs/01_scope/01_SCOPE_AND_ROADMAP.md) — MVP, fases, orden de construcción

### Arquitectura
- [`02_ARCHITECTURE.md`](docs/02_architecture/02_ARCHITECTURE.md) — Módulos, capas, comunicación
- [`03_DATABASE.md`](docs/02_architecture/03_DATABASE.md) — Modelo de datos, convenciones
- [`04_API_AND_INTEGRATIONS.md`](docs/02_architecture/04_API_AND_INTEGRATIONS.md) — Contratos API, Mora Mora

### Operación
- [`05_SECURITY.md`](docs/03_infrastructure/05_SECURITY.md) — Seguridad, RBAC, auditoría
- [`06_INFRASTRUCTURE_AND_DEPLOYMENT.md`](docs/03_infrastructure/06_INFRASTRUCTURE_AND_DEPLOYMENT.md) — Infraestructura, ambientes
- [`07_COST_OPTIMIZATION.md`](docs/03_infrastructure/07_COST_OPTIMIZATION.md) — Estrategia de costos

### Desarrollo
- [`08_AI_AGENTS_AND_DEVELOPMENT_WORKFLOW.md`](docs/04_standards/08_AI_AGENTS_AND_DEVELOPMENT_WORKFLOW.md) — Workflow Codex + Claude
- [`09_CODING_AND_TESTING_STANDARDS.md`](docs/04_standards/09_CODING_AND_TESTING_STANDARDS.md) — Estándares de código

### Decisiones
- [`decisions/`](decisions/) — Decisiones arquitectónicas documentadas (ADRs)
- [`decisions/CURRENT_WORK.md`](decisions/CURRENT_WORK.md) — Estado actual de trabajo

---

## Instrucciones por rol

### 👤 Si eres **Claude**
Lee: [`CLAUDE.md`](CLAUDE.md)
- Instrucciones específicas
- Alcance de tareas
- Estándares de seguridad

### 👤 Si eres **Codex**
Lee: [`CODEX.md`](CODEX.md)
- Instrucciones específicas
- Responsabilidades de dominio
- Estándares de infra

### 👤 Si eres **Project Manager**
Lee:
1. [`docs/00_foundation/00_PROJECT_CHARTER.md`](docs/00_foundation/00_PROJECT_CHARTER.md)
2. [`docs/01_scope/01_SCOPE_AND_ROADMAP.md`](docs/01_scope/01_SCOPE_AND_ROADMAP.md)
3. [`decisions/CURRENT_WORK.md`](decisions/CURRENT_WORK.md)

### 👤 Si eres **Arquitecto/Revisor**
Lee:
1. [`docs/02_architecture/02_ARCHITECTURE.md`](docs/02_architecture/02_ARCHITECTURE.md)
2. [`decisions/`](decisions/) — Todas las ADRs
3. [`guides/`](guides/) — Estándares

---

## Git workflow

### Crear una tarea nueva
```bash
git checkout main
git pull origin main
git checkout -b claude/01-task-name    # O codex/01-task-name
```

### Durante el trabajo
```bash
git add <archivos-específicos>
git commit -m "[MODULE] Descripción breve"
# Commits pequeños, frecuentes, descriptivos

git push origin claude/01-task-name
```

### Antes de hacer PR
```bash
npm run test        # Pruebas pasan
npm run lint        # Código limpio
npm run format      # Formato consistente

# Verifica cambios
git diff main..HEAD --stat
```

### Crear PR
- Abre en GitHub/GitLab
- Título descriptivo
- Descripción clara con cambios y pruebas
- Referencia a issues si aplica

### Después de aprobación
- Squash & merge recomendado
- Borra rama local y remota

**Detalles completos:** [`guides/git-workflow/GIT_WORKFLOW_GUIDE.md`](guides/git-workflow/GIT_WORKFLOW_GUIDE.md)

---

## Comunicación y coordinación

### Estado actual
- **Fase:** 0 — Fundaciones
- **Actividad principal:** Documentación y estructura
- **Bloqueador:** Stack técnico (por confirmar)

Ver: [`decisions/CURRENT_WORK.md`](decisions/CURRENT_WORK.md)

### Cómo contactar
- **GitHub Issues:** Preguntas, bugs, mejoras
- **GitHub Discussions:** Decisiones arquitectónicas
- **Chat/Slack:** Comunicación urgente
- **ADRs:** Decisiones formales en `decisions/`

### Reuniones
- **Sync diaria:** Breve estado de trabajo (async en CURRENT_WORK.md)
- **Tech sync:** Decisiones arquitectónicas (semanal o ad-hoc)
- **Retrospectiva:** Aprendizajes (al final de cada fase)

---

## Próximos pasos

### Ahora (Fase 0 finalización)
- [ ] Confirmar stack técnico (5 categorías del usuario)
- [ ] Crear ADRs de decisiones técnicas
- [ ] Finalizar templates de módulos
- [ ] Crear guía de API design

### Post-stack (Fase 0 → MVP)
- [ ] Setup inicial repositorio (gitignore, etc.)
- [ ] Inicializar backend + frontend + DB
- [ ] Autenticación y autorización básica
- [ ] Modelo de datos inicial
- [ ] Primeros endpoints funcionales

### MVP (Fase 1+)
Ver [`docs/01_scope/01_SCOPE_AND_ROADMAP.md`](docs/01_scope/01_SCOPE_AND_ROADMAP.md) — Orden recomendado de construcción

---

## Principios del proyecto

1. **Fuente de verdad definida** para cada dato
2. **Auditoría antes que borrado destructivo**
3. **Seguridad por diseño** y mínimo privilegio
4. **Separación modular** y por capas
5. **Datos históricos reproducibles**
6. **Costos controlados** de infra e IA
7. **MVP rápido** sin deuda estructural
8. **Documentación** sobre secretos tácitos
9. **Git como fuente de verdad** para desarrollo
10. **Decisiones documentadas** que condicionen el futuro

---

## Recursos útiles

### Documentación técnica
- [PostgreSQL](https://www.postgresql.org/docs/) — Si es DB elegida
- [ADR por Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) — Contexto ADRs

### Templates
- Módulo backend: `structure/backend-module-template/`
- Componente frontend: `structure/frontend-component-template/`
- ADR: `decisions/000_ADR_TEMPLATE.md`

### Referencias Codex/Claude
- **Para Claude:** Consulta `CLAUDE.md`
- **Para Codex:** Consulta `CODEX.md`

---

## Contribuir a este README

Si necesitas actualizar algo:
1. Edita este archivo
2. Agrega cambio en commit: `[DOCS] Update README — razón`
3. Haz PR con descripción
4. Después de aprobación, mergea

---

## Licencia

[Por definir según necesidad legal de KLEBER]

---

**Preguntas? Consulta la documentación en `docs/` o abre un issue en GitHub.**

**Estado actual:** [`decisions/CURRENT_WORK.md`](decisions/CURRENT_WORK.md)

---

*Última actualización: 2026-09-07 por Claude*  
*Próxima revisión: 2026-09-08 (post-stack-decision)*

