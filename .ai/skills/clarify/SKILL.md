---
name: clarify
description: Detectar y resolver las ambigüedades materiales del contrato antes de planificar.
---

# clarify

## Lee

- Workflow: [1. Specification](../../workflow.md#1-specification).
- El registro Contrato del cambio. Leer código solo para confirmar un hecho concreto.

## Produce

Subsección `Aclaraciones` del Contrato con pregunta, respuesta, quién la resolvió y requisito afectado; o la constancia "Sin ambigüedades materiales" y qué se revisó. Requisitos y criterios ajustados.

## Pasos

1. Revisar cada requisito: si su criterio permite decidir pasa o no pasa; si hay términos sin definir, umbrales, casos límite, errores, permisos, datos o compatibilidad sin especificar; si el alcance se contradice.
2. Considerar material una ambigüedad cuando dos interpretaciones razonables llevarían a implementaciones o pruebas distintas. Descartar el resto.
3. Preguntar al responsable las ambigüedades materiales, hasta cinco por ronda, cada una con opciones y una recomendación.
4. Registrar las respuestas y ajustar requisitos y criterios. Si cambia el nivel, aplicar el escalado.
5. Una respuesta pendiente se registra como bloqueo: el gate no se cumple.

## Gate

Cada ambigüedad material está resuelta y registrada, o consta que no las hay.

## No hacer

Responder por cuenta propia lo que decide el responsable, preguntar por detalles que no cambian el resultado o planificar.
