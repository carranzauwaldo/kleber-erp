# 05_SECURITY.md --- Seguridad de KLEBER ERP

**Proyecto:** KLEBER ERP\
**Estado:** Diseño base / Fase 0\
**Objetivo:** Establecer las reglas mínimas obligatorias de seguridad
para desarrollo, despliegue, operación, integraciones y manejo de datos.

------------------------------------------------------------------------

## 1. Principios de seguridad

KLEBER deberá diseñarse bajo estos principios:

1.  **Mínimo privilegio.**
2.  **Deny by default.**
3.  **Separación por organización.**
4.  **Validación siempre en backend.**
5.  **Secretos fuera del código.**
6.  **Auditoría de operaciones críticas.**
7.  **No confianza implícita entre módulos, usuarios o integraciones.**
8.  **Seguridad proporcional al riesgo y al costo.**
9.  **No almacenar datos sensibles que no sean necesarios.**
10. **Toda excepción de seguridad debe documentarse.**

------------------------------------------------------------------------

## 2. Alcance

Esta política aplica a:

-   frontend;
-   backend;
-   API;
-   base de datos;
-   almacenamiento de archivos;
-   autenticación;
-   usuarios;
-   roles;
-   integraciones;
-   Mora Mora;
-   logs;
-   backups;
-   despliegues;
-   CI/CD;
-   infraestructura;
-   documentos generados;
-   futuras funciones de IA;
-   agentes de desarrollo Codex/Claude.

------------------------------------------------------------------------

## 3. Modelo de amenazas inicial

Riesgos principales:

-   acceso no autorizado;
-   fuga entre organizaciones;
-   modificación indebida de viajes;
-   manipulación financiera;
-   reaperturas fraudulentas;
-   duplicación de movimientos;
-   robo de credenciales;
-   secretos expuestos en repositorio;
-   ataques a API;
-   inyección;
-   abuso de permisos;
-   pérdida de datos;
-   cambios no auditados;
-   alteración de sincronización Mora Mora ↔ KLEBER;
-   exposición de datos en logs;
-   uso indebido de ambientes de producción.

------------------------------------------------------------------------

## 4. Autenticación

La autenticación deberá estar gestionada por un proveedor confiable o
servicio interno probado.

Requisitos mínimos:

-   contraseñas nunca almacenadas en texto plano;
-   hash seguro si la autenticación es propia;
-   sesiones con expiración;
-   protección contra robo de sesión;
-   cierre de sesión;
-   recuperación segura de acceso;
-   MFA opcional inicialmente;
-   MFA recomendado para ADMIN y FINANCE;
-   bloqueo/rate limiting frente a intentos repetidos.

Si se utiliza un proveedor externo de autenticación, deberá ser
abstraído para evitar acoplamiento innecesario.

------------------------------------------------------------------------

## 5. Roles iniciales

Roles previstos:

``` text
ADMIN
FINANCE
REGISTRO_1
```

Principio:

> Un rol no concede acceso global automáticamente.

Los permisos se asignarán por capacidades.

Ejemplo conceptual:

``` text
trip.read
trip.create
trip.update
trip.close
trip.reopen
trip.cancel

finance.read
finance.create
finance.update
finance.approve

asset.read
asset.create
asset.update

user.manage
security.manage
report.export
audit.read
```

La matriz definitiva se documentará antes de producción.

------------------------------------------------------------------------

## 6. Reglas mínimas por rol

### ADMIN

Podrá administrar configuración general y usuarios autorizados.

No deberá saltarse controles financieros sin auditoría.

### FINANCE

Podrá consultar y operar componentes financieros según permisos.

No necesariamente podrá administrar usuarios ni configuración técnica.

### REGISTRO_1

Podrá registrar información operativa básica.

No podrá:

-   cerrar períodos;
-   reabrir viajes;
-   modificar permisos;
-   eliminar movimientos financieros;
-   cambiar configuraciones críticas.

------------------------------------------------------------------------

## 7. Separación multiempresa

Toda consulta susceptible de exponer datos empresariales deberá filtrar
por:

``` text
organization_id
```

Regla obligatoria:

> Nunca confiar en el organization_id recibido desde el frontend sin
> verificarlo contra la identidad autenticada.

Se deberá impedir:

-   acceso horizontal entre organizaciones;
-   modificación cruzada;
-   reportes cruzados;
-   búsqueda por ID global sin contexto de organización.

------------------------------------------------------------------------

## 8. Autorización server-side

Toda operación sensible debe validar:

``` text
identidad
+
organización
+
permiso
+
estado del recurso
+
regla de negocio
```

Ejemplo:

Un usuario puede tener `trip.update`, pero no editar un viaje ya
cerrado.

Por tanto:

``` text
permiso válido ≠ operación automáticamente permitida
```

------------------------------------------------------------------------

## 9. Integración Mora Mora ↔ KLEBER

La integración será máquina-a-máquina.

Requisitos:

-   credenciales independientes de usuarios humanos;
-   secretos separados por ambiente;
-   rotación;
-   posibilidad de revocación;
-   mínimo privilegio;
-   firma o mecanismo equivalente;
-   validación de origen;
-   rate limiting;
-   idempotencia;
-   auditoría;
-   logs controlados.

Mora Mora no tendrá acceso directo a la base de datos de KLEBER.

------------------------------------------------------------------------

## 10. Protección del cierre

Después de cierre:

-   Mora Mora no podrá editar unilateralmente;
-   KLEBER controla la reapertura;
-   toda reapertura requiere autorización;
-   se registra motivo;
-   se registra quién autoriza;
-   se conserva la versión anterior;
-   el cambio se vuelve a conciliar.

No habrá reaperturas silenciosas.

------------------------------------------------------------------------

## 11. Operaciones críticas

Se consideran críticas:

-   cierre de viaje;
-   reapertura;
-   anulación;
-   aprobación financiera;
-   modificación de tarifas;
-   cambio de propiedad de activos;
-   movimientos de caja;
-   pagos;
-   edición de cuentas por cobrar;
-   cambios de roles;
-   altas/bajas de usuarios;
-   cambios de integración;
-   rotación de credenciales;
-   cambios de configuración de seguridad.

Todas deberán ser auditadas.

------------------------------------------------------------------------

## 12. Auditoría de seguridad

Campos mínimos:

``` text
event_id
organization_id
user_id / service_id
action
entity_type
entity_id
timestamp
ip_address (cuando aplique)
user_agent (cuando aplique)
request_id
before
after
reason
source
result
```

No guardar secretos en auditoría.

------------------------------------------------------------------------

## 13. Gestión de secretos

Nunca almacenar:

-   claves API;
-   tokens;
-   contraseñas;
-   claves privadas;
-   cadenas de conexión;
-   credenciales cloud;

en:

-   repositorio;
-   archivos `.md`;
-   código fuente;
-   frontend;
-   commits;
-   capturas;
-   logs.

Usar:

-   variables de entorno;
-   secret manager;
-   vault del proveedor;
-   mecanismo equivalente.

Archivos como `.env` deben estar excluidos del repositorio.

------------------------------------------------------------------------

## 14. Repositorio

Reglas:

-   repositorio privado;
-   `main` protegida;
-   revisión antes de merge;
-   commits pequeños;
-   no subir secretos;
-   escaneo automático cuando sea posible;
-   dependencias bloqueadas mediante lockfile;
-   ramas por tarea;
-   CI para pruebas mínimas.

Codex/Claude no deberán imprimir secretos en respuestas ni añadirlos a
documentación.

------------------------------------------------------------------------

## 15. Validación de entrada

Validar siempre en backend:

-   tipos;
-   longitudes;
-   rangos;
-   formatos;
-   enums;
-   UUIDs;
-   fechas;
-   montos;
-   relaciones;
-   archivos;
-   IDs externos.

Ningún campo enviado por frontend se considerará confiable.

------------------------------------------------------------------------

## 16. Protección contra inyección

Evitar concatenación manual de consultas SQL.

Usar:

-   ORM seguro;
-   query builder;
-   prepared statements;
-   parámetros.

También validar:

-   filtros;
-   ordenamientos;
-   búsquedas;
-   consultas dinámicas.

------------------------------------------------------------------------

## 17. Frontend

Nunca confiar secretos al frontend.

El frontend no deberá contener:

-   claves privadas;
-   credenciales de servicio;
-   secretos de base de datos;
-   tokens permanentes.

Los permisos visibles en UI son solo una mejora UX.

La autorización real ocurre en backend.

------------------------------------------------------------------------

## 18. Manejo de sesión

Requisitos:

-   tokens de corta duración cuando aplique;
-   refresh seguro;
-   revocación;
-   expiración;
-   invalidación en cambio de contraseña;
-   protección CSRF si se usan cookies;
-   cookies `HttpOnly`, `Secure`, `SameSite` cuando aplique.

------------------------------------------------------------------------

## 19. CORS

Configurar explícitamente dominios permitidos.

No usar:

``` text
Access-Control-Allow-Origin: *
```

en endpoints autenticados de producción salvo justificación documentada.

------------------------------------------------------------------------

## 20. Rate limiting

Aplicar inicialmente a:

-   login;
-   recuperación de contraseña;
-   endpoints públicos;
-   integración Mora Mora;
-   generación de reportes pesados;
-   futuras funciones de IA.

El objetivo es evitar abuso sin introducir infraestructura costosa.

------------------------------------------------------------------------

## 21. Archivos

Los archivos deberán:

-   validarse por tipo;
-   limitar tamaño;
-   usar nombres internos seguros;
-   evitar ejecución directa;
-   almacenarse fuera de rutas públicas cuando sea necesario;
-   usar URLs firmadas si aplica;
-   tener control de acceso.

No confiar en extensión del archivo.

------------------------------------------------------------------------

## 22. PDFs

Los PDFs generados pueden contener información financiera.

Por tanto:

-   solo usuarios autorizados podrán generarlos;
-   la URL no debe ser pública permanentemente;
-   deben respetar organization_id;
-   si se almacenan, su acceso debe quedar protegido;
-   se evitará cache público.

------------------------------------------------------------------------

## 23. Datos financieros

Los montos deberán manejarse con tipos numéricos precisos.

No usar `float` para cálculos monetarios críticos.

Reglas:

-   moneda explícita;
-   redondeo definido;
-   historial;
-   trazabilidad;
-   conciliación;
-   autorización según riesgo.

------------------------------------------------------------------------

## 24. Datos personales

Recolectar solo información necesaria.

Para empleados/conductores:

-   evitar duplicación;
-   restringir acceso;
-   no exponer documentos personales innecesariamente;
-   definir retención;
-   cumplir la normativa aplicable en Colombia.

El sistema no deberá utilizar datos personales para finalidades
distintas sin justificación.

------------------------------------------------------------------------

## 25. Logs

Los logs técnicos no deberán incluir:

-   contraseñas;
-   tokens;
-   secretos;
-   cadenas de conexión;
-   payloads completos innecesarios;
-   tarjetas completas;
-   datos personales sensibles.

Cuando sea necesario registrar un identificador, enmascararlo si
corresponde.

------------------------------------------------------------------------

## 26. Manejo de errores

Producción no deberá mostrar:

-   stack traces;
-   nombres internos de tablas;
-   rutas del servidor;
-   variables de entorno;
-   secretos;
-   consultas SQL completas.

Respuesta al usuario:

``` text
mensaje controlado
+
error_code
+
request_id
```

Detalles técnicos quedan en logs internos.

------------------------------------------------------------------------

## 27. Backups

Debe existir una estrategia antes de producción.

Mínimo:

-   backup automático;
-   retención definida;
-   prueba periódica de restauración;
-   copia independiente cuando el riesgo lo justifique;
-   cifrado;
-   control de acceso.

Un backup no probado no se considera recuperación confiable.

------------------------------------------------------------------------

## 28. Recuperación

Documentar:

``` text
RPO
RTO
responsable
procedimiento
```

Para MVP puede ser simple, pero debe existir.

La prioridad inicial es evitar pérdida total de:

-   viajes;
-   movimientos financieros;
-   auditoría;
-   usuarios;
-   cierres.

------------------------------------------------------------------------

## 29. Ambientes

Separación obligatoria:

``` text
LOCAL
STAGING
PRODUCTION
```

Nunca:

-   usar producción para pruebas;
-   conectar staging a base productiva;
-   reutilizar credenciales entre ambientes;
-   usar usuarios productivos ficticiamente en pruebas.

------------------------------------------------------------------------

## 30. Datos de prueba

No utilizar datos reales sensibles innecesariamente.

Preferir:

-   fixtures;
-   datos anonimizados;
-   datos sintéticos.

------------------------------------------------------------------------

## 31. Dependencias

Reglas:

-   usar versiones estables;
-   evitar dependencias abandonadas;
-   revisar vulnerabilidades;
-   no instalar librerías solo porque un agente las sugiera;
-   eliminar paquetes no usados;
-   mantener lockfile.

Antes de añadir una dependencia importante:

``` text
¿es necesaria?
¿es segura?
¿está mantenida?
¿incrementa costos?
¿puede resolverse con stack actual?
```

------------------------------------------------------------------------

## 32. CI/CD

Pipeline mínimo:

``` text
lint
typecheck
tests
build
security checks básicos
deploy
```

Producción deberá depender de una rama protegida.

No hacer despliegues manuales desde máquinas personales como
procedimiento habitual.

------------------------------------------------------------------------

## 33. Base de datos

Requisitos:

-   conexión cifrada;
-   usuario de aplicación con permisos mínimos;
-   migraciones controladas;
-   no usar usuario administrador para operación normal;
-   índices adecuados;
-   constraints;
-   backups;
-   logs de cambios críticos.

Si el proveedor soporta Row Level Security y se decide usarla, debe
considerarse defensa adicional, no sustituto de autorización backend.

------------------------------------------------------------------------

## 34. Eliminación de datos

Entidades críticas no deberán eliminarse físicamente salvo procedimiento
excepcional.

Preferir:

``` text
ACTIVE
INACTIVE
CANCELLED
ARCHIVED
```

Cuando la eliminación física sea legalmente necesaria, deberá
documentarse y auditarse.

------------------------------------------------------------------------

## 35. Seguridad de reportes

Un reporte debe filtrar por:

``` text
organization
+
usuario
+
permiso
+
alcance temporal
```

Exportar datos no deberá evadir controles que existen en pantalla.

------------------------------------------------------------------------

## 36. Seguridad en futuras funciones IA

La IA futura no tendrá acceso indiscriminado a la base.

Principios:

-   exponer solo datos necesarios;
-   minimizar PII;
-   controlar prompts;
-   registrar acciones automatizadas;
-   no permitir acciones financieras irreversibles sin aprobación
    humana;
-   evitar enviar secretos a modelos externos;
-   revisar proveedor y retención de datos.

------------------------------------------------------------------------

## 37. Seguridad de Codex y Claude

Los agentes deberán:

-   trabajar solo en archivos asignados;
-   no modificar `.env`;
-   no imprimir secretos;
-   no desactivar validaciones para "hacer funcionar" pruebas;
-   no eliminar controles de acceso;
-   no cambiar permisos sin tarea explícita;
-   no crear bypasses temporales en producción;
-   no reemplazar seguridad por comentarios TODO.

Toda tarea relacionada con:

-   auth;
-   permisos;
-   dinero;
-   conciliación;
-   cierre;
-   integración;
-   migraciones;

debe usar esfuerzo medio/alto del modelo según complejidad.

------------------------------------------------------------------------

## 38. Checklist antes de producción

Debe verificarse:

-   [ ] repositorio privado;
-   [ ] secretos fuera del código;
-   [ ] `.env` ignorado;
-   [ ] autenticación activa;
-   [ ] RBAC validado;
-   [ ] separación multiempresa probada;
-   [ ] API protegida;
-   [ ] CORS definido;
-   [ ] rate limiting mínimo;
-   [ ] validación backend;
-   [ ] logs sin secretos;
-   [ ] backups activos;
-   [ ] restore probado;
-   [ ] HTTPS;
-   [ ] staging separado;
-   [ ] pruebas de integración;
-   [ ] auditoría;
-   [ ] manejo de errores;
-   [ ] dependencias revisadas;
-   [ ] permisos de almacenamiento;
-   [ ] integración Mora Mora autenticada;
-   [ ] reapertura controlada;
-   [ ] cierre bloqueado correctamente;
-   [ ] no existe borrado silencioso de datos críticos.

------------------------------------------------------------------------

## 39. Severidad de incidentes

### SEV-1

Pérdida de datos, acceso no autorizado masivo, corrupción financiera o
compromiso de credenciales críticas.

### SEV-2

Función crítica indisponible, modificación indebida limitada o
integración afectada con riesgo operativo.

### SEV-3

Problema menor sin riesgo material de seguridad o integridad.

Los incidentes SEV-1 deberán priorizarse sobre cualquier desarrollo
funcional.

------------------------------------------------------------------------

## 40. Regla de excepción

Si por costo o velocidad se propone omitir un control:

1.  documentar qué control se omite;
2.  describir el riesgo;
3.  definir compensación;
4.  fijar fecha o condición de revisión;
5.  registrar la decisión.

No se aceptará una excepción de seguridad implícita.

------------------------------------------------------------------------

## Criterio rector

> KLEBER debe ser sencillo de operar, pero difícil de manipular sin
> autorización.

La velocidad del MVP nunca deberá lograrse sacrificando:

-   integridad financiera;
-   aislamiento entre organizaciones;
-   control de accesos;
-   auditoría;
-   recuperación de datos;
-   seguridad de integraciones.
