---
name: verify
description: Etapa de test y validación que cierra la implementación contrastando cada criterio con evidencia (Verification).
---

# verify

## Lee

- [Preguntas y aclaraciones](../../workflow.md#preguntas-y-aclaraciones).
- Workflow: [5. Verification](../../workflow.md#5-verification). Regla de [Testing](../../rules/testing.md).
- Contrato, estrategia de verificación del Plan, registro Tareas y comprobaciones de `PROJECT.md`.

## Produce

Registro Verificación (sección de `spec.md` en el nivel mínimo, `verification.md` en estándar y extendido) con la tabla `Requisito | Método | Evidencia | Resultado`, desviaciones, límites y handoff.

## Pasos

1. Confirmar el gate de entrada.
2. Ejecutar las comprobaciones aplicables de `PROJECT.md`, incluida la suite si existe. Registrar comandos y resultados resumidos; declarar las comprobaciones inexistentes o no ejecutadas y sus límites, sin presentarlas como exitosas.
3. Aplicar a cada requisito el método planificado y registrar la evidencia o su referencia.
4. Comprobar regresiones del comportamiento que debía preservarse.
5. Ante un fallo: registrar la evidencia, volver a `implement` o a la fase que lo originó, corregir y repetir la verificación afectada.
6. Declarar el resultado satisfactorio solo si todos los criterios tienen evidencia y pasan.

## Gate

Gate de salida de Verification.

## No hacer

Equiparar tests exitosos con cumplimiento, presentar como satisfactorio un criterio no comprobado, cambiar requisitos o pruebas para pasar, o hacer Ship.
