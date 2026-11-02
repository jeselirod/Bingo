# Contexto del proyecto Bingo

Este archivo resume el contexto y las convenciones del proyecto para futuras sesiones de IA. Léelo antes de cambiar código y actualízalo si la arquitectura o los comandos cambian.

## Raíz y comandos

Hay dos carpetas anidadas llamadas `Bingo`. La raíz real del proyecto Angular es:

`C:\Users\jesus\proyectos\Angular\Bingo\Bingo`

Ejecuta los comandos de npm desde esa carpeta (la segunda `Bingo`), donde están `package.json` y `angular.json`. Por ejemplo, en PowerShell:

```powershell
Set-Location 'C:\Users\jesus\proyectos\Angular\Bingo\Bingo'
npm start
```

Comandos habituales:

```powershell
npm start
npm run build
npm test
npm test -- --watch=false --browsers=ChromeHeadless
```

La última variante ejecuta toda la suite una vez en Chrome Headless. El comando de test interactivo puede dejar Karma observando cambios.

## Tecnologías

- Angular 20, aplicación standalone y componentes con templates HTML separados.
- TypeScript 5.8, RxJS y señales de Angular.
- Tailwind CSS 4, importado desde `src/styles.css`.
- Firebase mediante AngularFire: Firestore para el estado de las salas y Realtime Database para presencia.
- Pruebas unitarias con Jasmine, Karma y Chrome Headless.

## Estructura importante

- `src/app/app.routes.ts`: rutas principales; home, lobby con autenticación y sección bingo con carga diferida.
- `src/app/pages/home/`: inicio y acceso.
- `src/app/pages/lobby/`: crear o unirse a una sala.
- `src/app/pages/bingo/`: rutas admin/invitado y vista principal con pestañas.
- `src/app/services/bingo.service.ts`: estado y operaciones de partida. Mantiene señales para bolas restantes, extraídas, bola actual, animación, jugadores y administrador.
- `src/app/services/auth.service.ts`: integración de autenticación.
- `src/app/shared/components/`: tablero, bombo, bola, jugadores, menú, alertas y spinner.
- `src/app/shared/guards/`: guards de autenticación y administración.
- `src/environments/`: configuración de Firebase. No copiar ni exponer sus valores en documentación, logs, tests o respuestas.

El bingo usa 90 números. Las rutas de partida son `/bingo/admin/:id` y `/bingo/invitado/:id`. El tablero y la vista de bolas extraídas reutilizan `Tablero` con el input `orden`.

## Flujo de trabajo para tareas y bugs

Salvo que el usuario indique expresamente otro flujo en el chat, toda petición para implementar una tarea nueva o resolver un bug debe avanzar en estas tres fases:

1. **Análisis e investigación:** inspeccionar el código y el comportamiento existente, rastrear la causa o los puntos de integración, y valorar la solución que mejor encaja con la arquitectura actual. Comunicar al usuario los hallazgos antes de pasar a planificar.
2. **Planificación:** basándose en la investigación y en el contexto que aporte el usuario, proponer un plan concreto y suficientemente detallado. Esperar a que el usuario lo valide o pida cambios; no empezar la implementación antes de esa validación.
3. **Implementación:** ejecutar el plan validado, hacer cambios precisos, validar el resultado con las pruebas/build pertinentes y resumir qué cambió y qué verificación se ejecutó.

Si el usuario solicita explícitamente omitir o combinar fases, respetar esa indicación para esa tarea. Las consultas informativas, revisiones sin cambios y tareas de documentación no requieren este flujo salvo que el usuario lo pida.

En cualquiera de las fases, si falta información necesaria, hay ambigüedad relevante o existen varias decisiones razonables que afecten el resultado, preguntar al usuario antes de asumir. Usar la herramienta de preguntas disponible en lugar de formular preguntas como texto normal cuando exista. Si no hace falta aclaración, continuar sin preguntas innecesarias.

## Convenciones para cambios

- Revisa primero los archivos y patrones existentes; realiza cambios pequeños y relacionados con la petición.
- Conserva Angular standalone, inyección con `inject()`, señales y las APIs/estilo de templates ya usados en el área correspondiente.
- Para estilos del tablero, los números verdes extraídos usan texto oscuro; la bola actual roja usa texto blanco; las bolas pendientes usan fondo gris y texto gris oscuro.
- Al usar `ngClass`, evita repetir una misma clase entre claves con condiciones distintas: Angular puede alternar esa clase al procesar cada entrada.
- No cambies estilos globales para resolver un problema local sin demostrar que el origen es global.
- No cambies dependencias ni generes archivos de configuración temporales salvo que sean necesarios.
- No reviertas cambios preexistentes del usuario ni incluyas en el alcance archivos ajenos a la petición.
- No hagas commits salvo que se solicite.

## Pruebas

- La aplicación usa `provideZonelessChangeDetection()`; los specs que creen un `TestBed` deben usar el mismo provider.
- Proporciona dobles/mocks para Firebase, router y servicios inyectados. Las pruebas unitarias no deben conectarse a un proyecto Firebase real.
- Para componentes que usan animaciones Angular, usa `provideNoopAnimations()` si el renderizado del test lo requiere.
- Mantén las pruebas existentes enfocadas; no añadas cobertura extensa si solo se pide que los tests puedan ejecutarse.
- Ejecuta primero el spec afectado y, si el cambio toca configuración o providers comunes, verifica la suite completa con el comando headless indicado arriba.

## Estado conocido

- La suite verificada recientemente ejecutó 24 pruebas correctamente.
- El test de `Menu` puede registrar un 404 de `/Bingo/sounds/Fireworks-burst-sound.mp3` en Karma; no impidió que las pruebas pasaran. Si se trabaja con assets/audio, revisa la ruta y la configuración `baseHref`.
- El build puede emitir un aviso de presupuesto del bundle inicial; no confundas ese aviso con un fallo de compilación.
