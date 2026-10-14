import { fileURLToPath } from 'node:url';
import { defineVitestProject } from '@nuxt/test-utils/config';
import { defineConfig } from 'vitest/config';

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  test: {
    projects: [
      // Pure logic (utils, SRD mappers, schemas) in plain Node: no Nuxt boot, so it runs in
      // milliseconds. Nuxt's aliases are mirrored here so app code imports resolve without it.
      {
        resolve: {
          alias: {
            '~~': fromRoot('./'),
            '~': fromRoot('./app'),
            '#shared': fromRoot('./shared'),
          },
        },
        test: {
          name: 'unit',
          include: ['test/unit/**/*.test.ts'],
          environment: 'node',
        },
      },
      // Code that needs Nuxt at runtime (composables, stores, components): boots the app with
      // its modules (i18n, Pinia...) and a simulated DOM.
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.test.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: { domEnvironment: 'happy-dom' },
          },
          // On by default since Vitest 5.0.4, but replaying cached transforms breaks the Nuxt
          // environment from the second run on ("Failed to resolve import './nuxt.js'" inside
          // nuxt-vitest-app-entry). Related upstream: vitest-dev/vitest#11575. Re-enable once
          // fixed. Set here because this project opts out of extending the root config.
          fsModuleCache: false,
        },
      }),
    ],
  },
});
