# Contrato del proyecto: ndev-spec

## Propósito y estado

ndev-spec desarrolla un harness portable para Specification-Driven Development asistido por agentes. Etapa actual: **cierre de la v1 manual**, sobre Stage 4 — Workflow skills. El canon compartido reside en [`.ai/`](.ai/README.md); este repositorio es su origen. La revisión entregada de cada cambio se registra en su `verification.md`, para evitar que este contrato apunte al commit que lo contiene.

Las reglas metodológicas, las [skills](.ai/skills/README.md) por etapa y los niveles de cambio ya están escritos. Comandos, personas/agentes, adapters, plantillas y gates automáticos aún no están definidos. La [instalación y actualización manual](docs/architecture/installation-updates.md) tiene un diseño documentado; las plantillas, el instalador y la automatización de actualizaciones siguen pendientes.

La [guía práctica](docs/guide.md) explica instalación nueva/existente, operación, actualización y recuperación. [004](specs/004-v1-manual-readiness/verification.md) registra la auditoría y evidencia de preparación de v1; no implica una release publicada. Las capacidades disponibles siguen siendo documentales y manuales.

## Contexto técnico y restricciones

El producto disponible es documentación Markdown versionada en Git. No hay aplicación, dependencias de ejecución, build ni suite automatizada. Las decisiones arquitectónicas se documentan en [`docs/architecture/`](docs/architecture/); cada cambio guarda su contrato y estado en [`specs/`](specs/).

Se aplican las instrucciones de [`AGENTS.md`](AGENTS.md), el canon y los gates del [workflow](.ai/workflow.md). Las integraciones futuras con herramientas serán adapters y no fuentes de verdad. Los cambios de producto requieren Specification, Plan y Tasks vigentes antes de Implementation.

## Comprobaciones y entrega

Para cambios documentales se revisan coherencia normativa, enlaces locales, criterios de la spec, `git diff --check` y estado de Git. Se agregan comprobaciones específicas según el cambio; una suite exitosa no sustituye la evidencia por requisito.

Para `001-readme-manual-sdd`, Ship significa commits coherentes en la rama local `docs/readme-manual-sdd`, después de Verification satisfactoria. No requiere push, PR ni integración en `main`. El commit entregado y el handoff final se registran en `specs/001-readme-manual-sdd/verification.md` mediante un cierre documental posterior. Para otros cambios, el mecanismo de entrega debe definirse en su Specification y Plan antes del gate de Ship.

Para `002-install-update-design`, Ship entrega únicamente diseño documental y evidencia de ensayos manuales mediante commits locales en `docs/install-update-design`, desde `de238169dd7eda60404de40523e6440497356dce`, después de Verification satisfactoria. Se preservan `docs/readme-manual-sdd` y `main`; no requiere push, PR ni integración. El commit entregado y el handoff se registran en `specs/002-install-update-design/verification.md` mediante cierre posterior. Un instalador futuro requiere otra spec y sus gates; este diseño no implica que exista ni que haya sido probado.

Las entregas locales de 001 y 002 se integraron después en `main` mediante el PR #1 y sus ramas ya no existen; el registro está en la sección [Integración](specs/002-install-update-design/verification.md#integración) de 002. Las condiciones anteriores describen cada entrega original.

Para `003-sdd-workflow-skills`, Ship significa commits coherentes en `docs/sdd-workflow-skills`, creada desde `main` en `43875b9`; después de Verification satisfactoria, push y PR contra `main` con descripción en español. No se mergea sin confirmación explícita del usuario. La rama, el commit entregado y el PR se registran en `specs/003-sdd-workflow-skills/verification.md`.

El PR #3 se integró posteriormente en `main` mediante `9789384098f21106261f125339263e62383866ee`; la [nota de integración de 003](specs/003-sdd-workflow-skills/verification.md#integración) distingue esa integración de la entrega original.

Para `004-v1-manual-readiness`, Ship significa commits coherentes en `docs/v1-manual-readiness`, desde `main` en `9789384098f21106261f125339263e62383866ee`; tras Verification satisfactoria, push y PR en español contra `main`. Registrar commit verificado, rama, PR y handoff en su `verification.md`, con cierre documental posterior. No hacer merge sin confirmación explícita; no crear tag ni release. La preparación de v1 requiere que no queden hallazgos que impidan instalar, utilizar o evaluar el resultado; las limitaciones de los ensayos se registran expresamente.
