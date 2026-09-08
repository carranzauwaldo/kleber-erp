# 04_API_AND_INTEGRATIONS.md --- API e Integraciones

**Proyecto:** KLEBER ERP\
**Estado:** Diseño base / Fase 0\
**Objetivo:** Definir contratos, límites y reglas para las APIs internas
y externas, con prioridad en la integración bidireccional Mora Mora ↔
KLEBER.

------------------------------------------------------------------------

## 1. Principios

-   API versionada desde el inicio.
-   Contratos explícitos y documentados.
-   Validación server-side de toda entrada.
-   Autenticación y autorización obligatorias.
-   Idempotencia en operaciones de sincronización y pagos cuando
    aplique.
-   Ningún sistema externo tendrá acceso directo a las tablas internas.
-   Los cambios de contrato incompatibles requieren nueva versión.
-   Logs técnicos y auditoría de negocio son conceptos separados.
-   Los secretos nunca se almacenan en código ni se envían al frontend.
-   La integración debe poder fallar temporalmente sin corromper datos.

## 2. Superficies de API

``` text
/api/v1/auth
/api/v1/organizations
/api/v1/users
/api/v1/people
/api/v1/assets
/api/v1/clients
/api/v1/routes
/api/v1/rates
/api/v1/trips
/api/v1/operational-cash
/api/v1/finance
/api/v1/maintenance
/api/v1/reports
/api/v1/audit
/api/v1/integrations/mora-mora
```

Estas rutas son conceptuales hasta que el stack y OpenAPI definitivo
sean aprobados.

## 3. Contrato estándar

Las respuestas deberán mantener una estructura consistente.

Éxito:

``` json
{
  "data": {},
  "meta": {
    "requestId": "uuid"
  }
}
```

Error:

``` json
{
  "error": {
    "code": "TRIP_ALREADY_CLOSED",
    "message": "El viaje se encuentra cerrado.",
    "details": {}
  },
  "meta": {
    "requestId": "uuid"
  }
}
```

Los códigos internos serán estables y utilizables por frontend e
integraciones.

## 4. Identificadores

-   Identificadores internos: UUID/UUIDv7 o equivalente aprobado en
    DATABASE.
-   Mora Mora conservará su identificador externo original.
-   KLEBER nunca utilizará el ID externo como llave primaria interna.
-   La relación deberá ser única por organización + sistema origen + ID
    externo.

Ejemplo:

``` text
organization_id
source_system = "MORA_MORA"
external_id
internal_trip_id
external_version
last_synced_at
```

## 5. Integración Mora Mora → KLEBER

Mora Mora será fuente primaria de los datos operativos del viaje
mientras este no haya sido cerrado por KLEBER.

Flujo:

``` text
Mora Mora
   ↓
crea/modifica viaje
   ↓
API de integración
   ↓
validación
   ↓
upsert idempotente en KLEBER
   ↓
registro de sincronización
   ↓
auditoría
```

Datos mínimos previstos:

-   ID externo.
-   Fecha/hora.
-   Cliente.
-   Origen.
-   Destino.
-   Material.
-   Cantidad/peso cuando exista.
-   Vehículo.
-   Conductor.
-   Valor operativo disponible.
-   Estado externo.
-   Fecha de modificación.
-   Versión del registro si Mora Mora la soporta.

El contrato definitivo se ajustará al modelo real de Mora Mora; no se
inventarán campos que el sistema origen no posea.

## 6. Actualizaciones antes del cierre

Mientras el viaje esté abierto:

1.  Mora Mora puede corregir información operativa.
2.  Envía una nueva versión.
3.  KLEBER valida que el viaje no esté bloqueado.
4.  KLEBER actualiza únicamente campos cuya propiedad corresponda a Mora
    Mora.
5.  Se registra el cambio y la versión recibida.

No se permitirá que una actualización de Mora Mora sobrescriba campos
financieros cuya propiedad sea exclusiva de KLEBER.

## 7. Conciliación

Estados conceptuales:

``` text
RECEIVED
SYNCED
PENDING_RECONCILIATION
RECONCILED
CLOSED
REOPEN_REQUESTED
REOPENED
CANCELLED
```

Los nombres definitivos se fijarán en DATABASE/DECISIONS.

Al conciliar:

-   KLEBER verifica el viaje.
-   Se comparan datos relevantes.
-   Se resuelven diferencias.
-   Un usuario autorizado aprueba.
-   Se genera evidencia de auditoría.

## 8. Cierre y bloqueo remoto

Cuando KLEBER cierre/apruebe el viaje:

``` text
KLEBER
  ↓
CLOSE
  ↓
evento/llamada de integración
  ↓
MORA MORA
  ↓
bloquea edición del viaje
  ↓
ACK
  ↓
KLEBER registra confirmación
```

El cierre local de KLEBER y el bloqueo remoto no deben tratarse como una
única transacción de base de datos distribuida.

Se utilizará un estado de sincronización que permita reintentar el
bloqueo si Mora Mora está temporalmente fuera de servicio.

Ejemplo:

``` text
close_status = CLOSED
remote_lock_status = PENDING
```

y posteriormente:

``` text
remote_lock_status = CONFIRMED
```

## 9. Reapertura

Mora Mora no podrá reabrir unilateralmente un viaje cerrado.

Proceso:

``` text
Mora Mora solicita corrección
        ↓
KLEBER recibe solicitud
        ↓
usuario autorizado evalúa
        ↓
KLEBER autoriza reapertura
        ↓
Mora Mora desbloquea
        ↓
se realiza corrección
        ↓
sincronización
        ↓
nueva conciliación
        ↓
nuevo cierre
```

La reapertura exige:

-   motivo;
-   usuario autorizador;
-   fecha/hora;
-   referencia al cierre anterior;
-   auditoría completa.

## 10. Anulación

No borrar físicamente viajes conciliados/cerrados.

La anulación deberá:

-   exigir permiso;
-   exigir motivo;
-   conservar datos originales;
-   registrar usuario y fecha;
-   afectar correctamente cálculos financieros;
-   sincronizar el estado con Mora Mora cuando corresponda.

## 11. Idempotencia

Operaciones críticas de integración deberán tolerar reintentos.

Ejemplo:

``` text
Idempotency-Key: <uuid>
```

o mediante combinación estable:

``` text
source_system + external_id + external_version
```

Recibir dos veces el mismo evento no deberá crear dos viajes ni duplicar
movimientos financieros.

## 12. Control de concurrencia

Se deberá impedir que dos modificaciones simultáneas destruyan
información.

Opciones permitidas:

-   version number;
-   updated_at + optimistic locking;
-   ETag/If-Match;
-   mecanismo equivalente del stack elegido.

Conflictos deberán producir una respuesta explícita, no una
sobrescritura silenciosa.

## 13. Autenticación máquina a máquina

Mora Mora no utilizará credenciales de usuario humano.

Se definirá un mecanismo de servicio, por ejemplo:

-   client credentials;
-   API key rotatoria + firma;
-   JWT de servicio;
-   alternativa equivalente aprobada.

Requisitos:

-   credencial distinta por ambiente;
-   rotación;
-   revocación;
-   mínimo privilegio;
-   secretos únicamente server-side;
-   rate limiting.

## 14. Autorización

La autenticación no reemplaza autorización.

Cada endpoint verificará:

``` text
usuario/servicio
      +
organización
      +
permiso
      +
estado del recurso
```

Ejemplo: un usuario con permiso de registro puede crear un viaje, pero
no necesariamente cerrar un período financiero.

## 15. Validación

Toda entrada externa deberá validarse mediante schemas.

Validar como mínimo:

-   tipos;
-   campos obligatorios;
-   rangos;
-   enums;
-   formatos;
-   identificadores;
-   relaciones;
-   reglas de negocio.

No confiar en validación realizada por Mora Mora ni por el frontend.

## 16. Paginación y filtros

Listados grandes usarán paginación.

Ejemplo conceptual:

``` text
GET /api/v1/trips?from=...&to=...&assetId=...&status=...&page=...
```

Evitar endpoints que descarguen indefinidamente toda la historia.

Los reportes masivos deberán utilizar endpoints/procesos especializados.

## 17. Webhooks/eventos

No se introducirán colas complejas en el MVP.

Cuando sea útil, la integración podrá usar:

-   llamadas REST directas;
-   webhooks firmados;
-   tabla/outbox de eventos pendientes para reintentos.

Se recomienda patrón outbox ligero para eventos críticos como
cierre/bloqueo remoto si el stack lo justifica.

## 18. Reintentos

Solo reintentar errores potencialmente transitorios:

-   timeout;
-   429;
-   502;
-   503;
-   504;
-   fallos temporales de red.

No reintentar automáticamente errores funcionales 4xx sin corregir la
causa.

Usar backoff y límite de intentos.

## 19. Registro de sincronización

Cada intento relevante deberá poder rastrearse:

``` text
integration
direction
entity_type
internal_id
external_id
operation
request_id
attempt
status
http_status
started_at
finished_at
error_code
```

Payloads completos solo se conservarán cuando sea necesario y seguro. Se
evitará duplicar datos sensibles en logs.

## 20. Health checks

La aplicación deberá distinguir:

``` text
/health/live
/health/ready
```

Cuando el stack lo permita.

La caída de Mora Mora no necesariamente debe marcar a KLEBER como caído;
deberá reportarse como dependencia degradada.

## 21. OpenAPI

La API HTTP deberá documentarse mediante OpenAPI.

El contrato incluirá:

-   endpoints;
-   parámetros;
-   schemas;
-   errores;
-   autenticación;
-   ejemplos;
-   versionado.

Codex/Claude no deberán crear endpoints incompatibles con el contrato
aprobado sin actualizar primero la documentación correspondiente.

## 22. Ambientes

Como mínimo:

``` text
LOCAL
STAGING
PRODUCTION
```

Las integraciones de staging jamás deberán modificar datos de producción
de Mora Mora.

Credenciales, URLs y bases serán independientes por ambiente.

## 23. API de reportes PDF

El Resumen Ejecutivo por activo será generado server-side o mediante un
servicio interno controlado.

Ejemplo conceptual:

``` text
GET /api/v1/assets/{assetId}/executive-summary.pdf
```

Debe respetar:

-   organización;
-   permisos;
-   rango de fechas;
-   datos financieros autorizados.

No almacenar múltiples copias del mismo PDF sin necesidad. Cuando sea
posible, generarlo bajo demanda o conservar únicamente versiones
formalmente cerradas.

## 24. Integraciones futuras

La arquitectura debe permitir adaptadores independientes para:

``` text
Mora Mora
GPS/Telemetría
Bancos
DIAN
Nómina
WhatsApp/Notificaciones
Proveedores
IA/Analítica
```

Una integración futura no debe obligar a modificar la lógica central de
viajes.

## 25. Límites de costo

Para el MVP:

-   evitar gateways API pagos innecesarios;
-   evitar brokers administrados sin necesidad;
-   controlar volumen y retención de logs;
-   limitar llamadas repetitivas entre Mora Mora y KLEBER;
-   preferir sincronización incremental;
-   cachear únicamente cuando exista beneficio medible;
-   no introducir servicios cloud adicionales por conveniencia del
    agente de IA.

Toda dependencia nueva con costo recurrente debe registrarse en
COST_OPTIMIZATION/DECISIONS antes de incorporarse.

## 26. Pruebas mínimas de integración

Antes de producción deberán existir pruebas para:

1.  Crear viaje desde Mora Mora.
2.  Recibir dos veces el mismo viaje sin duplicarlo.
3.  Modificar viaje abierto.
4.  Rechazar modificación de viaje cerrado.
5.  Conciliar.
6.  Cerrar.
7.  Bloquear en Mora Mora.
8.  Simular caída de Mora Mora durante el cierre.
9.  Reintentar bloqueo.
10. Solicitar reapertura.
11. Autorizar reapertura.
12. Volver a conciliar.
13. Anular con trazabilidad.
14. Intentar acceso sin credenciales.
15. Intentar acceso de otra organización.
16. Conflicto de versiones concurrentes.

## 27. Regla para agentes de desarrollo

Antes de modificar integración Mora Mora ↔ KLEBER, Codex o Claude
deberán leer:

``` text
00_PROJECT_CHARTER.md
02_ARCHITECTURE.md
03_DATABASE.md
04_API_AND_INTEGRATIONS.md
SECURITY.md
DECISIONS.md
```

Si existe contradicción entre implementación y estos documentos, no
deberán improvisar una solución silenciosa.

Deberán:

1.  identificar la contradicción;
2.  proponer la decisión;
3.  actualizar el ADR/DECISIONS correspondiente;
4.  implementar después de quedar definida.

------------------------------------------------------------------------

## Criterio rector

> Mora Mora puede ser la fuente operativa del viaje, pero KLEBER
> conserva su propio modelo, su integridad financiera y el control final
> del dato una vez conciliado y cerrado.

La integración debe reducir digitación duplicada sin convertir a KLEBER
en una extensión frágil de Mora Mora.
