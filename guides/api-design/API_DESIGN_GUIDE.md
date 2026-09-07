# Guía de Diseño de APIs — KLEVER ERP

**Versión:** 0.1  
**Estado:** Fase 0 — Framework específico pendiente  
**Última actualización:** 2026-09-07

---

## 1. Principios de diseño

### ✅ Hacer
- URLs semánticas y predecibles
- Validación explícita con errores claros
- Versionado de API
- Autenticación y autorización obligatoria
- Documentación automática (OpenAPI/Swagger)
- Idempotencia donde sea necesario
- Rate limiting
- Auditoría de operaciones sensibles

### ❌ Evitar
- URLs ambiguas o inconsistentes
- Errores genéricos sin contexto
- APIs undocumented
- Cambios breaking sin versionado
- Confianza en frontend para seguridad
- Secrets en logs
- Operaciones lentas sin paginación

---

## 2. Estructura de URLs

### Convención base
```
/api/v1/<resource>/<id>/<sub-resource>
```

### Ejemplos
```
# Recurso
GET    /api/v1/trips              # Listar viajes
POST   /api/v1/trips              # Crear viaje
GET    /api/v1/trips/:id          # Obtener viaje específico
PUT    /api/v1/trips/:id          # Actualizar viaje
DELETE /api/v1/trips/:id          # Anular viaje (soft delete)

# Sub-recurso
GET    /api/v1/trips/:id/expenses # Gastos de un viaje
POST   /api/v1/trips/:id/expenses # Agregar gasto a viaje

# Operación especial
POST   /api/v1/trips/:id/close    # Cierre de viaje
POST   /api/v1/trips/:id/reopen   # Reapertura de viaje
```

### Métodos HTTP

| Método | Uso | Ejemplo |
|--------|-----|---------|
| `GET` | Obtener recurso(s) | `GET /api/v1/trips` |
| `POST` | Crear recurso | `POST /api/v1/trips` |
| `PUT` | Reemplazar recurso completo | `PUT /api/v1/trips/:id` |
| `PATCH` | Actualizar parcialmente | `PATCH /api/v1/trips/:id` |
| `DELETE` | Eliminar recurso | `DELETE /api/v1/trips/:id` |

**Nota:** En KLEVER casi nunca haremos DELETE físico. Usamos soft deletes o anulaciones.

---

## 3. Estructura de requests

### Headers obligatorios
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Headers opcionales pero recomendados
```
X-Request-ID: <uuid>              # Para trazabilidad
X-Idempotency-Key: <uuid>         # Para idempotencia en POSTs
User-Agent: <client-info>         # Identificar cliente
```

### Body de POST/PUT
```json
{
  "client_id": "uuid",
  "asset_id": "uuid",
  "origin": "Medellín",
  "destination": "Bogotá",
  "freight_value": 150000.00,
  "material": "Arena",
  "quantity": "10 toneladas",
  "notes": "Opcional"
}
```

### Validación de entrada
**Obligatorio en backend:**
- Validar tipo de dato
- Validar rangos/longitud
- Validar valores esperados
- Validar referencias (¿existe el cliente?)

```typescript
// Ejemplo usando Zod (o equivalente)
const createTripSchema = z.object({
  client_id: z.string().uuid('Invalid client ID'),
  asset_id: z.string().uuid('Invalid asset ID'),
  origin: z.string().min(1).max(255),
  destination: z.string().min(1).max(255),
  freight_value: z.number().positive().multipleOf(0.01),
  material: z.string().optional(),
  quantity: z.string().optional(),
  notes: z.string().optional().max(1000)
})
```

---

## 4. Estructura de responses

### Success (2xx)

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "client_id": "uuid",
    "asset_id": "uuid",
    "origin": "Medellín",
    "destination": "Bogotá",
    "freight_value": 150000.00,
    "status": "draft",
    "created_at": "2026-09-07T10:30:00Z",
    "updated_at": "2026-09-07T10:30:00Z"
  },
  "meta": {
    "timestamp": "2026-09-07T10:30:00Z",
    "request_id": "req-123456"
  }
}
```

### Éxito con lista

```json
{
  "data": [
    { "id": "...", "client_id": "...", ... },
    { "id": "...", "client_id": "...", ... }
  ],
  "meta": {
    "total": 100,
    "count": 20,
    "page": 1,
    "per_page": 20,
    "has_more": true,
    "next_cursor": "abc123xyz"
  }
}
```

### Error (4xx/5xx)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid trip data",
    "details": [
      {
        "field": "freight_value",
        "message": "Must be greater than 0"
      },
      {
        "field": "client_id",
        "message": "Client does not exist"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-09-07T10:30:00Z",
    "request_id": "req-123456",
    "trace_id": "trace-789"  // Para debugging en logs
  }
}
```

---

## 5. Códigos HTTP

### 2xx — Éxito
| Código | Uso |
|--------|-----|
| `200` | GET/PUT exitoso, datos retornados |
| `201` | POST exitoso, recurso creado |
| `204` | Operación exitosa, sin contenido (DELETE confirmado) |

### 3xx — Redirección
| Código | Uso |
|--------|-----|
| `301/302` | Redirige a URL nueva (evitar si es posible) |

### 4xx — Error del cliente
| Código | Uso |
|--------|-----|
| `400` | Validación fallida (bad request) |
| `401` | No autenticado (sin token) |
| `403` | No autorizado (sin permiso) |
| `404` | Recurso no encontrado |
| `409` | Conflicto (ej: estado inválido) |
| `422` | Validación de lógica de negocio falló |
| `429` | Rate limit excedido |

### 5xx — Error del servidor
| Código | Uso |
|--------|-----|
| `500` | Error interno genérico |
| `503` | Servicio no disponible (BD, dependencia caída) |

---

## 6. Autenticación y autorización

### Token JWT (recomendado)
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Verificación obligatoria
```typescript
// Pseudocódigo
async function protectedEndpoint(req, res) {
  // 1. Verificar token existe
  const token = extractToken(req.headers.authorization)
  if (!token) return res.status(401).json({ error: 'Missing token' })
  
  // 2. Validar token
  const user = await validateToken(token)
  if (!user) return res.status(401).json({ error: 'Invalid token' })
  
  // 3. Verificar permiso ESPECÍFICO
  if (!user.hasPermission('EDIT_TRIP')) {
    return res.status(403).json({ error: 'Insufficient permissions' })
  }
  
  // 4. Proceder
  return await editTrip(user, req.body)
}
```

### Permisos (RBAC)
Cada operación requiere permiso explícito:
```
CREATE_TRIP
READ_TRIP
EDIT_TRIP
DELETE_TRIP (soft-delete)
REOPEN_TRIP
VIEW_FINANCES
EDIT_FINANCES
VIEW_AUDIT
CLOSE_PERIOD
```

---

## 7. Paginación

### Query parameters
```
GET /api/v1/trips?page=1&per_page=20&sort=created_at&order=desc
```

### Response
```json
{
  "data": [...],
  "meta": {
    "total": 1000,
    "count": 20,
    "page": 1,
    "per_page": 20,
    "total_pages": 50,
    "has_more": true,
    "next_cursor": "abc123xyz"
  }
}
```

### Cursor-based (mejor para grandes volúmenes)
```
GET /api/v1/trips?cursor=abc123xyz&per_page=20
```

---

## 8. Filtros y búsqueda

### Filtros simples
```
GET /api/v1/trips?status=active&asset_id=uuid
GET /api/v1/trips?created_after=2026-09-01&created_before=2026-09-30
```

### Búsqueda
```
GET /api/v1/trips?search=cliente_name
GET /api/v1/clients?search=empresa
```

---

## 9. Idempotencia

Para operaciones críticas (POST) que pueden tener retry:

```
POST /api/v1/trips
X-Idempotency-Key: f058ebd6-02f7-4d3f-942e-904344e8cde5

Response:
HTTP 201
Location: /api/v1/trips/550e8400-e29b-41d4-a716-446655440000
```

Si se repite la misma operación:
```
POST /api/v1/trips
X-Idempotency-Key: f058ebd6-02f7-4d3f-942e-904344e8cde5

Response:
HTTP 200 (ya existe, retorna lo que se creó)
```

---

## 10. Documentación automática

### Usar OpenAPI/Swagger
```yaml
openapi: 3.0.0
info:
  title: KLEVER ERP API
  version: 1.0.0
paths:
  /trips:
    get:
      summary: List trips
      parameters:
        - name: page
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TripsResponse'
```

### Acceso
- Documentación interactiva: `/api/docs` o `/swagger-ui`
- JSON: `/api/openapi.json`
- YAML: `/api/openapi.yaml`

---

## 11. Rate limiting

### Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1630992000
```

### Límites sugeridos
- Por usuario: 1000 req/hora
- Por IP: 100 req/minuto (evitar DDoS)
- Operaciones críticas: 10 req/minuto

---

## 12. Auditoría

### Operaciones que deben registrar
- Crear/modificar viajes
- Cambiar estado
- Crear/modificar gastos
- Cerrar período
- Cambios de autorización

### Información registrada
```json
{
  "timestamp": "2026-09-07T10:30:00Z",
  "user_id": "uuid",
  "action": "EDIT_TRIP",
  "resource_type": "trips",
  "resource_id": "uuid",
  "changes": {
    "status": { "old": "draft", "new": "active" }
  },
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/...",
  "status": "success"
}
```

---

## 13. Versionado de API

### URL versionada
```
/api/v1/trips
/api/v2/trips  (en el futuro si hay breaking changes)
```

### Deprecation headers
```
Deprecation: true
Sunset: Sun, 01 Jan 2027 00:00:00 GMT
Link: </api/v2/trips>; rel="successor-version"
```

### Política de versionado
- Mantener versión anterior por 6 meses mínimo
- Avisar con Deprecation headers
- Migración guiada en documentación

---

## 14. Ejemplo completo: Crear viaje

### Request
```
POST /api/v1/trips
Authorization: Bearer token_123
X-Idempotency-Key: f058ebd6-02f7-4d3f-942e-904344e8cde5
Content-Type: application/json

{
  "client_id": "550e8400-e29b-41d4-a716-446655440000",
  "asset_id": "660e8400-e29b-41d4-a716-446655440001",
  "origin": "Medellín",
  "destination": "Bogotá",
  "freight_value": 150000.00,
  "material": "Arena",
  "quantity": "10 toneladas"
}
```

### Response (Éxito)
```
HTTP 201 Created
Location: /api/v1/trips/770e8400-e29b-41d4-a716-446655440002
X-Request-ID: req-789456
Content-Type: application/json

{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "client_id": "550e8400-e29b-41d4-a716-446655440000",
    "asset_id": "660e8400-e29b-41d4-a716-446655440001",
    "origin": "Medellín",
    "destination": "Bogotá",
    "freight_value": 150000.00,
    "material": "Arena",
    "quantity": "10 toneladas",
    "status": "draft",
    "created_by": "current-user-id",
    "created_at": "2026-09-07T10:30:00Z",
    "updated_at": "2026-09-07T10:30:00Z"
  },
  "meta": {
    "timestamp": "2026-09-07T10:30:00Z",
    "request_id": "req-789456"
  }
}
```

### Response (Error de validación)
```
HTTP 400 Bad Request
X-Request-ID: req-789457
Content-Type: application/json

{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid trip data",
    "details": [
      {
        "field": "freight_value",
        "message": "Must be a positive number"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-09-07T10:30:00Z",
    "request_id": "req-789457"
  }
}
```

### Response (No autorizado)
```
HTTP 403 Forbidden
X-Request-ID: req-789458

{
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "You don't have permission to create trips"
  },
  "meta": {
    "timestamp": "2026-09-07T10:30:00Z",
    "request_id": "req-789458"
  }
}
```

---

## 15. Testing de APIs

### Herramientas recomendadas
- Postman (UI)
- Insomnia (UI)
- curl (CLI)
- `npm run test:api` (automatizado)

### Casos a probar
- ✅ Happy path (datos válidos)
- ✅ Validación (datos inválidos)
- ✅ Autenticación (token faltante/inválido)
- ✅ Autorización (user sin permiso)
- ✅ Idempotencia (mismo request dos veces)
- ✅ Concurrencia (race conditions)

---

## 16. Stack específico (por confirmar)

Cuando se confirme el stack, se actualizará con ejemplos en:
- Express.js / Fastify / NestJS (Node)
- FastAPI / Django (Python)
- Go (si se elige)
- etc.

---

**Stack a confirmar:** Backend = [TBD]

Para dudas de API design, consulta `CLAUDE.md`, `CODEX.md` o abre discussion en GitHub.

