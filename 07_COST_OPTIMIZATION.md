# 07_COST_OPTIMIZATION.md --- Optimización de costos

**Proyecto:** KLEBER ERP\
**Estado:** Diseño base / Fase 0\
**Objetivo:** Mantener bajo control el costo total de desarrollo y
operación sin degradar seguridad, integridad financiera, respaldo ni
mantenibilidad.

## 1. Principio rector

KLEBER no debe pagar por escala que todavía no necesita. Antes de
incorporar infraestructura, servicios o dependencias se evaluará:
necesidad real, capacidad ya disponible en el stack, alternativa
gratuita o de bajo costo, costo actual, costo al crecer, dificultad de
migración y riesgo introducido.

El costo mínimo nunca justificará sacrificar seguridad, integridad
financiera, auditoría o recuperación.

## 2. Objetivo económico inicial

Durante desarrollo y MVP, el objetivo ideal de infraestructura será
**USD 0--10/mes**. Se podrá superar cuando exista una razón concreta:
backups confiables, base productiva estable, almacenamiento, dominio,
comunicaciones, seguridad o disponibilidad.

Todo costo recurrente deberá quedar visible y documentado.

## 3. Categorías a controlar

-   Hosting frontend.
-   Hosting backend/API.
-   PostgreSQL.
-   Autenticación.
-   Object storage.
-   Backups.
-   Egress.
-   Logs y monitoreo.
-   Dominio/DNS.
-   Notificaciones.
-   CI/CD.
-   Integraciones.
-   IA.
-   Servicios de terceros.

## 4. Registro FinOps

Mantener un inventario con: servicio, proveedor, plan, costo mensual,
límite, consumo actual, fecha de renovación, responsable y alertas
configuradas.

No depender de recordar manualmente las suscripciones.

## 5. Alta de nuevos servicios

Antes de añadir un SaaS o recurso cloud:

1.  demostrar la necesidad;
2.  verificar si el stack actual ya la resuelve;
3.  calcular costo inicial;
4.  revisar precio al superar el free tier;
5.  revisar egress y retención;
6.  revisar lock-in;
7.  identificar alternativa;
8.  registrar ADR si afecta arquitectura.

Codex y Claude no podrán contratar ni habilitar recursos pagos por
iniciativa propia.

## 6. Consolidación

Durante el MVP se preferirá consolidar PostgreSQL, Auth y Storage en un
proveedor cuando reduzca costo y complejidad sin comprometer seguridad o
portabilidad.

No fragmentar KLEBER entre numerosos proveedores sin beneficio medible.

## 7. Base de datos

Antes de aumentar recursos:

1.  revisar consultas;
2.  crear/corregir índices;
3.  eliminar N+1;
4.  paginar;
5.  seleccionar solo columnas necesarias;
6.  revisar conexiones;
7.  optimizar jobs;
8.  revisar crecimiento de auditoría.

No aumentar capacidad para ocultar consultas deficientes.

## 8. Almacenamiento

Evitar almacenar duplicados, archivos temporales permanentes, PDFs
regenerables sin valor histórico y versiones innecesarias.

Los PDFs se generarán preferentemente bajo demanda. Se conservarán
cuando sean evidencia, correspondan a un cierre o exista necesidad de
mantener exactamente esa versión.

## 9. Egress

Reducir polling, respuestas masivas, descargas repetidas y transferencia
innecesaria entre proveedores.

Preferir sincronización incremental, paginación, compresión y
eventos/webhooks cuando sean adecuados.

## 10. Mora Mora

La integración Mora Mora ↔ KLEBER nunca deberá consultar repetidamente
toda la historia.

Preferir, según la API real disponible:

`updated_since`, versión externa, cursor o eventos/webhooks.

Los reintentos usarán backoff y límites.

## 11. Logs y auditoría

Los logs técnicos tendrán retención limitada. Debug no permanecerá
activo en producción salvo diagnóstico controlado.

La auditoría financiera/operativa crítica tendrá una política
independiente y no se eliminará únicamente para ahorrar almacenamiento.

## 12. CI/CD

Reducir consumo innecesario mediante caché de dependencias, cancelación
de builds obsoletos, separación de pruebas rápidas/pesadas y evitando
despliegues de aplicación cuando solo cambie documentación si el
pipeline permite excluirlos.

## 13. Backups

Los backups son un costo obligatorio de producción.

Optimizar frecuencia y retención según RPO/RTO, pero nunca desactivarlos
para reducir factura.

## 14. Observabilidad

Comenzar con herramientas nativas del proveedor. Incorporar APM u
observabilidad especializada cuando el diagnóstico actual sea
insuficiente o el costo de incidentes lo justifique.

## 15. Serverless y jobs

Controlar invocaciones, duración, memoria, tráfico y cron jobs. Una
tarea no debe ejecutarse cada minuto si el negocio solo requiere una
revisión diaria u horaria.

Evitar loops de reintentos sin límite.

## 16. Notificaciones

Antes de usar WhatsApp/SMS de pago, determinar qué eventos requieren
realmente ese canal. Utilizar notificación in-app o correo cuando sean
suficientes.

## 17. IA futura

Cada función de IA deberá estimar:

-   modelo;
-   tokens de entrada/salida;
-   frecuencia;
-   número de usuarios;
-   costo por operación;
-   costo mensual;
-   valor generado.

No enviar documentos completos cuando basten campos estructurados o
fragmentos relevantes.

## 18. Optimización de Codex y Claude

Para reducir tokens:

-   usar documentación persistente;
-   referenciar archivos concretos;
-   asignar tareas pequeñas;
-   limitar archivos permitidos;
-   definir criterios de aceptación;
-   evitar repetir el contexto completo;
-   impedir trabajo duplicado;
-   usar el segundo agente para review cuando aporte valor.

## 19. Niveles de razonamiento

**Bajo/Instant:** renombrados, formato, boilerplate, cambios mecánicos y
pruebas triviales.

**Medio:** CRUD, frontend, endpoints, validaciones, consultas y pruebas
normales.

**Alto:** arquitectura, seguridad, migraciones complejas, concurrencia,
reglas financieras, conciliación, integración Mora Mora, debugging
difícil y revisión preproducción.

No utilizar el nivel más costoso para tareas mecánicas.

## 20. Contrato de tarea para agentes

Cada tarea debe indicar:

``` text
Objetivo
Documentos a leer
Archivos permitidos
Archivos prohibidos
Criterios de aceptación
Pruebas requeridas
Formato de entrega
```

La entrega debe resumir archivos modificados, pruebas ejecutadas y
riesgos pendientes.

## 21. Evitar duplicación

Antes de asignar trabajo se verificará si Codex o Claude ya está
trabajando sobre el mismo módulo.

La segunda IA se utilizará preferentemente para revisión, tests,
detección de fallos, validación arquitectónica o UX, no para generar dos
implementaciones completas sin propósito.

## 22. Dependencias

Antes de instalar una dependencia:

-   comprobar necesidad;
-   mantenimiento activo;
-   vulnerabilidades;
-   tamaño;
-   licencia;
-   impacto operativo;
-   posibilidad de resolver con stack actual.

No instalar paquetes para funciones triviales ni reinventar componentes
complejos ya resueltos de forma segura.

## 23. Costo de deuda técnica

El costo no es solo cloud. También incluye debugging, retrabajo, deuda
técnica, onboarding y mantenimiento.

La arquitectura modular, pruebas y documentación forman parte de la
estrategia de reducción de costos.

## 24. Alertas de consumo

Configurar cuando estén disponibles:

-   presupuesto;
-   DB;
-   storage;
-   egress;
-   logs;
-   builds;
-   APIs;
-   IA.

Evitar facturación sorpresa y escalamiento ilimitado sin alertas.

## 25. Revisión mensual

Revisar: costo total, variación mensual, DB, storage, egress, logs,
minutos de build, integraciones, IA y servicios sin uso.

Cancelar recursos que hayan dejado de aportar valor.

## 26. Umbrales de reevaluación

Reevaluar cuando:

-   un servicio supere consistentemente su plan;
-   el costo crezca más de 30 % sin crecimiento equivalente del negocio;
-   egress sea relevante;
-   DB alcance límites;
-   logs tengan costo significativo;
-   IA supere presupuesto;
-   un proveedor sea cuello de botella.

## 27. Migraciones motivadas por costo

Comparar ahorro anual contra horas de migración, riesgo, downtime,
testing y lock-in.

No migrar por diferencias pequeñas si el costo total de migrar es mayor.

## 28. Futuro multiempresa/SaaS

Cuando existan más organizaciones, medir consumo por tenant:

-   DB;
-   storage;
-   requests;
-   IA;
-   notificaciones;
-   soporte.

Esto permitirá fijar precios sostenibles.

Funciones costosas como IA, analítica avanzada, almacenamiento adicional
e integraciones podrán formar parte de planes superiores.

## 29. Qué no optimizar

Nunca recortar por costo:

-   autenticación;
-   autorización;
-   auditoría;
-   backups;
-   integridad de DB;
-   pruebas críticas;
-   HTTPS;
-   secretos;
-   conciliación financiera.

## 30. Qué puede esperar

No incorporar durante MVP sin necesidad demostrada:

-   Kubernetes;
-   microservicios;
-   multi-región;
-   data warehouse;
-   Kafka;
-   APM empresarial;
-   SIEM empresarial;
-   feature flags SaaS;
-   multi-cloud;
-   autoscaling sofisticado;
-   modelos IA dedicados.

## 31. Criterio para subir de plan

Actualizar cuando el riesgo de permanecer en el plan actual sea mayor
que el costo del upgrade.

Ejemplos: backups insuficientes, base pausándose, almacenamiento
crítico, límites productivos o rendimiento real insuficiente.

## 32. Registro de decisiones económicas

Toda decisión relevante registrará:

``` text
Decisión
Costo actual
Costo esperado
Alternativas
Motivo
Riesgo
Fecha de revisión
```

y se incorporará a `DECISIONS.md`.

## 33. Checklist antes de añadir gasto

-   [ ] Necesidad demostrada.
-   [ ] No existe capacidad equivalente actual.
-   [ ] Precio actual revisado.
-   [ ] Free tier revisado.
-   [ ] Precio al crecer revisado.
-   [ ] Egress revisado.
-   [ ] Retención revisada.
-   [ ] Lock-in revisado.
-   [ ] Seguridad suficiente.
-   [ ] Alertas disponibles.
-   [ ] Decisión documentada si corresponde.

## 34. Meta de Fase 0

Al finalizar Fase 0 deberán existir:

-   arquitectura seleccionada;
-   estimación mensual;
-   límites gratuitos conocidos;
-   riesgos de sobrecosto;
-   alertas previstas;
-   estrategia de agentes;
-   decisiones económicas registradas.

## Criterio final

> KLEBER debe gastar cuando ese gasto reduzca un riesgo real, permita
> operar correctamente o produzca valor medible; no porque una
> arquitectura más compleja parezca más profesional.

La plataforma debe comenzar pequeña y económica sin generar una deuda
técnica que obligue a reconstruirla cuando crezca.
