# Tareas — 005

| ID | Trabajo y requisitos | Dependencias | Criterio de finalización | Estado |
| --- | --- | --- | --- | --- |
| T1 | Motor seguro de preparación, actualización y recuperación; R2/R4/R5/R6 | — | Tests de blobs, colisiones, preservación, fallos y recuperación pasan | Completa: suite local 32/32; casos binario y destino bare/enlazado adicionales satisfactorios |
| T2 | CLI, adapter y paquete; R1/R3 | T1 | Flags, prompts, cancelación y npx comprobados | Completa: CLI y smoke tarball/Git por commit satisfactorios |
| T3 | Matriz y documentación; R7/R8 | T1/T2 | Comprobaciones locales y evidencia de límites; docs coherentes | Completa: matriz preparada, documentación y evidencia local; ejecución externa pendiente en Verification |

## Análisis de coherencia y cobertura

Contrato, Plan y decisión cubren R1–R8 sin decisiones materiales abiertas. El cambio aprueba las excepciones al diseño manual antes de implementarlas. Pruebas multiplataforma requieren ejecución externa; distinguir trabajo implementado de verificación pendiente. Entrega solo local, sin mezclar cambios de 004. Gates de Specification, Plan y Tasks cumplidos; T1 habilitada.

## Handoff

Implementation completa y gate de salida cumplido: tareas y comprobaciones locales satisfechas; sin decisiones materiales abiertas para verificar. [Verification](verification.md) registra evidencia por requisito y mantiene pendiente su gate de salida por las ejecuciones Linux/macOS. No se ha realizado Ship. Los archivos de 004 permanecen con sus cambios preexistentes.
