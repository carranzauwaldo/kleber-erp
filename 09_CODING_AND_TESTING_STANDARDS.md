# 09_CODING_AND_TESTING_STANDARDS.md --- Estándares de código y pruebas

**Proyecto:** KLEBER ERP\
**Estado:** Diseño base / Fase 0\
**Objetivo:** Establecer reglas técnicas comunes para que el código
producido por desarrolladores, Codex y Claude sea consistente,
mantenible, seguro y verificable.

------------------------------------------------------------------------

## 1. Principio rector

El código de KLEBER debe optimizarse para ser entendido y mantenido, no
para demostrar complejidad técnica.

Prioridades:

``` text
CORRECTO
→ SEGURO
→ LEGIBLE
→ PROBADO
→ SIMPLE
→ EFICIENTE
```

La optimización prematura queda por debajo de estas prioridades.

------------------------------------------------------------------------

## 2. Aplicación de estos estándares

Aplican a:

-   frontend;
-   backend;
-   dominio;
-   infraestructura;
-   integraciones;
-   migraciones;
-   scripts;
-   pruebas;
-   automatizaciones;
-   código generado por IA.

Cuando el framework elegido imponga una convención razonable, se
preferirá la convención oficial sobre crear una propia.

------------------------------------------------------------------------

## 3. Arquitectura

KLEBER utilizará inicialmente un **monolito modular**.

Cada módulo deberá mantener separación conceptual entre:

``` text
presentation
application
domain
infrastructure
tests
```

No es obligatorio crear carpetas vacías para todas las capas. La
estructura debe aparecer cuando exista código real que la justifique.

------------------------------------------------------------------------

## 4. Dependencias entre módulos

Un módulo no deberá importar internals arbitrarios de otro.

Preferir:

-   interfaces públicas;
-   application services;
-   DTOs/contratos;
-   eventos cuando exista justificación.

Evitar dependencias circulares.

------------------------------------------------------------------------

## 5. Reglas de dominio

Las reglas importantes no deberán vivir únicamente en:

-   componentes UI;
-   controladores;
-   rutas HTTP;
-   consultas SQL;
-   jobs.

Ejemplos:

-   viaje cerrado no puede modificarse;
-   tarifa histórica no cambia retroactivamente;
-   reapertura requiere autorización;
-   pago no puede duplicarse.

Estas reglas deben ser explícitas y testeables.

------------------------------------------------------------------------

## 6. Nombres

Usar nombres descriptivos.

Preferir:

``` text
calculateOutstandingBalance()
closeTrip()
authorizeTripReopen()
routeRateSnapshot
```

Evitar:

``` text
doStuff()
processData()
x1
temp2
helperFinal()
```

------------------------------------------------------------------------

## 7. Idioma del código

Preferencia:

-   código, variables, clases, APIs y nombres técnicos: **inglés**;
-   textos de interfaz/documentación funcional: español;
-   comentarios: idioma que resulte más claro, manteniendo consistencia.

Ejemplo:

``` text
Trip
RouteRate
OperationalAdvance
Receivable
MaintenanceOrder
```

------------------------------------------------------------------------

## 8. Formato

El formatter del stack será obligatorio.

No discutir manualmente estilos que puedan resolverse automáticamente.

Configurar:

-   formatter;
-   linter;
-   editor config;
-   type checker cuando aplique.

------------------------------------------------------------------------

## 9. Tipado

Si el stack soporta tipado estático, utilizarlo estrictamente.

Evitar:

-   `any` indiscriminado;
-   casts para silenciar errores;
-   tipos excesivamente amplios.

Las fronteras externas deben validarse en runtime aunque exista
TypeScript u otro tipado estático.

------------------------------------------------------------------------

## 10. Funciones

Preferir funciones:

-   pequeñas;
-   con responsabilidad clara;
-   con pocos efectos laterales;
-   fáciles de probar.

No establecer un límite artificial de líneas, pero dividir cuando una
función mezcle responsabilidades.

------------------------------------------------------------------------

## 11. Comentarios

Los comentarios deben explicar **por qué**, no repetir el código.

Bueno:

``` text
// Keep the historical rate because later tariff changes
// must not alter already-created trips.
```

Malo:

``` text
// Set rate
rate = value
```

------------------------------------------------------------------------

## 12. TODOs

Un TODO relevante deberá indicar contexto o referencia de backlog.

Ejemplo:

``` text
TODO(KLB-142): replace temporary reconciliation rule after Mora Mora API v2.
```

No dejar:

``` text
TODO fix later
```

en lógica crítica.

------------------------------------------------------------------------

## 13. Manejo de errores

No silenciar excepciones.

Cada capa deberá distinguir:

-   errores esperados de negocio;
-   errores de validación;
-   errores de autorización;
-   conflictos;
-   fallos externos;
-   errores inesperados.

No devolver stack traces al cliente.

------------------------------------------------------------------------

## 14. Excepciones de dominio

Utilizar errores/códigos explícitos para casos como:

``` text
TRIP_ALREADY_CLOSED
ROUTE_RATE_NOT_FOUND
REOPEN_NOT_AUTHORIZED
DUPLICATE_EXTERNAL_TRIP
PAYMENT_EXCEEDS_BALANCE
```

Los nombres definitivos se centralizarán.

------------------------------------------------------------------------

## 15. Dinero

Nunca usar tipos de coma flotante para lógica monetaria crítica.

Usar:

-   decimal/numeric;
-   moneda explícita;
-   reglas de redondeo definidas.

Las pruebas deberán cubrir centavos/redondeos cuando apliquen.

------------------------------------------------------------------------

## 16. Fechas y horas

Guardar timestamps de sistema preferentemente en UTC.

Presentar al usuario según zona horaria configurada.

Fechas puras de negocio podrán usar tipo `date`.

No mezclar silenciosamente:

``` text
date
datetime
local time
UTC
```

Zona inicial de operación:

``` text
America/Bogota
```

sin asumir que será la única para siempre.

------------------------------------------------------------------------

## 17. IDs

No exponer secuenciales internos si no existe necesidad.

Preferir UUID conforme a `03_DATABASE.md`.

Nunca confiar en que conocer un ID autoriza acceso al recurso.

------------------------------------------------------------------------

## 18. Base de datos

Toda modificación de esquema:

-   migración versionada;
-   revisión;
-   prueba local;
-   prueba staging.

Usar constraints para proteger invariantes que la DB pueda garantizar.

------------------------------------------------------------------------

## 19. Consultas

Evitar:

-   `SELECT *` indiscriminado;
-   N+1;
-   cargar relaciones completas sin necesidad;
-   consultas dentro de loops cuando puedan agruparse.

Medir antes de introducir caché compleja.

------------------------------------------------------------------------

## 20. Transacciones

Usar transacciones en operaciones que deban ser atómicas.

Ejemplos:

-   liquidación de anticipo;
-   asignación de pago;
-   cierre financiero;
-   creación de movimiento + auditoría crítica cuando corresponda.

No mantener transacciones abiertas durante llamadas lentas a APIs
externas.

------------------------------------------------------------------------

## 21. Integraciones externas

Encapsular cada integración detrás de un adaptador.

Ejemplo:

``` text
MoraMoraGateway
```

La lógica de negocio no debe depender directamente de detalles HTTP del
proveedor.

------------------------------------------------------------------------

## 22. Idempotencia

Operaciones susceptibles a retry deberán ser idempotentes.

Especialmente:

-   Mora Mora;
-   pagos;
-   webhooks;
-   jobs;
-   comandos críticos.

Las pruebas deben incluir reenvío.

------------------------------------------------------------------------

## 23. Frontend

Componentes deberán separar, cuando sea razonable:

-   presentación;
-   estado;
-   acceso a API;
-   reglas de formulario.

No duplicar reglas críticas del backend como única validación.

------------------------------------------------------------------------

## 24. Estados de interfaz

Toda pantalla con datos remotos deberá contemplar:

``` text
loading
success
empty
error
unauthorized
```

cuando correspondan.

------------------------------------------------------------------------

## 25. Formularios

Requisitos:

-   labels claros;
-   validación;
-   mensajes específicos;
-   evitar doble envío;
-   conservar información cuando un error recuperable ocurra;
-   confirmar acciones destructivas/críticas.

------------------------------------------------------------------------

## 26. Accesibilidad

Mínimo:

-   navegación razonable por teclado;
-   labels;
-   contraste adecuado;
-   foco visible;
-   semántica HTML;
-   no depender únicamente del color.

------------------------------------------------------------------------

## 27. Responsive

La prioridad es escritorio corporativo, pero las vistas principales
deberán ser utilizables en tablet/móvil cuando sea razonable.

No diseñar exclusivamente para una resolución fija.

------------------------------------------------------------------------

## 28. API

Seguir `04_API_AND_INTEGRATIONS.md`.

Reglas:

-   versionado;
-   validación;
-   códigos de error consistentes;
-   paginación;
-   autorización;
-   request/correlation ID;
-   OpenAPI.

------------------------------------------------------------------------

## 29. Seguridad

Seguir `05_SECURITY.md`.

Ninguna prueba o necesidad de desarrollo justifica dejar bypasses de
seguridad en producción.

------------------------------------------------------------------------

## 30. Pirámide de pruebas

Objetivo:

``` text
          E2E
       integración
    unitarias/dominio
```

Mayor cantidad de pruebas rápidas en la base.

No convertir todos los escenarios en E2E.

------------------------------------------------------------------------

## 31. Pruebas unitarias

Priorizar para:

-   cálculos;
-   reglas de dominio;
-   estados;
-   validaciones;
-   tarifas;
-   rentabilidad;
-   saldos;
-   fechas;
-   transiciones.

Deben ser rápidas y deterministas.

------------------------------------------------------------------------

## 32. Pruebas de integración

Priorizar para:

-   repositorios;
-   PostgreSQL;
-   transacciones;
-   constraints;
-   API;
-   auth;
-   Mora Mora;
-   almacenamiento.

Cuando la regla depende del comportamiento real de la DB, no
reemplazarla siempre por mocks.

------------------------------------------------------------------------

## 33. E2E

Mantener un conjunto pequeño de flujos críticos:

1.  login;
2.  registrar activo;
3.  crear viaje;
4.  consultar viaje;
5.  conciliar/cerrar;
6.  anticipo y liquidación;
7.  cartera/pago;
8.  permisos;
9.  sincronización Mora Mora;
10. reporte ejecutivo.

------------------------------------------------------------------------

## 34. Pruebas negativas

Obligatorias en seguridad y negocio.

Ejemplos:

-   usuario sin permiso;
-   tenant incorrecto;
-   viaje cerrado;
-   pago duplicado;
-   versión externa vieja;
-   monto inválido;
-   ID inexistente;
-   payload malformado.

------------------------------------------------------------------------

## 35. Regresiones

Todo bug importante corregido deberá generar una prueba que falle antes
de la corrección y pase después.

------------------------------------------------------------------------

## 36. Mocks

Usar mocks para fronteras externas cuando sean útiles.

No mockear tanta lógica que la prueba deje de representar comportamiento
real.

Para Mora Mora mantener:

-   mock/sandbox;
-   fixtures representativos;
-   contract tests.

------------------------------------------------------------------------

## 37. Datos de prueba

No depender de datos productivos.

Usar factories/fixtures y datos sintéticos.

Cada test debe limpiar o aislar sus datos.

------------------------------------------------------------------------

## 38. Determinismo

Las pruebas no deberán depender innecesariamente de:

-   hora actual real;
-   orden aleatorio;
-   red externa;
-   datos de producción;
-   servicios terceros.

Inyectar reloj/IDs cuando ayude.

------------------------------------------------------------------------

## 39. Cobertura

La cobertura porcentual es una señal, no el objetivo.

Priorizar cobertura de:

-   reglas críticas;
-   estados;
-   dinero;
-   seguridad;
-   integraciones.

No escribir tests sin valor únicamente para elevar porcentaje.

------------------------------------------------------------------------

## 40. Quality gates

Antes de merge:

``` text
formatter
lint
typecheck
unit tests
integration tests relevantes
build
```

E2E podrá ejecutarse según impacto y pipeline.

------------------------------------------------------------------------

## 41. Performance

No optimizar sin evidencia.

Sí evitar desde el inicio:

-   N+1 obvios;
-   endpoints sin paginación;
-   loops con llamadas externas;
-   cargas completas innecesarias.

Agregar pruebas de rendimiento cuando exista volumen que lo justifique.

------------------------------------------------------------------------

## 42. Seguridad automatizada

Incorporar gradualmente:

-   dependency scanning;
-   secret scanning;
-   análisis estático;
-   actualización controlada de dependencias.

No aceptar automáticamente upgrades mayores sin pruebas.

------------------------------------------------------------------------

## 43. Logs

Usar logs estructurados cuando el stack lo permita.

Incluir:

``` text
timestamp
level
requestId
service/module
event
```

y referencias necesarias.

Nunca secretos.

------------------------------------------------------------------------

## 44. Feature flags

Si se usan, deben tener:

-   nombre claro;
-   responsable;
-   fecha/condición de retiro.

Eliminar flags obsoletos.

------------------------------------------------------------------------

## 45. Código muerto

Eliminar código que ya no se usa una vez confirmado.

No mantener grandes bloques comentados "por si acaso"; Git conserva
historial.

------------------------------------------------------------------------

## 46. Refactor

Refactorizar cuando:

-   reduzca duplicación significativa;
-   simplifique reglas;
-   mejore testabilidad;
-   elimine acoplamiento;
-   facilite cambios previstos.

No hacer refactors masivos dentro de una tarea funcional sin necesidad.

------------------------------------------------------------------------

## 47. Definition of Done técnica

Un cambio está terminado cuando:

-   cumple criterios;
-   compila;
-   formatter/lint pasan;
-   typecheck pasa;
-   tests relevantes pasan;
-   no expone secretos;
-   respeta arquitectura;
-   documentación está actualizada si cambió contrato;
-   no introduce warnings críticos conocidos;
-   diff es revisable.

------------------------------------------------------------------------

## 48. Reglas específicas para agentes IA

Codex y Claude deberán:

1.  leer documentos indicados;
2.  respetar archivos permitidos;
3.  no ampliar alcance silenciosamente;
4.  ejecutar pruebas;
5.  reportar fallos reales;
6.  no afirmar que algo fue probado si no se ejecutó;
7.  no desactivar tests para completar una tarea;
8.  no introducir dependencias sin justificar;
9.  mantener cambios pequeños;
10. señalar decisiones no definidas.

------------------------------------------------------------------------

## 49. Revisión de PR

Preguntas mínimas:

-   ¿cumple la regla de negocio?
-   ¿rompe otra?
-   ¿está autorizado?
-   ¿respeta tenant?
-   ¿maneja errores?
-   ¿tiene tests?
-   ¿hay migración?
-   ¿hay impacto financiero?
-   ¿hay secretos?
-   ¿introduce costo?
-   ¿la solución es más compleja de lo necesario?

------------------------------------------------------------------------

## 50. Criterio final

> El estándar de KLEBER no es producir la mayor cantidad de código; es
> producir la menor cantidad de código necesaria para implementar
> correctamente reglas empresariales claras y comprobables.

El software debe poder evolucionar durante años sin depender de que una
IA o una persona recuerde cómo funcionaba internamente.
