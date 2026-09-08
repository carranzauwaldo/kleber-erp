# CLAUDE — Guía de desarrollo para Claude

**Versión:** 0.1  
**Actualizado:** 2026-09-07  
**Propósito:** Instrucciones específicas para que Claude desarrolle funcionalidades en KLEVER ERP

---

## 1. Principios fundamentales

Antes de cualquier tarea:
1. Lee `00_PROJECT_CHARTER.md` en contexto.
2. Consulta `decisions/` para decisiones existentes.
3. No asumas decisiones técnicas no documentadas.
4. Si aparece una decisión nueva, detén la tarea y documenta en `decisions/`.
5. Los commits son pequeños y descriptivos.

---

## 2. Alcance de tareas para Claude

### ✅ Tareas típicas
- Creación de nuevos módulos/funcionalidades dentro de límites claros.
- Implementación de API endpoints con validación y autorización.
- Integración con servicios externos (Mora Mora, bases de datos).
- Refactoring localizado dentro de un módulo.
- Pruebas unitarias/integración.
- Documentación de funcionalidad implementada.
- Auditoría y logging.

### ❌ Tareas que requieren coordinación
- Cambios simultáneos en archivos también asignados a Codex.
- Rediseño arquitectónico o modular.
- Cambios en el modelo de datos que afecten múltiples módulos.
- Decisiones sobre nuevas dependencias externas.

---

## 3. Workflow de rama

Cada tarea = una rama con naming:

```
claude/<número-tarea>-<descripción-corta>
Ejemplo: claude/01-auth-setup
```

### Checklist antes de PR

- [ ] Cambios son atómicos y concentrados.
- [ ] `git log` muestra commits pequeños y descriptivos.
- [ ] No hay secretos en código/logs.
- [ ] Pruebas locales pasan.
- [ ] Se actualiza documentación si cambian contratos/APIs.
- [ ] Se agrega ADR si hay decisión nueva.

---

## 4. Estructura de commits

Formato:
```
[MODULE] Brief description

Longer explanation if needed:
- What was changed
- Why
- Any risks or notes

Refs: #ticket-number (if applicable)
```

Ejemplo:
```
[TRIPS] Add trip status validation

- Implement status lifecycle: draft → active → closed
- Add created_by tracking for audits
- Validate user permission before status change

Refs: backlog/trip-validation
```

---

## 5. Estándares de código

### Backend (por confirmar stack)
- Validación de entrada en todos los endpoints.
- Autorización RBAC antes de acceso a datos.
- Logs sin secretos.
- Transacciones para operaciones financieras.
- Tipos/interfaces explícitos.

### Frontend (por confirmar stack)
- Componentes reutilizables y bien nombrados.
- Validación optimista + server-side.
- Manejo de errores y estados.
- Accesibilidad (WCAG AA).

### Pruebas
- Mínimo cobertura en lógica crítica (finanzas, auditoría, auth).
- Pruebas de integración para flujos de negocio principales.
- Pruebas end-to-end para viajes + reportes.

---

## 6. Límites de consumo de IA

Por tarea:
- **Baja complejidad:** Usa razonamiento bajo (Haiku).
- **Media complejidad:** Razonamiento medio.
- **Alta complejidad:** Razonamiento alto (solo para arquitectura, seguridad, integraciones difíciles).

Evita:
- Reenviar archivos completos.
- Prompts genéricos sin contexto documentado.
- Investigación que Codex ya hizo.

---

## 7. Comunicación con Codex

### Coordinación necesaria
- Antes de tocar archivos en módulos que Codex está desarrollando.
- Cambios en `shared/`, especialmente en interfaces/contratos.
- Decisiones que afecten la arquitectura.

### Archivos de coordinación
- `decisions/CURRENT_WORK.md` — actualiza si hay conflicto potencial.
- GitHub issues/PRs — referencia cambios relacionados.

---

## 8. Documentación esperada

Cada funcionalidad debe incluir:

**En código:**
- Docstrings/comentarios para lógica no obvia.
- Nombres de variables/funciones auto-documentados.

**En repo:**
- README en módulo si es complejo.
- `CHANGELOG.md` si es cambio importante.
- Actualizar este CLAUDE.md si cambias procesos.

---

## 9. Checklist de seguridad

Antes de mergear:
- [ ] No hay credenciales/tokens en logs.
- [ ] Las consultas SQL no son vulnerables a inyección.
- [ ] La autorización se valida en backend, no solo frontend.
- [ ] Los datos sensibles no viajan sin HTTPS.
- [ ] Las contraseñas usan hashing seguro.
- [ ] Se registra auditoría para operaciones críticas.

---

## 10. Cómo reportar problemas o cambios

Si encuentras:
- **Inconsistencia con documentación:** Abre issue en GitHub.
- **Decisión nueva necesaria:** Crea ADR en `decisions/` y detente.
- **Dependencia con Codex:** Documenta en `decisions/CURRENT_WORK.md`.
- **Refactor necesario:** Propón en PR, no lo hagas sin aprobación.

---

## 11. Contacto y referencias

**Documentos clave:**
- `docs/00_foundation/00_PROJECT_CHARTER.md` — Visión general.
- `docs/02_architecture/02_ARCHITECTURE.md` — Módulos y límites.
- `decisions/` — Decisiones arquitectónicas documentadas.
- `guides/` — Procedimientos y estándares.

**Stack (por confirmar):**
- Backend: [A CONFIRMAR]
- Frontend: [A CONFIRMAR]
- DB: [A CONFIRMAR]
- Hosting: [A CONFIRMAR]

---

**Última actualización:** 2026-09-07  
**Por:** Sistema de Fase 0 KLEVER
