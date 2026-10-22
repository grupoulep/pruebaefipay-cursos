# Guía de Despliegue en GitHub Pages — CREDIULEP

Este proyecto ya incluye toda la configuración necesaria en el código para ser desplegado en **GitHub Pages** de dos formas: automática mediante **GitHub Actions** o manual desde terminal con **`gh-pages`**.

---

##Archivos de despliegue incluidos en el proyecto

1. **`vite.config.ts`**: Configurado con `base: './'` para que las rutas de estilos, scripts y recursos funcionen en cualquier subruta de repositorio (`https://tu-usuario.github.io/crediulep/`) o dominio propio.
2. **`.github/workflows/deploy.yml`**: Flujo automatizado de GitHub Actions que compila el proyecto con Node.js 22, genera el respaldo `404.html` para Single Page Applications (SPA) y publica la carpeta `dist` en GitHub Pages en cada `git push`.
3. **`public/.nojekyll`**: Evita que GitHub procese la carpeta con Jekyll.
4. **`package.json`**: Incluye los scripts `"predeploy"` y `"deploy"` usando el paquete `gh-pages`.

---

## Opción 1: Despliegue Automático con GitHub Actions (Recomendado)

1. Crea un repositorio nuevo en GitHub (por ejemplo, `crediulep-tienda`).
2. Sube el código desde tu terminal:
   ```bash
   git init
   git add .
   git commit -m "Lanzamiento tienda virtual CREDIULEP con Efipay"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/crediulep-tienda.git
   git push -u origin main
   ```
3. En tu repositorio de GitHub, ve a **Settings** → **Pages**.
4. En **Build and deployment** → **Source**, selecciona **GitHub Actions**.
5. El workflow `Despliegue de CREDIULEP en GitHub Pages` se ejecutará automáticamente y publicará tu tienda en:
   `https://TU_USUARIO.github.io/crediulep-tienda/`

---

## Opción 2: Despliegue Directo por Comando (`npm run deploy`)

Si prefieres publicar directamente hacia la rama `gh-pages` desde tu computador:

```bash
npm install
npm run deploy
```

Esto ejecutará `vite build` y subirá automáticamente el contenido de la carpeta `dist/` a la rama `gh-pages` de tu repositorio.
