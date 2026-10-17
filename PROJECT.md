# Contrato del proyecto: ndev-spec

## Propósito y estado

ndev-spec desarrolla un harness portable para Specification-Driven Development asistido por agentes. Etapa actual: **Stage 3 — Rules**. El canon compartido reside en [`.ai/`](.ai/README.md); este repositorio es su origen. La revisión entregada de cada cambio se registra en su `verification.md`, para evitar que este contrato apunte al commit que lo contiene.

Las reglas metodológicas ya están escritas. Comandos, skills, personas/agentes, adapters y gates automáticos aún no están definidos. La [instalación y actualización manual](docs/architecture/installation-updates.md) tiene un diseño documentado; las plantillas, el instalador y la automatización de actualizaciones siguen pendientes.

## Contexto técnico y restricciones

El producto disponible es documentación Markdown versionada en Git. No hay aplicación, dependencias de ejecución, build ni suite automatizada. Las decisiones arquitectónicas se documentan en [`docs/architecture/`](docs/architecture/); cada cambio guarda su contrato y estado en [`specs/`](specs/).

Se aplican las instrucciones de [`AGENTS.md`](AGENTS.md), el canon y los gates del [workflow](.ai/workflow.md). Las integraciones futuras con herramientas serán adapters y no fuentes de verdad. Los cambios de producto requieren Specification, Plan y Tasks vigentes antes de Implementation.

## Comprobaciones y entrega

Para cambios documentales se revisan coherencia normativa, enlaces locales, criterios de la spec, `git diff --check` y estado de Git. Se agregan comprobaciones específicas según el cambio; una suite exitosa no sustituye la evidencia por requisito.

Para `001-readme-manual-sdd`, Ship significa commits coherentes en la rama local `docs/readme-manual-sdd`, después de Verification satisfactoria. No requiere push, PR ni integración en `main`. El commit entregado y el handoff final se registran en `specs/001-readme-manual-sdd/verification.md` mediante un cierre documental posterior. Para otros cambios, el mecanismo de entrega debe definirse en su Specification y Plan antes del gate de Ship.

Para `002-install-update-design`, Ship entrega únicamente diseño documental y evidencia de ensayos manuales mediante commits locales en `docs/install-update-design`, desde `de238169dd7eda60404de40523e6440497356dce`, después de Verification satisfactoria. Se preservan `docs/readme-manual-sdd` y `main`; no requiere push, PR ni integración. El commit entregado y el handoff se registran en `specs/002-install-update-design/verification.md` mediante cierre posterior. Un instalador futuro requiere otra spec y sus gates; este diseño no implica que exista ni que haya sido probado.
