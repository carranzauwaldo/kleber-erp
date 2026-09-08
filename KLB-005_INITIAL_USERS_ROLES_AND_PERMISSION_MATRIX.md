# KLB-005 --- Initial Users, Roles and Permission Matrix Specification

**Proyecto:** KLEBER ERP\
**Fecha:** 2026-09-07\
**Estado:** ESPECIFICACIÓN --- PENDIENTE DE USUARIOS REALES\
**Objetivo:** Definir el modelo inicial de usuarios, roles y permisos de
KLEBER antes de implementar RBAC, sin inventar nombres de personas ni
conceder privilegios innecesarios.

------------------------------------------------------------------------

## 1. Principio

KLEBER utilizará control de acceso por permisos.

``` text
Usuario
  ↓
Organización
  ↓
Rol
  ↓
Permisos
  ↓
Estado del recurso
  ↓
Regla de negocio
```

El rol simplifica la administración, pero el backend valida la
autorización real.

------------------------------------------------------------------------

## 2. Roles iniciales provisionales

Se mantienen los tres perfiles definidos provisionalmente:

``` text
ADMIN
FINANCE
REGISTRO_1
```

Los nombres pueden cambiar antes de producción.

------------------------------------------------------------------------

## 3. ADMIN

Responsable de administración general.

Capacidades iniciales:

-   gestionar usuarios;
-   asignar roles;
-   administrar catálogos;
-   gestionar activos;
-   gestionar clientes;
-   gestionar rutas/tarifas;
-   registrar/editar viajes permitidos;
-   revisar información financiera;
-   conciliar;
-   cerrar;
-   autorizar reaperturas;
-   anular según reglas;
-   consultar auditoría;
-   generar reportes.

Las operaciones especialmente sensibles podrán exigir confirmación
adicional.

------------------------------------------------------------------------

## 4. FINANCE

Perfil financiero/contable.

Capacidades esperadas:

-   consultar viajes;
-   consultar clientes;
-   registrar/revisar anticipos;
-   registrar/revisar gastos;
-   liquidar anticipos;
-   gestionar cartera;
-   registrar pagos;
-   consultar obligaciones;
-   registrar pagos de obligaciones;
-   consultar mantenimiento/costos;
-   generar reportes financieros;
-   participar en conciliación según matriz definitiva.

No administra usuarios por defecto.

------------------------------------------------------------------------

## 5. REGISTRO_1

Perfil operativo básico.

Capacidades esperadas:

-   consultar catálogos necesarios;
-   registrar viajes;
-   consultar viajes permitidos;
-   registrar información operacional;
-   adjuntar soportes;
-   consultar activos necesarios para registro.

No podrá por defecto:

-   gestionar usuarios;
-   modificar roles;
-   consultar información financiera global;
-   borrar operaciones;
-   autorizar reaperturas;
-   modificar viajes cerrados;
-   cambiar configuración de seguridad.

------------------------------------------------------------------------

## 6. Permisos granulares

Los roles se construirán sobre permisos explícitos.

Ejemplo:

``` text
assets.read
assets.create
assets.update

trips.read
trips.create
trips.update
trips.close
trips.reopen.authorize
trips.cancel

finance.advances.read
finance.advances.create
finance.settlements.create
finance.receivables.read
finance.payments.create

users.read
users.manage

audit.read
reports.read
```

Los nombres definitivos se establecerán al implementar.

------------------------------------------------------------------------

## 7. Matriz inicial

  Acción                     ADMIN     FINANCE     REGISTRO_1
  ------------------------- ------- ------------- ------------
  Consultar activos            ✓          ✓            ✓
  Crear/editar activos         ✓      opcional        ---
  Consultar clientes           ✓          ✓            ✓
  Gestionar clientes           ✓          ✓         limitado
  Consultar rutas/tarifas      ✓          ✓            ✓
  Modificar tarifas            ✓      opcional        ---
  Crear viaje                  ✓      opcional         ✓
  Editar viaje abierto         ✓      limitado         ✓
  Cerrar viaje                 ✓     por definir      ---
  Autorizar reapertura         ✓         ---          ---
  Registrar anticipo           ✓          ✓           ---
  Liquidar anticipo            ✓          ✓           ---
  Consultar cartera            ✓          ✓           ---
  Registrar pago               ✓          ✓           ---
  Gestionar obligaciones       ✓          ✓           ---
  Consultar auditoría          ✓      limitado        ---
  Gestionar usuarios           ✓         ---          ---
  Generar PDF ejecutivo        ✓          ✓         limitado

`opcional`, `limitado` y `por definir` requieren validación humana antes
de producción.

------------------------------------------------------------------------

## 8. Segregación de funciones

Cuando el tamaño del equipo lo permita, conviene separar:

``` text
registro
≠
aprobación/cierre
≠
reapertura
```

Con un equipo pequeño puede ser inevitable que ADMIN acumule funciones,
pero la auditoría permanecerá activa.

------------------------------------------------------------------------

## 9. Estado del recurso

Tener permiso `trips.update` no significa poder editar cualquier viaje.

Ejemplo:

``` text
trips.update
+
trip.status = OPEN
→ permitido

trips.update
+
trip.status = CLOSED
→ rechazado
```

Para un cerrado se requiere el flujo de reapertura.

------------------------------------------------------------------------

## 10. Scope de organización

Toda autorización deberá comprobar `organization_id`.

No basta:

``` text
user has trips.read
```

Debe cumplirse también que el recurso pertenezca a una organización
accesible para el usuario.

------------------------------------------------------------------------

## 11. Superadministrador

No crear un `SUPER_ADMIN` global durante MVP salvo necesidad real.

Un rol con acceso transversal a todas las organizaciones aumenta el
riesgo y no aporta valor mientras KLEBER sea una sola organización.

------------------------------------------------------------------------

## 12. Cuenta de servicio Mora Mora

Mora Mora no utilizará un usuario humano.

Usará identidad M2M separada con permisos mínimos.

Ejemplo conceptual:

``` text
integration.mora_mora.trip.create
integration.mora_mora.trip.update_open
integration.mora_mora.status.read
```

Nunca:

``` text
users.manage
finance.payments.create
trips.reopen.authorize
```

------------------------------------------------------------------------

## 13. Identidades de sistema

Distinguir:

``` text
HUMAN
SERVICE
SYSTEM
```

para auditoría.

------------------------------------------------------------------------

## 14. Alta de usuario

Flujo:

``` text
ADMIN invita/crea
↓
identidad validada
↓
asociación organización
↓
rol
↓
activación
```

No otorgar permisos por defecto más amplios de lo necesario.

------------------------------------------------------------------------

## 15. Baja

Al retirar acceso:

-   desactivar asociación;
-   invalidar sesiones según capacidades del proveedor;
-   conservar historial;
-   no borrar auditoría;
-   conservar autoría de registros anteriores.

------------------------------------------------------------------------

## 16. Cambio de rol

Registrar:

-   usuario afectado;
-   rol anterior;
-   rol nuevo;
-   quién cambió;
-   fecha;
-   motivo cuando sea sensible.

------------------------------------------------------------------------

## 17. MFA

Se evaluará en la selección final de Auth.

Preferencia de seguridad:

-   obligatorio para ADMIN en producción cuando el proveedor lo permita
    razonablemente;
-   recomendable para FINANCE;
-   política para otros usuarios según riesgo.

------------------------------------------------------------------------

## 18. Sesiones

La estrategia definitiva depende del proveedor de identidad.

Requisitos:

-   expiración;
-   revocación;
-   recuperación segura;
-   protección contra sesiones robadas;
-   cierre de sesión.

------------------------------------------------------------------------

## 19. Contraseñas

Si KLEBER gestiona credenciales directa o indirectamente:

-   nunca almacenar contraseña en texto;
-   usar proveedor/algoritmo seguro;
-   recuperación mediante flujo seguro;
-   no enviar contraseñas por WhatsApp/correo.

------------------------------------------------------------------------

## 20. Información financiera

Permisos financieros se dividirán cuando sea necesario entre:

``` text
read
create
approve
reverse
```

No usar un único permiso `finance.all`.

------------------------------------------------------------------------

## 21. Operaciones críticas

Requerir permisos específicos para:

-   cierre;
-   reapertura;
-   anulación;
-   reversión financiera;
-   cambio de tarifa;
-   modificación de propiedad;
-   gestión de usuarios;
-   exportaciones sensibles.

------------------------------------------------------------------------

## 22. Auditoría

Eventos de acceso/seguridad importantes:

-   login relevante;
-   fallo repetido;
-   cambio de rol;
-   alta/baja;
-   reapertura;
-   cierre;
-   reversión;
-   cambio de configuración crítica.

------------------------------------------------------------------------

## 23. UI

El frontend ocultará/deshabilitará acciones no autorizadas para mejorar
UX.

Pero:

``` text
UI permission ≠ security boundary
```

NestJS deberá validar siempre.

------------------------------------------------------------------------

## 24. Pruebas RBAC

Cada endpoint crítico deberá probar:

``` text
authorized → success
unauthenticated → reject
wrong permission → reject
wrong organization → reject
invalid resource state → reject
```

------------------------------------------------------------------------

## 25. Principio de mínimo privilegio

Un usuario recibe solo permisos necesarios para su trabajo actual.

No conceder ADMIN como solución rápida a problemas de permisos.

------------------------------------------------------------------------

## 26. Permisos temporales

Si posteriormente se necesitan:

``` text
temporary role
valid_from
valid_until
```

pero no implementarlos en MVP sin caso real.

------------------------------------------------------------------------

## 27. Vacaciones/reemplazos

La delegación temporal podrá añadirse cuando exista necesidad.

No compartir cuentas.

------------------------------------------------------------------------

## 28. Usuarios compartidos

Prohibir cuentas tipo:

``` text
operaciones@...
admin1 compartido
usuario oficina
```

Cada persona debe tener identidad propia para preservar auditoría.

------------------------------------------------------------------------

## 29. Exportaciones

La exportación masiva de datos podrá requerir permiso diferente de
lectura normal.

Ejemplo:

``` text
reports.read
reports.export
```

------------------------------------------------------------------------

## 30. Datos necesarios antes del go-live

Por cada usuario real:

-   nombre;
-   correo/identificador;
-   cargo;
-   organización;
-   rol;
-   permisos excepcionales;
-   estado;
-   necesidad de MFA.

No almacenar información personal que no tenga propósito operacional.

------------------------------------------------------------------------

## 31. Plantilla de levantamiento

``` text
Name
Email
Job Role
System Role
Organization
Can Close Trips?
Can Reopen Trips?
Can Register Payments?
Can Manage Users?
Can View Audit?
MFA Required?
Notes
```

------------------------------------------------------------------------

## 32. Preguntas pendientes

Antes de cerrar la matriz:

1.  ¿Quién será ADMIN principal?
2.  ¿Quién manejará finanzas?
3.  ¿Quién hará registro diario?
4.  ¿FINANCE podrá cerrar viajes?
5.  ¿Quién concilia Mora Mora?
6.  ¿Quién autoriza reaperturas?
7.  ¿Quién modifica tarifas?
8.  ¿Quién puede anular operaciones?
9.  ¿Quién puede exportar reportes completos?
10. ¿Se requiere más de un ADMIN?

------------------------------------------------------------------------

## 33. Resultado

``` text
KLB-005 = ROLE SPECIFICATION READY
REAL USERS = PENDING
FINAL PERMISSION MATRIX = PENDING VALIDATION
```

------------------------------------------------------------------------

## 34. Próximo paso de ejecución

De acuerdo con el backlog original, después de KLB-005 comienza el
bloque técnico:

``` text
KLB-010 — Crear repositorio y estructura
KLB-011 — Incorporar documentación Fase 0
KLB-012 — Configurar calidad
KLB-013 — Configurar CI
KLB-014 — Configurar secretos y ambientes
```

Los identificadores KLB-006 a KLB-009 quedan reservados y no necesitan
inventarse solo para mantener numeración consecutiva.

------------------------------------------------------------------------

## Criterio final

> Los roles simplifican la administración; los permisos y las reglas de
> negocio protegen realmente el sistema.

KLEBER debe permitir que cada persona haga su trabajo sin conceder
acceso innecesario a operaciones financieras, administrativas o
críticas.
