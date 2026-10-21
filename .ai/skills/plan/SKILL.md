---
name: plan
description: Definir cómo satisfacer el contrato y cómo se verificará cada criterio (Plan).
---

# plan

## Lee

- Workflow: [2. Plan](../../workflow.md#2-plan) y la tabla de registros de [Niveles de cambio](../../workflow.md#niveles-de-cambio). Regla de [Arquitectura](../../rules/architecture.md).
- El Contrato, el contexto técnico de `PROJECT.md`, la documentación arquitectónica relacionada y solo el código que el enfoque toca.

## Produce

Registro Plan: sección de `spec.md` en el nivel mínimo, `plan.md` en estándar y extendido. En extendido, además, la decisión arquitectónica en la documentación del proyecto, antes de implementarla.

## Pasos

1. Elegir el enfoque mínimo compatible con el contrato y la arquitectura existente.
2. Registrar las decisiones con su motivo. Las arquitectónicas van a la documentación del proyecto, con sus alternativas.
3. Identificar dependencias, componentes afectados y riesgos, incluidos los de seguridad.
4. Para cada requisito, definir el método de verificación (test, comando, inspección o ensayo) y la evidencia esperada, usando las comprobaciones de `PROJECT.md`.
5. Si el enfoque revela una condición de nivel superior, escalar.
6. Registrar el handoff.

## Gate

Gate de salida de Plan.

## No hacer

Implementar, cambiar requisitos para acomodar el enfoque, describir alternativas fuera de la decisión arquitectónica o detallar pasos triviales.
