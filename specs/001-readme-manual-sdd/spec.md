# 001 — Uso manual y adopción portable

Estado: Specification vigente; gate de salida revalidado tras precisar R8.

## Contrato

Consolidar el canon y las reglas existentes, documentar un primer uso manual del ciclo SDD y definir cómo incorporar el harness en proyectos nuevos o existentes. El resultado debe poder usarse sin un proveedor, modelo, instalación global o conexión de red durante el trabajo cotidiano.

| ID | Requisito y criterio verificable |
| --- | --- |
| R1 | El workflow identifica cada cambio como `specs/<número>-<nombre-kebab-case>/`: secuencia local desde `001`, mínimo tres dígitos, siguiente número igual al mayor existente más uno, sin reutilizar números cancelados. Documenta huecos, colisiones entre ramas y el paso de `999` a `1000`, sin contador ni vínculo obligatorio con una rama. |
| R2 | Se conservan las seis fases y cuatro artefactos breves (`spec.md`, `plan.md`, `tasks.md`, `verification.md`), creados al llegar a su fase, con estado y handoff suficientes. Ninguna herramienta o plantilla extensa es obligatoria. |
| R3 | `.ai/` es autocontenido para aplicar el canon: jerarquía normativa, workflow y reglas son legibles tras copiar solo ese directorio. Las decisiones arquitectónicas del repositorio explican el razonamiento sin constituir otra fuente normativa. |
| R4 | `PROJECT.md` contiene el contexto de ndev-spec y las condiciones de Ship local, se referencia desde las instrucciones de entrada y es distinto del canon distribuido. Stage 3 se declara en un único lugar; las referencias históricas a Stage 2 no contradicen ese estado. |
| R5 | El README explica propósito, estado, ciclo manual, incorporación local de una revisión exacta y comienzo de una spec. Distingue lo disponible de instalador, adapters y automatizaciones futuras. |
| R6 | Una decisión arquitectónica previa a la implementación define copia local versionada, propiedad de `.ai/`, `PROJECT.md` y `specs/`, colisiones y actualizaciones futuras. La incorporación nunca sobrescribe `.ai/` o `PROJECT.md` existentes. |
| R7 | La incorporación manual se ensaya en repositorios temporales vacío y existente. Se comprueba uso del canon sin consultar el origen, identificación de la revisión copiada, preservación de archivos y detección de colisiones. |
| R8 | `verification.md` registra método, resultado y evidencia de R1–R7, además de la comprobación de enlaces y `git diff --check`. Los fallos y límites se hacen visibles. |

## Límites

No se implementan instalador, CLI, adapters, gates automáticos ni actualización automática. La entrega es local: requiere commits coherentes en `docs/readme-manual-sdd`, referencia al commit entregado y handoff final; no requiere push, PR o integración en `main`. Se preservan los cambios de canon y reglas que ya estaban en el árbol de trabajo al iniciar este cambio.

## Handoff

Contexto revisado: `AGENTS.md`, `.ai/`, `docs/architecture/` y estado de Git en `main` antes de crear la rama de trabajo. No había specs numeradas previas. Plan y Tasks están completos; Implementation produjo el canon portable y la guía. Siguiente fase: Verification y después Ship local, si se cumple su gate.
