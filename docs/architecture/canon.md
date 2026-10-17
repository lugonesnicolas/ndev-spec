# Canon neutral del harness

Primera decisión arquitectónica formal de ndev-spec.

Estado: vigente. Etapa: Stage 1 — Canon.

## Decisión

`.ai/` contiene el canon metodológico compartido y reusable del harness. Debe permanecer agnóstico de proveedores y modelos. Las integraciones con herramientas serán adapters que referencien el canon sin duplicarlo ni redefinirlo.

## Jerarquía de fuentes de verdad

La [jerarquía normativa](../../.ai/README.md#jerarquía-de-fuentes-de-verdad) reside en el canon portable. Esta decisión estableció su separación entre metodología, contexto del proyecto e implementación; la definición compartida se consulta en `.ai/` para evitar dos textos normativos. Los adapters apuntan al canon y no pueden redefinirlo.

## Canon vs Project Context

| Elemento | Responsabilidad conceptual |
| --- | --- |
| `.ai/` | Metodología reusable del harness, compartida y neutral respecto de proveedores y modelos. |
| `specs/` | Contratos y estado del trabajo. |
| `docs/` | Arquitectura y decisiones del proyecto. |
| `PROJECT.md` | Contexto específico del repositorio; su ubicación y responsabilidad se decidieron después en [adopción portable](adoption.md). |
| Adapters | Integración del canon con herramientas. Referencian el canon sin duplicarlo ni redefinirlo. |

## Límite de esta etapa

En Stage 1 esta decisión definió el canon conceptual y la jerarquía, sin implementar workflow SDD, comandos, skills, agentes, adapters, scripts, CI, instalador ni gates automáticos. Las decisiones posteriores se registran por separado; el límite de Stage 1 no impide las etapas siguientes.
