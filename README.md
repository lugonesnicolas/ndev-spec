# ndev-spec

ndev-spec construye un harness portable y liviano para **Specification-Driven Development (SDD)** asistido por agentes. El canon compartido vive en [`.ai/`](.ai/README.md); [el contrato de este proyecto](PROJECT.md) indica su etapa actual y sus condiciones de entrega. Las [decisiones arquitectónicas](docs/architecture/) explican cómo evolucionó el diseño.

El ciclo disponible es manual y neutral respecto de proveedores y modelos. Sus fases y gates se definen en [el workflow](.ai/workflow.md); las [reglas](.ai/README.md#índice-de-reglas) complementan su aplicación. Comandos, skills, adapters, instalador y gates automáticos son trabajo futuro.

## Trabajar un cambio

1. Leer `.ai/README.md`, `.ai/workflow.md`, las reglas aplicables y `PROJECT.md`. Antes de modificar producto, resolver las decisiones arquitectónicas necesarias y documentarlas.
2. Crear `specs/<número>-<nombre-kebab-case>/`. El primer cambio es `001`; para el siguiente, tomar el mayor número existente y sumar uno. Los huecos y números de cambios cancelados no se reutilizan. Si dos ramas producen el mismo número, renumerar el cambio entrante y sus referencias antes de integrar. El nombre de la rama es independiente.
3. En **Specification**, escribir `spec.md` con requisitos y criterios verificables. Superar su gate antes de crear `plan.md` con enfoque, decisiones y verificación.
4. En **Tasks**, crear `tasks.md` con unidades, dependencias y criterios de finalización. Solo entonces ejecutar **Implementation** y actualizar allí el progreso.
5. En **Verification**, crear `verification.md` y contrastar cada criterio con evidencia. Si algo falla, volver a la fase correspondiente, corregir y verificar de nuevo.
6. En **Ship**, aplicar las condiciones de entrega del proyecto y registrar resultado, referencia y handoff final en `verification.md`.

Cada archivo se crea cuando se trabaja su fase. Basta con Markdown breve que permita a otra persona o agente continuar desde el repositorio; no se requieren plantillas ni comandos del harness. [El primer cambio real](specs/001-readme-manual-sdd/spec.md) muestra los cuatro artefactos.

## Incorporar el harness en otro proyecto

1. Elegir una revisión exacta de este repositorio, por ejemplo un commit de Git. Obtener esa revisión y comprobar que el árbol de origen corresponde al commit elegido; no usar una copia de trabajo con cambios sin registrar.
2. Revisar si el proyecto ya tiene `.ai/` o `PROJECT.md`. Si alguno existe, detener la copia y resolver su contenido y propiedad. Revisar también las instrucciones existentes para agentes: se conservan y se enlazan al canon manualmente cuando corresponda.
3. Copiar únicamente `.ai/` desde la revisión elegida a la raíz del proyecto. En `PROJECT.md`, registrar propósito, stack, restricciones, comprobaciones, condiciones de Ship, URL o ruta del repositorio de origen y el commit exacto copiado. Ese archivo y `specs/` pertenecen al proyecto consumidor; no copiar las specs ni la documentación histórica de ndev-spec.
4. Leer el canon copiado y empezar `specs/001-<nombre>/` cuando surja el primer cambio. Las referencias internas de `.ai/` funcionan con esa copia local, sin consultar el repositorio de origen durante el trabajo.

Mantener `.ai/` sin modificaciones locales facilita comparar revisiones. Para una actualización futura, revisar las diferencias antes de reemplazar el core y preservar `PROJECT.md`, `specs/` y archivos ajenos. El mecanismo de instalación y actualización automática aún no está definido; [la decisión de adopción](docs/architecture/adoption.md) establece sus límites.
