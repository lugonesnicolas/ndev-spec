# Verificación — 005

Estado: Verification parcial; implementación completa y revisable localmente, sin Ship. Falta evidencia Linux/macOS. No hay publicación ni revisión Git distribuible del instalador. Fecha: 9 de noviembre de 2026.

## Evidencia

| Requisito | Método | Evidencia | Resultado |
| --- | --- | --- | --- |
| R1 | Suite CLI y smoke de paquete | Node 24.22.2, npm 10.9.3 y Git 2.50.1.windows.1. Parser, confirmación/cancelación, dry-run, --yes y rechazo no interactivo. Tarball y npm exec desde Git local por commit ensayados sin publicación | Satisfactorio en Windows |
| R2 | Fixtures y ensayo del canon real | Instalación exacta, ocultos/placeholders, preservación, contexto pendiente, binarios y objetos Git SHA-256; canon real de HEAD: 21 blobs exactos de 1fdb02f6070ca5ac8e1f6a227686ea1d42e1961b, sin specs/docs ni stage | Satisfactorio en Windows |
| R3 | Fixtures de AGENTS y salida CLI | Bloque nuevo, externo conservado, bloque alterado/conflicto rechazado, prompt constitution | Satisfactorio; semántica arbitraria de instrucciones requiere revisión humana |
| R4 | Fixtures y revisión del motor | Limpieza, índice/HEAD preservados, ignorados, junctions/symlinks, atributos actuales/propuestos, sparse/flags y revalidación incluso de creación concurrente de Git | Satisfactorio en Windows |
| R5 | Actualización/retroceso | Altas, modificaciones, bajas, cambio solo de procedencia, no-op antes/después del commit, retroceso, divergencia confirmada, CRLF comprobable y mezcla rechazada | Satisfactorio en Windows |
| R6 | Fallos inyectados | Restauración acotada, conversiones archivo/directorio y cambio concurrente con recovery.json; cambios de archivos gestionados sin actualización no se ocultan | Satisfactorio en Windows; no equivale a interrupción física |
| R7 | Tests, documentación y matriz | Windows ejecutado; matriz de tres SO preparada; Linux/macOS no ejecutados. Enlaces locales y whitespace comprobados | Pendiente de evidencia multiplataforma |
| R8 | Inspección Git y handoff | Alineación de 004 y CLI 005 guardadas en la misma rama local por autorización posterior del usuario; commits de resguardo separados, sin publicación. Contrato/Plan/Tareas alineados | Resguardo local; Ship pendiente de R7 |

## Fallos y correcciones

Primera ejecución: 17/19 casos satisfactorios. Dos fallos: Git trató de codificar el propio .gitattributes del fixture como UTF-16 al prepararlo; una ruta Windows inexistente produjo un diagnóstico demasiado genérico. Se corrigieron creación del blob de fixture y diagnóstico de origen. Segunda ejecución: 19/19 satisfactorios.

La ampliación produjo 26/27 satisfactorios: el caso CRLF dependía de diff-files con estado del índice sin refrescar. Se sustituyó por hash-object con atributos previamente comprobados y comparación con el OID del índice, sin escribir objetos ni ejecutar filtros externos. La revisión agregó preflight anterior a status, revalidación de atributos/ignores/Git, control de archivos gestionados sin cambios propuestos y no-op antes del commit.

Ejecución ampliada final: **32/32 satisfactorios** con `node --test test/installer.test.js` bajo Node 24.22.2 (266,35 s). Tras añadir cobertura binaria y ajustar la salida CLI, repetición dirigida con `--test-name-pattern='blobs binarios|CLI|init repetido'`: **4/4 satisfactorios**. La revisión final agregó rechazo de destino bare y de .git enlazado incluso con destino inexistente; repetición dirigida `--test-name-pattern='destino bare|CLI dry-run|fallo durante conversión'`: **3/3 satisfactorios**. Hay 34 casos distintos disponibles, todos ensayados en Windows entre la suite y las repeticiones dirigidas. Las precisiones de permisos POSIX y la rama de modos ejecutables Unix siguen incluidas en el pendiente Linux/macOS. Smoke final `node scripts/test-package.js`: tarball y ejecución npx/npm exec desde Git fijado a commit satisfactorios. Rechazo de la CLI pública bajo Node 22 comprobado. Sintaxis de módulos comprobada con node --check.

`node scripts/check-doc-links.js` comprobó 154 enlaces locales en 48 archivos Markdown; `git diff --check` satisfactorio y búsqueda de whitespace final en archivos nuevos sin coincidencias. La suite y los ensayos solo modificaron repositorios desechables. Durante la implementación original se preservaron los cuatro archivos preexistentes de 004 y no se prepararon cambios en el índice. El resguardo posterior autorizado actualiza únicamente la nota de alineación de 004 para registrar la rama compartida; PROJECT conserva la integración y las condiciones de 005.

## Límites y handoff

Node del host: 22.18.0. Se obtuvo Node 24.22.2 con npx y caché temporal, sin modificar dependencias del repositorio. La CLI pública rechaza Node <24. Los ensayos usan repositorios Git desechables y fallos simulados, no cortes eléctricos reales. El canal Git de npx se probó con un commit de un repositorio temporal que contiene el paquete; no demuestra descarga pública de archivos todavía sin commit.

No se han ejecutado runners Linux/macOS en esta sesión. Se intentó inventariar WSL (`Wsl/EnumerateDistros/Service/E_ACCESSDENIED`) y consultar Docker (API docker_engine y configuración inaccesibles bajo los permisos actuales); no se iniciaron servicios ni se alteraron permisos. Ejecutar `.github/workflows/installer-tests.yml` tras una publicación autorizada, o ejecutar `npm test` y `npm run test:package` en esos entornos. Preparar la matriz no cumple esa evidencia. Verification y Ship permanecen pendientes mientras falte R7; no declarar portabilidad completa ni inventar un commit verificado del instalador.

## Cierre

Sin Ship. El usuario autorizó después guardar 004 y 005 en `feat/install-update-cli` mediante commits locales para evitar retrabajo. Ese resguardo conserva los pendientes de Verification y no constituye entrega final. Push, PR, merge y publicación siguen fuera del alcance autorizado.

La alineación de 004 se guardó en `4da2372` (`docs: alinea cierre e integración de 004`), incluido únicamente el hunk de integración de PROJECT. El commit siguiente reúne la implementación y documentación de 005, junto con el resto del contexto de PROJECT. Revisión documental del resguardo: 154 enlaces locales satisfactorios y diff --check sin errores. No cambió código ejecutable desde las pruebas registradas; este resguardo no añade evidencia multiplataforma.
