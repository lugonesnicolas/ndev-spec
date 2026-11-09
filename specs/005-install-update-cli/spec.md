# 005 — Instalación y actualización sencilla

Nivel: extendido; introduce una interfaz ejecutable, distribución y adapter. Estado: Specification, Plan, Tasks e Implementation cumplidas; Verification parcial y Ship pendiente. Responsable: usuario, aprobación explícita del plan en la solicitud de implementación.

## Contrato

| ID | Requisito y criterio verificable |
| --- | --- |
| R1 | CLI JavaScript sin dependencias de ejecución ni compilación; Node >=24 y Git; ejecutable mediante npx desde un commit Git. `init [directorio]` y `update [directorio]`, `--ref`, `init --source`, `--dry-run`, `--diff`, `--yes` y ayuda. Salida predeterminada breve: destino/origen/revisión, conteos de cambios del canon y propósito de PROJECT/AGENTS nuevos; cambios concretos de archivos locales existentes sin repetir contenido externo. --diff muestra inventario y contenido anterior/propuesto completo. Confirmación antes de escribir; dry-run indica que no aplicó cambios. |
| R2 | Copiar exclusivamente el árbol .ai de un commit comprobado, con ocultos y placeholders; procedencia única en PROJECT, preservando contexto ajeno. Sin PROJECT, declarar pendientes sin inferirlos. HEAD por defecto y OID completo persistido. Origen local o remoto explícito; update conserva origen. |
| R3 | Entrada delimitada en AGENTS que referencia canon/contexto/skills; preservar contenido externo y comprobar bloque gestionado antes de actualizar. Detectar conflictos observables y advertir que contradicciones semánticas arbitrarias requieren revisión humana. Mostrar constitution al terminar. |
| R4 | Inicializar Git si falta, exigir limpieza en repos existentes; no commits, stage, stash, ramas ni publicación. Detectar colisiones ignoradas, rutas/enlaces y atributos incompatibles. Preparación externa y revalidación anterior a escrituras. |
| R5 | Actualizar B/L/T comprobando blobs, rutas y procedencia incluso frente a divergencias confirmadas; permitir retroceso y no-op. Rechazar contenido desconocido. |
| R6 | Recuperación acotada con respaldo externo: ante fallo restaurar solo estado propio sin cambios posteriores; preservar evidencia si no es seguro. Verificar canon y archivos propios antes de éxito; indicar commit pendiente. |
| R7 | Pruebas automatizadas de comportamiento, paquete npx y matriz Windows/Linux/macOS; registrar lo ejecutado y las limitaciones sin declarar plataformas no ensayadas. Guía, README y PROJECT coherentes. |
| R8 | Conservar alineación de 004 e implementación de 005 en `feat/install-update-cli`. Publicar la rama y abrir PR en español contra main, como borrador mientras Verification siga parcial, para revisión y pruebas remotas. Registrar rama, commit y PR. Sin merge/tag/release ni publicación npm. Publicar para verificar no declara Ship ni supera sus gates. |

## Alcance y aclaraciones

Las decisiones de la conversación están aprobadas: Node+Git, Git como canal inicial, AGENTS, init/update, revisión interactiva y --yes, tres plataformas, commit delegado. No hay preguntas materiales pendientes para implementar. La portabilidad debe probarse: una matriz preparada no equivale a ejecución satisfactoria. El commit del instalador distribuible solo podrá fijarse tras una entrega versionada futura; no se inventará un OID de archivos aún sin commit.

No se alteran fases ni gates SDD. Sin adapters específicos, actualización de origen, publicación npm ni reconstrucción de specs históricas.

Ampliación autorizada por el usuario el 9 de noviembre de 2026: guardar la alineación de 004 y la CLI de 005 en una misma rama para evitar retrabajo. Reemplaza la restricción inicial de no crear commits locales; no autoriza publicación ni cambia el pendiente de verificación multiplataforma. Responsable: usuario; requisito afectado: R8.

Ajuste de usabilidad solicitado por el usuario tras cancelar la instalación para revisar su salida: reducir el mensaje a información concreta, entendible y fácil de seguir. Se adopta resumen predeterminado y detalle optativo mediante --diff; no se cambia preparación, aplicación, recuperación ni confirmación. Responsable: usuario; requisito afectado: R1.

Corrección derivada del ensayo del usuario: repetir init con --source equivalente al origen registrado debe aceptarse; solo una diferencia real bloquea. Las rutas locales se comparan tras resolver su ubicación canónica; no se infiere equivalencia entre URLs diferentes. Se mantiene la selección HEAD por defecto y el requisito de usar update para cambiar una revisión instalada. R2/R5; sin decisión arquitectónica nueva.

Autorización posterior del usuario: publicar la rama y abrir el PR para probar adquisición desde GitHub y ejecutar la matriz. Sustituye el límite anterior de resguardo solo local; R8. No autoriza merge, tag, release ni declarar Verification/Ship completos. Los gates pendientes permanecen explícitos.

## Handoff

Specification, Plan, Tasks e Implementation cumplidas. Decisión documentada antes del código; pruebas locales satisfactorias. [Verification](verification.md) conserva evidencia y pendientes; su gate de salida y Ship siguen sin cumplir. Publicación de rama y PR autorizada para revisión y ejecución de pruebas remotas; sin release ni versión estable declarada.
