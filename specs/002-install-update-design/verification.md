# Verification — 002-install-update-design

Estado: Verification completa y Ship cerrado; ambos gates de salida cumplidos. Integrado en `main` (ver [Integración](#integración)).

## Método y evidencia

Ensayos ejecutados el 2026-10-16 en Windows, Git `2.50.1.windows.1` y Node `22.18.0` como auxiliar temporal de fixtures y assertions. No se agregaron scripts, dependencias, instalador ni suite al producto. Las decisiones de bloqueo son aplicación e inspección del procedimiento manual; no existe un comando que las automatice. Los auxiliares ejecutaron operaciones Git y copias explícitas sobre escenarios conocidos, no una interfaz de instalación general.

Base real B: `de238169dd7eda60404de40523e6440497356dce`; árbol `.ai/`: `08f63171fd33390904c99e66a82c25d103ec7279`, con 12 archivos. Se obtuvo una copia local separada del repositorio, sin red, y se extrajeron blobs y un archive de B; ambos coincidieron ruta por ruta y contenido por contenido.

Destino sintético T: `1123f402d58935d4a0cfff11026218791a8c0af7`, generado solo en el repositorio temporal. Fixture reproducible: agregar a `.ai/README.md` una línea en blanco y `Ensayo temporal de actualización 002.`, crear `.ai/rules/fixture.md` con `# Regla temporal de ensayo` y eliminar `.ai/commands/.gitkeep`; líneas terminadas en LF. T no es una release ni se publica. Una reproducción creará otro OID por los metadatos del commit; debe conservar estas diferencias observables.

Los temporales quedaron en `C:/Users/lugon/AppData/Local/Temp/ndev-spec-002-ENstvy`; `report.json` registra E01–E17. E18–E20 se ejecutaron después como comprobaciones adicionales. Este documento conserva los resultados y datos necesarios para reconstruir los casos; no depende de que permanezcan los temporales ni los OID sintéticos disponibles.

## Escenarios ejecutados

| Caso | Requisitos | Evidencia y resultado |
| --- | --- | --- |
| E01 — extracción y origen local | R1 | 12 archivos de B idénticos mediante blobs y `git archive`; inventario y SHA-256 de contenidos coincidentes. Sin acceso a red. Satisfactorio. |
| E02 — propuesta B→T | R5 | Diff previo: `M .ai/README.md`, `D .ai/commands/.gitkeep`, `A .ai/rules/fixture.md`. T fijada antes de copiar. Satisfactorio. |
| E03 — proyecto nuevo | R1, R2, R3 | Commit de recuperación `874eec535d61635fc2cc0842b82db4878fa2361f`; instalación y PROJECT propio confirmados juntos. Índice idéntico a B y estado limpio. Satisfactorio. |
| E04 — proyecto existente | R2, R3 | Revisión de PROJECT antes de incorporar su sección; texto previo preservado. AGENTS, spec previa, documento propio y `.gitignore` idénticos por SHA-256. Índice del canon igual a B. Satisfactorio. |
| E05 — adopción | R2, R3 | Copia de B sin registro estructurado comparada por rutas, índice y contenido; solo PROJECT cambió al registrar la procedencia. Satisfactorio. |
| E06 — actualización y repetición | R5, R6 | Las tres operaciones previstas y procedencia T quedaron en `3c914a27a269a26b5e3f6825b25a8b603cc8ba76`. Archivos propios preservados; índice y archivos iguales a T. Repetir la comprobación no cambió snapshot ni HEAD. Satisfactorio. |
| E07 — revisión anterior | R5, R8 | Nuevo commit `42405e678ec60152f1c0940ff27cbd957df282fa` vuelve a B; su padre es el commit de actualización. Canon exacto y contexto preservado, sin reescribir historia. Satisfactorio. |
| E08 — divergencias | R6 | Edición local confirmada mostró status limpio pero índice distinto de B; se respaldó el archivo y restauró B en un nuevo commit. Alta local y baja local también se detectaron; se preservó respaldo de la adición. Resultado final igual a B. Satisfactorio. |
| E09 — colisiones | R3, R4, R6 | Archivo ignorado bajo `.ai/` permanecía invisible al status, pero apareció en inventario y `ls-files --others --ignored`; se conservó su contenido. También se detectaron archivo oculto por nombre, `.ai` como archivo y `.AI` como colisión real del sistema Windows. No se aplicó canon sobre esos estados. Satisfactorio. |
| E10 — enlaces y tipos | R4 | Junction real en `.ai` detectada con inspección sin seguirla; snapshot del destino externo intacto. Entradas sintéticas de índice con modos `120000` y `160000` identificadas como tipos no admitidos antes de extracción. Satisfactorio. |
| E11 — entradas inválidas | R1, R2, R8 | Git rechazó referencia inexistente y objeto base ausente. Se detectaron dos secciones de procedencia y una extracción sin README. Snapshot y HEAD del consumidor permanecieron iguales; no se aplicó ninguna de las propuestas. Satisfactorio. |
| E12 — LF/CRLF y atributos | R7 | Copia CRLF con `core.autocrlf=true`: índice idéntico a B, status limpio y `ls-files --eol` mostrando `w/crlf`. Inspección detectó atributos `filter=untrusted` y `working-tree-encoding=UTF-16` sin ejecutar filtros ni preparar contenido transformado. Satisfactorio. |
| E13 — cambio después de revisión | R5, R8 | Edición de AGENTS después del snapshot produjo una diferencia observable; propuesta invalidada sin actualización. Se conservó respaldo del cambio antes de restaurar el fixture. Satisfactorio. |
| E14 — validación fallida e interrupción | R8 | Canon parcialmente preparado en índice con PROJECT todavía en B: comparación con B falló como se esperaba. Recuperación acotada de README, placeholder y alta nueva restauró snapshot completo, índice limpio y HEAD C, sin tocar otras rutas. Satisfactorio. |
| E15 — fallo de commit | R8 | Hook temporal `pre-commit` con salida 1 rechazó el commit. HEAD siguió en C y el diff preparado permaneció pendiente. Tras corregir ese hook de fixture y revalidar T, se confirmó `31b72931613190dd69c95aaa62efe5bfe448d14a`. No se desactivaron controles de un proyecto real. Satisfactorio. |
| E16 — archive incompleto | R1, R8 | Una `.gitattributes` temporal con `export-ignore` omitió `rules/testing.md` del archive aunque seguía en el árbol del commit. Se detectó la discrepancia sin copiar al consumidor. Satisfactorio. |
| E17 — preservación del repositorio real | R9, R10 | `docs/readme-manual-sdd` sigue en B; `main` en `8cc6e8c1ace667cb92f8bd91725dff7f591837bc`. Diff contra B vacío para `.ai/` y `specs/001-readme-manual-sdd/`. Satisfactorio. |
| E18 — oculto de Windows | R4 | Archivo con atributo Hidden real detectado por enumeración del directorio; no se aplicó actualización mientras estaba presente. Satisfactorio. |
| E19 — lectura autónoma | R1, R9 | Los 11 enlaces locales del canon extraído resuelven dentro de `.ai/`. Lectura de README, workflow y reglas sin consultar el origen. Satisfactorio. |
| E20 — atributos introducidos por T | R7 | Propuesta temporal con `.ai/.gitattributes` y `filter=candidate`: `check-attr` detectó su efecto antes de tocar el consumidor y sin ejecutar filtros. Satisfactorio. |

## Revisión documental y cobertura

R1–R8 tienen escenarios arriba y tratamiento explícito en la decisión: commit completo, origen sin credenciales, adopción, propiedad, B/L/T, LF/CRLF, recuperación acotada y fallos. R9 se comprobó por lectura de la decisión, README, adopción y PROJECT: cuatro alternativas comparadas, procedimiento de siete pasos, ejemplos, condiciones de entrega y distinción entre diseño y automatización. La jerarquía, las reglas y los seis gates del canon no cambiaron. La sección de procedencia es una convención documental del consumidor, no una nueva API ejecutable ni estado duplicado.

R10: revisión de los 22 documentos Markdown del repositorio y 43 enlaces locales, incluidas anclas: cero destinos o anclas faltantes. `git diff --check`: sin errores. Revisión de alcance: únicamente documentación de 002, decisión nueva y alineación de README, PROJECT y adopción; ningún script ni cambio al canon o a 001. La decisión previa, Specification, Plan y Tasks están en `7a0ab8f`, anterior a los cambios derivados. La comprobación del índice y del árbol final se repite al preparar la entrega.

Durante la revisión se precisó que los atributos efectivos deben evaluarse también cuando T cambia `.gitattributes`, no solo en la copia actual. Se volvió a Implementation documental para aclararlo y se revalidaron los gates afectados: R7 y el Plan ya exigían bloquear transformaciones no verificables; no cambiaron requisitos ni decisiones de producto. E20 verificó la precisión y se volvió a Verification. T1–T3 siguen completas.

## Fallos previstos, incidencias y límites

Los rechazos de Git, la comparación fallida de E14 y el hook fallido de E15 son fallos provocados con resultado esperado; ninguno dejó un criterio fallido. Un intento de parche documental no encontró una línea exacta del README, no aplicó cambios y se corrigió antes de Verification. La escritura inicial de la rama requirió escalación por permisos de `.git`, aprobada; no se alteraron las ramas previas. El alias de Python no estaba disponible, por lo que los ensayos usaron Node. Los avisos locales de Git sobre LF/CRLF no fueron errores; el comportamiento se comprobó en E12.

Se ensayó en Windows y con repositorios locales. No se probó transporte remoto, autenticación, firmas, otros sistemas de archivos, OID de otro formato, pérdida de energía ni exclusión automática de escritores. Los modos no admitidos se inspeccionaron sin extraerlos. La carrera concurrente se representó mediante un cambio intercalado; el diseño exige coordinación manual y no promete atomicidad. Los rechazos son verificaciones manuales apoyadas en herramientas, no validación de un instalador. Estos límites son compatibles con el contrato documental satisfecho; una implementación futura necesita su propia spec y pruebas.

## Handoff

R1–R10 satisfechos con evidencia y sin desviaciones materiales pendientes. El producto y la evidencia se confirmaron y se comprobaron antes del cierre siguiente. No se publicó ni integró ninguna rama.

## Ship

Entrega local completada en `docs/install-update-design`: decisión previa y gates de entrada en `7a0ab8f`; producto documental y evidencia en `34e2180b8c566a4de5ac5b053e3f4974d33d4919`. Se confirmó ese commit como HEAD con árbol e índice limpios antes de este cierre. `git diff --cached --check` previo al commit y `git diff --check de23816..HEAD` posteriores: satisfactorios. La revisión final de 22 documentos y 43 enlaces no encontró errores.

Se confirmó que `.ai/` y `specs/001-readme-manual-sdd/` son idénticos a B; las refs `docs/readme-manual-sdd` y `main` conservan sus commits iniciales. No hubo push, PR, integración ni reescritura de historia. Este registro y los handoffs finales se incorporan mediante un commit documental posterior, sin intentar referenciar el commit que los contiene.

Handoff final: diseño y procedimiento manual entregados y verificados. No quedan pendientes del contrato 002. Una implementación futura del instalador o comandos debe abrir la siguiente spec disponible, revalidar las decisiones aplicables y cumplir sus propios gates; estos ensayos no verifican una implementación automatizada. Integrar las ramas existentes en main no fue parte de esta entrega.

## Integración

Posterior a Ship, el 2026-10-21. Las ramas entregadas se publicaron y se integraron en `main` mediante el PR #1, con merge commit (sin squash) `cb1fac45a3111aff92714e2a962aad4730d29b15`; los commits de 001 y 002 y sus hashes citados en estos registros se conservan en el historial de `main`. Antes de borrar las ramas se comprobó que `docs/readme-manual-sdd` estaba contenida en `docs/install-update-design`. Ambas se eliminaron del remoto y del repositorio local; sus cabezas finales, recuperables por hash, eran `de238169dd7eda60404de40523e6440497356dce` y `4aff55718443fbc3d84137fe44ee1f18ee7f9112`.

No se registró una revisión formal del PR; la integración la decidió el autor. Esto no modifica el contrato, los requisitos ni la evidencia de 002, y sus límites siguen vigentes: ensayos en Windows con repositorios locales, sin instalador ni transporte remoto. La entrega local descrita en Ship sigue siendo el registro de lo ocurrido en su momento.

Handoff: el pendiente de integrar las ramas en `main` queda cerrado. No quedan pendientes de 002. La automatización del instalador, si se decide, requiere una nueva spec con el siguiente número disponible.
