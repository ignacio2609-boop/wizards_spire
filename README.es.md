# Wizard's Spire

*[Read this in English](./README.md)*

Wizard's Spire es una aplicación web para crear personajes de Dungeons &
Dragons 5ª edición: completa la creación de tu personaje paso a paso, tira tus
estadísticas con dados 3D interactivos y exporta una ficha en PDF lista para
jugar — gratis, desde el navegador, sin instalar nada.

## Estado del proyecto

En fase muy temprana (bootstrap). Todavía no hay funcionalidad de creación de
personajes implementada.

## Intención

- Creador de personajes paso a paso siguiendo las reglas de D&D 5e (SRD).
- Páginas de consulta de razas, clases y hechizos optimizadas para SEO.
- Tirada de dados 3D interactiva.
- Exportación de la ficha a PDF (formulario oficial de personaje).
- Soporte multi-idioma real (español / inglés) desde el diseño inicial.

## Stack

- [Nuxt 4](https://nuxt.com/) + TypeScript
- Tailwind CSS + DaisyUI 5
- Pinia + VueUse
- `@nuxtjs/i18n`
- [Valibot](https://valibot.dev/) para validación de esquemas
- `@3d-dice/dice-box` para los dados 3D
- `pdf-lib` para la exportación a PDF
- pnpm como gestor de paquetes

## Desarrollo

```bash
pnpm install
pnpm dev
```

Servidor de desarrollo en `http://localhost:3000`.

## Licencia

[MIT](./LICENSE)
