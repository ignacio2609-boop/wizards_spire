# La Torre del Mago

_[Read this in English](./README.md)_

La Torre del Mago es una aplicación web para crear personajes de Dungeons &
Dragons 5ª edición: completa la creación de tu personaje paso a paso con ayuda de un guía, tira tus
estadísticas con dados 3D interactivos y exporta una ficha en PDF lista para
jugar — gratis, desde el navegador, sin instalar nada.

**Pruébala: <https://wizardspire.netlify.app>**

## Estado del proyecto

Versión **0.0.1**: la base. El stack, la estructura del proyecto, los tests y el despliegue
están montados, con una primera parte de la creación de personajes:

- Concepto del personaje: nombre, clase, especie, trasfondo y alineamiento.
- Características: valores estándar o 4d6 descartando el más bajo, tirados con dados 3D, más
  la mejora del trasfondo.
- Ficha de personaje en PDF, rellena con el personaje o vacía, en español e inglés.
- Interfaz en español e inglés.

El personaje se guarda en el navegador. No hay cuentas ni backend.

## Próximos pasos

- Creador de personajes paso a paso siguiendo las reglas de D&D 5e (SRD 5.2.1).
- Tirada de dados 3D interactiva.
- Exportación de la ficha a PDF, sobre plantillas de ficha propias del proyecto.

## Stack

| Área            | Herramientas                                                                    |
| --------------- | ------------------------------------------------------------------------------- |
| Framework       | [Nuxt 4](https://nuxt.com/), Vue 3, TypeScript                                  |
| Estilos         | Tailwind CSS 4, [daisyUI 5](https://daisyui.com/), iconos Lucide                |
| Estado          | Pinia, persistido con `pinia-plugin-persistedstate`; VueUse                     |
| Idiomas         | `@nuxtjs/i18n`, con el idioma como preferencia (sin idioma en la URL)           |
| Validación      | [Valibot](https://valibot.dev/)                                                 |
| Dados 3D        | `@3d-dice/dice-box`                                                             |
| PDF             | `pdf-lib`, que rellena los campos de formulario de las plantillas de ficha      |
| Datos del juego | SRD 5.2.1, importado en tiempo de build desde `5e-bits/5e-srd-api` a JSON local |
| Tests           | Vitest, `@nuxt/test-utils`, happy-dom                                           |
| Calidad         | ESLint, Prettier, `vue-tsc`                                                     |
| Herramientas    | pnpm, Node.js 24                                                                |
| Alojamiento     | Netlify                                                                         |

## Desarrollo

```bash
pnpm install
pnpm dev
```

Servidor de desarrollo en `http://localhost:3000`.

| Comando             | Qué hace                                              |
| ------------------- | ----------------------------------------------------- |
| `pnpm build`        | Build de producción                                   |
| `pnpm test`         | Tests (`test:unit` y `test:nuxt` lanzan un conjunto)  |
| `pnpm lint`         | ESLint                                                |
| `pnpm type-check`   | Comprobación de tipos                                 |
| `pnpm format`       | Formatea con Prettier                                 |
| `pnpm srd:import`   | Vuelve a importar los datos del SRD a `app/data/srd/` |
| `pnpm sheets:build` | Regenera las plantillas de ficha en PDF               |

## Licencia

Código: [MIT](./LICENSE).

Esta obra incluye material procedente del documento de referencia del sistema 5.2.1
(“SRD 5.2.1”) de Wizards of the Coast LLC, disponible en https://www.dndbeyond.com/srd.
La licencia sobre el SRD 5.2.1 se concede de acuerdo con la licencia internacional de
atribución/reconocimiento 4.0 de Creative Commons, disponible en
https://creativecommons.org/licenses/by/4.0/legalcode.

Los datos del SRD se importan de [5e-bits/5e-srd-api](https://github.com/5e-bits/5e-srd-api)
(MIT). Los avisos completos están en [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md).
