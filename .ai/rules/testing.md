# Testing

Estas reglas orientan las pruebas y la evidencia de cumplimiento del cambio.

- Los tests se DEBEN alinear con los criterios de aceptación de la especificación; su cobertura se DEBE relacionar con esos criterios.
- Se DEBE distinguir la ejecución de tests de la verificación funcional. Los tests exitosos aportan evidencia, pero no demuestran por sí solos el cumplimiento de todos los requisitos y criterios. Se DEBEN utilizar otros métodos cuando sean necesarios para comprobarlos, conforme a [Verification en el workflow SDD](../workflow.md#5-verification).
- Se DEBEN incluir pruebas de regresión cuando el cambio pueda afectar comportamiento existente que deba preservarse.
- Las limitaciones de pruebas y verificación, incluidos criterios sin comprobar o cobertura parcial, se DEBEN registrar junto con la evidencia en `verification.md`, según el workflow.
- No se DEBE declarar éxito si la evidencia registrada no lo soporta. Un test no ejecutado o un criterio sin comprobar no se DEBE presentar como satisfactorio.
