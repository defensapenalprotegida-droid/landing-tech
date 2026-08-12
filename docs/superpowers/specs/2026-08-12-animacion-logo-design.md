# Diseño: animación cinematográfica del logo Arteaga & Aldunate

## Objetivo

Crear una animación web breve y memorable para el logo de Arteaga & Aldunate que atraiga la mirada, transmita sofisticación y conserve la seriedad propia de un estudio jurídico. La animación se limita al logo: no altera la navegación, el carrusel ni el contenido comercial de la página.

## Ubicación y activación

- El logo animado reemplazará visualmente al logo estático del encabezado durante su primera aparición.
- Se reproducirá una sola vez por carga de página, sin bloquear la navegación ni exigir interacción.
- Duración objetivo: 4 segundos; el estado final será el logo horizontal completo y nítido.
- Tras terminar, el elemento seguirá funcionando como enlace al inicio de la página.

## Concepto visual aprobado

La pieza seguirá un revelado cinematográfico sobrio:

1. **Inicio (0–0,35 s):** el contenedor aparece con opacidad baja, sin destellos abruptos.
2. **Gota y monograma (0,35–1,65 s):** el trazo azul nace en la gota central y recorre progresivamente las dos letras “A”. El movimiento usa aceleración y desaceleración suaves.
3. **Barrido de luz (1,45–2,55 s):** una luz cálida cruza el símbolo de izquierda a derecha y revela gradualmente el degradado azul, rojo y dorado.
4. **Firma (2,2–3,25 s):** “Arteaga & Aldunate” aparece con un desplazamiento vertical máximo de 6 px y fundido; “ABOGADOS Y ASOCIADOS” entra 180 ms después.
5. **Reposo (3,25–4 s):** el resplandor desciende, la imagen se estabiliza y queda el logo horizontal final.

El efecto no tendrá rebotes, giros, zoom agresivo, sonido ni repetición infinita.

## Implementación visual

- Se construirá un componente aislado `AnimatedLogo` para que el encabezado solo decida tamaño, destino y evento de clic.
- Las cinco imágenes entregadas se usarán como referencia de dirección artística y secuencia; para evitar una transición tipo diapositivas y mejorar nitidez, el movimiento principal se resolverá con capas, máscaras y transiciones web sobre los recursos del logo.
- El componente mantendrá una caja estable desde el primer fotograma para impedir saltos de diseño.
- El estado final coincidirá con la composición horizontal proporcionada en la quinta imagen.
- El brillo permanecerá contenido alrededor del monograma y no reducirá la legibilidad del menú.

## Adaptación por pantalla

- En escritorio, la animación completa conservará el detalle del trazado y el barrido luminoso.
- En móvil, se mantendrá la misma duración conceptual, pero se reducirá la amplitud del resplandor para no competir con el botón de menú.
- El logo conservará su proporción y nunca excederá el espacio disponible en el encabezado.

## Accesibilidad y rendimiento

- Si `prefers-reduced-motion: reduce` está activo, se mostrará inmediatamente el logo final con un fundido breve o sin animación.
- El texto alternativo será `Arteaga & Aldunate, Abogados y Asociados`.
- Las capas decorativas no serán anunciadas por lectores de pantalla.
- Los recursos se optimizarán para web y no se cargará video; el objetivo es evitar un impacto perceptible en la carga inicial.
- Si una capa no carga, el logo estático actual actuará como respaldo visible.

## Verificación

- Prueba de componente: renderiza el texto alternativo, conserva la acción de volver al inicio y aplica el estado reducido cuando corresponde.
- Revisión visual en anchos móvil, tableta y escritorio.
- Comprobación de que el encabezado no cambia de altura durante la secuencia.
- Comprobación de que la navegación y el menú móvil funcionan durante toda la animación.
- Construcción y pruebas existentes del proyecto deben continuar pasando.

## Fuera de alcance

- Animar el hero completo o el fondo de la página.
- Crear música o efectos de sonido.
- Reproducir la animación continuamente o en cada desplazamiento.
- Rediseñar el logotipo, la paleta o la tipografía corporativa.
