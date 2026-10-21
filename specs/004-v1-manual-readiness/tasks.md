# Tasks — 004

Estado: Tasks cumplida; Implementation pendiente. Specification y Plan vigentes.

| ID | Trabajo y requisitos | Dependencias | Criterio de finalización | Estado |
| --- | --- | --- | --- | --- |
| T1 | Auditar ciclo y corregir canon/preguntas (R1–R3) | Specification, Plan, decisión y análisis | Matriz de fases/skills; hallazgos resueltos; protocolo neutral enlazado y lecturas coherentes. | Pendiente |
| T2 | Guía operativa y ejemplos (R4, R5) | T1 | Instalación nueva/existente, actualización, recuperación, nueve prompts y tres niveles, conforme a 002. | Pendiente |
| T3 | Alinear entradas y estado histórico (R6) | T1, T2 | README breve, índices y PROJECT vigentes; nota de integración 003; 001/002 y diseño de instalación preservados. | Pendiente |
| T4 | Preparar y ejecutar ensayos E1–E7 (R1–R7) | T1–T3 | Evidencia por criterio, límites explícitos y ningún bloqueo de preparación v1; enlaces/presupuestos/diff correctos. | Pendiente |
| T5 | Entregar PR y registrar cierre (R8) | T4 y gate de Verification | Rama publicada, PR en español, referencia verificada y estados coherentes; sin merge ni release. | Pendiente |

T5 es trabajo de Ship: no se ejecuta ni condiciona la salida de Implementation antes de Verification. T1–T4 son las unidades de implementación y preparación de evidencia.

## Análisis

Cobertura: R1→T1/T4→E1/E5; R2→T1/T4→E2; R3→T1/T4→E1/E5/E6; R4→T2/T4→E3/E4; R5→T2/T4→E5/E7; R6→T3/T4→E6/E7; R7→T4→E2–E6; R8→T5→E7. No hay tareas sin requisito, ciclos ni criterios inobservables. Nivel extendido confirmado por cambio del canon y decisión arquitectónica. Condiciones de entrega coinciden con el usuario; PROJECT se alineará en T3. T5 pertenece explícitamente a Ship y no crea una dependencia circular con Verification. Sin inconsistencias materiales abiertas: gate de entrada de Implementation cumplido para T1.

## Auditoría inicial

| Hallazgo | Impacto | Resolución prevista |
| --- | --- | --- |
| H1: analyze dice «Nada más» pero contrasta PROJECT y decisiones. | No puede comprobar coherencia siguiendo sus lecturas. | Declarar contexto relevante en Lee. |
| H2: preguntas sin protocolo común de herramienta/alternativa en todas las fases. | Aclaraciones tardías o no persistidas. | Regla transversal, lecturas explícitas y retorno a fase de origen. |
| H3: verify ordena ejecutar «la suite» aunque puede no existir. | Agente puede inventar comprobaciones o confundir ausencia con éxito. | Ejecutar solo comprobaciones aplicables y declarar inexistentes. |
| H4: README concentra operación e instalación; no hay recorrido guiado. | Adopción y continuación requieren interpretar decisiones arquitectónicas. | Guía práctica y README como entrada breve. |
| H5: cierre de 003 aún indica PR sin merge. | Estado actual ambiguo para quien retoma. | Nota de integración basada en 9789384, preservando historia. |

## Handoff

Gates de Specification, Plan y Tasks cumplidos. Análisis sin bloqueos; T1 habilitada. Los hallazgos son trabajo contratado, no requisitos nuevos. Registrar resolución y evidencia al completar cada tarea; no declarar preparación v1 antes de Verification.
