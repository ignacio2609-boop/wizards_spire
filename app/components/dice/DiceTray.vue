<script setup lang="ts">
import { useDiceBox } from '~/composables/useDiceBox';

// Size comes from the parent through class, e.g. <DiceTray class="h-96 w-full" />
const trayElement = useTemplateRef<HTMLElement>('tray');
const { attach, detach, resize } = useDiceBox();

onMounted(() => {
  if (trayElement.value) void attach(trayElement.value);
});

onBeforeUnmount(() => {
  if (trayElement.value) detach(trayElement.value);
});

useResizeObserver(trayElement, resize);
</script>

<template>
  <div
    ref="tray"
    class="[&_canvas]:block [&_canvas]:size-full"
  />
</template>
