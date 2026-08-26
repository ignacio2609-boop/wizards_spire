<script setup lang="ts">
import { ArrowRight, Dices } from '@lucide/vue';
</script>

<template>
  <div class="bg-base-100 relative flex min-h-screen items-center justify-center overflow-hidden">
    <div
      class="bg-primary/20 absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl"
      aria-hidden="true"
    />
    <div
      class="bg-secondary/20 absolute -right-32 -bottom-32 h-96 w-96 rounded-full blur-3xl"
      aria-hidden="true"
    />

    <div class="relative z-10 mx-auto max-w-2xl px-6 text-center">
      <div class="badge badge-outline badge-lg gap-2">
        <Dices class="size-4" />
        {{ $t('home.hero.badge') }}
      </div>

      <h1
        class="from-primary to-secondary mt-6 bg-linear-to-r bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl"
      >
        {{ $t('common.appName') }}
      </h1>

      <p class="text-base-content/70 mx-auto mt-6 max-w-lg text-lg leading-relaxed">
        {{ $t('home.hero.description') }}
      </p>

      <button class="btn btn-primary btn-lg mt-10 gap-2">
        {{ $t('home.hero.cta') }}
        <ArrowRight class="size-5" />
      </button>
    </div>
  </div>
</template>
