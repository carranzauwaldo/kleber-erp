# Git Workflow — Codex + Claude en paralelo

**Versión:** 0.1  
**Propósito:** Evitar conflictos y garantizar integración limpia cuando dos agentes trabajan simultáneamente

---

## 1. Principios fundamentales

1. **main siempre funciona** — Jamás hacer push directo a main.
2. **Una tarea = una rama** — Cada agente en su rama independiente.
3. **PR antes de mergear** — Revisión y validación obligatoria.
4. **Commits pequeños** — Fácil de revisar y revertir si es necesario.
5. **Comunicación de dependencias** — Documentar en `decisions/CURRENT_WORK.md` si hay conflictos previstos.

---

## 2. Estructura de ramas

```
main (producción, siempre limpia)
├── codex/<number>-<task>         (Codex trabaja aquí)
├── claude/<number>-<task>        (Claude trabaja aquí)
└── fix/<issue>-<description>     (Hotfixes)
```

### Ejemplos válidos
```
codex/01-auth-setup
claude/02-trips-domain
fix/security-sql-injection
feature/reporting-dashboard
```

### Ejemplos inválidos
```
wip               # Demasiado vago
my-feature        # Sin prefijo de agente
temp-fix          # No descriptivo
claudecodex/thing # Ambiguo
```

---

## 3. Antes de crear una rama

### Checklist de prerequisitos

1. **Entiende la tarea completamente**
   - Lee CLAUDE.md o CODEX.md según sea
   - Revisa documentación arquitectónica
   - Consulta ADRs relacionados

2. **Identifica dependencias**
   - ¿Otros módulos que tocará?
   - ¿Otro agente está trabajando en esos módulos?
   - ¿Hay que coordinar?

3. **Actualiza CURRENT_WORK.md**
   - Documenta qué vas a hacer
   - Documenta archivos que tocarás
   - Anota si hay potencial conflicto

4. **Crea rama desde main actualizado**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b claude/02-my-task
   ```

---

## 4. Mientras trabajas

### Cómo hacer commits

**Frecuencia:** Pequeños commits después de cada objetivo completado

**Formato del mensaje:**
```
[MODULE] Brief description

- What changed
- Why
- Related info

Refs: #ticket
```

**Ejemplo:**
```
[TRIPS] Create Trip entity with status enum

- Define Trip aggregate root
- Create TripStatus value object
- Add basic factory and getters
- Implement domain invariants (no duplicate routes)

This is the core domain entity for operational tracking.
Tests added for status transitions.

Refs: phase-0/domain-setup
```

### Reglas durante desarrollo

- ✅ Hacer commits regularmente
- ✅ Referenciar en commit messages
- ❌ Hacer commits enormes sin contexto
- ❌ Comitear código roto/sin tests
- ❌ Incluir archivos de configuración personal

### Mantener rama actualizada

Si `main` avanza mientras trabajas:

```bash
# Opción 1: Rebase (recomendado para histories limpias)
git fetch origin
git rebase origin/main

# Si hay conflictos:
# - Resuelve manualmente en tu editor
# - git add <archivos>
# - git rebase --continue

# Opción 2: Merge (más seguro si cambios son grandes)
git fetch origin
git merge origin/main
# Resuelve conflictos si aplica
git add .
git commit -m "Merge main into mi-rama"
```

---

## 5. Cuando hay conflictos

### Prevención (mejor que resolución)

Documenta en `decisions/CURRENT_WORK.md`:
```markdown
## Trabajo activo 2026-09-07

### Claude - claude/02-trips-domain
- Archivos: modules/trips/domain/**
- Plazo: 2026-09-08
- Notas: Codex no debe tocar este módulo

### Codex - codex/01-auth-setup
- Archivos: modules/identity/**
- Plazo: 2026-09-09
- Notas: Ambos tocan shared/auth.ts — coordinar!
```

### Si ocurre un conflicto

```bash
# Identificar conflictos
git status

# Abre los archivos con <<<<<<, =====, >>>>>>
# Decide cuál versión mantener o combina ambas

# Resuelve manualmente, luego:
git add <archivo-resuelto>

# Completa el rebase o merge
git rebase --continue   # Si usaste rebase
# O simplemente haz commit si usaste merge
git commit
```

**Regla importante:** Si no estás seguro, pide review en GitHub antes de resolver conflictos.

---

## 6. Pull Request (PR)

### Antes de abrir PR

```bash
# 1. Asegúrate que tu rama está actualizada
git fetch origin
git rebase origin/main

# 2. Corre tests locales
npm run test
npm run lint

# 3. Verifica qué cambios vas a pushear
git diff main..HEAD --stat

# 4. Push a servidor
git push origin claude/02-my-task
```

### Cómo crear un PR

**En GitHub/GitLab:**

```
Título:
[MODULE] Brief description

Descripción:
## ¿Qué cambió?
- Cambio 1
- Cambio 2
- Cambio 3

## Por qué
Explica la razón o problema resuelto.

## Cómo se probó
- Prueba 1 que ejecuté localmente
- Prueba 2

## Checklist
- [x] Tests pasan
- [x] Código formateado
- [x] Documentación actualizada
- [x] Sin secrets en el código
- [x] Alineado con decisiones en decisions/

## Referencias
Closes #123 (si aplica)
Relacionado a: codex/01-auth (si hay dependencia)

## Capturas (si aplica)
[Agrega screenshot de cambios en UI]
```

### Checklist de PR

- [ ] El título es descriptivo
- [ ] Hay descripción clara de cambios
- [ ] Los tests pasan (verifica en CI)
- [ ] No hay conflictos con main
- [ ] Se referencian issues relacionados
- [ ] Se notifica si hay dependencia con otro PR

---

## 7. Code Review (cuando otros revisan)

### Qué esperar como autor
- Preguntas sobre diseño
- Sugerencias de mejora
- Validación de criterios de aceptación

### Cómo responder

```bash
# Si debes hacer cambios:
git add <archivos>
git commit -m "[MODULE] Address review feedback

- Change 1 as suggested
- Change 2 based on concern"

git push origin mi-rama
# El PR se actualiza automáticamente
```

**Nunca hacer:**
- Push force sin coordinación
- Rechazar feedback sin explicación
- Mergear sin que se apruebe la revisión

---

## 8. Mergear a main

### Cuándo está listo

✅ La rama:
- Tiene al menos 1 aprobación en PR
- Todos los tests pasan
- No hay conflictos con main
- Documentación está actualizada

❌ No mergear si:
- Hay comentarios sin resolver
- Tests fallan
- Hay conflictos sin resolver
- El autor no ha respondido a feedback

### Cómo mergear

**Opción 1: Squash (recomendado para historias limpias)**
```bash
# En GitHub: Click "Squash and merge"
# Esto combina todos los commits en uno
```

**Opción 2: Rebase (si commits son muy pequeños y claros)**
```bash
# En GitHub: Click "Rebase and merge"
```

**Opción 3: Merge commit (si es integración grande)**
```bash
# En GitHub: Click "Create a merge commit"
git checkout main
git pull origin main
```

---

## 9. Después de mergear

### Limpiar

```bash
# Tu rama ya no se necesita
git branch -d claude/02-my-task
git push origin --delete claude/02-my-task
```

### Verificar main

```bash
# Asegúrate que main sigue en buen estado
git checkout main
git pull origin main
npm run test
npm run build
```

### Publicar cambios

Si hay ambiente de staging:
```bash
# El CI/CD automáticamente deployará a staging
# Verifica que todo funcione

# Después de validar, manual deploy a producción
# (o automático si tu workflow lo permite)
```

---

## 10. Casos especiales

### Si necesitas revertir un merge

```bash
git revert -m 1 <commit-del-merge>
git push origin main
```

### Si accidentalmente hiciste push force

```bash
# ❌ NUNCA hacer esto sin avisar
git push --force

# ✅ BIEN: Hablar primero, luego:
# Coordina con el equipo
# Solo después usa --force-with-lease
git push --force-with-lease
```

### Si alguien más cambió los mismos archivos

```bash
# Cuando hagas rebase y hay conflictos:
# 1. Abre los archivos marcados
# 2. Resuelve manualmente
# 3. git add
# 4. git rebase --continue
# 5. Sube nuevamente: git push --force-with-lease
```

---

## 11. Coordenando con el otro agente

### Archivo de coordinación: `decisions/CURRENT_WORK.md`

Mantén actualizado:

```markdown
## Trabajo activo

### Claude
- **Rama:** claude/02-trips-domain
- **Módulos:** modules/trips/domain/**
- **Archivos:** Ver rama
- **Plazo:** 2026-09-08
- **Bloqueadores:** Ninguno
- **Dependencias:** Espera auth de Codex (en progreso)

### Codex
- **Rama:** codex/01-auth-setup
- **Módulos:** modules/identity/**
- **Archivos:** Ver rama
- **Plazo:** 2026-09-09
- **Bloqueadores:** shared/auth.ts — coordinar con Claude si cambios
- **Dependencias:** Ninguno

### Puntos de coordinación
- `shared/auth.ts` — Ambos pueden tocar. Revisar antes de PR.
- `docs/` — Ambos pueden documentar, sin conflicto esperado.
```

### Comunicación asincrónica

- **En GitHub:** Usa issues/comments en PRs
- **En Slack/Chat:** Mensajes directos si es urgente
- **En Decisiones:** Documenta en `decisions/` si es arquitectura

---

## 12. Reglas de oro

1. **main debe funcionar siempre** — Jamás romperla
2. **Commits son documentación** — Hazlos descriptivos
3. **Las ramas son baratas** — Crea cuantas necesites
4. **Revisa antes de mergear** — No es burocracia, es calidad
5. **Comunica dependencias** — No seas sorpresa
6. **Resuelve conflictos rápido** — No los dejes crecer

---

## 13. Cheatsheet rápido

```bash
# Crear rama nueva
git checkout main
git pull origin main
git checkout -b claude/01-task-name

# Trabajar y comitear
git add <archivos específicos>
git commit -m "[MODULE] Description"
git push origin claude/01-task-name

# Mantener actualizado
git fetch origin
git rebase origin/main

# Antes de PR
npm run test && npm run lint

# Después de aprobar PR
# En GitHub: Click "Squash and merge"
git checkout main
git pull origin main

# Limpiar
git branch -d claude/01-task-name
git push origin --delete claude/01-task-name
```

---

**Dudas? Consulta CLAUDE.md, CODEX.md o abre issue en GitHub.**

