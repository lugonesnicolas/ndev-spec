---
name: tasks
description: Convertir el Plan en unidades ejecutables con cobertura de requisitos (Tasks).
---

# tasks

## Lee

- Workflow: [3. Tasks](../../workflow.md#3-tasks).
- Contrato y Plan del cambio.

## Produce

Registro Tareas (sección de `spec.md` en el nivel mínimo, sección de `plan.md` en estándar, `tasks.md` en extendido) con la tabla `ID | Trabajo y requisitos | Dependencias | Criterio de finalización | Estado` y el handoff.

## Pasos

1. Dividir el trabajo en unidades con un resultado comprobable: una tarea por resultado, no por paso.
2. Relacionar cada tarea con sus requisitos y dependencias.
3. Escribir un criterio de finalización observable, incluidas las pruebas que la tarea deja pasando.
4. Registrar el estado inicial `Pendiente`.
5. Aplicar `analyze` antes de habilitar Implementation.

## Gate

Gate de salida de Tasks.

## No hacer

Ejecutar tareas, agregar trabajo fuera del contrato o crear tareas sin requisito.
