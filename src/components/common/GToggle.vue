<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<template>
  <label class="relative inline-flex items-center cursor-pointer select-none">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="sr-only peer"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <div
      class="w-11 h-6 bg-zinc-300 dark:bg-[#2B2724] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-[#FDF9F1] after:border-border-subtle after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container peer-checked:border-primary border border-zinc-400/50 dark:border-[#4E4637] shadow-inner"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    />
    <span v-if="label" class="ml-3 text-sm font-medium text-on-surface">
      {{ label }}
    </span>
  </label>
</template>
