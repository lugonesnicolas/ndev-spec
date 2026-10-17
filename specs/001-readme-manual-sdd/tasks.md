# Tasks — 001-readme-manual-sdd

Estado: Implementation completa; gate de salida cumplido. Tasks y sus dependencias fueron evaluadas antes de ejecutar T1.

| ID | Trabajo y requisitos | Dependencia | Criterio de finalización | Estado |
| --- | --- | --- | --- | --- |
| T1 | Conservar y alinear canon, numeración e historia arquitectónica (R1, R2, R3, R4, R6) | Specification, Plan y decisión de adopción | Workflow define el identificador y los artefactos; `.ai/` se lee sin `docs/`; decisiones históricas referencian el canon vigente. | Completa: workflow, canon y decisiones alineados. |
| T2 | Crear contrato local y ajustar instrucciones de entrada (R4, R6) | T1 | `PROJECT.md` contiene contexto y Ship local; AGENTS apunta allí y no duplica la etapa. | Completa: contrato y entrada actualizados. |
| T3 | Escribir guía manual y adopción en README (R5, R6) | T1, T2 | Un lector puede iniciar un cambio y copiar una revisión concreta con controles de colisión; funciones futuras están identificadas. | Completa: guía manual y de adopción escrita. |

## Handoff

T1–T3 produjeron los cambios de documentación previstos, sin cambiar requisitos ni dejar bloqueos de Implementation. Siguiente fase: Verification. Ensayar numeración y adopción, guardar evidencia por criterio en `verification.md` y corregir cualquier desviación antes de Ship.
