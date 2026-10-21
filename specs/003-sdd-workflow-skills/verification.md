# Verification — 003-sdd-workflow-skills

Estado: Verification satisfactoria tras repetirla por la observación de E4; Ship pendiente de actualizar el cierre en el PR #3.

Revisión verificada: `b4db092` (producto en `b557a9a` más el paso de cierre de `ship` en `b4db092`). La verificación original fue sobre `9f6fea8`. Los ensayos se hicieron en repositorios temporales fuera de este repositorio, con el `.ai/` de `b557a9a`; sus auxiliares (`measure.py`, `links.py` y los repos de prueba) no forman parte del producto.

## Ensayos

| ID | Ensayo | Resultado |
| --- | --- | --- |
| E1 | Medición con `max(caracteres/4, palabras×1,5)` | Por skill: entre 238 (`tasks`) y 520 (`constitution`) tokens, todas ≤ 700; `ship` pasó de 337 a 382 tokens (contexto fijo de 836 a 880) con el paso de cierre. Contexto fijo por etapa: entre 434 (`tasks`) y 1.611 (`specify`), todos ≤ 2.500. Referencia: leer el canon completo sin skills cuesta 4.689 tokens por etapa. |
| E2 | Formato y neutralidad | 9 carpetas con `SKILL.md`; frontmatter `name` igual a la carpeta y `description` no vacía; 5/5 secciones en cada una. Búsqueda de nombres de proveedores, modelos y herramientas en `.ai/`: sin coincidencias. Ningún enlace de `.ai/` sale de `.ai/`. |
| E3 | Caso mínimo (a): corregir un mensaje de error en un proyecto Python | Un único `spec.md`, de 248 palabras (≤ 500), con Contrato + Aclaraciones, Plan, Tareas + Análisis, Verificación y Cierre. `python -m unittest`: 2 pruebas OK. Cierre en un commit posterior que referencia el commit entregado, sin autorreferencia. |
| E4 | Caso extendido (b): exportación JSON que cambia la interfaz pública `report.export` | Cuatro archivos y la decisión `0001` (767 palabras en total). `clarify` registró 4 aclaraciones, una de ellas sobre un cambio de comportamiento existente. `analyze` detectó el hueco sembrado (R3 sin tarea) y otro no sembrado (el criterio de T1 no probaba R2); ambos se corrigieron y se repitió el gate de Tasks. `verify`, ejecución 1: un defecto inyectado después de Implementation hizo fallar `test_csv` (R4). Se volvió a `implement` y en la ejecución 2 pasaron las 5 pruebas y el comando de R2. Observación: el primer cierre no actualizó el estado de cabecera de `spec.md` y `plan.md`, como pide `ship`; al revisar el gate se corrigió en un commit adicional, que tampoco actualizó `tasks.md`. Causa: `ship` lo pedía en `Produce` pero no en `Pasos`. Resuelta en `b4db092` y comprobada en E9. |
| E5 | Escalado: opción `--quiet` | Clasificado como mínimo; durante Plan aparecieron dos componentes, así que se reclasificó a estándar antes del gate de Plan. Se registró el motivo, se trasladaron Plan, Tareas y Análisis a `plan.md`, se creó `verification.md` y se repitió el gate de Specification. 4 pruebas OK. |
| E6 | `constitution` | Proyecto nuevo: `PROJECT.md` con propósito, restricciones, comprobaciones inexistentes declaradas y entrega; `.ai/` sin cambios. Proyecto existente (Node, con AGENTS y procedencia): el relevamiento leyó solo README, AGENTS, `package.json` y la estructura, y ejecutó `npm test`. Registró hechos con su fuente y dos supuestos marcados (ESM sin `"type": "module"` bajo Node 20; comando de publicación). La sección `## ndev-spec` quedó byte a byte idéntica; `.ai/`, AGENTS, `src/`, `test/`, `package.json` y README sin cambios. |
| E7 | Preservación y coherencia | `git diff main` sobre `specs/001-*`, `specs/002-*`, `installation-updates.md`, `adoption.md`, `canon.md` y `.ai/rules/`: vacío. Revisión normativa: los seis gates se conservan; el workflow agrega las condiciones de `clarify` y `analyze` y la regla de registro por nivel; README, `.ai/README.md`, `sdd.md` y PROJECT remiten a ellas sin redefinirlas. |
| E8 | Enlaces y formato | 103 enlaces locales y anclas revisados, sin errores. `git diff --check` sin hallazgos. Árbol limpio antes del commit de Verification. Repetido tras `b4db092`: 102 enlaces (se retiró uno del handoff), sin errores; `git diff --check` limpio. |
| E9 | Repetición de Ship de E4 con `ship` de `b4db092` | Copia de `ext` desde `0287747` (antes del cierre), con la skill actualizada. Un único commit de cierre registró la referencia al commit verificado y dejó en estado final las cabeceras de los cuatro artefactos (`spec`, `plan`, `tasks` y `verification`), comprobadas antes del gate. No hizo falta un commit correctivo. |

## Requisitos

| Requisito | Evidencia | Resultado |
| --- | --- | --- |
| R1 | E2; decisión en [`skills.md`](../../docs/architecture/skills.md), registrada en `45e2f6f`, antes que las skills (`b557a9a`). | Satisfactorio |
| R2 | E2; mapeo en [`.ai/skills/README.md`](../../.ai/skills/README.md); E3–E5 recorrieron las nueve skills y cada fase cerró su gate. | Satisfactorio |
| R3 | [Niveles de cambio](../../.ai/workflow.md#niveles-de-cambio); E3 (mínimo), E4 (extendido), E5 (escalado); cambios de gate (a)–(c) aplicados. | Satisfactorio |
| R4 | Tabla de registros con contenido mínimo y exclusiones en el workflow; la skill creadora consta en cada `Produce`. Los ensayos no generaron archivos fuera de la tabla. | Satisfactorio |
| R5 | E1; cada skill declara `Lee`. | Satisfactorio |
| R6 | E2; los ensayos aplicaron las skills leyendo los archivos, sin adapters. | Satisfactorio |
| R7 | E6; E7 (instalación y 001/002 sin cambios). | Satisfactorio |
| R8 | E7; la tabla de cuatro archivos se declara como nivel extendido en el workflow y en `sdd.md`. En los cinco repositorios de ensayo, el `.ai/` distribuido coincide con los 21 blobs de `b557a9a` (ver límites). | Satisfactorio |
| R9 | PROJECT en Stage 4 con la entrega de 003; README, `.ai/README.md` y `sdd.md` actualizados; `.gitkeep` retirado. | Satisfactorio |
| R10 | E1–E9 en este archivo. | Satisfactorio |

## Desviaciones y límites

- El origen tiene `core.autocrlf=true`, así que `git archive` entregó CRLF a los repos de ensayo y sus blobs no coinciden byte a byte con `b557a9a`. Sin CR, los 21 archivos de cada repo son idénticos a los blobs del origen. Es un atajo del auxiliar de ensayo, no el procedimiento de 002 (que exige comprobar sin filtros) ni un cambio del producto.
- Los ensayos los ejecutó un único agente que redactó las skills, y las respuestas del responsable fueron simuladas y registradas como tales. Los costos son estimaciones por fórmula, no mediciones con un tokenizer de un proveedor.
- El defecto de E4 fue inyectado para ejercitar el camino de fallo; no proviene de la implementación.

## Handoff

El contrato y el Plan no cambiaron. La observación de E4 reabrió T2: se agregó el paso de cierre a `ship`, por decisión del usuario, en lugar de ampliar `analyze`, que corre antes de Implementation. E1, E8 y E9 se repitieron con resultado satisfactorio. Siguiente paso: actualizar el PR #3 y el cierre.

## Cierre

Entregado según PROJECT: rama `docs/sdd-workflow-skills` publicada en `origin` con el contenido verificado en `2b76cd1`, y [PR #3](https://github.com/lugonesnicolas/ndev-spec/pull/3) contra `main`, con descripción en español. El merge queda pendiente de confirmación explícita del usuario; es compatible con el contrato, que no lo exige. Este registro se agrega en un commit posterior al PR. Handoff final: revisar y, si se aprueba, mergear el PR; no quedan tareas de 003.
