# ndev-spec

1. El proyecto se llama ndev-spec.
2. Su objetivo es construir un harness portable para Specification-Driven Development asistido por agentes.
3. El harness debe ser agnóstico respecto de proveedores y modelos.
4. `.ai/` es el namespace reservado para el canon compartido del harness.
5. Las configuraciones futuras de Codex, Claude Code, Cursor u otras herramientas serán adapters y no podrán convertirse en la fuente de verdad.
6. Las decisiones arquitectónicas del framework deben documentarse antes de implementarse.
7. No inventar estructura, convenciones o workflows que todavía no hayan sido definidos explícitamente.
8. Ante una decisión arquitectónica no especificada, detener la implementación y dejarla para la siguiente etapa de diseño.

## Current Stage

Stage 0 — Bootstrap

Todavía NO están definidos:

- el workflow SDD;
- la jerarquía completa de instrucciones;
- los comandos;
- las skills;
- las personas/agentes;
- los adapters;
- los gates automáticos.
