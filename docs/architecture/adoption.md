# Adopción portable y numeración liviana

Estado: vigente. Decisión para el cambio `001-readme-manual-sdd`.

## Contexto

Al iniciar este cambio, `.ai/` enlazaba hacia `docs/architecture/`: copiar solo el canon dejaba referencias rotas y una dependencia del repositorio de desarrollo. El workflow reservaba `specs/<change-id>/` sin definir el identificador. Un proyecto consumidor también necesita contexto propio y una forma de reconocer qué revisión del harness incorporó.

## Decisión

El límite portable es `.ai/`: contiene las definiciones normativas del canon, la jerarquía de fuentes, el workflow y las reglas. `docs/architecture/` documenta el porqué de las decisiones de ndev-spec y apunta al canon; no debe ser necesario copiarlo para aplicar el harness. Los adapters futuros referenciarán `.ai/` sin reproducir sus reglas.

Cada repositorio consumidor guarda una copia local de `.ai/` tomada de una revisión exacta de ndev-spec y registra esa revisión y su origen en su `PROJECT.md`. Ese contrato, propiedad del consumidor y situado en la raíz, registra contexto y condiciones de Ship. `specs/` y sus evidencias también pertenecen al consumidor. El core distribuido no se edita localmente; las modificaciones metodológicas se proponen en ndev-spec. La incorporación manual se detiene si ya existen `.ai/` o `PROJECT.md`, para revisar su contenido antes de cualquier copia. No modifica instrucciones preexistentes de herramientas.

La convención normativa para el identificador de cambio se documenta en [el workflow](../../.ai/workflow.md): número secuencial local más nombre descriptivo, sin estado auxiliar ni dependencia del nombre de rama. Cada fase conserva su artefacto breve y su gate.

Una actualización futura deberá mostrar diferencias y preservar `PROJECT.md`, `specs/` y archivos ajenos al core. Si `.ai/` fue modificado en el consumidor, se deberá resolver esa divergencia antes de reemplazarlo. El instalador, formato de paquete y mecanismo de actualización se diseñarán por separado.

## Alternativas consideradas

| Alternativa | Motivo para no elegirla en esta etapa |
| --- | --- |
| Compartir una instalación externa entre proyectos | El uso cotidiano dependería de su disponibilidad y de resolver la versión activa para cada proyecto. |
| Copiar también `docs/architecture/` | Distribuiría historia y decisiones del repositorio de desarrollo junto con la metodología necesaria. |
| Permitir cambios locales dentro de `.ai/` | Haría que cada actualización exigiera reconciliar variantes del canon. |
| Mantener un contador de specs o acoplarlas a ramas | Añadiría estado y herramientas obligatorias a un ciclo que puede llevarse en Markdown. |

## Consecuencias y límites

La revisión queda visible en cada consumidor y las actualizaciones son explícitas. A cambio, cada repositorio conserva su copia de `.ai/` y las colisiones requieren resolución humana. Esta decisión no implementa instalación, adapters, comandos ni actualizaciones automáticas.
