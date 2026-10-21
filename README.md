# ndev-spec

Harness portable para **Specification-Driven Development (SDD)** asistido por agentes. Su versión manual ofrece seis fases, nueve skills y documentación proporcional al cambio, con decisiones y evidencia persistentes. Es agnóstico de proveedores y modelos.

**Empezá por la [guía de instalación y uso](docs/guide.md)**: incluye proyectos nuevos y existentes, ejemplos PowerShell/Bash, actualización, recuperación y prompts para cada skill.

## Usarlo en un proyecto

1. Incorporar únicamente `.ai/` desde una revisión Git exacta y registrar origen/revisión en un `PROJECT.md` propio, siguiendo la guía.
2. Pedir al agente que lea el canon local, el índice de skills y el contexto del proyecto. Las skills se aplican leyendo sus archivos; no requieren comandos instalados.
3. Recorrer `Specification → Plan → Tasks → Implementation → Verification → Ship`, dejando artefactos y cumpliendo cada gate. Las aclaraciones materiales se preguntan y registran antes de continuar el trabajo afectado.

El [workflow](.ai/workflow.md) define fases, gates y niveles; el [canon](.ai/README.md) contiene reglas y jerarquía; el [índice de skills](.ai/skills/README.md) permite operar cada etapa. La guía muestra qué producir y cómo retomar.

## Estado y contribuciones

El producto disponible es Markdown versionado y de operación manual. Instalador, adapters, comandos propios y gates automáticos son trabajo futuro. Las carpetas reservadas no implican capacidades disponibles; este cierre no publica una release.

El [contrato del proyecto](PROJECT.md) registra la etapa y entrega; las [decisiones arquitectónicas](docs/architecture/) explican el diseño. Para contribuir, usar el mismo workflow, documentar decisiones antes de implementarlas y verificar cada criterio. La [auditoría de v1](specs/004-v1-manual-readiness/spec.md) y su [evidencia](specs/004-v1-manual-readiness/verification.md) delimitan la preparación de esta versión.
