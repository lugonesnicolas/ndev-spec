# Verification — 004

Estado: entregado; Verification satisfactoria y Ship completo, PR #4 abierto para revisión, sin merge. Implementation completa en `58f9d76`; producto documental y canon ensayados desde `63f3a380facb4a09259314f437c9d6fa9c294d13`; revisión verificada entregada `581c113f792e4cac77852508a9934ed16aa306f5`.

## Resultado y alcance comprobado

Las seis fases y nueve skills tienen entradas, outputs, gates y handoffs definidos. H1–H5 quedaron resueltos y no quedan hallazgos que impidan instalar, utilizar o evaluar la v1 manual dentro del alcance documentado. No hay build ni suite de producto; se aplicaron inspección normativa, aserciones de auxiliares temporales, Git y recorridos funcionales de la guía. Esto acredita preparación de la versión manual; no publicación ni validación de campo con usuarios.

## E1 — Auditoría del ciclo

La [matriz por fase](tasks.md#resultado-de-auditoría-por-fase) relaciona entradas, salidas, gate y handoff con las nueve skills. Se contrastó con workflow, reglas y arquitectura. H1 resuelto en las lecturas de analyze; H2 en protocolo transversal y sus nueve referencias; H3 en verify; H4 en guía/README; H5 en nota de integración de 003. Los ensayos E2–E6 contrastan su operabilidad. No se alteraron fases, niveles ni responsabilidades; no hay capacidad arquitectónica nueva pendiente dentro del alcance.

## E2 — Preguntas y bloqueos

- **Interacción real:** durante la planificación, la herramienta de preguntas recibió cuatro decisiones del usuario: versión manual, herramienta interactiva con alternativa por chat, entrega por PR y ejemplos PowerShell/Bash. Preguntas y respuestas están sintetizadas en [Specification](spec.md#aclaraciones), sin transcribir la conversación ni simular aprobación. El usuario pidió implementar ese plan.
- **Sin respuesta, simulado:** en el caso extendido se dejó Q1 sobre el campo JSON con opciones `status`/`result`, recomendación `status` y responsable pendiente. Se comprobó que no existía Plan y que el producto seguía devolviendo `ok\n`; no se implementó el trabajo bloqueado.
- **Alternativa por chat, simulada:** el responsable del ensayo eligió `status`; quedó registrado como respuesta simulada antes del Plan. No se atribuye esa decisión al usuario real.
- **Pregunta tardía, ejercicio simulado de inspección:** orden de resultados no definido durante Implementation; bloqueo del trabajo afectado, pregunta y retorno a Specification/clarify si cambia el contrato, con repetición de gates dependientes. No se ejecutó UI de un segundo proveedor ni se probó automáticamente la obediencia de otro agente.
- El protocolo exige investigar hechos descubribles primero; la inspección de skills y guía no encontró instrucciones que permitan tomar el silencio por aprobación o sustituir una decisión material por recomendación del agente.

## E3 — Instalación PowerShell y Bash

Se extrajeron de la guía los bloques P1–P8/B1–B8 y se ejecutaron con rutas temporales, una referencia exacta y un PROJECT propuesto para cada fixture. La preparación del contexto y su acuerdo son simulados para estos proyectos de ensayo. Los bloques son ejemplos manuales: las inspecciones y comparaciones adicionales indicadas en el texto también se aplicaron; no se presentan como un instalador autónomo.

Entorno: PowerShell 7, Git Bash 5.2.37, Git local y Node 22.18.0 como auxiliar de aserciones. Origen local estable de ensayo: `D:/repositorios/ndev-spec`. Revisión T: `63f3a380facb4a09259314f437c9d6fa9c294d13`. Extracción con `git -c core.autocrlf=false archive`, comprobación de cada archivo con `git hash-object --no-filters` y comparación de índice/modos/rutas con `ls-tree`; 21 archivos regulares por instalación. No se ocultaron conversiones de líneas al comparar blobs.

| Fixture | Resultado | Commit final del repositorio temporal |
| --- | --- | --- |
| PowerShell, nuevo | 21/21 archivos, procedencia T, árbol limpio | `6ee8ae34222b419a7cff57b61749ea48016fbd38` |
| PowerShell, existente | 21/21; README, AGENTS, src/main.txt y spec previa preservados; contexto de PROJECT intacto | `6dcbe870365b486abb91437198570c1cb104a591` |
| Git Bash, nuevo | 21/21 archivos, procedencia T, árbol limpio | `a0683690e38840dcccb55125382f5af2b35da239` |
| Git Bash, existente | 21/21 y las mismas cuatro rutas propias preservadas; contexto de PROJECT intacto | `ce4d0838a4990f9a5c48c7e6433f34c212eb99af` |

Los repositorios nuevos partieron de un commit vacío; los existentes, de contenido propio confirmado. En los existentes se ejercitó `core.autocrlf=true` y se compararon los blobs del índice con T; las extracciones temporales fueron exactas. El script auxiliar devolvió código 0 en los cuatro recorridos y las aserciones de preservación por SHA-256 pasaron. Los hashes de commits temporales son referencias locales de ensayo, no commits publicados del producto.

## E4 — Actualización, no-op, colisión y recuperación

B: `9789384098f21106261f125339263e62383866ee`; T: `63f3a380facb4a09259314f437c9d6fa9c294d13`, mismo origen. Ambos árboles se extrajeron y comprobaron contra sus blobs antes de aplicar.

| Caso | Acción y evidencia observada | Resultado |
| --- | --- | --- |
| Actualización | Instalación B confirmada; comparación B/L/T y reemplazo de archivos conocidos; PROJECT actualizado a T; índice idéntico al árbol T; cuatro archivos propios conservan SHA-256. Commit temporal `3fbbad1b958be05de9263258e3cfb43f981adf7e`. | Satisfactorio |
| Sin cambios | L=T y procedencia T; status vacío y HEAD anterior conservado. Sin escrituras ni commit vacío. | Satisfactorio |
| Interrupción | Copia T sobre B antes de editar PROJECT: se observó diff de .ai con PROJECT aún B. Se restauraron solo .ai/PROJECT al C temporal `9204be4d9cd5808b8e002c7a0a0a657aaeebcd38`; no había altas nuevas entre B y T. Índice, archivos y procedencia volvieron a B, status vacío. Luego se repitió la actualización correctamente. | Satisfactorio |
| Colisión ignorada | Se agregó .ai/private.md al inventario y a info/exclude: status limpio, pero ls-files --others --ignored lo mostró. Las guardas P6 y B6 devolvieron código 1 antes de copiar. El archivo y PROJECT conservaron SHA-256. | Bloqueo correcto, contenido preservado |

El texto de la guía cubre recuperación acotada de altas y bajas y tipos de rutas; este ensayo de actualización ejercitó modificaciones de archivos existentes, sin convertir archivos en directorios ni viceversa. No se declara probada una herramienta general para todos esos casos.

## E5 — Tres niveles y continuidad

Se prepararon tres repositorios locales con el canon T y contexto propio. Los registros se escribieron por fase antes de implementar; los puntos de reanudación se resolvieron releyendo artefactos y PROJECT. Se aplicaron las skills como instrucciones leídas, con un único agente y auxiliares dirigidos; no es un ensayo ciego con otro agente.

| Nivel | Ejercicio y comprobación | Evidencia final |
| --- | --- | --- |
| Mínimo | Un enlace interno de manual.md apuntaba a #instalacion cuando la sección era Instalar. R1/T1 exigían destino #instalar. Se comprobó enlace y encabezado con aserciones Node. Un spec.md de 234 palabras contiene Contrato/Aclaraciones, Plan, Tareas/Análisis, Verificación y Cierre. | Producto `6b0a9364bb09cad01ba5e4eb37c665ae5dffad8c`; cierre `a741cf5d8c6abb309e83e9d0f077f082854b87ac`. |
| Estándar | Dos documentos debían usar el término ya decidido Inspección. Aserciones comprobaron ambos y ausencia de Revisión. Tres archivos: spec.md, plan.md con Tareas/Análisis y verification.md con Cierre. | Producto `98140f502eff5d5faa528149988724d7a5e79088`; cierre `b52f2753ca8b0e6aa29140a7e9e4fd226045dae1`. |
| Extendido | CLI local report.cjs incorpora --json, preservando stdout sin argumentos. Cuatro archivos y decisión JSON previa a implementar. Cobertura inicial: R2 sin tarea; análisis bloqueó hasta agregar T2 y repetir Tasks. | Producto `18f4b8920dfc7650042f94b9259104fe32f474a8`; cierre `5e22af9107c844d27459bd247ae70a97a74a0647`. |

En el extendido se ejecutó `node report.cjs --json`, se analizó stdout con JSON.parse y se comprobó por separado la salida predeterminada exacta `ok\n`. Tras completar Implementation se inyectó el defecto `invalid-json`: Verification falló con SyntaxError real y bloqueó Ship. El fallo persistió; se reabrió T1, se corrigió en Implementation y la segunda ejecución produjo `{"status":"ok"}\n`, con regresión de texto satisfactoria. Todos los artefactos terminaron con cabeceras entregadas y cierres que referencian el commit anterior, sin autorreferencia.

## E6 — Formato, enlaces y presupuestos

Comprobación auxiliar temporal con Node: enlaces Markdown locales fuera de bloques de código, destinos y anclas; enlaces de .ai contenidos en .ai; frontmatter name/description y cinco secciones en cada skill; nueve referencias al protocolo; diff de preservación de 001/002 y diseño de instalación vacío. Fórmula `ceil(max(caracteres/4, palabras×1,5))`, texto LF; contexto fijo incluye skill más secciones completas del canon enlazadas en Lee, sin PROJECT, artefactos o código de consumidor.

| Skill | Tokens estimados | Contexto fijo estimado |
| --- | --- | --- |
| analyze | 372 | 972 |
| clarify | 399 | 956 |
| constitution | 539 | 1.139 |
| implement | 324 | 1.553 |
| plan | 372 | 1.718 |
| ship | 401 | 1.228 |
| specify | 370 | 1.960 |
| tasks | 257 | 781 |
| verify | 385 | 1.218 |

Todas cumplen ≤700/≤2.500. Son estimaciones, no mediciones con tokenizer. La medición incluye las lecturas transversales nuevas; no aumenta el presupuesto aprobado. `git diff 9789384 --check` satisfactorio. Revisión final: 127 enlaces locales/anclas sin errores; se repite tras el cierre. Los bloques de shell se comprobaron ejecutándolos en E3, no mediante el verificador de enlaces.

## E7 — Documentación, historia y preparación de Ship

La guía incluye los nueve prompts, tres niveles, puntos de parada, preguntas, evidencia, reanudación, instalación/actualización/recuperación y límites manuales. README remite a ella y al canon; PROJECT define entrega de 004. El árbol de origen 9789384 confirma el merge de PR #3, padres 43875b9/008e403; la nota de integración de 003 preserva su evidencia histórica. El diseño de 002 no cambió.

## Cobertura del contrato

| Requisito | Evidencia | Resultado |
| --- | --- | --- |
| R1 | E1, E5 y matriz de Tasks; H1–H5 resueltos, sin bloqueos de preparación v1. | Satisfactorio |
| R2 | E2 y protocolo leído por nueve skills; decisiones reales y ejercicios simulados diferenciados. | Satisfactorio |
| R3 | Decisión previa en ba96c6a; canon en 63f3a38; E1/E5/E6, neutralidad y presupuestos conservados. | Satisfactorio |
| R4 | Guía, E3/E4, cuatro instalaciones y mantenimiento con procedencia y preservación. | Satisfactorio en los entornos declarados |
| R5 | Nueve prompts y ejemplos revisados; E5 prueba ubicación de artefactos, continuidad, cobertura y retorno por fallo. | Satisfactorio |
| R6 | E6/E7; diff de preservación vacío y nota histórica contrastada con Git. | Satisfactorio |
| R7 | E1–E7, métodos, resultados y limitaciones persistidos aquí. | Satisfactorio |
| R8 — entrega | Rama publicada y PR #4 abierto contra main después de Verification; referencias y confirmación en Cierre. | Satisfactorio; Ship completo |

## Limitaciones

- Un único agente redactó y ejecutó los recorridos; QA y arquitectura realizaron revisión independiente posterior según la sección siguiente. Los ejercicios dirigidos no demuestran comportamiento consistente de todos los modelos ni sustituyen una evaluación de campo de usuarios. Chat, ausencia de respuesta y aclaración tardía son simulados; la interacción real de decisiones consta en Specification.
- Bash se ejecutó en Git Bash sobre Windows. WSL Bash no inició (Bash/Service/CreateInstance/E_ACCESSDENIED); Linux/macOS/WSL no se declaran comprobados. PowerShell 7 sí se ejecutó.
- No se ensayaron descarga remota, filtros personalizados, enlaces, transformaciones de atributos, cambios de formato de objetos ni escritores concurrentes. La guía exige detectarlos/detenerse según 002; no promete resolverlos automáticamente. Los ensayos usaron origen local y SHA-1; no hay instalador ni atomicidad de copia.
- Git emitió advertencias de lectura de un ignore global inaccesible. Se inspeccionaron inventarios locales completos y archivos ignorados de las fixtures; no se trató status como inventario completo ni se modificó configuración global.
- Auxiliares y repositorios de ensayo se conservan temporalmente fuera del producto, en una carpeta ndev-spec-004 bajo TEMP. Esta evidencia resume entradas, comandos y resultados reproducibles; sus commits locales no son enlaces públicos ni fuentes normativas.

## Revisión independiente

Aplicada la skill sdd-review como complemento del canon local, sin crear fuentes de verdad ni perfiles personales en el repositorio. Base revisada `9789384098f21106261f125339263e62383866ee`, HEAD `58f9d7631bf629e99869d6d7a90042b2c7134aae` más los cuatro registros documentales actuales de 004; el producto de 63f3a38 no cambió.

- **QA (personal-sdd-qa): ready para Ship**, sin hallazgos blocker/major/minor. Contrastó R1–R8 con diff completo, guía, canon, auxiliares y fixtures. Ejecutó independientemente static.cjs (127 enlaces, cero errores, máximos 539/1.960), `git diff 9789384 --check` (0), comprobó que el producto no difiere de 63f3a38, inspeccionó estados/commits de cuatro instalaciones y tres cambios, ejecutó el CLI extendido con/sin --json y contrastó la integración de 003. No recreó fixtures ni repitió las operaciones de copia.
- **Arquitectura (personal-sdd-architecture): ready**, sin hallazgos materiales. Revisó por lectura neutralidad, jerarquía, aislamiento, nueve skills, protocolo transversal y compatibilidad de la guía con 002. No ejecutó comandos ni repitió ensayos; la comparación de revisiones se apoyó en evidencia y resumen del autor.
- Ambas revisiones mantienen como siguiente gate la entrega real y actualización final de estados; no atribuyen a los ensayos validación universal de proveedores, sistemas operativos o casos de adquisición no ejecutados.

## Handoff

Gates de Specification, Plan, Tasks, Implementation, Verification y Ship cumplidos. Contrato y enfoque vigentes, sin bloqueos ni tareas de 004. Siguiente paso: revisión del PR #4 por el responsable; un merge requiere confirmación explícita y no forma parte de la entrega. No hay tag ni release publicada.

## Cierre

Entrega confirmada: rama `docs/v1-manual-readiness` publicada en origin con `581c113f792e4cac77852508a9934ed16aa306f5` (evidencia de Verification y revisiones independientes), y [PR #4](https://github.com/lugonesnicolas/ndev-spec/pull/4) abierto contra `main`, con título y descripción en español. El conector confirmó estado open, draft=false, merged=false, base main en 9789384 y head en 581c113. El producto y canon son los ensayados de 63f3a38; los commits posteriores solo actualizan los registros de 004.

Este cierre se incorpora en un commit documental posterior al entregado y se publica en el mismo PR. Se comprobaron las cabeceras y handoffs de los cuatro artefactos: todos reflejan entrega completa, sin tareas pendientes y con la misma referencia verificada. Enlaces locales/anclas: 127, sin errores; diff --check satisfactorio. No se ejecutó merge, tag ni release. La revisión/decisión de integración queda al responsable y es compatible con Ship completo según el contrato.
