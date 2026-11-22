# Wizard's Spire

_[Leer esto en español](./README.es.md)_

Wizard's Spire is a web app for building Dungeons & Dragons 5th Edition
characters: walk through character creation step by step with the help of a guide, roll your stats
with interactive 3D dice, and export a ready-to-play PDF character sheet —
free, in the browser, no installation required.

**Try it: <https://wizardspire.netlify.app>**

## Project status

Version **0.0.1**: the foundation. The stack, the project structure, the tests and the
deployment are in place, with a first slice of character creation:

- Character concept: name, class, species, background and alignment.
- Ability scores: standard array or 4d6 drop lowest, rolled with 3D dice, plus the background
  bonus.
- PDF character sheet, filled in with the character or empty, in English and Spanish.
- Interface in English and Spanish.

The character is kept in the browser. There are no accounts and no backend.

## Next steps

- Step-by-step character creator following the D&D 5e rules (SRD 5.2.1).
- Interactive 3D dice rolling.
- Character sheet export to PDF, on the project's own sheet templates.

## Stack

| Area         | Tools                                                                       |
| ------------ | --------------------------------------------------------------------------- |
| Framework    | [Nuxt 4](https://nuxt.com/), Vue 3, TypeScript                              |
| Styles       | Tailwind CSS 4, [daisyUI 5](https://daisyui.com/), Lucide icons             |
| State        | Pinia, persisted with `pinia-plugin-persistedstate`; VueUse                 |
| Languages    | `@nuxtjs/i18n`, language kept as a preference (no locale in the URL)        |
| Validation   | [Valibot](https://valibot.dev/)                                             |
| 3D dice      | `@3d-dice/dice-box`                                                         |
| PDF          | `pdf-lib`, filling the form fields of the sheet templates                   |
| Game data    | SRD 5.2.1, imported at build time from `5e-bits/5e-srd-api` into local JSON |
| Tests        | Vitest, `@nuxt/test-utils`, happy-dom                                       |
| Code quality | ESLint, Prettier, `vue-tsc`                                                 |
| Tooling      | pnpm, Node.js 24                                                            |
| Hosting      | Netlify                                                                     |

## Development

```bash
pnpm install
pnpm dev
```

Dev server at `http://localhost:3000`.

| Command             | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `pnpm build`        | Production build                                |
| `pnpm test`         | Tests (`test:unit` and `test:nuxt` run one set) |
| `pnpm lint`         | ESLint                                          |
| `pnpm type-check`   | Type check                                      |
| `pnpm format`       | Format with Prettier                            |
| `pnpm srd:import`   | Re-import the SRD data into `app/data/srd/`     |
| `pnpm sheets:build` | Rebuild the PDF sheet templates                 |

## License

Code: [MIT](./LICENSE).

This work includes material from the System Reference Document 5.2.1 (“SRD 5.2.1”) by
Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is
licensed under the Creative Commons Attribution 4.0 International License, available at
https://creativecommons.org/licenses/by/4.0/legalcode.

SRD data is imported from [5e-bits/5e-srd-api](https://github.com/5e-bits/5e-srd-api) (MIT).
See [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md) for the full notices.
