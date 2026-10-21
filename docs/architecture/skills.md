# Skills del workflow y proporcionalidad

Estado: vigente. Decisión para [003](../../specs/003-sdd-workflow-skills/spec.md), registrada durante Plan antes de modificar el canon. Etapa: Stage 4 — Workflow skills.

## Contexto

El [workflow](../../.ai/workflow.md) definía fases, gates y artefactos, pero no cómo operarlos: `.ai/skills/` era un placeholder y cualquier cambio, aun trivial, producía cuatro archivos. Faltaba también un dueño explícito para aclarar el contrato antes de planificar y para comprobar la coherencia entre artefactos antes de implementar, que es donde un error cuesta más retrabajo.

## Decisión

**Formato.** Cada skill es `.ai/skills/<nombre>/SKILL.md`: un frontmatter con `name` y `description`, y un cuerpo Markdown con las secciones `Lee`, `Produce`, `Pasos`, `Gate` y `No hacer`. Coincide con la estructura del formato abierto de Agent Skills sin depender de él: un agente cualquiera aplica la skill leyendo el archivo, y un adapter futuro puede apuntarla sin transformarla. La carpeta admite anexos que se leen solo cuando hacen falta; en esta versión no hay anexos. `.ai/skills/README.md` es el índice y el mapeo skill→fase.

**Mapeo.** Hay nueve skills. Las fases siguen siendo seis; dos skills son sub-pasos y una es previa al ciclo.

| Skill | Fase | Responsabilidad |
| --- | --- | --- |
| `constitution` | Antes del ciclo | Contexto, restricciones, comprobaciones y entrega en `PROJECT.md`. |
| `specify` | Specification | Abrir el cambio, clasificar el nivel, redactar el contrato. |
| `clarify` | Specification | Resolver ambigüedades materiales; condición del gate de salida. |
| `plan` | Plan | Enfoque, decisiones y estrategia de verificación. |
| `tasks` | Tasks | Unidades ejecutables con cobertura de requisitos. |
| `analyze` | Entrada de Implementation | Coherencia y cobertura spec↔plan↔tasks; condición del gate de entrada. |
| `implement` | Implementation | Ejecutar tareas y registrar avance. |
| `verify` | Verification | Etapa de test/validación que cierra la implementación con evidencia por criterio. |
| `ship` | Ship | Entregar según el proyecto y registrar el cierre. |

`verify` y `ship` son skills separadas para que el cierre siempre tenga dueño: `implement` no puede declarar cumplido el contrato y `verify` no entrega.

**Proporcionalidad.** La definición normativa de los tres niveles, sus criterios, el escalado y los artefactos por nivel reside en [el workflow](../../.ai/workflow.md#niveles-de-cambio). El nivel cambia dónde se registra cada fase, no qué gates se evalúan: en el mínimo todo vive en `spec.md`; en el estándar las tareas van dentro de `plan.md`; el extendido conserva los cuatro archivos y exige una decisión arquitectónica. Los cambios previos con cuatro archivos son válidos como nivel extendido.

**Economía de contexto.** Cada skill pesa como máximo unos 700 tokens estimados y declara en `Lee` las secciones exactas del canon que necesita, en lugar de repetirlas. El contexto fijo de una etapa no supera los 2.500 tokens estimados. La estimación usa `max(caracteres/4, palabras×1,5)`, sin tokenizer de proveedor.

**Constitution.** Solo opera sobre el contexto de `PROJECT.md`. La copia de `.ai/` y la sección `## ndev-spec` pertenecen al [procedimiento de instalación](installation-updates.md), que la skill cita por nombre porque `docs/` no se distribuye con el canon.

**Distribución.** Las skills forman parte de `.ai/` y viajan con el mecanismo manual existente; no cambia.

## Alternativas consideradas

| Alternativa | Motivo para no elegirla |
| --- | --- |
| Archivo plano por skill sin frontmatter | Los adapters tendrían que inferir nombre y descripción del texto. |
| Ocho skills (`verify` incluye Ship) o siete (`implement` valida y entrega) | Mezclan responsabilidades que el core separa; el cierre podría quedar sin dueño. |
| Dos niveles | No distinguen un cambio mediano de uno que requiere decisión arquitectónica. |
| Estándar con cuatro archivos | Paga un archivo extra por cambio sin mejorar un gate. |
| `clarify` y `analyze` opcionales | Se omitirían justo donde evitan retrabajo. |
| Niveles en un archivo aparte | Una lectura más en cada etapa y otra fuente normativa. |
| `constitution` orquestando la instalación | Duplicaría el procedimiento de 002 dentro del canon. |

## Consecuencias y límites

Un cambio chico produce un solo archivo con todos sus gates; uno grande conserva la trazabilidad completa. La clasificación y el escalado agregan una decisión explícita al inicio de cada cambio. No se definen adapters, comandos, plantillas, personas/agentes ni gates automáticos; los presupuestos de tokens son estimaciones y su verificación es manual.
