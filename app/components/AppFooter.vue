<script setup lang="ts">
// The SRD's CC-BY-4.0 license requires this statement on the work. Its wording is fixed by
// Wizards (the es text is their official translation): only the URLs are interpolated.
const SRD_URL = 'https://www.dndbeyond.com/srd';
const LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/legalcode';
const DATA_SOURCE_URL = 'https://github.com/5e-bits/5e-srd-api';
</script>

<template>
  <footer class="footer footer-center bg-base-200 text-base-content/70 gap-2 p-6 text-xs">
    <i18n-t
      keypath="common.footer.srdAttribution"
      tag="p"
      scope="global"
      class="max-w-3xl"
    >
      <template #srdUrl>
        <a
          :href="SRD_URL"
          class="link"
          target="_blank"
          rel="noopener"
        >
          {{ SRD_URL }}
        </a>
      </template>
      <template #licenseUrl>
        <a
          :href="LICENSE_URL"
          class="link"
          target="_blank"
          rel="noopener"
        >
          {{ LICENSE_URL }}
        </a>
      </template>
    </i18n-t>
    <i18n-t
      keypath="common.footer.dataSource"
      tag="p"
      scope="global"
    >
      <template #source>
        <a
          :href="DATA_SOURCE_URL"
          class="link"
          target="_blank"
          rel="noopener"
        >
          5e-bits/5e-srd-api
        </a>
      </template>
    </i18n-t>
  </footer>
</template>
