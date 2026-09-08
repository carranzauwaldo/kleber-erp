# KLEVER ERP — Alcance y Roadmap

**Versión:** 0.1  
**Estado:** Fase 0 — Definición  
**Documento padre:** `00_PROJECT_CHARTER.md`

## 1. Objetivo de este documento
Definir qué se construirá primero, qué se pospone, el orden de implementación y los límites necesarios para obtener una primera versión productiva rápidamente sin comprometer la arquitectura futura.

## 2. Estrategia de entrega
KLEVER ERP se desarrollará de forma incremental. Cada incremento deberá ser pequeño, demostrable, verificable y desplegable.

Principios:
- Priorizar valor operativo y financiero inmediato.
- Evitar desarrollar funciones futuras antes de necesitarlas.
- No sacrificar seguridad, auditoría ni integridad de datos por velocidad.
- Mantener módulos desacoplados y preparados para expansión.
- Reducir consumo de tokens mediante tareas acotadas y contexto persistente en el repositorio.
- Evitar infraestructura de pago mientras el volumen permita operar de forma segura en niveles gratuitos o económicos.

## 3. Fase 0 — Fundaciones
**Objetivo:** dejar el proyecto preparado para que Codex y Claude desarrollen en paralelo sin improvisar arquitectura.

### Entregables
- Project Charter.
- Alcance y roadmap.
- requisitos funcionales y reglas de negocio.
- arquitectura y límites de módulos.
- estructura del repositorio.
- modelo de datos inicial.
- contratos de integración con Mora Mora.
- modelo de seguridad y permisos.
- estrategia de auditoría, logs y observabilidad.
- evaluación y selección de infraestructura.
- ambientes y despliegue.
- estrategia Git, ramas/worktrees y colaboración de agentes.
- estándares de código, pruebas y Definition of Done.
- estrategia de prompts y control de tokens.
- registro de decisiones arquitectónicas.
- backlog inicial priorizado.

### Restricción
No iniciar módulos funcionales grandes antes de cerrar las decisiones fundamentales de Fase 0. Se permiten únicamente prototipos técnicos pequeños cuando sean necesarios para validar una decisión.

## 4. MVP — Primera versión productiva

### 4.1 Autenticación y acceso
- Inicio de sesión seguro.
- Usuarios internos.
- Roles iniciales: Administración, Financiero/Contable y Registro Operativo.
- Permisos por capacidad, no únicamente por pantalla.
- Registro de acciones sensibles.

### 4.2 Empresas y configuración
- KLEVER como empresa inicial.
- Identificador de empresa/tenant incorporado desde el modelo de datos cuando corresponda.
- Parámetros básicos de operación configurables.
- Preparación para futuras empresas sin implementar todavía administración comercial SaaS.

### 4.3 Terceros
- Clientes.
- Proveedores relevantes.
- Conductores/empleados necesarios para la operación.
- Datos de contacto y estado.
- Evitar duplicados mediante identificadores y validaciones.

### 4.4 Activos
Soporte genérico para diferentes clases de activo, incluyendo inicialmente:
- tractomulas;
- volquetas;
- pajaritas;
- Bobcat;
- otros tipos futuros.

Cada activo deberá soportar:
- identificación;
- estado operativo;
- porcentaje/tipo de propiedad cuando aplique;
- historial básico;
- asociación con viajes, gastos, mantenimientos y obligaciones;
- indicadores financieros acumulados;
- generación futura/incremental de resumen ejecutivo PDF.

### 4.5 Rutas y tarifas
- Origen y destino.
- Tarifa estándar de flete.
- Vigencia desde/hasta.
- Historial de tarifas.
- Cambio de tarifa sin alterar viajes históricos.
- Posibilidad de ajustar excepcionalmente el valor de un viaje con permiso y trazabilidad.

### 4.6 Viajes
El viaje será una unidad transaccional central.

Debe permitir:
- creación manual;
- importación/sincronización desde Mora Mora;
- cliente;
- activo;
- conductor;
- origen/destino;
- fecha/hora;
- material;
- cantidad/peso cuando exista;
- modalidad comercial;
- valor de flete;
- valor/costo del material cuando aplique;
- estados del ciclo de vida;
- observaciones y soportes;
- auditoría.

Modalidades iniciales:
1. Solo flete.
2. Flete + suministro de material.

Un vehículo puede realizar múltiples viajes independientes en un mismo día.

### 4.7 Gastos y anticipos operativos
- Entrega de dinero al conductor.
- Forma de entrega/pago: efectivo o tarjeta corporativa, ampliable posteriormente.
- Combustible.
- Peajes.
- Compra de material cuando corresponda.
- Otros gastos parametrizables.
- Soportes.
- Liquidación del anticipo.
- Saldo a devolver o valor adicional por reconocer.
- Asociación a viaje y/o activo según naturaleza del gasto.

### 4.8 Cuentas por cobrar y recaudos básicos
Cada viaje podrá manejar condición de pago independiente:
- contado;
- crédito;
- anticipo;
- combinaciones futuras si son requeridas.

El MVP deberá permitir:
- saldo por cliente;
- viajes pendientes de pago;
- pagos parciales cuando sean necesarios;
- aplicación de recaudos;
- estado de cuenta;
- trazabilidad de ajustes/anulaciones.

### 4.9 Mantenimiento y reparaciones
- Registro de mantenimiento/reparación.
- Activo afectado.
- proveedor/taller.
- fecha.
- concepto.
- costo.
- estado de pago.
- soportes.
- tiempo fuera de servicio cuando sea conocido.
- historial por activo.

Debe ser posible registrar obligaciones de reparación ya existentes sin requerir que el gasto nazca después del lanzamiento del sistema.

### 4.10 Obligaciones de activos
Registro básico de obligaciones relevantes, por ejemplo:
- créditos de adquisición;
- cuotas;
- impuestos;
- otras obligaciones periódicas.

El objetivo del MVP es incorporarlas al panorama financiero; no construir todavía un sistema contable completo.

### 4.11 Dashboard y reportes iniciales
Como mínimo:
- viajes por período;
- ingresos por viajes;
- ingresos/costos por material cuando aplique;
- gastos operativos;
- cuentas por cobrar;
- costos de mantenimiento;
- resultado/margen operativo estimado;
- indicadores por activo;
- disponibilidad/estado de activos cuando la información exista.

### 4.12 Resumen ejecutivo PDF
Debe existir una capacidad de exportación progresiva de resumen por activo con información relevante, incluyendo según disponibilidad:
- identificación y estado;
- viajes;
- ingresos;
- gastos;
- mantenimientos;
- obligaciones;
- saldo/rentabilidad estimada;
- período consultado.

La generación debe realizarse en backend o servicio controlado cuando sea conveniente para consistencia y seguridad.

### 4.13 Integración Mora Mora
El MVP deberá dejar implementada o preparada, según disponibilidad del sistema origen, una API de sincronización con:
- identificadores externos estables;
- idempotencia;
- detección de actualizaciones;
- estados de conciliación;
- bloqueo posterior al cierre;
- solicitud/autorización de reapertura;
- auditoría de sincronizaciones;
- manejo explícito de errores y reintentos.

Regla: Mora Mora controla el dato operativo abierto; después de la aceptación/cierre, KLEVER controla cualquier reapertura o reversión.

## 5. Cierre y conciliación
Se contemplará cierre por período, inicialmente mensual, sin impedir cierres más granulares posteriormente.

Estados conceptuales mínimos:
- abierto;
- pendiente de conciliación;
- conciliado/aprobado;
- cerrado;
- anulado/reversado cuando aplique.

Una vez cerrado:
- Mora Mora no modifica el dato directamente;
- KLEVER debe autorizar una reapertura;
- toda reapertura debe registrar usuario, motivo y fecha;
- no se destruye el historial anterior.

## 6. Fase posterior inmediata — Operación ampliada
Una vez estabilizado el MVP:
- gestión documental de activos;
- vencimientos de SOAT, revisión técnico-mecánica, seguros y documentos equivalentes;
- alertas de mantenimiento por tiempo/kilometraje/horas;
- control de proveedores más completo;
- presupuestos y flujo de caja proyectado;
- centros de costo ampliados;
- rentabilidad por cliente, ruta, activo y modalidad;
- reportes financieros más avanzados;
- conciliaciones mejoradas;
- maquinaria amarilla con órdenes/servicios específicos y control por horas cuando corresponda.

## 7. Fases futuras
No son parte del MVP, pero la arquitectura debe permitir incorporarlas:
- nómina completa;
- seguridad social y prestaciones;
- facturación electrónica e integración formal con sistemas contables/tributarios;
- GPS/telemetría;
- aplicación móvil;
- portal de clientes;
- automatización bancaria;
- inventarios complejos;
- optimización de rutas;
- mantenimiento predictivo;
- detección de anomalías mediante IA;
- proyecciones financieras asistidas por IA;
- comercialización SaaS multiempresa;
- planes, suscripciones y billing SaaS.

## 8. Fuera de alcance deliberado del MVP
- Construir un ERP contable completo.
- Reemplazar software especializado de nómina.
- Implementar IA generativa como dependencia operativa.
- Microservicios distribuidos sin necesidad demostrada.
- Kubernetes u orquestación compleja.
- Data warehouse independiente.
- Apps Android/iOS nativas.
- Integraciones externas no necesarias para la operación inicial.
- Personalizaciones específicas para empresas distintas de KLEVER.

## 9. Orden recomendado de construcción
1. Fundaciones del repositorio y estándares.
2. Stack, infraestructura y ambientes.
3. Autenticación, autorización y tenant base.
4. Esquema de datos y migraciones.
5. Terceros y activos.
6. Rutas/tarifas.
7. Viajes.
8. Gastos y anticipos.
9. Cuentas por cobrar/recaudos.
10. Mantenimientos y obligaciones.
11. Integración Mora Mora.
12. Cierre/conciliación.
13. Dashboard/reportes.
14. PDF ejecutivo.
15. Hardening: seguridad, pruebas, backups, observabilidad y recuperación.
16. Piloto controlado.
17. Producción.

El orden puede ajustarse mediante ADR si una dependencia técnica real lo exige.

## 10. Estrategia de piloto
La salida inicial debe hacerse con un subconjunto controlado de operación real.

Durante el piloto:
- mantener mecanismo de contraste con registros actuales;
- validar valores de viajes y gastos;
- verificar cierres y saldos;
- revisar permisos;
- probar recuperación ante errores;
- documentar diferencias;
- no eliminar fuentes anteriores hasta confirmar estabilidad.

## 11. Criterios de salida a producción
No se considerará listo únicamente porque “funcione en desarrollo”. Antes de producción deben existir como mínimo:
- autenticación y permisos probados;
- migraciones reproducibles;
- respaldo y restauración probados;
- auditoría de operaciones sensibles;
- manejo de errores;
- pruebas de flujos críticos;
- variables secretas fuera del repositorio;
- HTTPS en producción;
- ambiente productivo separado;
- estrategia de rollback;
- monitoreo mínimo;
- documentación de despliegue;
- usuario administrador inicial controlado;
- validación del piloto.

## 12. Restricciones de costo
Toda dependencia de pago deberá justificar:
- necesidad;
- costo estimado;
- alternativa gratuita/económica considerada;
- umbral que obligaría a escalar de plan.

No se contratarán recursos sobredimensionados para crecimiento hipotético. Se priorizará arquitectura que pueda escalar vertical u horizontalmente cuando el uso real lo justifique.

## 13. Restricciones para agentes de IA
Codex y Claude no deben interpretar este roadmap como autorización para construir todo de una vez.

Cada tarea deberá:
- perseguir un único objetivo principal;
- indicar archivos o módulos permitidos;
- declarar dependencias;
- incluir criterios de aceptación;
- ejecutar/verificar pruebas pertinentes;
- terminar con resumen breve de cambios y riesgos;
- evitar refactors ajenos a la tarea;
- detenerse y documentar cuando aparezca una decisión arquitectónica no cubierta.

## 14. Definition of Done de una funcionalidad
Una funcionalidad solo está terminada cuando:
- cumple sus criterios de aceptación;
- respeta límites de arquitectura;
- tiene validación de entradas;
- aplica autorización correspondiente;
- registra auditoría si es sensible;
- maneja errores esperables;
- tiene pruebas proporcionales al riesgo;
- no introduce secretos ni datos sensibles en logs;
- tiene migraciones/versionado cuando corresponda;
- actualiza documentación si cambia contratos o decisiones;
- puede integrarse sin romper la rama principal.

## 15. Métrica principal del MVP
KLEVER debe poder reconstruir con confianza la historia económica y operativa de cada viaje y cada activo, y obtener un panorama financiero útil sin depender de doble digitación o registros dispersos.

## 16. Control de cambios de alcance
Toda función nueva se clasificará como:
- **MVP crítico**: bloquea operación o integridad.
- **MVP conveniente**: aporta valor, pero puede esperar.
- **Post-MVP**: no bloquea la primera salida.
- **Futuro**: capacidad estratégica proyectada.

Las nuevas ideas no entrarán automáticamente al sprint activo. Primero deberán ubicarse en una de estas categorías para evitar crecimiento descontrolado del alcance.
