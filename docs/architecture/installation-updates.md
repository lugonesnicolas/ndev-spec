# Instalación y actualización de una copia exacta

Estado: decisión vigente para [002](../../specs/002-install-update-design/spec.md), registrada durante Plan antes de los cambios documentales derivados. El mecanismo es manual; no existe instalador ni interfaz de comandos de ndev-spec.

## Contexto y alternativas

Esta decisión amplía [adopción portable](adoption.md). `.ai/` sigue siendo el único contenido distribuido; el contexto y las evidencias del consumidor permanecen fuera. El [workflow](../../.ai/workflow.md) no cambia: exigir Git para este mecanismo no convierte Git en requisito del ciclo metodológico ni de la lectura cotidiana del canon.

| Alternativa | Decisión y costo aceptado |
| --- | --- |
| Copia versionada, instalación global, submódulo o subtree | Copia versionada: lectura autónoma y diff ordinario. Evita resolución global y gestión de enlaces o merges de subtree, a cambio de conservar el canon en cada consumidor. |
| Procedencia en PROJECT o manifiesto separado | Una sección de PROJECT mantiene la decisión vigente sin duplicar estado. La revisión y edición son manuales; un parser futuro requerirá su propio contrato. |
| Canon exacto o variantes locales reconciliadas | Canon exacto. No hay merges automáticos ni overlays dentro de `.ai/`; resolver divergencias puede requerir intervención humana y una nueva revisión del origen. |
| Git manual o paquete/CLI automatizados | Git manual primero. No se agregan runtimes ni servicios. Empaquetado, firma, sintaxis de comandos y automatización quedan para otro cambio. |

## Unidad distribuida y procedencia

El origen es un repositorio Git remoto o local elegido explícitamente, incluido un fork. El usuario evalúa su confianza; un OID prueba identidad de contenido, no autoría ni legitimidad. No ejecutar código, hooks ni configuraciones provenientes del origen para extraer el canon. No registrar credenciales ni tokens en contratos o evidencias.

Una rama o tag solo ayuda a seleccionar: resolverlo a un commit y usar su OID completo en todas las operaciones siguientes. No asumir longitud fija del OID ni usar abreviaturas, `latest` o referencias móviles como revisión instalada. Obtener objetos desde un origen remoto requiere conectividad; un repositorio local que contenga los objetos comprobados permite el mismo procedimiento sin red. No cambiar el origen registrado por la ruta temporal de ese repositorio. Si no puede establecerse su correspondencia con el origen, detenerse.

Distribuir únicamente el árbol `.ai/` de ese commit, incluidos archivos ocultos y placeholders. La extracción debe comprobarse contra rutas, tipos y blobs del árbol Git: un archivo generado desde una copia de trabajo, un export con omisiones o sustituciones, o una descarga sin procedencia demostrable no bastan. Solo se admiten archivos regulares y modos representables en el consumidor; rechazar symlinks, gitlinks/submódulos, rutas incompatibles y conversiones no verificables antes de escribir. No seguir enlaces ni junctions del destino o de sus rutas de acceso.

En el consumidor, mantener exactamente una sección de nivel dos con este contenido mínimo (los marcadores se sustituyen por valores reales):

```markdown
## ndev-spec

- Origen: <URL sin credenciales o ruta del repositorio de origen>
- Revisión: <OID completo del commit instalado>
```

No exigir posiciones fijas ni reformatear el resto de PROJECT. Conservar su contenido fuera de esta sección. Un registro duplicado, incompleto o incompatible con la copia local bloquea la actualización. Un consumidor anterior puede adoptar este registro tras revisión humana de su procedencia y demostración de equivalencia; no adivinar una base a partir de archivos parecidos. ndev-spec es el repositorio de origen, no un consumidor de sí mismo: conserva el registro de entregas en Verification, sin agregar un OID autorreferente a su PROJECT.

## Propiedad y precondiciones

Git debe estar disponible, con un commit de recuperación C y árbol e índice limpios. En un proyecto nuevo inicializar el repositorio y crear un commit inicial, vacío si corresponde. En uno existente, el usuario resuelve sus cambios previos antes de continuar; no hacer stash, commit ni limpieza automáticos. Revisar además archivos ignorados y no rastreados, porque un status limpio no prueba ausencia de colisiones.

`PROJECT.md`, `specs/`, documentación e instrucciones de agentes son del consumidor. No copiarlos desde el origen ni modificar adapters. Si falta PROJECT, el consumidor redacta su contexto y condiciones de entrega; se revisa junto con la procedencia antes de incorporarlo. Si existe, detener la copia hasta revisar y acordar la edición de su sección de procedencia. No reemplazar el contrato completo.

Si existe `.ai/` sin instalación reconocida, bloquear la copia directa. Se permite adopción explícita solo cuando coincide con una revisión demostrada. En otro caso, conservar y resolver el contenido primero. Esto incluye un archivo llamado `.ai`, archivos ignorados/ocultos adicionales, una variante `.AI` que colisione en el sistema destino y obstáculos en directorios intermedios. Enumerar sin seguir enlaces y comprobar representabilidad de las rutas del origen en el sistema destino, incluidas colisiones entre mayúsculas/minúsculas. No eliminar contenido desconocido para hacer espacio.

## Comparación y resolución

B es el árbol de la revisión registrada; L comprende índice, archivos locales e inventario completo de `.ai/`; T es el árbol del commit destino. Obtener B y T antes de escribir. La actualización conserva el origen; migrarlo requiere otro diseño. No se exige que T descienda de B: una revisión anterior del mismo origen es una selección explícita válida.

La equivalencia exige mismas rutas, tipos y contenido versionado; los modos deben conservarse cuando sean significativos y representables. Comprobar blobs de Git además de la ausencia de modificaciones entre índice y copia de trabajo: un cambio local ya confirmado también es divergencia respecto de B. Para comparar repositorios con distintos formatos de objetos, comparar contenido de blobs, no sus identificadores entre formatos.

Se admite exclusivamente la conversión LF/CRLF de texto realizada por Git y comprobable en el índice. No normalizar contenido arbitrariamente ni ocultar cambios de líneas mixtas o archivos binarios. Revisar atributos efectivos y configuración del consumidor: filtros clean/smudge, `working-tree-encoding`, `ident` u otras transformaciones que impidan identidad bloquean. No desactivar controles existentes para continuar. Un cambio de atributos o configuración entre revisión y aplicación invalida la propuesta.

Mostrar B→L (divergencias), B→T (cambio del origen) y L→resultado propuesto, incluida la sección de PROJECT. El inventario debe mostrar altas, modificaciones y bajas, no solo el diff de archivos rastreados. Para una instalación sin B, mostrar todas las incorporaciones y la edición del contrato. Si L equivale a B y T es la misma revisión, la operación es sin cambios; si solo cambia el commit pero el canon es idéntico, revisar también esa actualización de procedencia.

Una divergencia bloquea el reemplazo. Conservar primero sus archivos y una referencia recuperable. Resolver explícitamente mediante descarte respaldado, traslado de contexto compatible fuera del core, o propuesta al origen. Una regla incompatible no se vuelve válida por moverla a PROJECT. Si el origen acepta la modificación y produce T, conservar el respaldo y restablecer L a B antes de retomar el procedimiento normal; no usar L divergente como base implícita. Repetir todas las comparaciones después de resolver. Nunca mantener una variante dentro del canon ni hacer un merge automático.

Solo se pueden eliminar rutas reconocidas de B que falten en T. Un contenido desconocido bloquea, incluso si está ignorado. Si T convierte una ruta de archivo en directorio o viceversa, comprobar que cada ruta desplazada pertenece a B y que no se pierde contenido ajeno. Revalidar C, índice, archivos, inventario, procedencia y atributos inmediatamente antes de aplicar. Cualquier cambio posterior a la revisión exige revisar nuevamente; no hay bloqueo de concurrencia automático.

## Fallos y recuperación

Antes de aplicar, mantener fuera del consumidor las extracciones comprobadas y una lista temporal de rutas que se crearán, editarán o eliminarán, junto con C y el estado revisado. No es un manifiesto persistente ni una nueva fuente de verdad. Conservarlos hasta verificar el commit final. Las credenciales y archivos ajenos no entran en ese material.

| Fallo o condición | Resultado y recuperación |
| --- | --- |
| Origen/revisión/base inaccesibles, extracción incompleta, colisión o divergencia | Detener antes de la primera escritura al consumidor; corregir la causa y repetir preparación y revisión. No inferir B ni bajar silenciosamente a otra revisión. |
| Cambio del destino después de revisar | Invalidar la propuesta. Si ya hubo escrituras, guardar el estado parcial y revisar el cambio concurrente antes de restaurar o continuar. |
| Interrupción durante copia o edición de procedencia | Operación pendiente, aunque una mitad parezca correcta. Comparar con C y el material preparado; restaurar solo las rutas de la operación o completar el resultado revisado tras nueva comprobación. |
| Recuperación antes del commit | Restaurar desde C el contenido y el estado del índice de las rutas afectadas que existían. Retirar solo incorporaciones identificadas por la operación y cuyos contenidos no hayan cambiado después. No usar reset global, clean general ni borrado recursivo indiscriminado. Si hay cambios posteriores, detenerse para preservarlos. |
| Validación o commit fallidos | No anunciar éxito ni adelantar la revisión registrada como instalada. Conservar el estado pendiente y evidencia, corregir y verificar de nuevo o restaurar el conjunto afectado. Un hook puede haber modificado archivos: inspeccionarlos antes de reintentar. |
| Recuperación después del commit | Crear un nuevo cambio explícito al commit anterior mediante este mismo procedimiento y su revisión; no resetear historia ni hacer force push. |

No se garantiza atomicidad de archivos ni protección frente a escritores concurrentes durante la copia. Coordinar acceso exclusivo durante la aplicación manual, volver a validar antes y después, y detenerse si se detecta concurrencia. El commit final reúne canon y procedencia coherentes. No tratar una instalación parcial como canon disponible para trabajo cotidiano.

## Límites y siguiente etapa

El diseño no cambia `.ai/`, su jerarquía o sus gates. Esta documentación de adquisición y mantenimiento se consulta cuando corresponde; no hace falta copiarla ni consultar el origen para aplicar cotidianamente la metodología. Adapters, migración de origen, firma de distribuciones, soporte de enlaces y automatización siguen fuera de esta versión. Un instalador futuro requerirá nueva spec, conservará estos controles observables y no podrá declararse probado por los ensayos manuales de 002.
