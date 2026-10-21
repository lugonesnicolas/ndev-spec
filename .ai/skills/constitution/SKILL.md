---
name: constitution
description: Redactar o actualizar el contexto del proyecto en PROJECT.md, para un proyecto nuevo o con desarrollo previo, antes de abrir cambios.
---

# constitution

## Lee

- [Jerarquía de fuentes](../../README.md#jerarquía-de-fuentes-de-verdad) y [Canon y contexto del proyecto](../../README.md#canon-y-contexto-del-proyecto).
- `PROJECT.md` si existe y las instrucciones de agentes del repositorio.
- Proyecto existente: solo lo necesario para relevarlo (README, manifiestos de dependencias, configuración de build, test y CI, estructura de primer nivel). No recorrer todo el código.

## Produce

`PROJECT.md` en la raíz, propiedad del proyecto, breve y con estas secciones:

- Propósito y etapa actual.
- Contexto técnico y restricciones: stack, convenciones y decisiones vigentes.
- Comprobaciones: comandos reales de build, test y lint, o constancia de que no existen.
- Entrega: mecanismo de Ship (ramas, PR, release, despliegue y confirmaciones requeridas) o constancia de que está pendiente.

## Pasos

1. Determinar el caso: proyecto nuevo o con desarrollo previo.
2. Con desarrollo previo: relevar y registrar solo hechos observados, con su fuente. Lo inferido se marca como supuesto a confirmar.
3. Proyecto nuevo: preguntar propósito, stack previsto, comprobaciones y entrega. No inventarlos.
4. Si `PROJECT.md` existe, proponer la edición como diferencia y preservar el resto, incluida la sección `## ndev-spec`.
5. Presentar el resultado al responsable y persistirlo con su acuerdo.

## Gate

`PROJECT.md` cubre propósito, restricciones, comprobaciones y entrega, o declara sus pendientes. No contradice el canon, no deja supuestos sin marcar y preserva el contenido previo ajeno.

## No hacer

- Copiar o modificar `.ai/`, ni crear o editar la sección `## ndev-spec`: corresponden al procedimiento de instalación y actualización publicado en el repositorio de origen de ndev-spec.
- Redefinir reglas del canon en `PROJECT.md`.
- Modificar instrucciones de agentes, specs o código existentes.
- Abrir cambios: eso corresponde a `specify`.
