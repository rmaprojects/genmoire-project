<script setup lang="ts">
interface Props {
  value: number; // 0 - 100
  label?: string;
  showLabel?: boolean;
  variant?: 'primary' | 'secondary' | 'gold' | 'sage';
  height?: 'sm' | 'md' | 'lg';
}

withDefaults(defineProps<Props>(), {
  value: 0,
  showLabel: false,
  variant: 'primary',
  height: 'md',
});

const heightClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const colorClasses = {
  primary: 'bg-primary-container',
  secondary: 'bg-secondary',
  gold: 'bg-gradient-to-r from-primary to-primary-fixed-dim',
  sage: 'bg-secondary-container',
};
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <div v-if="showLabel || label" class="flex justify-between text-xs font-bold text-text-secondary">
      <span>{{ label }}</span>
      <span>{{ Math.round(value) }}%</span>
    </div>
    <div
      class="w-full bg-surface-container rounded-full overflow-hidden border border-border-subtle/60 dark:border-0 dark:border-transparent p-[1.5px] dark:p-0 shadow-2xs"
      :class="heightClasses[height]"
    >
      <div
        class="h-full rounded-full transition-all duration-500 ease-out"
        :class="colorClasses[variant]"
        :style="{ width: `${Math.min(100, Math.max(0, value))}%` }"
      />
    </div>
  </div>
</template>
