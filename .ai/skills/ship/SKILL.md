---
name: ship
description: Entregar el cambio verificado según las condiciones del proyecto y registrar el cierre (Ship).
---

# ship

## Lee

- Workflow: [6. Ship](../../workflow.md#6-ship). [Trabajo con Git](../../rules/git-workflow.md) si el proyecto usa Git.
- Condiciones de entrega de `PROJECT.md` o del contrato, y el resultado de Verificación.

## Produce

Registro Cierre (sección de `spec.md` en el nivel mínimo, sección de cierre de `verification.md` en estándar y extendido) con resultado, referencias verificables, pendientes y handoff final. Estado final en la cabecera de los artefactos.

## Pasos

1. Confirmar que Verificación es satisfactoria y sigue vigente: sin cambios posteriores.
2. Si las condiciones de entrega no están definidas o falta una decisión material, detenerse y preguntar.
3. Ejecutar la entrega definida. Las acciones externas o irreversibles, como push, PR, merge, release o despliegue, requieren la confirmación que exijan el proyecto o el responsable.
4. Confirmar el resultado y registrar referencias: commit, PR, release o equivalente.
5. Registrar el cierre sin autorreferenciar el commit que lo contiene, actualizar el estado final en la cabecera de cada artefacto del cambio y comprobar, antes de declarar el gate, que cabeceras, handoff final y referencias son coherentes entre sí.

## Gate

Gate de salida de Ship.

## No hacer

Inventar el mecanismo de entrega, marcar el cambio como entregado sin confirmación o introducir cambios de producto sin volver a las fases afectadas.
