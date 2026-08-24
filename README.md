# Wizard's Spire

*[Leer esto en español](./README.es.md)*

Wizard's Spire is a web app for building Dungeons & Dragons 5th Edition
characters: walk through character creation step by step, roll your stats
with interactive 3D dice, and export a ready-to-play PDF character sheet —
free, in the browser, no installation required.

## Project status

Very early bootstrap stage. No character creation functionality has been
implemented yet.

## Intent

- Step-by-step character creator following the D&D 5e rules (SRD).
- SEO-friendly lookup pages for races, classes, and spells.
- Interactive 3D dice rolling.
- Character sheet export to PDF (official character form).
- Real multi-language support (Spanish / English) from the initial design.

## Stack

- [Nuxt 4](https://nuxt.com/) + TypeScript
- Tailwind CSS + DaisyUI 5
- Pinia + VueUse
- `@nuxtjs/i18n`
- [Valibot](https://valibot.dev/) for schema validation
- `@3d-dice/dice-box` for 3D dice
- `pdf-lib` for PDF export
- pnpm as package manager

## Development

```bash
pnpm install
pnpm dev
```

Dev server at `http://localhost:3000`.

## License

[MIT](./LICENSE)
