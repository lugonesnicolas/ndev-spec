# Workflow SDD

Este documento define el workflow normativo del harness ndev-spec. Es neutral respecto de proveedores, modelos y herramientas, y se aplica respetando [la jerarquía del canon](README.md#jerarquía-de-fuentes-de-verdad).

El ciclo base es `Specification → Plan → Tasks → Implementation → Verification → Ship`.

## Reglas transversales

- No se DEBEN implementar cambios de producto antes de completar Specification y Plan, ni antes de cumplir el gate de entrada de Implementation, incluida la preparación de Tasks.
- Cada gate de entrada y salida DEBE cumplirse antes de avanzar. Registrar un bloqueo no equivale a superar un gate.
- Cada fase DEBE dejar un handoff persistente en el repositorio: resultado, estado, decisiones relevantes, bloqueos si existen y siguiente paso. Otro agente DEBE poder continuar usando esos archivos y sus referencias, sin depender del historial conversacional.
- Los artefactos DEBEN mantenerse vigentes y coherentes. Si cambian requisitos o decisiones, se DEBEN actualizar los artefactos afectados y repetir sus gates antes de continuar. Un agente no DEBE alterar requisitos para simplificar la implementación.
- Una ambigüedad material DEBE resolverse antes de implementar el trabajo afectado. Las decisiones arquitectónicas necesarias DEBEN documentarse antes de implementarse.
- Ante un fallo de Verification, se DEBE persistir la evidencia, regresar a la fase correspondiente para corregirlo y verificar nuevamente. Ship permanece bloqueado mientras no se cumplan los criterios.
- Los gates de esta etapa son condiciones documentales evaluables; su automatización queda para stages futuros. Ningún gate exige un proveedor, modelo, comando o herramienta específicos.

## Artefactos del cambio

La convención es `specs/<número>-<nombre-kebab-case>/`, por ejemplo `specs/001-readme-manual-sdd/`. La secuencia se lleva por repositorio: comienza en `001`, usa al menos tres dígitos y continúa `999`, `1000` sin límite fijo. Para crear un cambio, se toma el mayor número de los directorios de cambio existentes y se suma uno; se ignoran placeholders y no se rellenan huecos. Los cambios cancelados conservan su directorio y estado, y sus números no se reutilizan. Si dos ramas crean el mismo número, antes de integrar se renumera el cambio entrante y se actualizan sus referencias. El identificador no determina prioridad, dependencias ni nombre de rama; no requiere contador o comando.

Cada artefacto se crea al trabajar su fase y se actualiza cuando corresponde. Los archivos que existen dependen del [nivel del cambio](#niveles-de-cambio); en el nivel extendido son:

| Archivo | Contenido persistido |
| --- | --- |
| `spec.md` | Contrato funcional de Specification. |
| `plan.md` | Enfoque y decisiones de Plan. |
| `tasks.md` | Unidades ejecutables de Tasks y estado de Implementation. |
| `verification.md` | Evidencias y resultados de Verification; sección de cierre de Ship. |

El contenido DEBE ser suficiente para evaluar los gates y continuar el trabajo. Su profundidad se adapta al cambio; no se impone una plantilla ni PRD/TRD/QRD como formato obligatorio. El estado y handoff de cada fase se registran de forma breve en su artefacto. No se exige una herramienta para crear o mantener los archivos.

## Niveles de cambio

El nivel decide dónde se registra cada fase; no elimina fases ni gates. Se clasifica al iniciar Specification y se registra con su motivo en la cabecera de `spec.md`.

- **Extendido** si se cumple cualquiera de estas condiciones: requiere una decisión arquitectónica; cambia una interfaz o contrato público, un formato de datos persistido o el canon; afecta límites de confianza o seguridad; incorpora una dependencia; requiere migración.
- **Mínimo** si se cumplen todas: ninguna condición de extendido; hasta 3 requisitos; hasta 3 tareas; un solo componente o documento; reversible con un único commit.
- **Estándar**: el resto de los casos.

| Nivel | Archivos | Registro de las fases |
| --- | --- | --- |
| Mínimo | `spec.md` | Secciones `Contrato`, `Plan`, `Tareas`, `Verificación` y `Cierre`. |
| Estándar | `spec.md`, `plan.md`, `verification.md` | Tareas como sección de `plan.md`; Ship en la sección de cierre de `verification.md`. |
| Extendido | Los cuatro de la tabla anterior y una decisión en la documentación arquitectónica del proyecto | Un archivo por fase; Ship en `verification.md`. |

Cuando una fase indica un archivo como output, en los niveles mínimo y estándar se entiende la sección correspondiente; su gate se evalúa sobre esa sección. Contenido mínimo de cada registro:

| Registro | Contenido mínimo | No contiene |
| --- | --- | --- |
| Contrato | Nivel y motivo; requisitos con criterio verificable; alcance y límites; aclaraciones o constancia de que no hacen falta; handoff. | Diseño de la solución ni tareas. |
| Plan | Enfoque; decisiones o sus referencias; dependencias; cómo se verificará cada criterio; handoff. | Requisitos nuevos ni alternativas fuera de la decisión arquitectónica. |
| Tareas | Unidades con requisito, dependencias, criterio de finalización y estado; análisis de coherencia y cobertura; handoff. | Pasos triviales ni código. |
| Verificación | Evidencia o referencia por criterio, método, resultado, desviaciones y límites; handoff. | Salidas completas sin relación con un criterio. |
| Cierre | Resultado de la entrega, referencia, pendientes y handoff final. | Cambios de producto. |

Ningún registro copia el canon ni transcribe conversaciones. Si en cualquier fase aparece una condición de un nivel superior, se reclasifica, se registra el motivo, se trasladan las secciones a los archivos del nuevo nivel y se repiten los gates afectados. Solo se puede bajar de nivel antes del gate de salida de Plan. Los cambios ya registrados con los cuatro archivos y su decisión son válidos como nivel extendido.

## 1. Specification

- **Propósito:** establecer el contrato funcional del cambio: qué comportamiento se requiere, su alcance y cómo comprobar su cumplimiento.
- **Inputs mínimos:** solicitud del cambio y contexto relevante del proyecto, incluidas las restricciones conocidas.
- **Output persistido:** `spec.md` con nivel, requisitos, alcance, límites, criterios verificables, aclaraciones y handoff.
- **Gate de entrada:** la solicitud y el contexto relevante están disponibles para definir el contrato.
- **Gate de salida:** el contrato está persistido con su nivel, sus requisitos tienen criterios verificables, las ambigüedades materiales detectadas están aclaradas y registradas (o consta que no las hay) y no queda ninguna que impida planificar o implementar.
- **Qué NO debe hacerse todavía:** implementar cambios de producto, sustituir el contrato por inferencias del agente o imponer PRD/TRD/QRD al core.

## 2. Plan

- **Propósito:** definir cómo satisfacer el contrato funcional y cómo comprobar el resultado.
- **Inputs mínimos:** `spec.md` vigente y contexto técnico pertinente del proyecto.
- **Output persistido:** `plan.md` con enfoque, decisiones necesarias, dependencias, estrategia de verificación y handoff; referencias a las decisiones arquitectónicas aplicables.
- **Gate de entrada:** el gate de salida de Specification está cumplido y su contrato sigue vigente.
- **Gate de salida:** el Plan es coherente con Specification, cubre sus requisitos, registra las decisiones necesarias y permite derivar tareas sin decisiones materiales abiertas.
- **Qué NO debe hacerse todavía:** implementar cambios de producto, omitir decisiones arquitectónicas necesarias o modificar requisitos para acomodarlos al enfoque elegido.

## 3. Tasks

- **Propósito:** transformar el Plan en unidades ejecutables con dependencias y criterios de finalización claros.
- **Inputs mínimos:** `spec.md` y `plan.md` vigentes y coherentes.
- **Output persistido:** `tasks.md` con unidades de trabajo, dependencias, relación con los requisitos, criterios de finalización, estado y handoff.
- **Gate de entrada:** los gates de salida de Specification y Plan están cumplidos.
- **Gate de salida:** las tareas cubren el trabajo previsto en el Plan; sus dependencias y criterios permiten identificar qué unidades pueden ejecutarse y cuándo están completas.
- **Qué NO debe hacerse todavía:** ejecutar tareas antes de completar esta fase, introducir trabajo fuera del contrato o ejecutar unidades con dependencias o gates pendientes.

## 4. Implementation

- **Propósito:** ejecutar las unidades habilitadas y producir los cambios que satisfacen el contrato.
- **Inputs mínimos:** `spec.md`, `plan.md` y `tasks.md` vigentes, junto con el estado del producto necesario para ejecutar la tarea.
- **Output persistido:** cambios de producto y `tasks.md` actualizado con avances, resultados, bloqueos, referencias relevantes y handoff.
- **Gate de entrada:** los gates anteriores están cumplidos; el análisis de coherencia y cobertura entre contrato, Plan y Tasks está registrado sin inconsistencias materiales abiertas; y las dependencias de la tarea que se ejecutará están satisfechas.
- **Gate de salida:** todas las tareas previstas están completas según sus criterios, los cambios están disponibles para verificar y no existen bloqueos pendientes que impidan esa verificación. Si hay bloqueos, se registran y el gate permanece sin cumplir.
- **Qué NO debe hacerse todavía:** declarar cumplido el contrato por haber terminado las tareas, realizar Ship o resolver por cuenta propia decisiones materiales no documentadas.

## 5. Verification

- **Propósito:** comprobar que el resultado satisface los requisitos y criterios de Specification, no solamente ejecutar tests.
- **Inputs mínimos:** contrato, Plan y Tasks vigentes, implementación completa y estrategia de verificación definida en el Plan.
- **Output persistido:** `verification.md` con evidencia o referencias de evidencia por requisito y criterio, métodos utilizados, resultados, desviaciones, estado y handoff.
- **Gate de entrada:** el gate de salida de Implementation está cumplido y los artefactos reflejan el cambio que se verificará.
- **Gate de salida:** todos los requisitos y criterios del contrato vigente están satisfechos con evidencia registrada; no quedan fallos, desviaciones materiales ni criterios sin comprobar que impidan Ship.
- **Qué NO debe hacerse todavía:** equiparar tests exitosos con cumplimiento funcional, omitir criterios no cubiertos por tests, realizar Ship o cambiar requisitos para hacer pasar la verificación.

## 6. Ship

- **Propósito:** completar la entrega del cambio como fase separada de Implementation y Verification.
- **Inputs mínimos:** `verification.md` con resultado satisfactorio, los artefactos vigentes del cambio y las condiciones y mecanismo de entrega conocidos del proyecto.
- **Output persistido:** sección de cierre de Ship en `verification.md` con resultado de entrega, referencias o evidencia, pendientes si existen y handoff final.
- **Gate de entrada:** el gate de salida de Verification está cumplido; las condiciones de entrega están definidas y no quedan decisiones materiales pendientes para efectuarla.
- **Gate de salida:** la entrega se completó conforme a las condiciones del proyecto, su confirmación está registrada y el handoff final permite conocer el estado del cambio. Cualquier pendiente registrado debe ser compatible con el contrato satisfecho y la entrega completa.
- **Qué NO debe hacerse todavía:** inventar mecanismos de entrega, marcar el cambio como entregado antes de confirmarlo, cerrar con requisitos incumplidos o introducir cambios de producto sin volver a las fases y gates afectados.

## Límites del core

Las [skills](skills/README.md) operan estas fases sin redefinirlas. Este workflow no define comandos, personas/agentes, provider adapters, plantillas, scripts de validación, instalador, GitHub Actions ni gates automáticos. Los mecanismos concretos de Ship dependen del proyecto que usa el harness. La automatización de criterios verificables queda para etapas futuras.
