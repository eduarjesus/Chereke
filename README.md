# chereke — catálogo web

Sitio de catálogo para chereke. El inventario vive en un Google Sheet: cada fila es
una pieza, y el sitio la lee automáticamente al generarse.

## 1. Crear el Google Sheet de inventario

Crea una hoja de cálculo en Google Sheets con estas columnas exactas en la primera fila:

| nombre | precio | categoria | descripcion | disponible | fotos |
|---|---|---|---|---|---|
| Cuenco Marfil | 18 | Cerámica | Cuenco torneado a mano... | Sí | https://... |

- **nombre**: nombre de la pieza.
- **precio**: solo el número (sin símbolo de moneda).
- **categoria**: úsala para los filtros del catálogo (ej. "Cerámica", "Llaveros"). Puedes dejarla vacía si no la necesitas.
- **descripcion**: texto libre, aparece en la página de detalle.
- **disponible**: escribe `Sí` o `No`. Las piezas "No" se muestran como agotadas en vez de desaparecer.
- **fotos**: una o varias URLs de imagen separadas por comas (ver sección de fotos abajo). La primera es la que se usa en la grilla del catálogo; todas se muestran en la página de detalle.

## 2. Publicar el Sheet como CSV

1. En Google Sheets: **Archivo → Compartir → Publicar en la web**.
2. Selecciona la hoja de inventario y el formato **CSV**.
3. Haz clic en **Publicar** y copia el link que te da.
4. Ese link va en la variable `PUBLIC_SHEET_CSV_URL` (ver paso 4).

Importante: esto hace que la hoja sea de lectura pública (cualquiera con el link puede ver los datos, no editarlos). No pongas ahí información sensible.

## 3. Subir fotos

La forma más simple sin herramientas nuevas:

1. Sube las fotos a una carpeta de **Google Drive**.
2. Click derecho en la foto → **Compartir** → "Cualquier persona con el enlace" → **Lector**.
3. Copia el link (se ve así: `https://drive.google.com/file/d/ABC123.../view?usp=sharing`).
4. Pégalo tal cual en la columna `fotos` del Sheet — el sitio lo convierte automáticamente al formato que se puede mostrar.

Alternativa más rápida de cargar y con mejor calidad de imagen: subir las fotos a [imgbb.com](https://imgbb.com) (gratis, sin cuenta) y pegar el link directo de la imagen.

## 4. Configurar el proyecto

```bash
npm install
cp .env.example .env
```

Edita `.env` con:
- `PUBLIC_SHEET_CSV_URL`: el link que copiaste en el paso 2.
- `PUBLIC_WHATSAPP_NUMBER`: tu número con código de país, sin `+` ni espacios (ej. `50761234567`).
- `PUBLIC_INSTAGRAM_USER`: tu usuario de Instagram sin `@`.

Si no configuras `PUBLIC_SHEET_CSV_URL`, el sitio funciona igual mostrando 3 productos de ejemplo — útil para probar el diseño antes de conectar tu inventario real.

## 5. Ver el sitio en tu computadora

```bash
npm run dev
```

Abre `http://localhost:4321`.

## 6. Publicar el sitio (gratis)

La forma más simple es [Vercel](https://vercel.com) o [Netlify](https://netlify.com):

1. Sube esta carpeta a un repositorio de GitHub.
2. En Vercel o Netlify: "Import Project" → conecta el repositorio.
3. Agrega las mismas 3 variables de entorno del `.env` en la configuración del proyecto.
4. Deploy.

## 7. Actualizar el inventario después de publicado

Como el sitio es estático, los cambios en el Sheet no aparecen solos — hay que
regenerar el sitio. Dos formas:

- **Manual**: en Vercel/Netlify, botón "Redeploy". Toma menos de un minuto.
- **Automática** (opcional, más avanzado): crear un "Deploy Hook" en Vercel/Netlify
  y llamarlo desde un script de Google Apps Script cada vez que edites el Sheet.
  Si quieres, lo armamos en otra sesión — no es necesario para empezar.

## Estructura del proyecto

```
src/
  data/sample-products.json   → productos de ejemplo (fallback)
  lib/products.ts             → lee y convierte el Google Sheet
  layouts/Layout.astro        → header/footer compartidos
  components/ProductCard.astro
  pages/index.astro           → catálogo (hero + grilla + filtros)
  pages/producto/[slug].astro → página de detalle por pieza
  styles/global.css           → paleta y tipografía de marca
```
