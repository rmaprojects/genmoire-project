<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';

defineProps<{
  cgUrl?: string;
  isPureKinetic?: boolean;
}>();

const bgLayerRef = ref<HTMLElement | null>(null);
let ctx: gsap.Context | null = null;

onMounted(() => {
  ctx = gsap.context(() => {
    if (bgLayerRef.value) {
      gsap.to(bgLayerRef.value, {
        scale: 1.06,
        x: 10,
        y: -10,
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, bgLayerRef.value || undefined);
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>

<template>
  <div ref="bgLayerRef" class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
    <!-- Image layer with crossfade transition -->
    <Transition name="cg-fade" mode="out-in">
      <div
        v-if="cgUrl && !isPureKinetic"
        :key="cgUrl"
        class="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-out transform scale-105"
        :style="{ backgroundImage: `url(${cgUrl})` }"
      />
      <!-- Pure Kinetic / Anti-AI Fallback: Clean Obsidian / Deep Sepia canvas -->
      <div
        v-else
        key="pure-kinetic-bg"
        class="absolute inset-0 w-full h-full bg-gradient-to-b from-[#141210] via-[#1A1816] to-[#12100E]"
      />
    </Transition>

    <!-- 45% Dark Overlay Scrim for perfect NVL typography contrast -->
    <div class="absolute inset-0 bg-black/45 backdrop-blur-[0.5px]"></div>
    
    <!-- Subtle Vignette Edge -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
  </div>
</template>

<style scoped>
.cg-fade-enter-active,
.cg-fade-leave-active {
  transition: opacity 0.8s ease;
}

.cg-fade-enter-from,
.cg-fade-leave-to {
  opacity: 0;
}
</style>
