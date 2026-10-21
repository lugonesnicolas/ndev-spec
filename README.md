# ndev-spec

ndev-spec construye un harness portable y liviano para **Specification-Driven Development (SDD)** asistido por agentes. El canon compartido vive en [`.ai/`](.ai/README.md); [el contrato de este proyecto](PROJECT.md) indica su etapa actual y sus condiciones de entrega. Las [decisiones arquitectónicas](docs/architecture/) explican cómo evolucionó el diseño.

El ciclo disponible es manual y neutral respecto de proveedores y modelos. Sus fases y gates se definen en [el workflow](.ai/workflow.md); las [reglas](.ai/README.md#índice-de-reglas) complementan su aplicación. Las [skills](.ai/skills/README.md) operan cada etapa leyendo solo lo necesario. Comandos, adapters, instalador y gates automáticos son trabajo futuro.

## Trabajar un cambio

1. Leer `.ai/README.md`, el [índice de skills](.ai/skills/README.md) y `PROJECT.md`; cada skill indica qué secciones del workflow y qué reglas leer. Antes de modificar producto, resolver las decisiones arquitectónicas necesarias y documentarlas.
2. Con `specify`, crear `specs/<número>-<nombre-kebab-case>/`. El primer cambio es `001`; para el siguiente, tomar el mayor número existente y sumar uno. Los huecos y números de cambios cancelados no se reutilizan. Si dos ramas producen el mismo número, renumerar el cambio entrante y sus referencias antes de integrar. El nombre de la rama es independiente.
3. Clasificar el [nivel](.ai/workflow.md#niveles-de-cambio): un cambio mínimo usa solo `spec.md`; uno estándar, `spec.md`, `plan.md` y `verification.md`; uno extendido, los cuatro archivos y una decisión arquitectónica.
4. En **Specification** (`specify`, `clarify`), escribir requisitos con criterios verificables y resolver ambigüedades materiales. En **Plan** y **Tasks** (`plan`, `tasks`), definir enfoque, verificación y unidades de trabajo; `analyze` comprueba la cobertura antes de implementar.
5. En **Implementation** (`implement`), ejecutar las tareas y registrar el progreso. En **Verification** (`verify`), probar y contrastar cada criterio con evidencia; si algo falla, volver a la fase correspondiente.
6. En **Ship** (`ship`), aplicar las condiciones de entrega del proyecto y registrar el cierre.

Cada registro se crea cuando se trabaja su fase. Basta con Markdown breve que permita a otra persona o agente continuar desde el repositorio; no se requieren plantillas ni comandos del harness. [El primer cambio real](specs/001-readme-manual-sdd/spec.md) muestra los cuatro artefactos del nivel extendido.

## Incorporar el harness en otro proyecto

Seguir el [procedimiento manual de instalación y actualización](docs/architecture/installation-updates.md#procedimiento-manual). Requiere Git, un commit de recuperación y un estado limpio antes de aplicar. El uso cotidiano del canon instalado permanece local y no requiere conexión al origen.

1. Elegir un origen Git y resolver la revisión a un commit completo. Preparar y comprobar únicamente su árbol `.ai/`, sin copiar el árbol de trabajo del origen.
2. Revisar colisiones, archivos ignorados e instrucciones existentes. Si ya existen `.ai/` o `PROJECT.md`, detener la copia hasta resolver su contenido y propiedad; una copia idéntica puede adoptarse explícitamente.
3. Revisar todos los cambios antes de aplicarlos. El consumidor conserva su contexto en PROJECT y registra origen y revisión en una sección única `## ndev-spec`. `PROJECT.md`, `specs/` e instrucciones de agentes son propios: no importarlos desde ndev-spec. La skill [`constitution`](.ai/skills/constitution/SKILL.md) ayuda a redactar ese contexto, en un proyecto nuevo o con desarrollo previo; no copia `.ai/` ni edita la sección de procedencia.
4. Aplicar el conjunto revisado, comprobar canon y procedencia, preservar archivos ajenos y confirmar ambos en Git. Leer el canon local y abrir la siguiente spec disponible cuando surja un cambio; en un consumidor nuevo será `001`.

Para actualizar, el procedimiento compara revisión registrada, copia local y revisión destino. Las divergencias dentro de `.ai/` bloquean el reemplazo hasta resolverse con respaldo; una interrupción exige completar o recuperar el conjunto afectado. La [decisión arquitectónica](docs/architecture/installation-updates.md) explica alternativas, fallos y recuperación. No existe instalador ni actualización automática; [002](specs/002-install-update-design/spec.md) entrega su diseño y ensayos manuales.
