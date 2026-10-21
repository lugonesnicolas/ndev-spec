# Plan — 004

Estado: Plan cumplido; pendiente Tasks. Contrato vigente: [spec.md](spec.md).

## Enfoque

La [decisión de operación manual](../../docs/architecture/manual-readiness.md) precede las modificaciones del canon. Corregir únicamente los hallazgos del ciclo y producir una guía operativa, manteniendo el diseño de adquisición de 002 y los límites de 003.

1. Auditar fase por fase y registrar hallazgos en Tasks; resolver protocolo de preguntas, contexto de analyze y ejecución de comprobaciones aplicables. Referenciar el protocolo desde las nueve skills.
2. Escribir docs/guide.md con instalación nueva/existente y comandos revisables equivalentes en PowerShell y Bash. Preparar extracciones fuera del consumidor, comprobarlas contra Git y aplicar únicamente el conjunto acordado.
3. Incluir prompts por skill y ejemplos concisos de niveles; actualizar README, índices, PROJECT y nota de integración de 003.
4. Ensayar en temporales aislados con Git y herramientas disponibles. Los auxiliares no son producto. No agregar dependencias ni automatización al repositorio.

## Verificación por criterio

| Ensayo | Método y evidencia esperada | Requisitos |
| --- | --- | --- |
| E1 | Matriz de seis fases/nueve skills, hallazgos y resoluciones; inspección de coherencia con canon y arquitectura. | R1, R3 |
| E2 | Preguntas reales de planificación más ejercicios simulados de herramienta/chat/sin respuesta y ambigüedad posterior; registro, bloqueo y retorno observables. | R2, R7 |
| E3 | Ejecutar ejemplos de instalación con PowerShell y Git Bash en nuevos/existentes; comparar rutas y blobs, procedencia y archivos propios. | R4, R7 |
| E4 | Actualizar entre commits del mismo origen, repetir sin cambios, detectar colisión y recuperar copia parcial mediante rutas identificadas. | R4, R7 |
| E5 | Tres cambios documentales temporales, uno por nivel, con pruebas observables; releer únicamente artefactos para continuar; sembrar hueco de cobertura y fallo de Verification, corregir y repetir. | R1, R3, R5, R7 |
| E6 | Enlaces/anclas, formato, aislamiento, presupuestos con max(caracteres/4, palabras×1,5), diff --check y preservación de 001/002/diseño de instalación. | R3, R6, R7 |
| E7 | Revisar guía y README como entradas de uso, PROJECT y nota de integración contra git show 9789384. Confirmar rama publicada y PR en español, sin merge. | R5, R6, R8 |

## Dependencias y riesgos

No hay build ni suite de producto. Git y PowerShell disponibles; Git Bash disponible en C:/Program Files/Git/bin/bash.exe. WSL Bash no inicia (E_ACCESSDENIED); no se declara soporte comprobado de WSL/Linux. Un único agente ejecutará los ensayos: no son una evaluación independiente ni sustituyen pruebas de usuarios. Preguntas simuladas se distinguen de las respuestas reales del usuario ya registradas.

## Entrega y handoff

Push y PR contra main tras Verification satisfactoria; sin merge/tag/release. Cierre documental posterior referencia el commit verificado, nunca el commit que lo contiene. Gate de Plan cumplido: requisitos cubiertos por E1–E7 y decisión persistida, sin decisiones materiales abiertas. Siguiente paso: Tasks y analyze.
