# KLB-002 --- Comparación de infraestructura y proveedores

**Proyecto:** KLEBER ERP\
**Fecha de referencia:** 2026-09-07\
**Estado:** ANÁLISIS --- SIN DECISIÓN DE PROVEEDOR\
**Objetivo:** Comparar PostgreSQL, autenticación, almacenamiento y
despliegue sin modificar decisiones previas ni seleccionar proveedor.

## 1. Restricciones

KLEBER priorizará costo bajo, PostgreSQL, seguridad, backups, separación
LOCAL/STAGING/PRODUCTION, integración Mora Mora, portabilidad y
crecimiento gradual. El objetivo durante desarrollo/MVP continúa siendo
aproximadamente USD 0--10/mes cuando sea viable.

## 2. AWS

Arquitectura posible:

``` text
Frontend → hosting compatible con Next.js
Backend  → AWS compute/serverless
DB       → Amazon RDS PostgreSQL
Auth     → Amazon Cognito
Storage  → Amazon S3
Logs     → CloudWatch
```

Ventajas: ecosistema completo, RDS administrado, Cognito, S3, IAM,
escalabilidad y experiencia cloud transferible.

Riesgos: RDS tradicional puede generar costo una vez terminados
créditos/promociones aunque exista poco tráfico; la estructura de costos
es más compleja y exige presupuestos y alertas.

El programa vigente para nuevos clientes permite explorar servicios
mediante créditos durante hasta seis meses. Esto es útil para
desarrollo, pero no debe interpretarse como infraestructura
permanentemente gratuita.

**Conclusión provisional:** excelente opción técnica y formativa, pero
hay que calcular específicamente el costo posterior al periodo
promocional.

## 3. Supabase

Integra PostgreSQL, Auth y Storage.

El plan Free actual incluye una base PostgreSQL, 500 MB por proyecto,
50.000 MAU, 1 GB de almacenamiento y 5 GB de egress. Los proyectos
gratuitos pueden pausarse tras una semana de inactividad y Free no
incluye backups automáticos.

El plan Pro publicado parte de USD 25/mes e incluye mayores cuotas y
backups diarios.

**Conclusión provisional:** muy conveniente para desarrollo rápido y
bajo DevOps; producción puede implicar un salto de USD 0 a un costo base
superior al objetivo inicial.

## 4. Neon / arquitectura híbrida

Neon ofrece PostgreSQL serverless con scale-to-zero. Su plan Free tiene
cuota de compute y almacenamiento sin límite temporal promocional
indicado en su plan actual. El plan Launch cobra según consumo.

Una arquitectura posible:

``` text
Frontend → proveedor A
Backend  → proveedor B
DB       → Neon PostgreSQL
Auth     → Neon Auth u otro
Storage  → S3 u otro
```

**Conclusión provisional:** especialmente atractivo para KLEBER por su
uso inicial bajo e intermitente, aunque aumenta el número potencial de
proveedores.

## 5. Comparación

  --------------------------------------------------------------------------
  Criterio          AWS                Supabase          Neon/híbrido
  ----------------- ------------------ ----------------- -------------------
  PostgreSQL        Excelente          Excelente         Excelente

  Inicio a USD 0    Sí, según          Sí                Sí
                    créditos/límites                     

  DB scale-to-zero  No en RDS          No como enfoque   Sí
                    tradicional        principal         

  Auth              Cognito            Integrado         Integrado/externo

  Storage           S3                 Integrado         Externo posible

  DevOps            Mayor              Bajo              Medio

  Ecosistema        Muy alto           Alto              Especializado

  Aprendizaje cloud Muy alto           Medio             Medio

  Riesgo de costo   Mayor              Menor             Menor/medio
  accidental                                             

  Portabilidad      Alta               Alta              Alta
  PostgreSQL                                             
  --------------------------------------------------------------------------

## 6. Escenarios

Con 5, 20 e incluso 100 usuarios administrativos, KLEBER seguirá siendo
inicialmente una carga pequeña. La decisión no debe basarse en capacidad
bruta, sino en costo mínimo, recuperación, seguridad y simplicidad.

Con aproximadamente 500 usuarios se deberán reevaluar compute,
conexiones, almacenamiento, egress, observabilidad y aislamiento
multiempresa, sin asumir que será necesario cambiar de PostgreSQL.

## 7. Estrategia híbrida

No existe obligación de colocar todo KLEBER en un solo proveedor. Una
posibilidad futura es combinar un backend de bajo consumo, PostgreSQL
con scale-to-zero y object storage económico.

Esto es solamente una alternativa de diseño, no una decisión.

## 8. AWS y aprendizaje

AWS aporta experiencia práctica en IAM, RDS, S3, Cognito, CloudWatch,
presupuestos, redes y despliegues. Ese beneficio es relevante, pero no
debe justificar infraestructura innecesariamente costosa.

## 9. Control de costos si se evalúa AWS

Antes de crear recursos:

-   configurar AWS Budgets;
-   activar alertas;
-   etiquetar recursos;
-   inventariar servicios;
-   revisar egress;
-   eliminar recursos de prueba;
-   evitar componentes costosos no necesarios;
-   estimar el costo de RDS después de créditos.

## 10. Backups

Desarrollo puede utilizar una política más ligera mientras no existan
datos productivos irremplazables.

Producción deberá tener backup automático, retención definida y una
prueba real de restauración. Una plataforma gratuita sin backups
automáticos no será la única protección de los datos de KLEBER.

## 11. Staging

Staging no debe mantener infraestructura costosa 24/7 si puede apagarse,
escalar a cero o crearse bajo demanda. Production y staging permanecerán
separados.

## 12. Auth

La decisión final deberá comparar MFA, recuperación, sesiones, límites
MAU, auditoría, integración NestJS, costo y exportabilidad. El número de
MAU gratuitos no será el único criterio.

## 13. Storage

KLEBER necesitará almacenar soportes, documentos, evidencias y PDFs. El
storage deberá admitir autorización, URLs firmadas, cifrado y políticas
de retención. S3 puede utilizarse incluso si PostgreSQL se aloja fuera
de AWS.

## 14. Lock-in

La lógica de dominio no dependerá directamente de SDKs cloud. Cuando sea
útil se utilizarán adaptadores como `DocumentStorage`,
`IdentityProvider` o equivalentes.

## 15. Criterio económico

No se escogerá proveedor únicamente por una promoción temporal. Se
comparará:

``` text
desarrollo
+ costo post-Free Tier
+ costo productivo mínimo
+ backups
+ operación
+ migración
```

## 16. Resultado

Este documento **no selecciona proveedor**.

-   **AWS:** mejor ecosistema y aprendizaje cloud; requiere controlar el
    costo posterior.
-   **Supabase:** mayor simplicidad integrada; Free es atractivo para
    desarrollo y Pro tiene costo base.
-   **Neon/híbrido:** atractivo para cargas pequeñas por scale-to-zero,
    a cambio de potencialmente combinar servicios.

## 17. Pendientes antes de decidir

1.  Verificar elegibilidad real de la cuenta AWS que se usaría.
2.  Definir disponibilidad requerida en producción.
3.  Estimar volumen documental.
4.  Definir política mínima de backup.
5.  Calcular costo post-promoción.
6.  Revisar región y latencia para Colombia.
7.  Determinar cuánto valor tiene usar AWS como parte del aprendizaje
    técnico.

## 18. Estado

``` text
KLB-002 = ANALYZED / DECISION PENDING
```

No se modifica ADR-001, no se modifica documentación previa, no se crea
infraestructura y no se incurre en costos.

## 19. Próximo documento

**KLB-003 --- Deployment Options and Environment Strategy**

Definirá alternativas para LOCAL, STAGING y PRODUCTION sin cerrar
todavía la selección final del proveedor cloud.
