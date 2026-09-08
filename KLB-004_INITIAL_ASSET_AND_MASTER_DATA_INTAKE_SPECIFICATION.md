# KLB-004 --- Initial Asset and Master Data Intake Specification

**Proyecto:** KLEBER ERP\
**Fecha:** 2026-09-07\
**Estado:** ESPECIFICACIÓN --- PENDIENTE DE LEVANTAMIENTO REAL\
**Objetivo:** Definir qué información deberá recopilarse antes de cargar
los vehículos y maquinaria reales de KLEBER, sin inventar cantidades,
saldos ni características.

------------------------------------------------------------------------

## 1. Principio

El inventario inicial será levantado desde evidencia real.

No se cargarán como datos productivos valores mencionados informalmente
hasta verificarlos.

Cada activo tendrá un identificador interno permanente independiente de
placa, propietario o estado.

------------------------------------------------------------------------

## 2. Tipos iniciales de activos

El catálogo debe soportar, como mínimo:

``` text
TRACTOR_TRUCK
DUMP_TRUCK
BOBCAT
BACKHOE_LOADER / PAJARITA
OTHER
```

Los nombres comerciales visibles podrán estar en español.

No hardcodear cantidades por categoría.

------------------------------------------------------------------------

## 3. Identificación básica

Por activo recopilar:

-   código interno KLEBER;
-   tipo;
-   placa, cuando aplique;
-   VIN/chasis/serial;
-   marca;
-   modelo;
-   año;
-   color;
-   descripción;
-   estado;
-   fecha de entrada en servicio;
-   ubicación/base habitual;
-   fotografía principal.

### Estados iniciales sugeridos

``` text
ACTIVE
IN_MAINTENANCE
OUT_OF_SERVICE
IDLE
SOLD
RETIRED
```

Los estados definitivos se validarán durante implementación.

------------------------------------------------------------------------

## 4. Datos técnicos de vehículos

Cuando apliquen:

-   combustible;
-   capacidad de tanque;
-   capacidad/carga útil;
-   peso;
-   kilometraje actual;
-   número de motor;
-   configuración relevante;
-   observaciones técnicas.

No convertir todos estos campos en obligatorios.

------------------------------------------------------------------------

## 5. Datos técnicos de maquinaria

Para Bobcat/pajarita:

-   serial;
-   marca;
-   modelo;
-   año;
-   horas actuales;
-   combustible;
-   implementos/accesorios;
-   capacidad relevante;
-   estado operacional;
-   ubicación;
-   observaciones.

La maquinaria debe poder usar **horómetro** en lugar de odómetro.

------------------------------------------------------------------------

## 6. Contadores

Modelo recomendado:

``` text
Asset
  └── Meter
       ├── ODOMETER_KM
       └── ENGINE_HOURS
```

Registrar:

-   lectura;
-   fecha/hora;
-   fuente;
-   usuario;
-   evidencia opcional.

Nunca reemplazar el historial dejando únicamente "kilometraje actual".

------------------------------------------------------------------------

## 7. Propiedad

La propiedad no será un simple campo `owner`.

Debe permitir participaciones.

Ejemplo:

``` text
Activo
├── KLEBER 50 %
└── Socio   50 %
```

Campos:

-   propietario;
-   porcentaje;
-   fecha inicio;
-   fecha fin;
-   documento/soporte;
-   observación.

La suma de participaciones activas deberá validarse según la regla de
negocio definitiva.

------------------------------------------------------------------------

## 8. Adquisición

Recopilar cuando exista:

-   fecha de adquisición;
-   modalidad;
-   vendedor/proveedor;
-   valor de adquisición;
-   moneda;
-   cuota inicial;
-   valor financiado;
-   documento de compra;
-   fecha de entrada en servicio.

Modalidades posibles:

``` text
PURCHASED
FINANCED
LEASED
PARTNERSHIP
OTHER
```

------------------------------------------------------------------------

## 9. Financiación

Para activos con crédito:

-   entidad;
-   número/referencia interna;
-   valor inicial;
-   saldo verificado;
-   fecha inicial;
-   plazo;
-   tasa si se requiere;
-   periodicidad;
-   valor cuota;
-   próxima fecha;
-   fecha final estimada;
-   soporte;
-   estado.

No almacenar credenciales bancarias.

------------------------------------------------------------------------

## 10. Obligaciones adicionales

Registrar independientemente:

-   impuestos;
-   seguros;
-   reparaciones pendientes;
-   financiación;
-   acuerdos con socios;
-   otras cuentas asociadas.

Cada obligación tendrá:

``` text
tipo
acreedor
valor original
saldo
fecha
vencimiento
estado
soporte
```

------------------------------------------------------------------------

## 11. Mantenimiento inicial

Antes del go-live recopilar:

-   último mantenimiento conocido;
-   reparación actual;
-   taller/proveedor;
-   descripción;
-   costo;
-   saldo pendiente;
-   fecha;
-   próximo mantenimiento si se conoce;
-   activo fuera de servicio sí/no;
-   soportes.

Los valores aproximados mencionados previamente no se cargarán sin
verificación.

------------------------------------------------------------------------

## 12. Documentos del activo

Tipos iniciales:

-   matrícula/registro;
-   SOAT;
-   revisión técnico-mecánica cuando aplique;
-   seguro;
-   factura/contrato de adquisición;
-   crédito;
-   impuestos;
-   mantenimiento;
-   propiedad/sociedad;
-   otros.

Cada documento:

``` text
asset_id
document_type
document_number
issue_date
expiration_date
storage_reference
status
notes
```

No todos los documentos tienen vencimiento.

------------------------------------------------------------------------

## 13. Vencimientos

El sistema deberá permitir alertas futuras para:

-   SOAT;
-   técnico-mecánica;
-   seguros;
-   impuestos;
-   cuotas;
-   mantenimientos.

La configuración exacta de anticipación se definirá después.

------------------------------------------------------------------------

## 14. Conductores y operadores

No almacenar conductor actual como único dato histórico del activo.

Crear asignaciones:

``` text
asset
person
role
start_date
end_date
status
```

Roles posibles:

``` text
DRIVER
OPERATOR
RESPONSIBLE
```

Esto permitirá saber quién tenía asignado el activo en una fecha
determinada.

------------------------------------------------------------------------

## 15. Centro de costo

Cada activo deberá actuar como unidad de análisis económico.

Posteriormente deberá ser posible calcular:

``` text
ingresos
- combustible
- peajes atribuibles
- mantenimiento
- reparaciones
- obligaciones
- otros costos
= resultado
```

La metodología contable/gerencial definitiva se definirá en el módulo
financiero.

------------------------------------------------------------------------

## 16. Propiedad compartida

Para el activo mencionado con participación compartida, no asumir que el
50 % aplica automáticamente a cada ingreso/gasto.

Se debe confirmar:

-   porcentaje legal/económico;
-   quién paga crédito;
-   quién paga mantenimiento;
-   cómo se distribuyen ingresos;
-   cómo se distribuye utilidad;
-   tratamiento de gastos extraordinarios;
-   liquidaciones al socio.

------------------------------------------------------------------------

## 17. Disponibilidad operacional

Además del estado general, interesa conocer:

-   disponible;
-   trabajando;
-   mantenimiento;
-   reparación;
-   detenido;
-   fuera de servicio.

No confundir estado patrimonial (`SOLD`) con disponibilidad diaria.

------------------------------------------------------------------------

## 18. Evidencia

Para la carga inicial se recomienda recopilar fotografías o PDFs de:

-   tarjeta/documento del vehículo;
-   documento de adquisición;
-   crédito;
-   seguros;
-   obligaciones;
-   mantenimientos importantes.

El sistema debe guardar referencia al archivo, no archivos binarios
dentro de las tablas transaccionales.

------------------------------------------------------------------------

## 19. Calidad del dato

Cada dato inicial puede clasificarse:

``` text
VERIFIED
PENDING_VERIFICATION
ESTIMATED
NOT_AVAILABLE
```

Los importes financieros productivos deberán tender a `VERIFIED`.

------------------------------------------------------------------------

## 20. Fuente

Registrar fuente cuando sea relevante:

``` text
DOCUMENT
OWNER
ACCOUNTING
BANK/FINANCIAL_ENTITY
WORKSHOP
MANUAL
IMPORT
```

------------------------------------------------------------------------

## 21. Fecha de corte

La carga inicial deberá realizarse con una fecha de corte.

Ejemplo conceptual:

``` text
Initial balance date: YYYY-MM-DD
```

Los saldos de créditos, reparaciones y obligaciones deben corresponder a
esa fecha.

Esto evita mezclar valores obtenidos en días diferentes.

------------------------------------------------------------------------

## 22. Plantilla de levantamiento

Una fila principal por activo:

``` text
Asset Code
Type
Plate
VIN/Serial
Make
Model
Year
Status
Odometer
Engine Hours
Acquisition Date
Acquisition Value
Ownership
Operational Status
Location
Notes
```

Información de múltiples propietarios, créditos, documentos y
mantenimientos debe ir en tablas relacionadas, no en columnas repetidas.

------------------------------------------------------------------------

## 23. Tablas de levantamiento recomendadas

``` text
01_ASSETS
02_ASSET_OWNERSHIP
03_ASSET_METERS
04_ASSET_OBLIGATIONS
05_ASSET_DOCUMENTS
06_INITIAL_MAINTENANCE
07_PEOPLE_ASSIGNMENTS
```

Una hoja Excel futura puede seguir esta estructura para facilitar
importación.

------------------------------------------------------------------------

## 24. Validaciones de importación

Antes de cargar:

-   código único;
-   placa no duplicada cuando aplique;
-   VIN/serial no duplicado;
-   porcentajes válidos;
-   valores monetarios no negativos;
-   fechas coherentes;
-   tipo de contador compatible;
-   referencias existentes;
-   documentos vinculados al activo correcto.

------------------------------------------------------------------------

## 25. Duplicados

No identificar activos únicamente por descripción.

Ejemplo inválido:

``` text
Bobcat 1
Bobcat nuevo
La pajarita
```

Debe existir un código permanente.

Ejemplo:

``` text
KLB-AST-0001
```

La nomenclatura definitiva puede generarse automáticamente.

------------------------------------------------------------------------

## 26. Importación

La primera carga debe:

1.  validar archivo;
2.  mostrar errores;
3.  no importar filas inválidas silenciosamente;
4.  ejecutar transacción cuando corresponda;
5.  generar resumen;
6.  conservar auditoría.

------------------------------------------------------------------------

## 27. Datos que NO deben bloquear el alta

Un activo puede registrarse aunque todavía falten campos secundarios.

Mínimo conceptual:

``` text
organization
asset type
internal code
description/identification
status
```

Para producción operacional podrán exigirse datos adicionales según
tipo.

------------------------------------------------------------------------

## 28. Datos que sí requieren alta calidad

Especialmente:

-   identidad del activo;
-   propiedad;
-   saldo de obligaciones;
-   adquisición;
-   contadores iniciales;
-   estado operacional.

Errores aquí distorsionarían rentabilidad y mantenimiento.

------------------------------------------------------------------------

## 29. Información pendiente de KLEBER

Antes de carga real se debe confirmar:

1.  número exacto de tractomulas;
2.  número exacto de volquetas;
3.  número exacto de Bobcats;
4.  número exacto de pajaritas;
5.  placas/seriales;
6.  estado de cada activo;
7.  propiedad;
8.  créditos;
9.  obligaciones;
10. reparaciones pendientes;
11. kilometraje/horas;
12. documentación.

------------------------------------------------------------------------

## 30. Lo que este documento NO decide

No decide:

-   inventario real;
-   valores reales;
-   proveedor cloud;
-   stack definitivo;
-   reglas contables;
-   depreciación;
-   tratamiento tributario;
-   distribución económica con socios;
-   frecuencia definitiva de mantenimiento.

------------------------------------------------------------------------

## 31. Resultado

``` text
KLB-004 = INTAKE SPECIFICATION READY
REAL ASSET INVENTORY = PENDING
PRODUCTION DATA IMPORTED = NO
```

------------------------------------------------------------------------

## 32. Próximo paso

**KLB-005 --- Initial Users, Roles and Permission Matrix Specification**

Definirá usuarios, perfiles y permisos requeridos para operar KLEBER
antes de implementar RBAC.

------------------------------------------------------------------------

## Criterio final

> Primero se define cómo representar correctamente un activo; después se
> cargan los activos reales.

La estructura debe permitir que una tractomula, una volqueta o una
máquina amarilla tengan características distintas sin fragmentar el
sistema en modelos incompatibles.
