# KLEVER ERP — Project Charter

**Versión:** 0.1  
**Estado:** Planificación / Fase 0  
**Empresa inicial:** KLEVER  
**Tipo:** Plataforma empresarial modular para gestión de transporte, flota, maquinaria y finanzas operativas.

## 1. Propósito
Construir un sistema empresarial rápido de poner en operación, confiable y de bajo costo que permita a KLEVER registrar, conciliar y analizar la operación de transporte de materiales y, progresivamente, la maquinaria amarilla, manteniendo una arquitectura preparada para crecimiento futuro y posible comercialización a otras empresas.

## 2. Prioridad inicial
El MVP prioriza obtener información operativa y financiera útil cuanto antes: viajes, activos, conductores, ingresos, gastos, anticipos, cuentas por cobrar, mantenimientos, obligaciones y reportes ejecutivos.

No se sacrificará trazabilidad ni estructura arquitectónica por velocidad. Se evitará, sin embargo, sobrearquitectura que incremente tiempo, infraestructura o consumo de tokens sin aportar valor al MVP.

## 3. Operación conocida
KLEVER transporta materiales como triturado, arena, piedra y gravilla. Los servicios pueden operar bajo dos modalidades principales:

1. **Solo flete:** KLEVER obtiene ingreso por transporte; el dinero destinado a comprar el material pertenece operativamente al encargo y no constituye margen sobre el material.
2. **Flete + suministro:** KLEVER vende tanto el transporte como el material y puede obtener margen en ambos componentes.

Los viajes son unidades independientes. Un mismo vehículo puede realizar varios viajes en un día. La asignación normalmente se decide en tiempo real cuando el vehículo llega al acopio; excepcionalmente puede definirse desde el día anterior.

Las tarifas de flete son normalmente fijas por ruta/origen-destino y no dependen de las toneladas transportadas. Debe existir historial de vigencia de tarifas para preservar los valores históricos.

## 4. Activos iniciales
El diseño debe soportar distintos tipos de activos sin quedar amarrado a los existentes actualmente. El inventario inicial informado incluye tractomulas, volqueta y maquinaria amarilla (pajaritas y Bobcat), incluyendo activos con propiedad compartida.

Cada activo tendrá una hoja de vida operativa y financiera que permita determinar ingresos, costos, mantenimientos, reparaciones, obligaciones y rentabilidad.

## 5. Integración Mora Mora
Mora Mora es actualmente el cliente operativo prioritario para tractomulas/volqueta y dispone de un sistema previamente desarrollado que registra información de los viajes.

Se proyecta integración por API para evitar doble digitación.

### Regla de propiedad del dato
- Mientras el viaje esté operativo/no conciliado, Mora Mora puede ser la fuente maestra del dato operativo.
- KLEVER recibe y sincroniza cambios mientras el período o viaje permanezca abierto.
- Cuando KLEVER concilia y aprueba/cierra el dato, KLEVER adquiere el control de cierre.
- Después del cierre, Mora Mora no podrá modificar directamente el registro.
- Una modificación posterior requerirá solicitud/reapertura autorizada desde KLEVER.
- Los cambios deben conservar auditoría completa.

## 6. Integridad y auditoría
Principios obligatorios:

- Los registros transaccionales importantes no se eliminan físicamente como mecanismo normal de operación.
- Las anulaciones/reversiones requieren estado, motivo, usuario y fecha/hora.
- Debe conservarse trazabilidad de modificaciones relevantes: quién cambió qué, cuándo y por qué.
- Los cierres conciliados deben ser reproducibles y verificables.
- La información histórica no debe cambiar por modificaciones posteriores de tarifas, catálogos o configuraciones.

## 7. Finanzas operativas
El sistema deberá evolucionar hacia control financiero por viaje, activo y período. Desde el diseño se contemplan:

- ingresos por flete;
- ingresos/costos por suministro de material;
- anticipos operativos;
- combustible;
- peajes;
- efectivo entregado a conductores;
- pagos con tarjeta corporativa;
- conciliación de anticipos y devoluciones/faltantes;
- cuentas por cobrar;
- pagos de contado/crédito/anticipos;
- mantenimientos y reparaciones;
- créditos asociados a adquisición de activos;
- impuestos y otras obligaciones;
- costos laborales atribuibles cuando corresponda.

## 8. Personal
Los conductores son normalmente empleados de KLEVER vinculados laboralmente. La arquitectura debe permitir posteriormente gestionar o integrar información de nómina, seguridad social, prima, vacaciones, cesantías e intereses a las cesantías.

La nómina completa no es requisito para la primera salida productiva salvo que sea necesaria para un indicador financiero definido posteriormente.

## 9. Usuarios y acceso inicial
El MVP contemplará como mínimo perfiles equivalentes a:

- Administración;
- Financiero/Contable;
- Registro operativo.

Los permisos definitivos se diseñarán mediante RBAC y principio de mínimo privilegio. Los nombres comerciales de los roles podrán ajustarse posteriormente.

## 10. Reportes
Cada activo debe poder producir una vista ejecutiva de estado y un **Resumen Ejecutivo descargable en PDF**, incluyendo progresivamente indicadores operativos y financieros relevantes.

También se proyectan tableros diarios, mensuales y consolidados de operación y rentabilidad.

## 11. Arquitectura
El sistema será modular y organizado por capas. Se evitarán carpetas genéricas que acumulen lógica no relacionada.

Cada dominio funcional deberá mantener separación clara entre, como mínimo:

- presentación/interfaz;
- aplicación/casos de uso;
- dominio/reglas de negocio;
- infraestructura/persistencia e integraciones;
- pruebas.

Existirán capacidades transversales para seguridad, auditoría, observabilidad, configuración e integraciones.

Los módulos no deberán depender de detalles internos de otros módulos; la comunicación se realizará mediante contratos/interfaces/eventos claramente definidos cuando aplique.

## 12. Escalabilidad y multiempresa
La primera operación será exclusivamente KLEVER. Sin embargo, el modelo de datos y las fronteras de seguridad deben quedar preparados para aislamiento por empresa/tenant cuando hacerlo no genere complejidad desproporcionada.

El objetivo es ser **SaaS-ready**, no construir desde el MVP toda la plataforma comercial SaaS.

## 13. Inteligencia artificial
La IA no es dependencia crítica del MVP. La arquitectura podrá dejar puntos de extensión para capacidades futuras como predicción de mantenimiento, análisis financiero, detección de anomalías, proyecciones y apoyo a decisiones.

No se incorporarán componentes de IA solo por novedad si aumentan costo o riesgo sin valor operativo inmediato.

## 14. Infraestructura y costos
La Fase 0 deberá comparar y seleccionar un stack con prioridad en:

1. costo inicial mínimo;
2. seguridad suficiente para información empresarial;
3. respaldo y recuperación;
4. facilidad de mantenimiento;
5. portabilidad y ausencia razonable de lock-in;
6. capacidad de escalar sin reescritura prematura.

El volumen inicial es pequeño, por lo que se preferirán niveles gratuitos o de bajo costo cuando cumplan los requisitos. La elección concreta de base de datos, backend, frontend, almacenamiento, hosting, observabilidad y CI/CD se documentará mediante decisiones arquitectónicas antes de implementarse.

## 15. Uso de agentes de desarrollo
Codex y Claude podrán trabajar en paralelo sobre líneas separadas, usando Git como fuente común de verdad.

Reglas iniciales:

- tareas pequeñas, verificables y con alcance limitado;
- evitar prompts que intenten desarrollar múltiples módulos completos de una sola vez;
- cada tarea debe indicar archivos permitidos y criterios de aceptación;
- usar ramas o worktrees separados para evitar sobrescrituras;
- ningún agente modifica simultáneamente el mismo conjunto de archivos sin coordinación;
- commits pequeños y descriptivos;
- decisiones nuevas se documentan antes o junto con el código que dependa de ellas;
- revisión antes de integrar cambios a la rama principal.

## 16. Control de consumo de IA
El proyecto deberá minimizar consumo innecesario de tokens:

- contexto persistente en documentos del repositorio en vez de repetirlo en cada prompt;
- prompts breves referenciando documentos concretos;
- dividir trabajos grandes en unidades pequeñas;
- no reenviar archivos completos cuando basta con indicar rutas o secciones;
- usar niveles bajos/medios de razonamiento para tareas mecánicas, documentación sencilla, refactors locales y cambios bien especificados;
- reservar modelos/esfuerzo alto para arquitectura, migraciones delicadas, seguridad, concurrencia, integraciones complejas, debugging difícil y revisiones críticas;
- evitar que dos agentes investiguen o implementen exactamente lo mismo salvo revisión intencional.

## 17. Fuera del MVP inmediato
Salvo decisión posterior, no son bloqueantes para la primera versión:

- IA predictiva;
- comercialización SaaS;
- facturación electrónica completa;
- nómina integral;
- optimización automática de rutas;
- telemetría/GPS avanzada;
- aplicaciones móviles nativas;
- automatizaciones bancarias complejas.

La arquitectura no debe impedir su incorporación futura.

## 18. Criterio de éxito inicial
La primera versión será exitosa cuando KLEVER pueda usarla diariamente para registrar o sincronizar viajes, asociarlos a activos y conductores, controlar sus principales movimientos económicos, consultar históricos confiables, conciliar información y obtener reportes financieros/ejecutivos útiles sin depender de hojas dispersas o registros informales.

## 19. Principios no negociables
1. Fuente de verdad definida para cada dato y estado.
2. Auditoría antes que borrado destructivo.
3. Seguridad por diseño y mínimo privilegio.
4. Separación modular y por capas.
5. Datos históricos reproducibles.
6. Costos de infraestructura e IA controlados.
7. MVP rápido sin deuda estructural deliberada.
8. Automatizar doble digitación cuando exista una fuente confiable.
9. Git como fuente común de verdad para desarrollo.
10. Documentar decisiones que condicionen el futuro del sistema.

## 20. Próximos documentos de Fase 0
Este Charter será la referencia superior. La Fase 0 continuará, como mínimo, con documentos separados para:

- alcance y roadmap;
- requisitos y reglas de negocio;
- arquitectura por capas y módulos;
- modelo de datos;
- integración/API con Mora Mora;
- seguridad;
- auditoría y observabilidad;
- estrategia de infraestructura y costos;
- despliegue y ambientes;
- estrategia Git y trabajo paralelo Codex/Claude;
- estándares de código y pruebas;
- estrategia de prompts y presupuesto de tokens;
- decisiones arquitectónicas (ADR/DECISIONS);
- backlog inicial y criterios de aceptación.
