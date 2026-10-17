# 002 — Diseño de instalación y actualización

Estado: Specification completa; gate de salida cumplido. Contrato aprobado por el usuario antes de su persistencia.

## Contrato

Diseñar y comprobar un procedimiento manual de instalación y actualización de ndev-spec para proyectos nuevos y existentes. El producto de este cambio es documentación: decisiones, pasos operables y evidencia de ensayos; no un instalador. Cada consumidor conserva una copia versionada y exacta de `.ai/`, con contexto propio fuera del canon.

| ID | Requisito y criterio verificable |
| --- | --- |
| R1 | Distribuir solo `.ai/` desde un commit completo de un origen Git remoto o local elegido, incluidos forks. Documentar resolución de referencias, comprobación de extracción, confianza y operación sin red con objetos disponibles. Un origen o revisión inválidos bloquean antes de escribir. |
| R2 | Usar una única sección `## ndev-spec` de `PROJECT.md`, con `Origen` sin credenciales y `Revisión` como OID completo. Preservar el resto del contrato; no introducir lockfile ni manifiesto. Bloquear registros ausentes o ambiguos en actualizaciones; permitir adopción explícita de una copia idéntica. |
| R3 | Exigir Git, un commit de recuperación y árbol e índice limpios antes de aplicar. Preservar `PROJECT.md`, `specs/`, instrucciones de agentes y archivos ajenos. Ensayar instalaciones nueva y existente y revisar colisiones antes de copiar. |
| R4 | Detectar contenido oculto, ignorado y no rastreado, conflictos archivo/directorio, diferencias de mayúsculas incompatibles y enlaces. Rechazar enlaces, submódulos y representaciones incompatibles; no seguir junctions ni escribir fuera de las rutas revisadas. |
| R5 | Comparar B (revisión registrada), L (copia local) y T (destino). Mostrar B→L, B→T y el resultado propuesto, incluida procedencia, antes de aplicar. Revalidar el destino inmediatamente antes de escribir; comprobar altas, cambios, bajas, repetición sin cambios y regreso explícito a una revisión anterior del mismo origen. |
| R6 | Bloquear divergencias locales, incluidas adiciones y eliminaciones; respaldarlas antes de resolverlas. No hacer merges automáticos ni mantener variantes dentro del canon. Solo borrar rutas reconocidas de B ausentes en T. Ensayar resolución sin pérdida y resultado equivalente a T. |
| R7 | Definir equivalencia por contenido versionado y ausencia de cambios locales, admitiendo LF/CRLF de Git. Bloquear filtros o conversiones que impidan demostrarla. Ensayar conversión de finales de línea y rechazo de transformaciones adicionales. |
| R8 | Documentar y ensayar interrupción parcial, recuperación acotada, fallo de validación o commit y cambios posteriores a la revisión. No prometer atomicidad; canon y procedencia deben quedar coherentes antes de dar por terminada la operación. No reescribir historia para recuperar una actualización confirmada. |
| R9 | Documentar decisiones antes de los cambios derivados, comparar alternativas y proporcionar una experiencia manual sin herramientas de ndev-spec. Alinear adopción, README y contrato del repositorio; mantener el canon neutral y autocontenido, sin cambiar sus reglas ni introducir interfaces ejecutables. |
| R10 | Registrar evidencia por R1–R9 en Verification: ensayos temporales, revisión normativa, enlaces, `git diff --check` y preservación de ramas/canon. Distinguir pruebas ejecutadas, inspección y límites; no presentar los ensayos como prueba de un instalador. |

## Alcance y entrega

La procedencia se mantiene en `PROJECT.md`, Git es requisito de este mecanismo y el resultado instalado es canon exacto. Se admite un origen elegido y actualizaciones dentro de él; migrar a otro origen queda fuera de alcance. Una copia local comprobada del origen permite trabajar sin red. El uso cotidiano del harness no requiere Git ni acceso al origen.

No se implementan instalador, comandos, adapters, plantillas, automatizaciones, paquetes ni gates automáticos; tampoco se elige lenguaje o CLI. Su implementación futura requiere otra spec y sus gates. Los ensayos usan repositorios temporales; sus auxiliares no forman parte del producto.

Ship requiere commits locales coherentes en `docs/install-update-design`, creada desde `de238169dd7eda60404de40523e6440497356dce`, después de Verification satisfactoria. No requiere push, PR ni integración. Se preservan `docs/readme-manual-sdd` en ese commit y `main` en `8cc6e8c1ace667cb92f8bd91725dff7f591837bc`. El cierre posterior registra el commit entregado sin autorreferencia.

## Handoff

Se revisaron AGENTS, PROJECT, canon, reglas, arquitectura y Git. Única spec previa: `001`; siguiente número revalidado: `002`. No había cambios locales. Las decisiones de producto quedaron resueltas por el usuario: procedencia en PROJECT, canon exacto, Git obligatorio, origen elegido y entrega local. Siguiente fase: persistir Plan y decisión arquitectónica; todavía no se han ejecutado cambios de producto.
