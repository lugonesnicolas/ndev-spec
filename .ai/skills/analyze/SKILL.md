---
name: analyze
description: Comprobar coherencia y cobertura entre contrato, Plan y Tasks antes de implementar.
---

# analyze

## Lee

- Workflow: gate de entrada de [4. Implementation](../../workflow.md#4-implementation).
- Contrato, Plan y Tareas del cambio. Nada más.

## Produce

Subsección `Análisis` del registro Tareas: cobertura requisito → tareas → método de verificación, hallazgos con su resolución y resultado. En el nivel mínimo basta una línea si no hay hallazgos.

## Pasos

1. Cobertura: cada requisito tiene al menos una tarea y un método de verificación en el Plan.
2. Trazabilidad inversa: cada tarea responde a un requisito; nada queda fuera de alcance.
3. Coherencia: términos, umbrales, nombres e interfaces coinciden en los tres registros y con `PROJECT.md` y las decisiones vigentes.
4. Ejecutabilidad: dependencias sin ciclos y criterios de finalización observables.
5. Nivel: la clasificación sigue correspondiendo; si no, escalar.
6. Clasificar cada hallazgo como material (bloquea) o menor. Corregirlo en su registro de origen con la skill de esa fase y repetir su gate. Registrar el resultado.

## Gate

El análisis está registrado y no quedan inconsistencias materiales abiertas.

## No hacer

Implementar, cambiar requisitos dentro del análisis o registrar observaciones de estilo como hallazgos.
