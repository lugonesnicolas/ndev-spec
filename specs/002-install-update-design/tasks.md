# Tasks — 002-install-update-design

Estado: Implementation documental completa; gate de salida cumplido. Se revisaron spec, plan y decisión arquitectónica antes de habilitar T1.

| ID | Trabajo y requisitos | Dependencias | Criterio de finalización | Estado |
| --- | --- | --- | --- | --- |
| T1 | Completar procedimiento manual y ejemplos en la decisión (R1–R9) | Gates de Specification, Plan y Tasks | Pasos para preparar, revisar, aplicar, verificar y recuperar; registro consumidor, comparación B/L/T y límites explícitos; sin instalador. | Completa: siete pasos, ejemplos y matriz de fallos. |
| T2 | Alinear adopción, README y PROJECT (R3, R9) | T1 | Una referencia principal al mecanismo; condiciones de Ship 002 conocidas; automatización pendiente; canon y ciclo 001 preservados. | Completa: referencias y condiciones actualizadas. |
| T3 | Preparar escenarios y puntos de comprobación para Verification (R1–R10) | T1, T2 | Plan y guía permiten reproducir casos de instalación, actualización, bloqueo y recuperación en temporales; revisión de cobertura sin decisiones materiales abiertas. | Completa: matriz del Plan contrastada con procedimiento y ejemplos; sin decisiones abiertas. |

## Handoff

T1–T3 produjeron documentación revisable; no hay bloqueos de Implementation. Durante Verification se precisó en T1 la inspección de atributos introducidos por el destino; no cambió el contrato ni el enfoque y se revalidó Implementation antes del ensayo E20. Verification está completa con evidencia por requisito en `verification.md`; siguiente fase: Ship local. Los auxiliares de ensayo no se incorporaron al producto.
