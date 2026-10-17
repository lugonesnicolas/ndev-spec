# Plan — 001-readme-manual-sdd

Estado: Plan completo; gate de salida cumplido.

## Enfoque y decisiones

Aplicar [la decisión de adopción](../../docs/architecture/adoption.md) y conservar el ciclo de [SDD Core](../../docs/architecture/sdd.md). Documentar en `.ai/workflow.md` la secuencia `001-nombre`, el cálculo manual del siguiente número, cancelaciones, colisiones y artefactos por fase. Llevar la jerarquía normativa sin cambios de prioridad a `.ai/README.md`; `docs/architecture/canon.md` quedará como explicación y enlace. Eliminar enlaces salientes desde `.ai/` hacia `docs/`.

Crear `PROJECT.md` para el contexto propio de ndev-spec. Será la única declaración de su etapa actual; `AGENTS.md` apuntará a ese archivo y mantendrá las instrucciones de lectura del canon. El README guiará el ciclo manual y la copia de una revisión exacta. En un consumidor, `PROJECT.md` debe anotar origen y revisión de esa copia; en ndev-spec, el origen es este repositorio y la revisión de la entrega se registra en Verification, para evitar una referencia circular al propio commit.

Preservar los documentos y modificaciones locales previas revisados al iniciar. Registrar la decisión arquitectónica antes de cambiar el canon. La rama `docs/readme-manual-sdd` alojará la entrega local; los commits se agruparán por documentación, verificación y cierre.

## Dependencias y verificación

El contrato `spec.md` y esta decisión preceden a Tasks; Tasks precede a los cambios de producto. La verificación relacionará R1–R8 con lectura documental, revisión de enlaces y `git diff --check`. Para R1 se comprobarán manualmente ejemplos de primera spec, máximo con huecos, cancelación, colisión entre ramas y `999 → 1000`. Para R3 y R7 se copiará el canon desde una revisión Git identificada a repositorios temporales vacío y existente, con `.ai/` y `PROJECT.md` preexistentes como casos de colisión. Los ensayos no modificarán repositorios externos ni se presentarán como prueba de un instalador.

Verification solo se cierra si todos los criterios tienen evidencia; Ship requiere los commits locales y después una actualización documental que registre el commit entregado y el handoff final.

## Handoff

Specification vigente en `spec.md`; decisión estructural en `docs/architecture/adoption.md`. Tasks, Implementation y Verification están completas. Ship local se registra en `verification.md`; el siguiente trabajo corresponde a un cambio separado de diseño.

Revalidación durante Verification: R8 se precisó como criterio de evidencia previo a Ship; la condición de entrega permanece en los límites de Specification y en `PROJECT.md`. El enfoque, las tareas de Implementation y su gate siguen cubriendo el contrato vigente.
