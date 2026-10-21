# Plan — 003-sdd-workflow-skills

Estado: Plan completo; gate de salida cumplido. Coherente con [spec.md](spec.md); cubre R1–R10 sin decisiones materiales abiertas.

## Enfoque

1. Registrar la decisión en [`docs/architecture/skills.md`](../../docs/architecture/skills.md) (R1–R3, R5–R7) antes de tocar el canon.
2. Ajustar [`.ai/workflow.md`](../../.ai/workflow.md) (R3, R4): sección "Niveles de cambio" con criterios, escalado y tabla de artefactos por nivel (contenido mínimo, skill creadora, exclusiones); condición de `clarify` en el gate de salida de Specification; condición de `analyze` en el gate de entrada de Implementation; la tabla de artefactos actual se describe como nivel extendido; "Límites del core" deja de excluir skills. Los gates existentes no se reescriben.
3. Crear `.ai/skills/README.md` (formato, mapeo y lectura incremental) y los nueve `SKILL.md` (R1, R2, R5, R6). Retirar `.ai/skills/.gitkeep`.
4. Alinear `.ai/README.md`, `docs/architecture/sdd.md`, `README.md` y `PROJECT.md` (R8, R9) sin duplicar el workflow.
5. Verification con ensayos en repositorios temporales fuera del repo (R10).

## Lectura incremental por skill

Cada skill lee solo lo listado; las secciones del workflow se citan por ancla. Los artefactos del cambio se leen según el nivel.

| Skill | Canon que declara en `Lee` |
| --- | --- |
| `constitution` | `.ai/README.md` (jerarquía) |
| `specify` | workflow: Niveles, Artefactos, §1 |
| `clarify` | workflow: §1 |
| `plan` | workflow: §2; `rules/architecture.md` |
| `tasks` | workflow: §3 |
| `analyze` | workflow: §4 (gate de entrada) |
| `implement` | workflow: §4; `rules/development.md`, `rules/security.md`; `rules/git-workflow.md` si se usa Git |
| `verify` | workflow: §5; `rules/testing.md` |
| `ship` | workflow: §6; `rules/git-workflow.md` si se usa Git |

Presupuesto: SKILL.md ≤ 700 tokens y contexto fijo (skill + canon declarado) ≤ 2.500, ambos con `max(caracteres/4, palabras×1,5)`. Se mide con un script auxiliar en el scratchpad; el script no forma parte del producto.

## Verificación

| ID | Ensayo o comprobación | Requisitos |
| --- | --- | --- |
| E1 | Medir cada SKILL.md y el contexto fijo por etapa. | R5 |
| E2 | Inspeccionar formato y secciones; buscar nombres de proveedores, modelos y herramientas en `.ai/skills/`; comprobar que los enlaces de `.ai/` no salen de `.ai/`. | R1, R2, R6 |
| E3 | Caso mínimo (a): proyecto temporal con una función y su prueba; recorrer `specify`→`ship` siguiendo solo el texto de las skills. Esperado: un `spec.md` de ≤ 500 palabras con seis gates. | R3, R4, R10 |
| E4 | Caso extendido (b): exportador con cambio de interfaz pública; cuatro archivos y una decisión; un hueco de cobertura sembrado que `analyze` debe detectar; un fallo inducido en `verify` con regreso a `implement`. | R3, R4, R10 |
| E5 | Escalado: un cambio mínimo que descubre una dependencia nueva se reclasifica; se trasladan las secciones y se repiten los gates. | R3 |
| E6 | `constitution` en un proyecto nuevo (vacío) y en uno existente con código, pruebas, `AGENTS.md` y una sección `## ndev-spec`; esta sección y `.ai/` quedan idénticos. | R7 |
| E7 | `git diff main -- specs/001-* specs/002-* docs/architecture/installation-updates.md` vacío; revisión normativa de la coherencia entre workflow, skills, README, PROJECT y sdd. | R7, R8, R9 |
| E8 | Revisión de enlaces locales, `git diff --check` y estado de Git. | R10 |

Los ensayos usan Python o Node disponibles localmente para las pruebas de los proyectos temporales. Un fallo se registra con su evidencia, se corrige en la fase correspondiente y se repite el ensayo.

## Ship

Commits por fase en `docs/sdd-workflow-skills`. Después de Verification satisfactoria: push, PR contra `main` en español con la línea de atribución y cierre en `verification.md` (rama, commit y PR). Sin merge sin confirmación explícita.

## Handoff

La decisión arquitectónica está persistida. Siguiente paso: Tasks y `analyze` sobre este mismo cambio antes de Implementation.
