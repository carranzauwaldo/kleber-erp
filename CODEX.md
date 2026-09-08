# CODEX — Guía de desarrollo para Codex

**Versión:** 0.1  
**Actualizado:** 2026-09-07  
**Propósito:** Instrucciones específicas para que Codex desarrolle funcionalidades en KLEVER ERP

---

## 1. Principios fundamentales

Antes de cualquier tarea:
1. Lee `00_PROJECT_CHARTER.md` en contexto.
2. Consulta `decisions/` para decisiones existentes.
3. No asumas decisiones técnicas no documentadas.
4. Si aparece una decisión nueva, detén la tarea y documenta en `decisions/`.
5. Los commits son pequeños y descriptivos.

---

## 2. Alcance de tareas para Codex

### ✅ Tareas típicas
- Creación de módulos backend con lógica de dominio compleja.
- Implementación de integraciones críticas (Mora Mora).
- Diseño e implementación de migraciones de base de datos.
- Lógica financiera, cierres y conciliación.
- Auditoría y trazabilidad.
- Análisis de rendimiento y optimización.
- Refactoring arquitectónico localizado.

### ❌ Tareas que requieren coordinación
- Cambios simultáneos en archivos también asignados a Claude.
- Rediseño de módulos compartidos.
- Cambios que afecten contratos de API.
- Decisiones sobre infraestructura o proveedores externos.

---

## 3. Workflow de rama

Cada tarea = una rama con naming:

```
codex/<número-tarea>-<descripción-corta>
Ejemplo: codex/02-trips-domain-setup
```

### Checklist antes de PR

- [ ] La lógica de dominio es independiente de framework.
- [ ] Los tests cubren los casos de negocio más importantes.
- [ ] No hay datos hardcodeados ni configuración en el código.
- [ ] Se documenta cualquier decisión arquitectónica nueva.
- [ ] Migraciones son versionadas y reproducibles.
- [ ] Se incluyen fixtures/seeds para pruebas si es necesario.

---

## 4. Estructura de commits

Formato:
```
[MODULE] Brief description

Longer explanation if needed:
- What was changed
- Why
- Design decisions
- Breaking changes (if any)

Refs: #ticket-number
```

Ejemplo:
```
[TRIPS] Implement Trip domain aggregate

- Create Trip entity with invariant validation
- Add TripRepository with save/findById
- Implement lifecycle states: Draft → Active → Closed
- Add TripValidator for business rules

This design allows Trip to remain independent
of HTTP/persistence details.

Refs: backlog/trip-core
```

---

## 5. Estándares de código

### Backend - Domain Layer (obligatorio)
- Entidades sin dependencias de framework.
- Value Objects para conceptos del dominio (Money, Distance, etc.).
- Reglas de negocio explícitas y validables.
- Interfaces/Ports claramente definidas.
- Tipos/interfaces explícitos en todo.

### Backend - Application Layer
- Use Cases/Commands descritos claramente.
- Orquestación de repositorios y servicios.
- Manejo de excepciones de negocio.
- Transacciones para operaciones críticas.

### Backend - Infrastructure Layer
- Adaptadores a repositorios/APIs.
- No incluir lógica de negocio.
- Inyección de dependencias clara.

### Pruebas
- Unit tests para dominio (sin mocks de BD).
- Integration tests para casos de uso críticos.
- Fixtures de datos consistentes.
- Tests de migración antes de producción.

---

## 6. Responsabilidades específicas de Codex

**Lógica de dominio:**
- Diseño de agregados.
- Invariantes de negocio.
- Eventos de dominio (si aplican).

**Infraestructura/Persistencia:**
- Migraciones y versionado de BD.
- Repositorios e implementaciones.
- Caché y optimización.

**Integraciones complejas:**
- Mora Mora sincronización bidireccional.
- Manejo de conflictos.
- Idempotencia.

**Reportes y analytics:**
- Consultas complejas y agregaciones.
- Performance para dashboards.

---

## 7. Límites de consumo de IA

Por tarea:
- **Baja complejidad:** Razonamiento bajo (Haiku).
- **Media complejidad:** Razonamiento medio.
- **Alta complejidad:** Razonamiento alto (solo para lógica financiera, integraciones complejas, migraciones críticas).

Evita:
- Copiar-pegar de Stack Overflow sin comprensión.
- Generación automática de tests sin revisar.
- Migraciones no probadas.

---

## 8. Comunicación con Claude

### Coordinación necesaria
- Cambios en módulos que Claude está desarrollando.
- Modificaciones a interfaces compartidas.
- Cambios al modelo de datos que afecten múltiples módulos.
- Cualquier decisión arquitectónica nueva.

### Archivos de coordinación
- `decisions/CURRENT_WORK.md` — documenta trabajo en paralelo.
- GitHub issues — referencia dependencias.
- PRs — solicita review antes de mergear cambios críticos.

---

## 9. Documentación esperada

Cada funcionalidad debe incluir:

**En código:**
- Docstrings explícitos para Value Objects y Entities.
- Explicación de invariantes de negocio.
- Comentarios en lógica compleja.

**En repo:**
- ADR en `decisions/` si hay decisión arquitectónica.
- `CHANGELOG.md` para cambios importantes.
- README en módulo si es nuevo.

---

## 10. Checklist de seguridad

Antes de mergear:
- [ ] Sensibles de datos (dinero, IDs, PII) se manejan con cuidado.
- [ ] Validación de entrada en límites del sistema.
- [ ] Permisos/autorización chequeados antes de acceso.
- [ ] Auditoría registrada para operaciones críticas.
- [ ] Migraciones tienen rollback.
- [ ] No hay hardcoded secrets o configuración de producción.

---

## 11. Estándar de migraciones

Toda migración de BD debe:

1. **Ser reversible:** `up()` y `down()` funcionan.
2. **Ser idempotente:** Ejecutarla dos veces no causa error.
3. **Ser probada:** Corre localmente antes de PR.
4. **Ser documentada:**
   ```
   -- Migration: 001_create_trips_table
   -- Description: Create trips table for operational core
   -- Rollback: DROP TABLE trips;
   ```
5. **Incluir datos de test:** Si necesario, `seed.sql` o fixture.

---

## 12. Cómo reportar problemas o cambios

Si encuentras:
- **Inconsistencia arquitectónica:** Abre ADR en `decisions/`.
- **Dependencia con Claude:** Documenta en `decisions/CURRENT_WORK.md`.
- **Problema de rendimiento:** Propón optimización con benchmark.
- **Refactor necesario:** Propón en PR con justificación.

---

## 13. Referencias clave

**Documentos clave:**
- `docs/00_foundation/00_PROJECT_CHARTER.md` — Visión general.
- `docs/02_architecture/02_ARCHITECTURE.md` — Módulos y capas.
- `docs/02_architecture/03_DATABASE.md` — Modelo de datos.
- `decisions/` — Decisiones arquitectónicas documentadas.
- `guides/` — Procedimientos y estándares.

**Stack (por confirmar):**
- Backend: [A CONFIRMAR]
- Database: [A CONFIRMAR]
- ORM/Query Builder: [A CONFIRMAR]
- Testing: [A CONFIRMAR]
- Migrations: [A CONFIRMAR]

---

**Última actualización:** 2026-09-07  
**Por:** Sistema de Fase 0 KLEVER
