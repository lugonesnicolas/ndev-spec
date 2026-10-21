# Operación y cierre de la v1 manual

Estado: vigente para [004](../../specs/004-v1-manual-readiness/spec.md), documentado durante Plan antes de modificar el canon.

## Contexto

Las seis fases, nueve skills y tres niveles ya existen. La auditoría inicial detectó que analyze restringe sus lecturas a tres registros pero exige comparar PROJECT y decisiones, que falta un mecanismo transversal para preguntar y que la adquisición está explicada principalmente como decisión arquitectónica. La v1 necesita instrucciones operativas y evidencia, sin ampliar su superficie de ejecución.

## Decisión

- Las preguntas son una capacidad del entorno, no una décima skill ni un adapter. El workflow define un protocolo neutral: investigar hechos, identificar una ambigüedad material, usar la herramienta interactiva disponible o chat, persistir decisión y responsable, y bloquear el trabajo afectado mientras falte respuesta. Las skills declaran la lectura de esa sección; clarify conserva el contrato y cada fase devuelve a su origen lo que cambie requisitos o decisiones.
- analyze puede leer las partes relevantes de PROJECT y decisiones referenciadas. No necesita recorrer todo el código ni todo el canon. verify ejecuta las comprobaciones aplicables y declara las que no existen, sin inventar una suite.
- La guía en docs/guide.md es documentación operativa del origen. Enlaza las definiciones normativas y el diseño de adquisición; no se copia al consumidor ni crea otra fuente de verdad. El uso cotidiano sigue siendo posible con .ai local y PROJECT propio.
- Los ejemplos de shell son operaciones Git y de archivos realizadas manualmente, con revisión entre pasos; no constituyen un instalador. Mantienen comparación de árboles/blobs, preservación, procedencia y recuperación de 002. El origen se resuelve a un commit completo.
- La preparación de v1 se demuestra con evidencia por requisito y hallazgos resueltos. Un PR verificado es la entrega de 004; no implica merge ni release publicada.

## Alternativas

| Alternativa | Motivo para descartarla |
| --- | --- |
| Exigir una herramienta de preguntas por nombre | Rompe neutralidad y disponibilidad en otros agentes. |
| Crear una skill ask-question | Duplica clarify y agrega una responsabilidad cuando basta un protocolo transversal. |
| Preguntar solo en Specification | Deja sin procedimiento las ambigüedades descubiertas más tarde. |
| Convertir la guía en un script instalador | Amplía el alcance y exige otro contrato de ejecución y soporte. |
| Copiar la guía y arquitectura dentro de .ai | Duplica contexto de adquisición que no hace falta para usar el canon local. |

## Consecuencias

Se conservan los seis gates, nueve skills, formatos, niveles y presupuestos de 003. Las lecturas adicionales se miden. El cambio no modifica el procedimiento aprobado de instalación ni migra artefactos anteriores. Automatización, adapters y publicación siguen pendientes. Una comprobación no ejecutada queda declarada como límite, nunca como éxito.
