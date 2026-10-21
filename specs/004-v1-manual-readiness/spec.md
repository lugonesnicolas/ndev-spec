# 004 — Auditoría y cierre de la v1 manual

Estado: Specification cumplida; pendiente Plan. Nivel: extendido, porque modifica el canon y requiere una decisión arquitectónica.

## Contrato

Dejar la versión manual de ndev-spec consistente y utilizable por una persona o agente que solo disponga del repositorio. La aprobación del plan por el usuario autoriza su implementación y entrega como PR, sin merge ni release.

| ID | Requisito y criterio verificable |
| --- | --- |
| R1 | Auditar las seis fases y nueve skills: entradas, responsabilidades, outputs, gates, trazabilidad y handoffs. Registrar hallazgos, impacto, resolución y evidencia; ningún hallazgo que impida instalar, utilizar o evaluar el resultado puede quedar abierto al declarar la v1 manual lista. |
| R2 | Ante ambigüedades materiales, consultar hechos descubribles y luego preguntar con la herramienta interactiva disponible, o por chat si no existe. Ofrecer opciones y recomendación cuando corresponda; persistir respuesta y responsable; sin respuesta, bloquear el trabajo afectado. Aplicar en todas las fases, devolviendo cambios del contrato a clarify y repitiendo gates afectados. |
| R3 | Corregir incoherencias del ciclo existente, incluida la lectura necesaria de PROJECT y decisiones en analyze. Conservar seis fases, nueve skills, niveles, neutralidad, aislamiento de .ai y presupuestos de 700 tokens por skill y 2.500 de contexto fijo según la fórmula de 003. Decidir antes de implementar. |
| R4 | Publicar docs/guide.md en español, con instalación nueva y existente, revisión exacta, copia exclusiva de .ai, PROJECT propio, procedencia, colisiones, actualización y recuperación según el diseño de 002. Incluir ejemplos PowerShell y Bash y declarar qué se comprobó. |
| R5 | La guía permite operar las nueve skills con prompts neutrales, ejemplos de tres niveles, aclaraciones, evidencia, cierre, reanudación y retorno por fallo. Diferenciar tareas completas, cumplimiento verificado y entrega confirmada; enlazar al canon sin redefinirlo. |
| R6 | README breve, índices y PROJECT describen la versión manual y sus límites. Registrar integración real de 003 basada en Git sin reescribir sus evidencias históricas. Preservar 001/002 y el diseño de instalación. |
| R7 | Verification registra evidencia por requisito: instalación nueva/existente, actualización, no-op, colisión, recuperación parcial; tres niveles; preguntas interactivas/chat/sin respuesta; falta de cobertura y fallo de verificación; enlaces, formato, presupuestos, aislamiento y diff. Distinguir casos reales, simulados y límites del entorno. |
| R8 | Ship: commits coherentes en docs/v1-manual-readiness desde main en 9789384098f21106261f125339263e62383866ee; tras Verification satisfactoria, push y PR en español contra main. Registrar commit, PR y handoff final. Sin merge, tag ni release. |

## Alcance y límites

Producto Markdown, instalación y evaluación manuales. Sin instalador, adapters, comandos propios, plantillas, agentes nuevos, dependencias de ejecución ni gates automáticos. Los auxiliares de ensayo son temporales y no se distribuyen. Capacidades nuevas fuera de este alcance se registran como pendientes, sin presentarlas como disponibles.

## Aclaraciones

Decisiones reales del usuario, obtenidas con preguntas interactivas durante la planificación y confirmadas al pedir implementar el plan:

| Pregunta | Respuesta del responsable | Requisitos |
| --- | --- | --- |
| ¿Qué incluye la primera versión? | Versión manual completa; automatización y adapters posteriores. | R1, R3–R6 |
| ¿Qué significa Ask Question Skill? | Usar herramienta interactiva del entorno; alternativa por chat. No crear otra skill. | R2, R3 |
| ¿Qué cuenta como entrega? | PR listo para revisar; merge y publicación requieren decisión posterior. | R8 |
| ¿Cómo presentar ejemplos? | Español con PowerShell y Bash y prompts neutrales. | R4, R5 |

Sin ambigüedades materiales pendientes tras revisar alcance, herramientas de preguntas, guía y entrega. No se requiere volver a pedir estas autorizaciones.

## Handoff

Gate de entrada y salida de Specification cumplidos. Siguiente paso: Plan y decisión arquitectónica antes de tocar producto; luego Tasks y analyze. El árbol inicial estaba limpio, en main, con PR #3 integrado en 9789384.
