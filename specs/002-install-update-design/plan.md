# Plan — 002-install-update-design

Estado: Plan completo; gate de salida cumplido. Specification vigente y decisiones materiales resueltas.

## Enfoque

Aplicar el contrato de [Specification](spec.md) mediante la [decisión de instalación y actualización](../../docs/architecture/installation-updates.md), persistida en esta fase antes de los cambios derivados. Conservar la [adopción portable](../../docs/architecture/adoption.md), ampliándola con procedencia única en PROJECT, comparación B/L/T, precondiciones Git, colisiones, resolución previa y recuperación acotada. No modificar el canon distribuido ni definir comandos ejecutables del harness.

Completar en la decisión un procedimiento manual con pasos, ejemplos de revisión exacta y herramientas Git ordinarias de inspección. Explicar instalación nueva, incorporación en proyecto existente, adopción de copia idéntica, actualización, revisión anterior y recuperación. Las comprobaciones de contenido incluirán extracción contra blobs, inventario de archivos ignorados/ocultos y conversión LF/CRLF; no bastará con status limpio.

Actualizar README para enlazar y resumir el procedimiento sin mantener una segunda especificación; actualizar adopción para distinguir el diseño disponible de la automatización pendiente. Registrar en PROJECT las condiciones de entrega de 002 sin cambiar de etapa ni agregar la sección de procedencia propia de consumidores al repositorio de origen.

## Dependencias y secuencia

Specification precedió a esta fase. La decisión arquitectónica y este Plan preceden a Tasks; no se ejecutará producto hasta persistir Tasks con sus dependencias y criterios. Implementation es documental: guía, referencias y material necesario para ensayar. Verification ejecutará ensayos temporales y revisará cada requisito. Un fallo vuelve a la fase afectada, queda registrado y bloquea Ship hasta su corrección.

## Estrategia de verificación

Usar como B la revisión real `de238169dd7eda60404de40523e6440497356dce` y preparar en un repositorio temporal una T sintética con alta, modificación y baja del canon. Identificar T en la evidencia, sin publicarla ni presentarla como release. Hacer instalaciones y actualizaciones mediante operaciones manuales ordinarias; los auxiliares temporales solo preparan fixtures y comprueban resultados, no constituyen instalador ni comandos reutilizables.

| Cobertura | Método previsto |
| --- | --- |
| R1, R2 | Obtener B por OID completo, comprobar inventario/blobs y registro; probar selección inválida, falta de base, registro ambiguo y extracción incompleta sin escrituras. Usar repositorios locales sin red. |
| R3, R4 | Consumidores nuevo y existente; snapshots de archivos propios; colisiones con PROJECT, `.ai` archivo/directorio, ignorados/ocultos y mayúsculas. Inspeccionar rechazo de enlaces y submódulos por tipo; no seguirlos. |
| R5, R6 | Revisar B→L y B→T; aplicar alta/cambio/baja, repetir sin cambios y volver a B en nuevo commit. Detectar edición, alta y baja locales, respaldar y resolver antes de aplicar. |
| R7 | Índice con blobs idénticos bajo LF/CRLF; atributos de transformación presentes causan bloqueo sin ejecutar filtros. |
| R8 | Mutar un destino después de revisarlo e invalidar; interrumpir una aplicación, restaurar solo rutas afectadas y comparar con C. Provocar validación y commit fallidos y comprobar que no se declara entrega. |
| R9, R10 | Lectura de coherencia y neutralidad, revisión de enlaces locales y anclas, diff/check, inventario de archivos cambiados y preservación de refs y `.ai/`. Evidencia explícita por criterio, separando inspección de ensayos. |

Los ensayos no pretenden probar compatibilidad de todos los sistemas de archivos, confianza criptográfica del origen ni exclusión automática de concurrencia. Se documentarán el entorno y límites concretos; las restricciones conservadoras del diseño seguirán vigentes. No se añade una suite al producto.

## Entrega y handoff

Rama `docs/install-update-design` desde `de23816`; commits coherentes de contrato/diseño, documentación verificada y cierre. Ship solo después de evidencia satisfactoria, con registro posterior del commit entregado para evitar autorreferencia. Sin push, PR, merge, rebase ni cambios en las refs previas. Tasks, Implementation documental y Verification completas; Ship local cerrado en `verification.md`. La decisión previa quedó registrada en `7a0ab8f`. La precisión sobre atributos introducidos por T permanece cubierta por R7 y este enfoque; gates revalidados y caso E20 satisfactorio. Una automatización futura requiere otro contrato.
