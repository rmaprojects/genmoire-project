<script setup lang="ts">
defineProps<{
  active?: boolean;
  icon?: string;
  badge?: string | number;
}>();
</script>

<template>
  <button
    type="button"
    :class="[
      'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-ui transition-all duration-200 cursor-pointer select-none relative z-10 shrink-0',
      active
        ? 'bg-primary text-on-primary font-semibold shadow-warm-sm'
        : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-border-subtle/50 dark:border-transparent shadow-2xs dark:shadow-none'
    ]"
  >
    <span v-if="icon" class="material-symbols-outlined text-[16px]" :class="{ 'fill': active }">{{ icon }}</span>
    <slot />
    <span v-if="badge" class="ml-1 px-1.5 py-0.5 bg-black/10 dark:bg-surface-container-highest rounded-full text-[11px] font-sans font-bold">
      {{ badge }}
    </span>
  </button>
</template>
