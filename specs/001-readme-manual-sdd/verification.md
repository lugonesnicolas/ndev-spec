# Verification — 001-readme-manual-sdd

Estado: Verification completa y Ship cerrado; ambos gates de salida cumplidos.

Revisión del core ensayada: `1ac3d281748463e03647fff1c76537e25c42fbe5` en `docs/readme-manual-sdd`. Se extrajo `.ai/` desde ese commit con `git archive`; los repositorios de ensayo fueron temporales y se eliminaron después.

| Criterio | Método, evidencia y resultado |
| --- | --- |
| R1 | Lectura de `.ai/workflow.md` y ensayo de directorios: sin specs → `001`; `001` y `003` → `004`; `004` cancelada → `005`; `999` → `1000`. Un `001` entrante se renumeró a `002` junto con su referencia; el `001` existente permaneció intacto. Satisfactorio. |
| R2 | Lectura de `.ai/workflow.md` y del handoff de esta spec: seis fases, cuatro artefactos creados en secuencia, estados y gates documentados, sin comando o plantilla obligatoria. Satisfactorio. |
| R3 | La revisión Git contiene 12 archivos en `.ai/`. Su copia en ambos ensayos coincidió archivo por archivo mediante SHA-256; los enlaces locales del canon permanecieron dentro de `.ai/` y no hubo destinos ni anclas rotos. Satisfactorio. |
| R4 | `PROJECT.md` describe contexto y Ship local; `AGENTS.md` apunta al contrato y al canon. La búsqueda de `Stage 3 — Rules` lo halló solo en `PROJECT.md`. Los límites de Stage 2 en `docs/architecture/sdd.md` están redactados como historia y apuntan al contrato vigente. Satisfactorio. |
| R5 | Lectura del README: propósito, estado por referencia, seis pasos del ciclo, nombre de spec, incorporación desde commit exacto, tratamiento de colisiones y capacidades futuras. Satisfactorio. |
| R6 | `docs/architecture/adoption.md` registra decisión, alternativas, propiedad y límites antes de los cambios al canon. La guía detiene la copia ante `.ai/` o `PROJECT.md` existentes y reserva actualizaciones automáticas para otra etapa. Satisfactorio. |
| R7 | Ensayo desde el commit indicado: proyecto vacío = copia exitosa; proyecto con `AGENTS.md`, `docs/` y `specs/` = copia exitosa y tres archivos previos idénticos por SHA-256. Colisión con `.ai/` = bloqueada; colisión con `PROJECT.md` = bloqueada, sin copia parcial ni sobrescritura. Ambos contratos de ensayo registraron la revisión exacta. Satisfactorio. |
| R8 | Revisión de coherencia y 33 enlaces Markdown locales: cero destinos o anclas faltantes. `git diff --cached --check` sobre la evidencia preparada: sin errores. R1–R7 tienen método y resultado registrados; no quedan criterios sin comprobar. Satisfactorio. |

El primer intento del ensayo de numeración falló por un formato numérico del script temporal de prueba. Se corrigió el script y se repitieron todos los escenarios con resultado satisfactorio; no requirió cambiar el producto. Estos ensayos prueban la incorporación manual de esta revisión, no un instalador, un adapter ni una actualización automática. No se realizó una prueba real con dos agentes: la continuidad se evaluó por lectura de los artefactos persistidos.

## Handoff de Verification

No quedaron desviaciones materiales ni bloqueos para Ship. El commit de evidencia se confirmó y la entrega local se registra a continuación.

## Ship

Estado: completo. La rama local `docs/readme-manual-sdd` contiene el producto en `1ac3d281748463e03647fff1c76537e25c42fbe5` y la evidencia verificada en `89623a56d183f35786dc0f51d2fa599cc000c525`. Se confirmó este último como HEAD con el árbol de trabajo limpio antes del cierre. Este registro se incorpora mediante un commit documental posterior para evitar una referencia circular. No se publicó la rama, según las condiciones de `PROJECT.md`.

Handoff final: el primer ciclo SDD manual está entregado localmente. La próxima decisión de diseño es el mecanismo de instalación y actualización y un primer adapter, usando estos ensayos de incorporación como punto de partida. No quedan pendientes de este contrato.
