# Tasks — 003-sdd-workflow-skills

Estado: Implementation en curso; T1–T3 completas, T4 pendiente. Gates de Specification, Plan y Tasks cumplidos; análisis registrado.

| ID | Trabajo y requisitos | Dependencias | Criterio de finalización | Estado |
| --- | --- | --- | --- | --- |
| T1 | Ajustar `.ai/workflow.md`: niveles, escalado, artefactos por nivel, condiciones de `clarify` y `analyze`, límites del core (R3, R4) | Gates de Specification, Plan y Tasks; decisión arquitectónica | Criterios objetivos y escalado iguales a la spec; tabla con nombre, contenido mínimo, skill creadora y exclusiones; seis gates conservados; ningún enlace fuera de `.ai/`. | Completa: sección Niveles de cambio con criterios, tabla de registros por nivel con exclusiones y escalado; condiciones de `clarify` (salida de Specification) y `analyze` (entrada de Implementation); límites del core actualizados. |
| T2 | Crear `.ai/skills/README.md` y los nueve `SKILL.md`; retirar `.gitkeep` (R1, R2, R5, R6, R7) | T1 | Formato y secciones de R1; mapeo de R2; `Lee` según el Plan; cada skill ≤ 700 tokens estimados; sin nombres de proveedores ni herramientas. | Completa: índice y nueve skills; máx. 520 tokens por skill (`constitution`) y máx. 1.611 de contexto fijo (`specify`); sin nombres de proveedores; `.gitkeep` retirado. |
| T3 | Alinear `.ai/README.md`, `docs/architecture/sdd.md`, `README.md` y `PROJECT.md` (R8, R9) | T1, T2 | Stage 4 y entrega de 003 en PROJECT; ningún texto declara las skills pendientes; compatibilidad de 001/002 explícita; sin duplicar el workflow. | Completa: Stage 4 y entrega de 003 en PROJECT; README con niveles, skills y `constitution`; `.ai/README.md` y `sdd.md` remiten a la decisión. |
| T4 | Preparar los escenarios E1–E8 y el script de medición en el scratchpad (R5, R10) | T2 | Proyectos temporales y casos sembrados listos para Verification; el script reproduce la fórmula de R5. | Pendiente |

## Análisis

Cobertura: R1→T2; R2→T2; R3→T1; R4→T1; R5→T2, T4; R6→T2; R7→T2 (`constitution`), E6; R8→T3; R9→T3; R10→T4 y Verification. Todos los requisitos tienen tarea y ensayo. No hay tareas sin requisito. El Plan y la spec usan los mismos umbrales (700/2.500 tokens, ≤ 500 palabras en el caso mínimo). Inconsistencias: ninguna.

## Handoff

T1–T3 verificadas localmente con medición de tokens, revisión de enlaces (99, sin errores) y `git diff --check`. Siguiente paso: T4. No hay bloqueos.
