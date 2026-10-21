# SDD Core neutral del harness

Estado: vigente. Etapa: Stage 2 — SDD Core.

## Decisión

El ciclo base del harness es `Specification → Plan → Tasks → Implementation → Verification → Ship`.

La definición normativa de las fases, sus gates y sus handoffs reside en [`.ai/workflow.md`](../../.ai/workflow.md). Este documento explica la decisión; no constituye una segunda definición del workflow. Se mantiene la [jerarquía de fuentes de verdad del canon](canon.md).

Specification representa el contrato funcional del cambio. El core no exige PRD, TRD ni QRD: esos formatos podrán incorporarse como extensiones o skill packs futuros. La profundidad de los artefactos debe ser proporcional al cambio, permitiendo usar el mismo ciclo en proyectos pequeños y grandes.

## Separación de responsabilidades

Specification establece qué debe cumplirse. Plan decide cómo satisfacer ese contrato. Tasks convierte el Plan en unidades ejecutables. Implementation produce los cambios y registra su avance. Verification contrasta el resultado con los requisitos y sus criterios, usando tests y otras evidencias pertinentes. Ship completa la entrega conforme a las condiciones del proyecto.

Separar estas responsabilidades permite distinguir un contrato completo, un enfoque viable, trabajo ejecutado, cumplimiento demostrado y entrega efectuada. En particular, una implementación terminada no prueba por sí sola que el contrato se cumplió ni que el cambio fue entregado.

Los gates expresan condiciones observables para pasar de una fase a la siguiente. En esta etapa son documentales y pueden evaluarse sin comandos específicos, proveedores ni mecanismos automáticos.

## Handoff-first design

El estado importante debe persistir en archivos del repositorio. Los resultados, decisiones, estado, bloqueos y siguiente paso no pueden depender exclusivamente del historial conversacional. Las referencias a evidencia externa deben quedar registradas en el artefacto correspondiente.

La convención inicial es `specs/<change-id>/`, con estos artefactos:

| Artefacto | Responsabilidad |
| --- | --- |
| `spec.md` | Contrato funcional y criterios verificables del cambio. |
| `plan.md` | Enfoque, decisiones, dependencias y estrategia de verificación. |
| `tasks.md` | Unidades ejecutables, dependencias, criterios de finalización y estado de implementación. |
| `verification.md` | Evidencias de cumplimiento, resultados, desviaciones y sección de cierre de Ship. |

La [decisión de skills](skills.md) agregó después niveles de cambio: esta tabla corresponde al nivel extendido, y en los niveles mínimo y estándar algunas fases se registran como secciones de otro archivo, sin eliminar gates. Implementation actualiza `tasks.md` además de producir los cambios de producto. Ship persiste su resultado en una sección de cierre de `verification.md`; compartir el archivo no fusiona ambas fases ni sus gates. Esta etapa documenta la convención sin crear cambios de ejemplo ni plantillas.

## Agent replaceability

Un agente debe poder realizar una fase y otro continuar desde su artefacto persistido. La continuidad depende del contrato, del estado del trabajo y de la evidencia registrada, no de la identidad del agente, su proveedor o su memoria de sesión. El handoff debe permitir reconocer qué gate se cumplió y qué trabajo sigue pendiente.

## Context efficiency

No se requiere que una sesión conserve todo el contexto desde Specification hasta Ship. Cada fase puede recuperar el contrato vigente, los artefactos previos pertinentes y las referencias necesarias para su responsabilidad. Persistir las decisiones evita reconstruirlas a partir de conversaciones extensas y permite retomar el trabajo en sesiones independientes.

## Determinism

Los gates deben apoyarse en criterios verificables y evidencia, para que el avance no dependa de una declaración subjetiva de finalización. Los criterios verificables deberán automatizarse en stages futuros cuando puedan evaluarse mecánicamente; esta etapa no introduce scripts ni gates automáticos. La automatización futura deberá comprobar los criterios definidos, sin sustituir el contrato por el mero resultado de una suite de tests.

## Decisiones pospuestas y límite de etapa

Al cerrar Stage 2 quedaban pendientes el formato de `change-id`, las plantillas y esquemas detallados de los artefactos, comandos, skills, personas/agentes, provider adapters, automatización de gates y mecanismos concretos de Ship. El identificador se definió posteriormente en [el workflow](../../.ai/workflow.md#artefactos-del-cambio); el mecanismo de Ship para ndev-spec consta en [su contrato local](../../PROJECT.md); las skills y la proporcionalidad se definieron en [su decisión](skills.md). Los demás elementos siguen pendientes, al igual que scripts de validación, instalador y GitHub Actions.

El core no prescribe Git, pull requests, releases ni despliegues como mecanismo obligatorio de entrega. Ship utiliza las condiciones conocidas del proyecto; si faltan decisiones materiales sobre la entrega, deben resolverse antes de efectuarla.

Esta decisión se limita a Stage 2 — SDD Core. No definió ni implementó Stage 3; el estado actual de ndev-spec figura en [su contrato local](../../PROJECT.md).
