<script setup lang="ts">
defineProps<{
  id?: string;
  label?: string;
  modelValue: string;
  placeholder?: string;
  type?: string;
  icon?: string;
  hint?: string;
  disabled?: boolean;
  clearable?: boolean;
  size?: 'md' | 'lg';
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'enter'): void;
}>();
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label v-if="label" :for="id" class="text-xs font-bold uppercase tracking-wider text-text-secondary">
      {{ label }}
    </label>
    <div class="relative flex items-center w-full">
      <span v-if="icon" class="absolute left-3.5 text-text-muted dark:text-zinc-300 material-symbols-outlined text-[20px] pointer-events-none">
        {{ icon }}
      </span>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full bg-surface-container border border-border-subtle rounded-xl text-base text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 shadow-inner',
          icon ? 'pl-11' : 'pl-4',
          clearable && modelValue ? 'pr-11' : 'pr-4',
          size === 'lg' ? 'py-3.5 text-lg' : 'py-3',
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @keydown.enter="$emit('enter')"
      />
      <button
        v-if="clearable && modelValue"
        type="button"
        class="absolute right-3.5 text-text-muted dark:text-zinc-300 hover:text-on-surface p-1 rounded-full cursor-pointer"
        @click="$emit('update:modelValue', '')"
      >
        <span class="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
    <span v-if="hint" class="text-xs text-text-muted mt-0.5">{{ hint }}</span>
  </div>
</template>
