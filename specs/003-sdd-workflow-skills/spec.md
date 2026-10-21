# 003 — Skills del workflow SDD

Estado: entregado (ver Cierre en verification.md); Specification cumplida. Contrato, cambios de gate y umbrales aprobados por el usuario. Nivel: extendido (cambia el canon y requiere decisión arquitectónica).

## Contrato

Hacer operable el workflow de [`.ai/workflow.md`](../../.ai/workflow.md) mediante skills neutrales en `.ai/skills/`, una por etapa, con niveles de proporcionalidad que eviten artefactos burocráticos en cambios chicos sin eliminar ningún gate. El producto son Markdown del canon y su documentación; no hay adapters, comandos, plantillas ni automatización.

| ID | Requisito y criterio verificable |
| --- | --- |
| R1 | Formato neutral: cada skill es `.ai/skills/<nombre>/SKILL.md` con frontmatter `name` y `description` y las secciones `Lee`, `Produce`, `Pasos`, `Gate` y `No hacer`. No contiene sintaxis, rutas ni nombres de herramientas, proveedores o modelos. La decisión y sus alternativas constan en `docs/architecture/` antes de crear las skills. |
| R2 | Existen exactamente nueve skills mapeadas en `.ai/skills/README.md`: `constitution` (contexto del proyecto, antes del ciclo); `specify` y `clarify` (Specification); `plan` (Plan); `tasks` (Tasks); `analyze` (condición del gate de entrada de Implementation); `implement` (Implementation); `verify` (Verification: etapa de test/validación que cierra la implementación); `ship` (Ship). Cada una de las seis fases tiene al menos una skill responsable de su gate de salida. |
| R3 | `.ai/workflow.md` define tres niveles (mínimo, estándar, extendido) con los criterios objetivos de la sección [Niveles](#niveles-de-cambio), su escalado y los artefactos de la sección [Artefactos](#artefactos-por-nivel). Las seis fases y sus gates se conservan en todos los niveles; ninguno omite Verification. Cambios de gate a aprobar: (a) el gate de entrada de Implementation exige además el resultado de `analyze` registrado; (b) el gate de salida de Specification exige que las aclaraciones de `clarify` estén registradas o declaradas innecesarias; (c) en mínimo y estándar, algunas fases registran su output como sección de otro archivo, y su gate se evalúa sobre esa sección. |
| R4 | Para cada artefacto y nivel se documenta en el canon: nombre, contenido mínimo, etapa y skill que lo crea, y qué no debe contener. No se agregan archivos por cambio fuera de los de la tabla de [Artefactos](#artefactos-por-nivel). |
| R5 | Presupuesto: cada `SKILL.md` ≤ 700 tokens estimados, con `max(caracteres/4, palabras×1,5)`. Cada skill declara en `Lee` las secciones del canon y los artefactos que necesita; el contexto fijo por etapa (skill + secciones del canon declaradas, sin artefactos del cambio ni código) ≤ 2.500 tokens estimados. Las skills enlazan al canon en lugar de repetir sus definiciones. Las mediciones constan en Verification. |
| R6 | Las skills son canon portable: se aplican leyendo los archivos y sin ningún adapter; `.ai/` sigue siendo autocontenido (no enlaza a `docs/`, `specs/` ni `PROJECT.md` de ndev-spec). Los formatos propios de herramientas quedan fuera de alcance. |
| R7 | `constitution` redacta o actualiza el contexto, las restricciones, las comprobaciones y las condiciones de entrega de `PROJECT.md`. En un proyecto existente, primero releva el desarrollo previo (stack, convenciones, comandos de prueba, instrucciones de agentes). No copia `.ai/`, no edita la sección `## ndev-spec` y no duplica el procedimiento de instalación: lo cita por nombre. No se modifica el procedimiento ni el comportamiento verificado de 001/002. |
| R8 | Compatibilidad: los cambios con los cuatro archivos (001, 002) siguen siendo válidos como nivel extendido sin migración. Las skills se distribuyen dentro de `.ai/` con el mecanismo de 002, sin cambios en él. |
| R9 | `PROJECT.md` pasa a Stage 4 — Workflow skills y registra las condiciones de entrega de 003 sin duplicar estado. `README.md`, `.ai/README.md` y `docs/architecture/sdd.md` quedan coherentes con niveles y skills; `.ai/skills/.gitkeep` se retira. |
| R10 | `verification.md` registra evidencia por R1–R9 con ensayos reales en repositorios temporales, recorriendo las skills: (a) el caso mínimo y (b) el caso extendido de [Casos de proporcionalidad](#casos-de-proporcionalidad); (c) `constitution` en un proyecto nuevo y en uno existente. Incluye los costos observados por etapa, la revisión de enlaces locales, `git diff --check` y la preservación de 001/002. |

## Niveles de cambio

- **Extendido** si se cumple cualquiera de estas condiciones: requiere una decisión arquitectónica; cambia una interfaz o contrato público, un formato de datos persistido o el canon; afecta límites de confianza o seguridad; incorpora una dependencia; requiere migración.
- **Mínimo** si se cumplen todas: ninguna condición de extendido; hasta 3 requisitos; hasta 3 tareas; un solo componente o documento; reversible con un único commit.
- **Estándar**: el resto de los casos.
- **Escalado**: `specify` clasifica y registra el nivel y su motivo en la cabecera de `spec.md`. Si en cualquier fase aparece un criterio de un nivel superior, se reclasifica, se registra, se trasladan las secciones a los archivos del nuevo nivel y se repiten los gates afectados. Solo se puede bajar de nivel antes del gate de salida de Plan.

## Artefactos por nivel

| Nivel | Archivos | Ubicación de cada fase |
| --- | --- | --- |
| Mínimo | `spec.md` | Secciones Contrato (+ aclaraciones), Plan, Tareas (+ análisis), Verificación y Cierre. |
| Estándar | `spec.md`, `plan.md`, `verification.md` | Las tareas y el análisis van en una sección de `plan.md`; el cierre de Ship va en `verification.md`. |
| Extendido | `spec.md`, `plan.md`, `tasks.md`, `verification.md` y una decisión en la documentación arquitectónica del proyecto | Como hoy. |

Ningún artefacto contiene transcripciones de conversación, copias del canon, alternativas no elegidas fuera de la decisión arquitectónica ni evidencia sin relación con un criterio.

## Casos de proporcionalidad

- **Mínimo (ensayo a):** en un proyecto temporal, corregir un mensaje de error y su prueba. Resultado esperado: un único `spec.md` de ≤ 500 palabras con las cinco secciones, los seis gates registrados, `verify` ejecuta la prueba y `ship` registra el cierre.
- **Extendido (ensayo b):** en un proyecto temporal, agregar un formato de exportación que cambia una interfaz pública. Resultado esperado: los cuatro archivos y una decisión arquitectónica, aclaraciones registradas, `analyze` detecta y corrige al menos una falta de cobertura sembrada, `verify` registra un fallo inducido, vuelve a `implement` y luego pasa.
- **Escalado:** durante el ensayo (a) o (b) se fuerza una reclasificación y se comprueba el traslado de secciones y la repetición de gates.

## Alcance y entrega

Fuera de alcance: adapters (Claude Code, Codex, Cursor u otros), comandos, plantillas en `.ai/templates/`, personas/agentes, scripts, gates automáticos e instalador. Los auxiliares de ensayo no forman parte del producto.

Ship: commits coherentes por fase en `docs/sdd-workflow-skills`, creada desde `main` en `43875b9`. Después de Verification satisfactoria: push y PR contra `main` con descripción en español. No se mergea sin confirmación explícita del usuario. Antes de Verification no se hace push ni se abre PR, salvo pedido explícito. El cierre registra la rama, el commit entregado y el PR en `verification.md`.

## Handoff

Se revisaron AGENTS, PROJECT, el canon, las reglas, la arquitectura, 001/002 y Git. Siguiente número revalidado: `003`. El usuario resolvió: formato de carpeta + `SKILL.md`, nueve skills con `verify` y `ship` separadas, tres niveles con el mínimo en un archivo, `clarify`/`analyze` como sub-pasos con registro, niveles en `workflow.md`, `constitution` limitada al contexto de PROJECT y un presupuesto de 700 tokens por skill. Las aclaraciones materiales quedaron resueltas por esas decisiones; no quedan ambigüedades abiertas. Siguiente paso: Plan y decisión arquitectónica.
