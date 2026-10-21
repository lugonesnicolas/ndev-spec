# ndev-spec

1. El proyecto se llama ndev-spec.
2. Su objetivo es construir un harness portable para Specification-Driven Development asistido por agentes.
3. El harness debe ser agnóstico respecto de proveedores y modelos.
4. `.ai/` es el namespace reservado para el canon compartido del harness.
5. Las configuraciones futuras de Codex, Claude Code, Cursor u otras herramientas serán adapters y no podrán convertirse en la fuente de verdad.
6. Las decisiones arquitectónicas del framework deben documentarse antes de implementarse.
7. No inventar estructura, convenciones o workflows que todavía no hayan sido definidos explícitamente.
8. Ante una decisión arquitectónica no especificada, detener la implementación y dejarla para la siguiente etapa de diseño.
9. Leer `.ai/README.md` para conocer el canon compartido del harness.
10. Respetar la jerarquía de fuentes de verdad definida en `.ai/README.md`.
11. Leer `.ai/workflow.md` para conocer el workflow SDD del harness.
12. No implementar cambios de producto sin cumplir los gates definidos en `.ai/workflow.md`.
13. Cualquier implementación debe respetar las reglas de `.ai/rules/`.
14. Leer `PROJECT.md` para conocer el contexto, la etapa y las condiciones de entrega de este repositorio.
