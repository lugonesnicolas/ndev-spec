---
name: specify
description: Abrir un cambio, clasificar su nivel y redactar el contrato funcional (Specification).
---

# specify

## Lee

- Workflow: [Artefactos del cambio](../../workflow.md#artefactos-del-cambio) (numeración), [Niveles de cambio](../../workflow.md#niveles-de-cambio) y [1. Specification](../../workflow.md#1-specification).
- `PROJECT.md` y la solicitud. Del código, solo lo necesario para delimitar el alcance.

## Produce

`specs/<número>-<nombre>/spec.md` con cabecera (estado, nivel y motivo) y el registro Contrato. En el nivel mínimo, este mismo archivo recibirá después Plan, Tareas, Verificación y Cierre.

## Pasos

1. Calcular el número siguiente según el workflow y elegir un nombre kebab-case.
2. Clasificar el nivel con sus criterios. Ante una duda entre dos niveles, elegir el superior.
3. Redactar requisitos con ID (`R1`…) y un criterio verificable cada uno: observable y con resultado esperado. Evitar adjetivos sin umbral.
4. Delimitar alcance, fuera de alcance y restricciones de `PROJECT.md` aplicables.
5. Aplicar `clarify`. En el nivel mínimo puede resolverse en la misma pasada.
6. Registrar el handoff: estado, decisiones, bloqueos y siguiente paso.

## Gate

Gate de salida de Specification, incluidas las aclaraciones registradas.

## No hacer

Diseñar la solución, crear tareas, implementar o completar huecos del pedido con inferencias no registradas.
