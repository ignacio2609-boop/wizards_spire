# La Torre del Mago

_[Read this in English](./README.md)_

La Torre del Mago es una aplicación web para crear personajes de Dungeons &
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

Código: [MIT](./LICENSE).

Esta obra incluye material procedente del documento de referencia del sistema 5.2.1
(“SRD 5.2.1”) de Wizards of the Coast LLC, disponible en https://www.dndbeyond.com/srd.
La licencia sobre el SRD 5.2.1 se concede de acuerdo con la licencia internacional de
atribución/reconocimiento 4.0 de Creative Commons, disponible en
https://creativecommons.org/licenses/by/4.0/legalcode.

Los datos del SRD se importan de [5e-bits/5e-srd-api](https://github.com/5e-bits/5e-srd-api)
(MIT). Los avisos completos están en [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md).
