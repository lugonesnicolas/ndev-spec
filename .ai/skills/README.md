# Skills

Las skills operan las fases del [workflow](../workflow.md) sin redefinirlas. Si una skill contradice el workflow o las reglas, prevalece el canon según la [jerarquía de fuentes](../README.md#jerarquía-de-fuentes-de-verdad).

## Formato

Cada skill es `<nombre>/SKILL.md`: frontmatter con `name` y `description`, y cuerpo con las secciones `Lee`, `Produce`, `Pasos`, `Gate` y `No hacer`. Se aplica leyendo el archivo; no requiere proveedor, modelo ni herramienta. `Lee` declara las únicas secciones del canon necesarias; los artefactos del cambio se leen según el [nivel](../workflow.md#niveles-de-cambio). Una skill no supera unos 700 tokens estimados.

## Mapeo

| Skill | Fase | Responsabilidad |
| --- | --- | --- |
| [constitution](constitution/SKILL.md) | Antes del ciclo | Contexto, restricciones, comprobaciones y entrega del proyecto en `PROJECT.md`. |
| [specify](specify/SKILL.md) | Specification | Abrir el cambio, clasificar su nivel y redactar el contrato. |
| [clarify](clarify/SKILL.md) | Specification | Resolver ambigüedades materiales; condición del gate de salida. |
| [plan](plan/SKILL.md) | Plan | Enfoque, decisiones y verificación por criterio. |
| [tasks](tasks/SKILL.md) | Tasks | Unidades ejecutables con cobertura de requisitos. |
| [analyze](analyze/SKILL.md) | Entrada de Implementation | Coherencia y cobertura entre contrato, Plan y Tasks; condición del gate de entrada. |
| [implement](implement/SKILL.md) | Implementation | Ejecutar tareas y registrar su avance. |
| [verify](verify/SKILL.md) | Verification | Test y validación que cierran la implementación con evidencia por criterio. |
| [ship](ship/SKILL.md) | Ship | Entregar según el proyecto y registrar el cierre. |

El orden es el de la tabla. En el nivel mínimo varias skills pueden aplicarse en una misma sesión; cada gate se evalúa y registra igual. Ninguna skill reemplaza el gate de la siguiente.
