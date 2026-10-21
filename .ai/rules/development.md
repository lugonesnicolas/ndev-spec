# Desarrollo

Estas reglas orientan la ejecución de los cambios definidos por el contrato.

- Se DEBE implementar contra `spec.md`, `plan.md` y `tasks.md` vigentes y coherentes, según [Implementation en el workflow SDD](../workflow.md#4-implementation).
- No se DEBEN cambiar requisitos durante la implementación. Si el contrato necesita cambiar, se DEBE seguir el proceso de actualización de artefactos y gates del [workflow SDD](../workflow.md#reglas-transversales) antes de continuar el trabajo afectado.
- Los cambios se DEBEN limitar al alcance definido en la especificación y desarrollado en el Plan y las Tasks.
- Se DEBE preservar la compatibilidad existente salvo que la especificación establezca lo contrario.
- No se DEBEN ocultar errores ni introducir workarounds silenciosos. Los errores y bloqueos relevantes se DEBEN hacer visibles y registrar en el estado del trabajo.
