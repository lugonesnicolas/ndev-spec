# Canon compartido

`.ai/` contiene el canon compartido y reusable del harness ndev-spec. Es autocontenido para aplicar la metodología y debe permanecer agnóstico de proveedores y modelos. El contexto de cada repositorio se registra en su `PROJECT.md`, fuera de `.ai/`.

Las carpetas existentes tienen estos propósitos:

- `rules/`: reglas metodológicas del harness.
- `commands/`: operaciones del harness.
- `skills/`: capacidades reutilizables.
- `agents/`: responsabilidades de agentes.
- `templates/`: plantillas de artefactos.

Actualmente `rules/` contiene las reglas metodológicas. `commands/`, `skills/`, `agents/` y `templates/` conservan únicamente sus placeholders; sus definiciones siguen pendientes.

## Índice de reglas

- [Arquitectura](rules/architecture.md): decisiones estructurales y cambios mínimos compatibles con la especificación.
- [Desarrollo](rules/development.md): implementación conforme al contrato, alcance y compatibilidad.
- [Testing](rules/testing.md): pruebas, regresión y evidencia de cumplimiento funcional.
- [Trabajo con Git](rules/git-workflow.md): operaciones seguras y commits coherentes.
- [Seguridad](rules/security.md): secretos, límites de confianza, dependencias y controles existentes.

Las reglas complementan el [workflow SDD](workflow.md), que define las fases, gates y handoffs; no los redefinen. Su aplicación respeta la jerarquía de fuentes de verdad del canon.

## Jerarquía de fuentes de verdad

Las fuentes se aplican en este orden, de mayor a menor prioridad:

1. Instrucción explícita actual del usuario.
2. Especificación activa del cambio.
3. Reglas del harness en `.ai/`.
4. Contrato del proyecto/repositorio (`PROJECT.md`).
5. Documentación arquitectónica vigente.
6. Implementación existente.
7. Inferencia del agente.

Una fuente de menor prioridad no puede sobrescribir una superior. Un agente no puede modificar requisitos para simplificar una implementación. Las ambigüedades materiales se resuelven antes de implementar.

## Canon y contexto del proyecto

`.ai/` define la metodología reusable; `PROJECT.md` describe el proyecto que la usa; `specs/` guarda los contratos y el estado de sus cambios. La documentación arquitectónica del proyecto explica sus decisiones. El contrato local puede añadir contexto y restricciones compatibles, sin redefinir las reglas del harness.

Ninguna carpeta específica de proveedor puede convertirse en fuente de verdad. Los adapters deberán apuntar al canon compartido, sin duplicarlo ni redefinirlo.
