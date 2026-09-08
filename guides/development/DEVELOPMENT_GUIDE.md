# Guía de Desarrollo — KLEVER ERP

**Versión:** 0.1  
**Estado:** Fase 0 — En construcción  
**Última actualización:** 2026-09-07

---

## 1. Antes de empezar

### Lectura obligatoria
1. `00_PROJECT_CHARTER.md` — Visión y principios no negociables
2. `CLAUDE.md` o `CODEX.md` — Instrucciones de tu agente
3. `02_ARCHITECTURE.md` — Módulos y límites

### Verificación de contexto
- ¿Cuál es el módulo exacto que desarrollaré?
- ¿Existe algún ADR que afecte mi tarea?
- ¿Hay trabajo en paralelo en archivos que tocaré?

---

## 2. Configuración local

### Requisitos (serán confirmados con stack)
- [ ] Node.js versión [A CONFIRMAR] o equivalente
- [ ] Base de datos en local: [A CONFIRMAR]
- [ ] Git configurado con tu nombre/email
- [ ] Visual Studio Code o editor preferido
- [ ] Postman o Insomnia para probar APIs

### Setup inicial
```bash
# Clonar repositorio
git clone <repo-url>
cd klever-erp

# Instalar dependencias
[Comando específico del stack]

# Crear archivo .env local
cp .env.example .env

# Inicializar BD local
[Comando de migraciones]

# Verificar que todo funciona
npm run dev  # o comando equivalente
```

---

## 3. Estructura de branches

Cada tarea nueva es una rama:

```
main
├── claude/<número>-<descripción-corta>
└── codex/<número>-<descripción-corta>
```

**Formato:**
```
feature/<type>/<area>/<description>

Examples:
  claude/01-trips-setup
  codex/02-auth-core
  fix/trips-validation-bug
```

### Crear una rama nueva

```bash
# Asegúrate que estés en main actualizado
git checkout main
git pull origin main

# Crea tu rama
git checkout -b claude/01-my-task

# Haz commits pequeños
git add <archivos específicos>
git commit -m "[MODULE] Brief message"
```

---

## 4. Flujo de un commit

### Checklist antes de comitear
- [ ] Código está formateado (linters pasan)
- [ ] Pruebas unitarias pasan localmente
- [ ] No hay `console.log()` de debug
- [ ] No hay secrets/tokens en el código
- [ ] El mensaje es descriptivo

### Estructura del mensaje de commit

```
[MODULE] Brief description

- Bullet point 1 of what changed
- Bullet point 2
- Bullet point 3

Why this change:
The reason or context.

Refs: #123 (si aplica)
```

**Ejemplo real:**
```
[TRIPS] Add trip status validation

- Create trip_status enum: draft, active, closed
- Validate state transitions in Trip domain
- Add tests for invalid state changes
- Update trip repository to save with status

This prevents invalid states from persisting
and ensures financial accuracy.

Refs: backlog/trip-lifecycle
```

---

## 5. Desarrollo de un módulo

### Estructura de carpetas (dentro de `modules/`)

```
module-name/
├── domain/              # Entidades, Value Objects, Interfaces
│   ├── entities/
│   ├── value-objects/
│   ├── ports/          # Interfaces que el módulo necesita
│   └── services/       # Lógica de dominio puro
├── application/        # Use Cases, Commands, Queries
│   ├── use-cases/
│   ├── dto/           # Data Transfer Objects
│   └── services/      # Orquestación
├── infrastructure/     # Implementaciones técnicas
│   ├── repositories/
│   ├── adapters/
│   └── database/
├── presentation/      # API controllers, DTOs entrada/salida
│   ├── controllers/
│   ├── routes/
│   └── middleware/
└── tests/            # Tests unitarios, integración
    ├── domain/
    ├── application/
    └── integration/
```

### Ejemplo: Crear módulo `trips`

1. **Dominio primero** (no toca BD ni API aún)
   ```
   modules/trips/domain/entities/Trip.ts
   modules/trips/domain/value-objects/TripStatus.ts
   modules/trips/domain/ports/ITripRepository.ts
   ```

2. **Lógica de aplicación**
   ```
   modules/trips/application/use-cases/CreateTripUseCase.ts
   modules/trips/application/dto/CreateTripRequest.ts
   ```

3. **Persistencia**
   ```
   modules/trips/infrastructure/repositories/PostgresTripRepository.ts
   modules/trips/infrastructure/database/migrations/001_create_trips_table.sql
   ```

4. **Exposición HTTP**
   ```
   modules/trips/presentation/controllers/TripsController.ts
   modules/trips/presentation/routes.ts
   ```

5. **Pruebas en cada capa**
   ```
   modules/trips/tests/domain/Trip.test.ts
   modules/trips/tests/application/CreateTripUseCase.test.ts
   modules/trips/tests/integration/trips.integration.test.ts
   ```

---

## 6. Escribir tests

### Convención de nombres
```
describe('Trip', () => {
  describe('#create', () => {
    it('should create a trip with valid data', () => { ... })
    it('should reject trip if client is inactive', () => { ... })
  })
})
```

### Cobertura mínima esperada
- **Dominio:** 80%+ (reglas de negocio críticas)
- **Application:** 60%+ (casos de uso principales)
- **Infrastructure:** 40%+ (adaptadores clave)
- **Presentation:** 50%+ (validación y ruteo)

### Ejecutar pruebas
```bash
npm run test              # Todos los tests
npm run test:watch       # Modo watch
npm run test:coverage    # Con reporte de cobertura
```

---

## 7. Validación de datos

### En el Backend (obligatorio)
- Validar TODA entrada del cliente.
- Mensajes de error específicos pero no reveladoras de seguridad.
- Usar schemas (Zod, Joi, etc. según stack).

**Ejemplo:**
```typescript
const createTripSchema = z.object({
  client_id: z.string().uuid('Invalid client'),
  asset_id: z.string().uuid('Invalid asset'),
  origin: z.string().min(1),
  destination: z.string().min(1),
  freight_value: z.number().positive(),
})
```

### En el Frontend (validación optimista)
- Validar antes de enviar.
- Mostrar feedback inmediato.
- Preparar para rechazo del servidor.

---

## 8. Seguridad

### Checklist de seguridad para cada módulo

- [ ] ¿Las operaciones críticas requieren autorización?
- [ ] ¿Se registra en auditoría?
- [ ] ¿Hay inyección SQL posible? (usar prepared statements)
- [ ] ¿Los errores revelan información sensible?
- [ ] ¿Las contraseñas se hashean?
- [ ] ¿Se valida en servidor, no solo cliente?
- [ ] ¿Hay rate limiting en endpoints públicos?

### Autorización

Siempre verificar en backend:
```typescript
// ❌ MAL: Confiar en frontend
if (user.role === 'ADMIN') { ... }

// ✅ BIEN: Verificar en backend
const user = await getCurrentUser(token)
if (!user.hasPermission('EDIT_TRIP')) {
  throw new UnauthorizedError()
}
```

---

## 9. Manejo de errores

### Errores esperados (negocio)
```typescript
throw new DomainError('Trip status cannot change from closed')
// El frontend debe mostrar esto al usuario
```

### Errores técnicos
```typescript
throw new InfrastructureError('Database connection failed')
// Log automático, mensaje genérico al usuario
```

### Nunca hacer
```typescript
// ❌ No revelar detalles internos
throw new Error('SQL: SELECT * FROM users WHERE...')

// ❌ No registrar secrets
console.log('Token:', apiKey)

// ❌ No fallar silenciosamente
catch (e) { }
```

---

## 10. Antes de hacer PR

### Checklist final
- [ ] La rama está actualizada con `main`
- [ ] Todos los tests pasan (`npm run test`)
- [ ] Linter pasa (`npm run lint`)
- [ ] El código fue formateado (`npm run format`)
- [ ] No hay archivos sin stagear
- [ ] La descripción del PR referencia la tarea
- [ ] Se agregó documentación si cambia un contrato
- [ ] Se creó ADR si hay decisión nueva

### Crear el PR

```bash
git push origin claude/01-my-task
# Copia el URL y abre en GitHub/GitLab

# Título:
[MODULE] Brief description

# Descripción:
## Cambios
- Bullet 1
- Bullet 2

## Testing
- Prueba 1 que hiciste
- Prueba 2 que hiciste

## Referencias
Closes #123 (si aplica)
```

---

## 11. Code review

### Qué esperar
- Preguntas sobre diseño o seguridad
- Sugerencias de mejora
- Validación de que se cumplieron criterios de aceptación

### Cómo responder
- Responde todas las preguntas
- Acepta sugerencias o explica por qué no
- Haz commits con cambios solicitados
- No hagas push force

---

## 12. Referencias rápidas

**Comandos comunes:**
```bash
git checkout -b mi-rama          # Nueva rama
git add .                        # Stagear cambios
git commit -m "mensaje"          # Commitear
git push origin mi-rama          # Subir a servidor
git pull origin main             # Traer cambios de main
git rebase main                  # Actualizar mi rama
```

**Archivos importantes:**
- `00_PROJECT_CHARTER.md` — Visión
- `02_ARCHITECTURE.md` — Módulos
- `03_DATABASE.md` — Datos
- `decisions/` — Decisiones previas
- `guides/` — Procedimientos

---

## 13. Stack (por confirmar)

Cuando el stack esté decidido, será actualizado aquí:

- **Backend:** [A CONFIRMAR]
- **Frontend:** [A CONFIRMAR]
- **Database:** [A CONFIRMAR]
- **Testing:** [A CONFIRMAR]
- **DevOps:** [A CONFIRMAR]

---

**Preguntas? Consulta `CLAUDE.md`, `CODEX.md` o abre issue en GitHub.**

