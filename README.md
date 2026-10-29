# JaveTalento
**Juego de reclutamiento y selección por competencias · Pontificia Universidad Javeriana Cali**

Simulador 3D interactivo desarrollado con **Three.js (WebGL)**, **React** y **TypeScript** para entrenar a líderes de área en diseño de perfiles, detección de sesgos inconscientes y entrevistas por competencias **Método STAR**, ambientado en una oficina frente al tradicional árbol del Samán en la Pontificia Universidad Javeriana Cali.

## Cómo Jugar

Para iniciar localmente:
```bash
npm install
npm run dev
```

Luego abre `http://localhost:5173/` en tu navegador.

## Despliegue en Vercel

El repositorio incluye configuración lista para producción (`vercel.json` y `vite.config.ts`):
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

## Controles y mecánicas

- **Mirar Alrededor (`Mouse / Touch Drag` o `WASD` / Teclas `[1-4]`):** Gira la cámara en primera persona hacia el candidato y el ventanal del Samán (`[1]`), tu escritorio de caoba (`[2]`), la pizarra de investigación e izquierda (`[3]`) o la puerta y los sellos a la derecha (`[4]`).
- **Tutorial guiado:** La primera vez que entras a la oficina, un recorrido paso a paso te muestra cada herramienta. Puedes repetirlo desde el menú de pausa («Cómo jugar»).
- **Pausa (`[Esc]` o botón arriba a la izquierda):** Continuar, cambiar de misión, manual, ajustes, diploma, sonido, pantalla completa y salir al menú principal. Las vistas de cámara siguen disponibles con las teclas `[1-4]`.
- **Barra de herramientas (abajo):** Cada objeto del escritorio tiene su ranura con atajo de teclado: Perfil `[P]`, Hoja de vida `[C]`, Libreta `[E]`, Lupa `[L]`, Citófono `[T]`, Manual `[M]` y los dos sellos.
- **Tablero del Perfil del Cargo (`[P]` o clic en el clipboard del escritorio):** Lo levantas como un clipboard real (pinza metálica, hoja rayada y memo pegado con cinta) y marcas a mano los criterios objetivos; las trampas de sesgo quedan tachadas en rojo.
- **Carpeta Manila de Hojas de Vida (`[C]` o clic en las carpetas de la bandeja):** Carpeta con pestañas por candidato, polaroid con clip, nota adhesiva que solo se lee al pasarle la Lupa y una hoja de evaluación donde resaltas cada hallazgo con marcador verde, amarillo o azul.
- **Libreta de Preguntas STAR (`[E]`, clic en la libreta de espiral o en el candidato):** Libreta de anillos con renglones y margen rojo; cada pregunta formulada queda sellada como «STAR ✓», «De cajón» o «Sesgo ✗».
- **Lupa del Cazatalentos (`[L]` o clic en la lupa de bronce):** Tómala en tu mano y apunta al candidato para leer su **lenguaje corporal / microexpresiones**, o apunta a su Hoja de Vida para destapar **notas ocultas verificadas**.
- **Citófono de Referencias Laborales (`[T]` o clic en el teléfono del escritorio):** Levanta el auricular con tonos de marcado reales para escuchar en altavoz la referencia sincera de su jefe anterior en Cali.
- **Contra-preguntas:** Tras cada respuesta aparece el botón **Presionar** para destapar quién responde con hechos verificables y quién está «echando carreta». El panel de objetivos (arriba a la derecha) muestra el avance, las pistas de la lupa y permite cambiar de candidato.
- **Sellos Físicos de Caucho (`CONTRATADO` / `DESCARTADO`):** Toma el sello de madera de su almohadilla de tinta y estámpalo con fuerza sobre la carpeta abierta para cerrar la misión y recibir tu **Acta de Evaluación** y **Diploma Oficial Enmarcado**.
