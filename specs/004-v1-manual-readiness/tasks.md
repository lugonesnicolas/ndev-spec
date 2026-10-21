# Tasks — 004

Estado: entregado; Implementation completa (T1–T4), Verification satisfactoria y Ship completo (T5). PR #4 abierto para revisión, sin merge. Specification, Plan, Tasks y análisis vigentes.

| ID | Trabajo y requisitos | Dependencias | Criterio de finalización | Estado |
| --- | --- | --- | --- | --- |
| T1 | Auditar ciclo y corregir canon/preguntas (R1–R3) | Specification, Plan, decisión y análisis | Matriz de fases/skills; hallazgos resueltos; protocolo neutral enlazado y lecturas coherentes. | Completa: matriz y H1–H3 resueltos abajo; medición preliminar ≤539 tokens/skill y ≤1.960 de contexto. |
| T2 | Guía operativa y ejemplos (R4, R5) | T1 | Instalación nueva/existente, actualización, recuperación, nueve prompts y tres niveles, conforme a 002. | Completa: docs/guide.md, con bloques P1–P8/B1–B8 y límites de copia/actualización. |
| T3 | Alinear entradas y estado histórico (R6) | T1, T2 | README breve, índices y PROJECT vigentes; nota de integración 003; 001/002 y diseño de instalación preservados. | Completa: README, índices, PROJECT y nota de integración; diff de preservación vacío. |
| T4 | Preparar y ejecutar ensayos E1–E7 (R1–R7) | T1–T3 | Evidencia por criterio, límites explícitos y ningún bloqueo de preparación v1; enlaces/presupuestos/diff correctos. | Completa: instalaciones P/B nuevas/existentes; actualización/no-op/colisión/recuperación; tres niveles y fallos; estática satisfactoria. Evidencia en verification.md. |
| T5 | Entregar PR y registrar cierre (R8) | T4 y gate de Verification | Rama publicada, PR en español, referencia verificada y estados coherentes; sin merge ni release. | Completa: 581c113 publicado, PR #4 abierto contra main, cierre posterior en verification.md; sin merge/tag/release. |

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

Todos los gates cumplidos y T1–T5 completas. Análisis sin bloqueos; evidencia, revisiones independientes y entrega en verification.md. Contrato y enfoque no cambiaron. Siguiente paso: revisar PR #4; el merge requiere confirmación explícita y está fuera de esta entrega. No quedan tareas de 004.

## Resultado de auditoría por fase

| Fase / skills | Entradas y salida evaluadas | Gate, trazabilidad y handoff | Resultado |
| --- | --- | --- | --- |
| Antes del ciclo / constitution | Instrucciones, contexto observado y PROJECT propio; preserva procedencia. | Acuerdo del responsable y pendientes explícitos; no abre cambios. | Conforme; H2 resuelto con lectura transversal. |
| Specification / specify, clarify | Solicitud y contexto → requisitos identificados, criterios, nivel y aclaraciones. | No permite ambigüedad material pendiente; handoff en Contrato. | Conforme; H2 resuelto para herramienta/chat y respuestas pendientes. |
| Plan / plan | Contrato vigente y contexto técnico → enfoque, decisiones y método por criterio. | Sin decisiones materiales abiertas; decisiones estructurales previas; handoff en Plan. | Conforme; protocolo aclara retorno ante cambios de enfoque. |
| Tasks / tasks, analyze | Contrato/Plan y contexto pertinente → unidades, cobertura y hallazgos. | Cada requisito tiene tarea y método; dependencias ejecutables y análisis sin bloqueos. | H1 resuelto: analyze ya puede leer PROJECT y decisiones. |
| Implementation / implement | Tarea habilitada y registros pertinentes → producto y progreso. | No confunde tareas completas con cumplimiento; bloquea nuevas decisiones y retorna a su origen. | Conforme; H2 resuelto también para aclaraciones tardías. |
| Verification / verify | Contrato, estrategia, tareas y comprobaciones → evidencia por criterio. | Fallos persisten y reabren trabajo; éxito requiere todos los criterios. | H3 resuelto: comprobaciones aplicables y ausencias explícitas. |
| Ship / ship | Verification vigente y mecanismo conocido → entrega, referencias y cierre. | Confirma entrega y coherencia de cabeceras/handoff; no inventa mecanismo ni autorización. | Conforme; H5 resuelto con nota de integración de 003. |

H4 resuelto mediante guía y README breve. Ningún hallazgo adicional exige ampliar arquitectura; quedan los límites explícitos de automatización/adapters/release, fuera del alcance aprobado. E1 se completa al contrastar esta inspección con E2–E7.
