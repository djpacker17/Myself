# Leo | Portafolio

Portafolio de Leo: desarrollador web y de apps, diseñador de marca, scripts de Roblox y Minecraft. En español e inglés.

Ver en línea: https://djpacker17.github.io/Myself/

## Qué tiene

- **Animación de apertura:** tres ventanas escriben código en JavaScript, Luau y HTML/CSS, cada una muestra su resultado (el logo de Zypuc, un botón de Roblox y el saludo) y la pantalla se deshace en cuadrados. Se ve una vez por sesión, se puede saltar y no aparece si la persona tiene activado «reducir movimiento». Para verla otra vez: botón «Ver la intro otra vez» del pie de página, o agrega `?intro=1` al link.
- **Proyecto destacado:** Zypuc con reto, solución, resultado, kit de marca y la intro en video.
- **Pruébalo:** tres demos (interfaz de Roblox, tienda online y marca) con su código al lado; al tocar un control se ilumina la línea que lo hace funcionar.
- **Arma tu proyecto:** el cliente elige qué necesita y se arma un mensaje listo para pegar en Fiverr (en español o inglés).
- Modo claro y oscuro, fondo de cuadrados que reacciona al mouse, barra de contacto en celular.

## Archivos

- `index.html`: la página y los textos en español.
- `css/estilos.css`: todos los estilos. Los colores están al inicio, en `:root`.
- `js/app.js`: idioma, tema, demos y el armador de proyectos. Los enlaces de Fiverr y GitHub están al inicio, en `CONFIG`.
- `js/intro.js`: la animación de apertura.
- `js/en.js`: los textos en inglés.
- `404.html`: página para enlaces que no existen.
- `media/`: avatar, imágenes de Zypuc, demo, intro en video e imagen para compartir (`og.png`).

## Cambiar textos

Un texto en español se cambia en `index.html`; su versión en inglés está en `js/en.js` con la misma clave (`data-i18n`).
