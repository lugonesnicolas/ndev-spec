# ndev-spec

Harness portable para **Specification-Driven Development (SDD)** asistido por agentes. Ofrece seis fases, nueve skills y documentación proporcional al cambio, con decisiones y evidencia persistentes. Es agnóstico de proveedores y modelos.

**Empezá por la [guía de instalación y uso](docs/guide.md)**: incluye proyectos nuevos y existentes, ejemplos PowerShell/Bash, actualización, recuperación y prompts para cada skill.

## Usarlo en un proyecto

1. Con Node.js >=24 y Git, ejecutar `node bin/ndev-spec.js init <directorio>` desde esta copia del repositorio, revisar la propuesta y confirmar. Para un proyecto existente usar su directorio raíz limpio. La [guía](docs/guide.md#instalación-con-la-cli) explica npx desde Git y `update`.
2. La CLI instala `.ai/`, registra origen/revisión en PROJECT e incorpora una entrada mínima en AGENTS. Pedir al agente que complete el contexto con `constitution`. Las skills se aplican leyendo sus archivos; no requieren comandos instalados.
3. Recorrer `Specification → Plan → Tasks → Implementation → Verification → Ship`, dejando artefactos y cumpliendo cada gate. Las aclaraciones materiales se preguntan y registran antes de continuar el trabajo afectado.

El [workflow](.ai/workflow.md) define fases, gates y niveles; el [canon](.ai/README.md) contiene reglas y jerarquía; el [índice de skills](.ai/skills/README.md) permite operar cada etapa. La guía muestra qué producir y cómo retomar.

## Estado y contribuciones

El canon sigue siendo Markdown de operación local. La CLI de instalación/actualización y el adapter mínimo AGENTS están implementados para revisión local; la [evidencia de 005](specs/005-install-update-cli/verification.md) registra las pruebas y límites de plataformas. Sin publicación, release ni commit distribuible de esta implementación todavía. Las carpetas reservadas no implican comandos de workflow, agentes ni gates automáticos.

El [contrato del proyecto](PROJECT.md) registra la etapa y entrega; las [decisiones arquitectónicas](docs/architecture/) explican el diseño. Para contribuir, usar el mismo workflow, documentar decisiones antes de implementarlas y verificar cada criterio. La [auditoría de v1](specs/004-v1-manual-readiness/spec.md) y su [evidencia](specs/004-v1-manual-readiness/verification.md) delimitan la preparación de esta versión.
