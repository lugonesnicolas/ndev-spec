---
name: implement
description: Ejecutar las tareas habilitadas y registrar su avance (Implementation).
---

# implement

## Lee

- Workflow: [4. Implementation](../../workflow.md#4-implementation). Reglas de [Desarrollo](../../rules/development.md) y [Seguridad](../../rules/security.md); [Trabajo con Git](../../rules/git-workflow.md) si el proyecto usa Git.
- El registro Tareas y, por tarea, los requisitos y partes del Plan que la afectan y el código que toca.

## Produce

Cambios de producto y registro Tareas actualizado con estado, resultados, referencias, bloqueos y handoff.

## Pasos

1. Confirmar el gate de entrada, incluido el análisis.
2. Tomar una tarea habilitada e implementarla junto con las pruebas que exige su criterio.
3. Ejecutar las pruebas pertinentes. Marcar la tarea completa solo si cumple su criterio.
4. Actualizar el registro al cerrar cada tarea.
5. Ante una decisión material, una ambigüedad o una condición de nivel superior: detenerse, registrarla y volver a la fase correspondiente.
6. Con todas las tareas completas, continuar con `verify`.

## Gate

Gate de salida de Implementation.

## No hacer

Declarar cumplido el contrato, hacer Ship, ampliar el alcance u ocultar fallos.
