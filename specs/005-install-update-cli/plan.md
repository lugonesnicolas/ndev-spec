# Plan — 005

Estado: Plan e Implementation cumplidos; Verification parcial y Ship pendiente. Contrato: [spec.md](spec.md). Decisión previa: [CLI](../../docs/architecture/installer-cli.md).

## Enfoque

CLI y motor separados, stdlib Node. Motor prepara snapshots Git en temporal, valida destino, genera propuesta y aplica con revalidación y rollback por ruta. Parser estricto, readline para confirmar, sin confirmación implícita en stdin no interactivo. Pruebas usan repos locales desechables y fallos inyectados desde API interna; ninguna opción pública de inyección.

Ajuste R1: separar resumen y detalle en el renderer de CLI. Resumen agrupa altas/modificaciones/bajas de .ai; explica creación de PROJECT/AGENTS; para archivos locales existentes muestra solo líneas cambiadas y omisiones, sin copiar secciones ajenas. --diff habilita inventario y contenido completo sin comillas JSON, manteniendo escapes para controles de terminal y metadatos de binarios/modos. Probar salida acotada con canon grande y contexto externo grande, flags combinados, no-op, dry-run y cancelación; motor sin cambios.

## Verificación por criterio

R1: parser, ayuda, confirmación/cancelación, dry-run y smoke de paquete npx local sin publicación. R2/R5: fixtures Git con revisiones y blobs conocidos, procedencia/preservación, update/rollback/no-op y divergencias confirmadas. R3: adapter delimitado, conservación y bloque alterado. R4: índice/HEAD antes/después, ignorados, enlaces, atributos y Git sin HEAD. R6: fallos inyectados, respaldo y cambios concurrentes. R7: node:test y matriz de SO con smoke npx; comprobación documental/enlaces/diff. R8: revisar diff/índice y guardar 004 y 005 en commits separados dentro de `feat/install-update-cli`, conforme a la ampliación autorizada; sin publicación ni declaración de Ship.

Dependencias externas de ejecución: Node >=24 y Git. El entorno actual tiene Node 22: se intentará ejecución con Node 24 mediante npm; si no es accesible, se registrará límite y no se afirmará verificación completa. Windows está disponible; Linux/macOS requieren runners externos. Ningún éxito local sustituye esa evidencia.

## Handoff

Plan y Tasks ejecutados conforme a la decisión previa. Pruebas locales y paquete satisfactorios; continuar con la evidencia Linux/macOS de [Verification](verification.md). Sin Ship mientras ese criterio siga pendiente. Cambios preexistentes de 004 preservados.
