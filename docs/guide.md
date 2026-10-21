# Guía de ndev-spec v1 manual

Para personas y agentes que quieren incorporar SDD en un repositorio y completar cambios con contratos, decisiones y evidencia persistentes. El producto es Markdown versionado: seis fases, nueve skills y tres niveles de documentación. La [verificación de 004](../specs/004-v1-manual-readiness/verification.md) registra qué se comprobó y sus límites; una release publicada es una entrega posterior.

## Elegir un recorrido

- Si ya tenés `.ai/` instalado: ir a [trabajar un cambio](#trabajar-un-cambio).
- Si el proyecto es nuevo: preparar Git y un commit inicial; luego seguir la instalación.
- Si tiene desarrollo previo: conservar código, instrucciones y specs, revisar su contexto y luego incorporar el canon.
- Para mantener una instalación: seguir [actualización y recuperación](#actualización-y-recuperación).

El [workflow](../.ai/workflow.md) es la definición normativa. Esta guía explica cómo aplicarlo; el [diseño de instalación](architecture/installation-updates.md) rige adquisición y recuperación. Solo se distribuye `.ai/`. `PROJECT.md`, `specs/`, instrucciones de agentes y documentación pertenecen al consumidor. No copies estos archivos desde ndev-spec.

## Instalación manual

Necesitás Git, un editor y PowerShell 7 o Bash con `unzip`. La lectura cotidiana del canon instalado no requiere red, runtime ni herramientas de proveedor. Los bloques siguientes son ejemplos manuales que se ejecutan por separado, revisando el resultado entre pasos; no son comandos propios ni un instalador. Si un comando falla, detenerse antes del siguiente. En PowerShell, comprobar también `$LASTEXITCODE` tras cada operación Git: `$ErrorActionPreference` no convierte sus códigos de error en excepciones.

### 1. Preparar el proyecto

**Proyecto nuevo:** elegir la carpeta y crear un punto de recuperación antes de copiar. Sustituir las rutas de ejemplo.

```powershell
# P1 — solo para un proyecto nuevo
$sddTarget = 'D:/proyectos/mi-proyecto'
New-Item -ItemType Directory -Path $sddTarget -ErrorAction Stop
git -C $sddTarget init
git -C $sddTarget commit --allow-empty -m 'chore: inicia proyecto'
```

```bash
# B1 — solo para un proyecto nuevo
sdd_target='/ruta/mi-proyecto'
mkdir -- "$sdd_target" && git -C "$sdd_target" init &&
  git -C "$sdd_target" commit --allow-empty -m 'chore: inicia proyecto'
```

**Proyecto existente:** usar su carpeta, leer sus instrucciones, README y `PROJECT.md` si existe. No inicializarlo otra vez ni crear commits para esconder cambios pendientes. El responsable resuelve cualquier trabajo previo fuera de esta operación. No hacer stash, limpiar ni forzar archivos ignorados automáticamente.

En ambos casos coordinar acceso exclusivo, comprobar rama, índice y árbol limpios, y anotar el commit de recuperación C:

```powershell
# P2
git -C $sddTarget status --short --untracked-files=all
git -C $sddTarget ls-files --others --ignored --exclude-standard
$sddRecovery = (git -C $sddTarget rev-parse --verify HEAD).Trim()
Get-ChildItem -LiteralPath $sddTarget -Force
```

```bash
# B2
git -C "$sdd_target" status --short --untracked-files=all
git -C "$sdd_target" ls-files --others --ignored --exclude-standard
sdd_recovery=$(git -C "$sdd_target" rev-parse --verify HEAD)
ls -la -- "$sdd_target"
```

Un status limpio no descarta obstáculos. Inspeccionar rutas de acceso y entradas ocultas **sin seguir symlinks, junctions o reparse points**. Revisar `.ai`, variantes como `.AI`, `PROJECT.md` y archivos ignorados. Si existe `.ai/` sin procedencia reconocida, detener la copia; su adopción solo procede tras demostrar equivalencia con una revisión exacta. Conservar un inventario de archivos propios y del estado revisado fuera del consumidor.

### 2. Elegir origen y revisión exacta

Elegir explícitamente un origen confiable, remoto o local. Para un remoto se puede obtener una copia separada con `git clone --no-checkout <URL-sin-credenciales> <carpeta-temporal-vacía>`; no ejecutar código, hooks ni configuraciones del origen. Una ruta temporal de clone no reemplaza la URL registrada. Para trabajar sin red, usar un repositorio local con los objetos y correspondencia demostrada con el origen elegido.

En estos ejemplos `$sddSource`/`sdd_source` apunta a ese repositorio local; la referencia es una elección explícita del responsable, no una revisión instalada móvil:

```powershell
# P3
$sddSource = 'D:/fuentes/ndev-spec'
$sddRef = 'main' # cambiar por la referencia elegida
$sddOid = (git -C $sddSource rev-parse --verify "${sddRef}^{commit}").Trim()
git -C $sddSource cat-file -t $sddOid
git -C $sddSource ls-tree -r $sddOid -- .ai
$sddStage = Join-Path ([IO.Path]::GetTempPath()) ('ndev-spec-' + [guid]::NewGuid())
New-Item -ItemType Directory -Path $sddStage -ErrorAction Stop
```

```bash
# B3
sdd_source='/ruta/fuentes/ndev-spec'
sdd_ref='main' # cambiar por la referencia elegida
sdd_oid=$(git -C "$sdd_source" rev-parse --verify "${sdd_ref}^{commit}")
git -C "$sdd_source" cat-file -t "$sdd_oid"
git -C "$sdd_source" ls-tree -r "$sdd_oid" -- .ai
sdd_stage=$(mktemp -d)
```

Confirmar tipo `commit`, OID completo y árbol no vacío. Antes de extraer, revisar rutas, tipos y modos: rechazar enlaces, gitlinks, rutas incompatibles, colisiones por mayúsculas y modos no representables. Los ejemplos de copia siguientes cubren los archivos regulares `100644` del canon actual; otro modo exige comprobar preservación antes de aplicar. No asumir una longitud fija de OID.

### 3. Preparar y comprobar la extracción

El temporal debe estar fuera del consumidor. Usar únicamente el OID resuelto. El ajuste de finales de línea del comando de extracción afecta al origen temporal, no cambia configuración ni controles del consumidor; aun así comprobar cada blob. `export-ignore` y `export-subst` pueden alterar un archive: si hay diferencia, detenerse y preparar blobs exactos según el procedimiento normativo.

```powershell
# P4
git -C $sddSource -c core.autocrlf=false archive --format=zip "--output=$sddStage/canon.zip" $sddOid .ai
Expand-Archive -LiteralPath "$sddStage/canon.zip" -DestinationPath "$sddStage/tree"
$sddTree = @(git -C $sddSource ls-tree -r $sddOid -- .ai)
foreach ($sddEntry in $sddTree) {
    if ($sddEntry -notmatch '^100644 blob ([0-9a-f]+)\t(.+)$') { throw 'Tipo o modo no admitido por este ejemplo' }
    $sddBlob = $Matches[1]; $sddPath = $Matches[2]
    $sddHash = git -C $sddSource hash-object --no-filters -- "$sddStage/tree/$sddPath"
    if ($LASTEXITCODE -ne 0 -or $sddHash -ne $sddBlob) { throw "Extracción diferente: $sddPath" }
}
$sddFiles = @(Get-ChildItem -LiteralPath "$sddStage/tree/.ai" -Force -Recurse -File)
if ($sddTree.Count -eq 0 -or $sddFiles.Count -ne $sddTree.Count) { throw 'Inventario diferente' }
```

```bash
# B4
git -C "$sdd_source" -c core.autocrlf=false archive --format=zip --output="$sdd_stage/canon.zip" "$sdd_oid" .ai &&
  unzip -q "$sdd_stage/canon.zip" -d "$sdd_stage/tree"
git -C "$sdd_source" ls-tree -r "$sdd_oid" -- .ai > "$sdd_stage/tree.txt"
while IFS=$'\t' read -r sdd_meta sdd_path; do
  read -r sdd_mode sdd_type sdd_blob <<< "$sdd_meta"
  [ "$sdd_mode" = 100644 ] && [ "$sdd_type" = blob ] || { echo 'Tipo o modo no admitido'; exit 1; }
  sdd_hash=$(git -C "$sdd_source" hash-object --no-filters -- "$sdd_stage/tree/$sdd_path") || exit 1
  [ "$sdd_hash" = "$sdd_blob" ] || { echo "Extracción diferente: $sdd_path"; exit 1; }
done < "$sdd_stage/tree.txt"
test -s "$sdd_stage/tree.txt" &&
  test "$(find "$sdd_stage/tree/.ai" -type f | wc -l)" -eq "$(wc -l < "$sdd_stage/tree.txt")"
```

Además del contenido y cantidad de archivos, cotejar el inventario de rutas y directorios contra el árbol; no admitir extras ni directorios vacíos desconocidos. La inspección de tipos y rutas debe preceder la extracción y el recorrido recursivo: los bloques no validan un archivo ZIP arbitrario ni siguen enlaces permitidos por accidente.

### 4. Revisar el resultado propuesto

Preparar fuera del consumidor un `PROJECT.md` propio, o una copia editada del existente, con propósito, contexto/restricciones, comprobaciones reales y entrega. La skill `constitution` ayuda a redactar ese contexto; su aprobación y los pendientes deben quedar explícitos. Durante la instalación agregar exactamente una sección de procedencia:

```markdown
## ndev-spec

- Origen: <URL sin credenciales o ruta estable elegida>
- Revisión: <OID completo resuelto>
```

Guardar el resultado acordado como `PROJECT.proposed.md` en el temporal. Revisar el diff completo: contexto propio y procedencia juntos. No copiar el PROJECT de ndev-spec ni sustituir contenido ajeno. Si PROJECT ya existe, detener la copia hasta acordar su edición. Conservar su contenido previo fuera de la sección de procedencia.

Revisar atributos efectivos para **cada ruta** y configuración de Git. Por ejemplo, para una ruta del canon:

```powershell
# P5 — repetir check-attr para cada ruta del inventario
git -C $sddTarget check-attr --all -- .ai/README.md
git -C $sddTarget config --show-origin --get-regexp 'core\.(autocrlf|eol)|filter\.'
```

```bash
# B5 — repetir check-attr para cada ruta del inventario
git -C "$sdd_target" check-attr --all -- .ai/README.md
git -C "$sdd_target" config --show-origin --get-regexp 'core\.(autocrlf|eol)|filter\.'
```

`config --get-regexp` devuelve 1 si no hay coincidencias; distinguirlo de un error. Bloquear filtros clean/smudge, `ident`, codificaciones u otras transformaciones incompatibles; no ejecutarlos ni desactivarlos para continuar. Revisar también atributos de T, incluidos nuevos `.gitattributes`, en una copia temporal del estado propuesto si corresponde. LF/CRLF de texto solo es admisible si Git permite comprobar identidad en el índice. Sparse checkout o archivos con skip-worktree/assume-unchanged requieren una copia completa verificable antes de seguir.

Revisar todas las altas y la edición de PROJECT, inventario de operaciones y C. La autorización puede estar ya dada en la solicitud: no pedirla otra vez si cubre exactamente el resultado revisado. No escribir en el consumidor antes de concluir esta revisión.

### 5. Aplicar exclusivamente el conjunto revisado

Volver a comprobar C, estado, inventario, archivos, procedencia y atributos. Cualquier cambio invalida la propuesta y exige otra revisión. Los bloques siguientes son **solo para instalación inicial sin `.ai/`**, tras revisar PROJECT y las rutas de acceso. Para actualización usar la siguiente sección, no esta copia de carpeta.

```powershell
# P6
if (Test-Path -LiteralPath "$sddTarget/.ai") { throw 'Colisión: revisar instalación existente' }
Copy-Item -LiteralPath "$sddStage/tree/.ai" -Destination "$sddTarget/.ai" -Recurse -ErrorAction Stop
Copy-Item -LiteralPath "$sddStage/PROJECT.proposed.md" -Destination "$sddTarget/PROJECT.md" -ErrorAction Stop
git -C $sddTarget add -- .ai PROJECT.md
git -C $sddTarget diff --cached --check
git -C $sddTarget ls-files --stage -- .ai
git -C $sddTarget ls-files --eol -- .ai
git -C $sddTarget diff --cached --stat
```

```bash
# B6
test ! -e "$sdd_target/.ai" && test ! -L "$sdd_target/.ai" || { echo 'Colisión: revisar instalación existente'; exit 1; }
cp -R -- "$sdd_stage/tree/.ai" "$sdd_target/.ai" &&
  cp -- "$sdd_stage/PROJECT.proposed.md" "$sdd_target/PROJECT.md" &&
  git -C "$sdd_target" add -- .ai PROJECT.md &&
  git -C "$sdd_target" diff --cached --check
git -C "$sdd_target" ls-files --stage -- .ai
git -C "$sdd_target" ls-files --eol -- .ai
git -C "$sdd_target" diff --cached --stat
```

La copia acordada de PROJECT no habilita reemplazar un contrato diferente surgido después de la revisión. Si ignore impide agregar rutas, detenerse, sin `add -f`. Comparar **todas** las rutas, modos y blobs del índice con T; si ambos repositorios usan el mismo formato de objetos, los OID deben coincidir. Con distintos formatos, comparar contenidos de blobs, no OID. Comprobar que árbol de trabajo e índice coinciden bajo `.ai/`, sin extras ocultos o ignorados, y que los archivos propios siguen intactos. No alcanza con mirar `--stat`.

### 6. Confirmar o recuperar

Solo si todo lo anterior pasa, crear un commit que reúna canon y procedencia:

```powershell
# P7
git -C $sddTarget commit -m 'chore: incorpora canon ndev-spec'
git -C $sddTarget status --short --untracked-files=all
git -C $sddTarget rev-parse HEAD
```

```bash
# B7
git -C "$sdd_target" commit -m 'chore: incorpora canon ndev-spec' &&
  git -C "$sdd_target" status --short --untracked-files=all &&
  git -C "$sdd_target" rev-parse HEAD
```

Comprobar también el árbol del commit y la revisión registrada. Registrar el commit final en la evidencia del consumidor; no hace falta inventar una spec para la adquisición inicial ni importar las del origen. Si el consumidor ya usa SDD, respetar sus gates. Conservar temporales hasta confirmar el resultado. Un hook o commit fallido exige inspeccionar el estado antes de reintentar; no anunciar éxito.

## Actualización y recuperación

La actualización usa **B**, revisión registrada; **L**, copia e índice locales más inventario completo; **T**, revisión destino del mismo origen. Puede elegirse una revisión anterior como T en un nuevo commit, sin reescribir historia.

1. Repetir precondiciones y preparación para B y T en temporales distintos. Una procedencia ausente, duplicada, inaccesible o incompatible bloquea la operación; no inferir B.
2. Comparar B→L, B→T y L→resultado. Comprobar incluso cambios locales ya confirmados y archivos ignorados. Revisar altas, modificaciones, bajas, PROJECT y atributos.
3. Si L difiere de B, preservar la divergencia y resolverla explícitamente: traslado de contexto compatible fuera del core, descarte respaldado o propuesta al origen. No mezclar variantes dentro de `.ai/`. Restablecer equivalencia con B y repetir la revisión antes de aplicar T.
4. Aplicar archivo por archivo según el inventario aprobado. Eliminar solo bajas reconocidas de B, nunca contenido desconocido. Los cambios archivo↔directorio requieren revisar cada entrada antes de desplazarlos. Cambiar únicamente la procedencia acordada de PROJECT. No usar la copia recursiva de instalación para actualizar.
5. Repetir comprobaciones de índice, blobs, inventario y preservación; confirmar canon y procedencia juntos. Si L=B y T=B, no hay escrituras ni commit vacío. Si cambia el commit pero el canon es idéntico, revisar el cambio de procedencia igualmente.

Comandos útiles para revisar una actualización, una vez sustituidos los OID y nombres:

```powershell
# P8
git -C $sddSource diff --name-status $sddBase $sddOid -- .ai
git -C $sddTarget diff -- .ai PROJECT.md
git -C $sddTarget diff --cached -- .ai PROJECT.md
```

```bash
# B8
git -C "$sdd_source" diff --name-status "$sdd_base" "$sdd_oid" -- .ai
git -C "$sdd_target" diff -- .ai PROJECT.md
git -C "$sdd_target" diff --cached -- .ai PROJECT.md
```

`$sddBase`/`sdd_base` es el OID completo leído del registro B. Los dos últimos comandos no detectan por sí solos divergencias ya confirmadas: comparar también el árbol/índice y el inventario con B.

| Problema | Acción |
| --- | --- |
| Colisión, divergencia, revisión inaccesible o extracción diferente | Detener antes de escribir; preservar y resolver; repetir preparación. |
| Copia completa de .ai pero PROJECT aún apunta a B | Instalación parcial pendiente: completar el resultado revisado tras revalidar, o recuperar ambas partes. No usar ese canon como instalado. |
| Interrupción antes del commit | Guardar estado parcial e inventario; restaurar desde C solo rutas afectadas preexistentes, en índice y archivos. Retirar solo incorporaciones identificadas cuyo contenido no cambió después. |
| Cambios concurrentes o de hooks | Preservarlos y revisar antes de restaurar o continuar. No hacer reset/clean global ni borrado recursivo general. |
| Volver atrás después del commit | Seleccionar la revisión anterior como T y aplicar un cambio nuevo con el mismo procedimiento. Sin force push. |

Para una ruta preexistente identificada, después de verificar sus cambios, `git restore --source=<C> --staged --worktree -- <ruta>` recupera índice y contenido. No elimina altas que no existían en C: retirarlas individualmente solo tras cotejar el inventario. El [procedimiento normativo](architecture/installation-updates.md#fallos-y-recuperación) detalla recuperación y límites de atomicidad.

## Trabajar un cambio

Un agente aplica una skill **leyendo su archivo**, sin necesidad de slash commands ni descubrimiento automático. En una sesión nueva pedir primero leer `.ai/README.md`, `.ai/skills/README.md`, instrucciones locales y `PROJECT.md`. Luego proporcionar el cambio o directorio activo. El índice y cada `Lee` acotan el contexto necesario.

Los textos siguientes son prompts que podés copiar adaptando `<pedido>` y `<cambio>`; los nombres no son comandos instalados.

| Momento | Prompt y resultado esperado |
| --- | --- |
| Contexto | «Leé `.ai/skills/constitution/SKILL.md`. Relevá este proyecto y proponé su contexto en PROJECT; preservá la procedencia. Preguntá decisiones faltantes y persistí el resultado con mi acuerdo». No copia canon ni abre specs. |
| Specification | «Leé `.ai/skills/specify/SKILL.md` para `<pedido>`. Calculá el siguiente número, clasificá nivel y escribí contrato y criterios. Aplicá clarify; detenete si faltan decisiones». Produce spec.md. |
| Aclaraciones | «Leé `.ai/skills/clarify/SKILL.md` para `<cambio>`. Investigá hechos primero; preguntá ambigüedades materiales y registrá respuestas. Sin respuesta, dejá el bloqueo». Actualiza Contrato; no planifica. |
| Plan | «Leé `.ai/skills/plan/SKILL.md` para `<cambio>`. Con el gate de Specification cumplido, definí enfoque y verificación por criterio; documentá decisiones arquitectónicas antes de implementar». Produce el registro Plan del nivel. |
| Tasks | «Leé `.ai/skills/tasks/SKILL.md` para `<cambio>`. Derivá unidades con requisitos, dependencias, finalización y estado; aplicá analyze antes de habilitar implementación». Produce Tareas; no las ejecuta. |
| Análisis | «Leé `.ai/skills/analyze/SKILL.md` para `<cambio>`. Contrastá contrato, Plan, Tareas, PROJECT y decisiones pertinentes. Persistí cobertura y hallazgos; detené implementación si son materiales». Actualiza Análisis. |
| Implementation | «Leé `.ai/skills/implement/SKILL.md` para `<cambio>`. Ejecutá solo tareas habilitadas, comprobá sus criterios y actualizá estado y handoff. Ante decisiones nuevas, volvé a la fase responsable». No declara cumplimiento ni entrega. |
| Verification | «Leé `.ai/skills/verify/SKILL.md` para `<cambio>`. Comprobá cada criterio con el método planificado, registrá evidencia y límites. Si falla, conservá evidencia y volvé a corregir; no hagas Ship». Produce Verificación. |
| Ship | «Leé `.ai/skills/ship/SKILL.md` para `<cambio>`. Confirmá Verification vigente y condiciones de entrega; ejecutá solo lo autorizado. Registrá referencias y cierre, comprobando cabeceras y handoffs». Detenerse si falta mecanismo o autorización requerida. |

### Preguntar durante cualquier fase

La regla de [preguntas y aclaraciones](../.ai/workflow.md#preguntas-y-aclaraciones) exige usar la herramienta interactiva disponible; si no existe, chat. No requiere una skill externa llamada Ask Question ni una herramienta de un proveedor concreto.

Ejemplo material: «¿Debe conservarse el orden original o clasificarse alfabéticamente? Recomiendo conservarlo por compatibilidad». Registrar la decisión del responsable y el criterio afectado. Si no responde, registrar pendiente y bloquear esa unidad; el silencio no aprueba la recomendación. Si PROJECT ya define el orden, no preguntar. Si cambia el contrato durante Implementation, volver a Specification/clarify y repetir Plan, Tasks y análisis afectados antes de retomar.

### Artefactos proporcionales y calidad

La [clasificación normativa](../.ai/workflow.md#niveles-de-cambio) prevalece sobre estos ejemplos. Todos recorren seis fases y mantienen evidencia; el nivel cambia dónde se escribe.

| Nivel | Ejemplo | Resultado esperado |
| --- | --- | --- |
| Mínimo | Corregir un enlace interno en un único documento, sin cambios del canon ni decisiones estructurales; un requisito y una tarea. | spec.md con Contrato/Aclaraciones, Plan, Tareas/Análisis, Verificación y Cierre. Criterio: enlace resuelve al destino previsto; evidencia: inspección de destino y ancla. |
| Estándar | Alinear instrucciones ya definidas en dos documentos, sin cambiar interfaces, canon o arquitectura. | spec.md, plan.md con Tareas/Análisis y verification.md con Cierre. Cada documento tiene comprobación y todas las tareas trazan a requisitos. |
| Extendido | Modificar el canon, como 004, o cambiar una interfaz pública. | spec.md, plan.md, tasks.md, verification.md y decisión arquitectónica previa. Criterios cubiertos por tareas y evidencia; cualquier fallo bloquea Ship. |

Un buen contrato usa condiciones observables: «El enlace abre la sección Instalación» permite decidir pasa/falla; «mejorar la documentación» no. Un Plan define método y evidencia para cada criterio; una tarea deja un resultado comprobable y sus dependencias claras. Verification registra método, evidencia y resultado por requisito; un listado de tests sin relación con criterios no alcanza.

Para ver artefactos reales, consultar [001](../specs/001-readme-manual-sdd/spec.md), [003](../specs/003-sdd-workflow-skills/spec.md) y [004](../specs/004-v1-manual-readiness/spec.md). Son contratos históricos de sus cambios; no reemplazan el canon vigente ni son plantillas obligatorias. La evidencia de 004 incluye ensayos de los tres niveles.

### Retomar y corregir

«Leé el canon local, PROJECT y los artefactos de `<cambio>`. Identificá último gate cumplido, tarea habilitada, bloqueos y siguiente paso desde sus handoffs. Si los registros se contradicen, resolvé la inconsistencia antes de continuar». Este prompt permite continuar sin conversación previa; no asumir que un archivo existente implica gate cumplido.

Si Verification falla, persistir el criterio fallido y su evidencia, volver a Implementation o a la fase que originó el problema y repetir lo afectado. No borrar fallos anteriores ni ajustar criterios para pasar. Si cambia el alcance o aparece una condición de nivel superior, reclasificar y actualizar los registros según el workflow.

**Implementation completa** significa tareas terminadas; **Verification satisfactoria**, contrato demostrado con evidencia; **Ship completo**, entrega confirmada según PROJECT. En un proyecto sin build o tests, declarar esa ausencia y aplicar inspecciones/ensayos planificados: no inventar comandos. Un PR abierto puede ser Ship si así lo define el proyecto, pero no implica merge ni release.

## Límites de la primera versión

No hay instalador, actualización automática, adapters, slash commands propios, plantillas obligatorias, agentes preconfigurados ni gates automáticos. Las carpetas reservadas con placeholders no representan capacidades implementadas. El agente necesita instrucciones explícitas para leer el canon; no se promete autodescubrimiento. Los cambios del core se proponen en ndev-spec, sin mantener variantes locales de `.ai/`.

La documentación normativa viaja en `.ai/`; esta guía y las decisiones quedan en el origen para consulta al adquirir o actualizar. La operación diaria permanece local y agnóstica de proveedor/modelo.
