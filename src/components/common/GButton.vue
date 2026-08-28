<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'tonal' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconRight?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  rounded?: boolean;
  customClass?: string;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  rounded: false,
  customClass: '',
});

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const sizeClasses = {
  sm: 'px-3.5 py-1.5 text-xs font-medium',
  md: 'px-5 py-2.5 text-sm font-semibold',
  lg: 'px-7 py-3.5 text-base font-bold',
};

const variantClasses = {
  primary: 'bg-primary-container text-on-primary hover:bg-primary shadow-warm-sm hover:shadow-warm-md text-white font-bold',
  secondary: 'bg-secondary text-on-secondary hover:bg-secondary/90 shadow-warm-sm',
  tonal: 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-border-subtle/50',
  outline: 'border border-border-subtle bg-transparent text-on-surface hover:bg-surface-container',
  ghost: 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container',
  danger: 'bg-error text-on-error hover:bg-error-light shadow-warm-sm',
};
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-ui transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-[0.98]',
      sizeClasses[size],
      variantClasses[variant],
      rounded ? 'rounded-full' : 'rounded-lg',
      (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      customClass
    ]"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
    <span v-else-if="icon" class="material-symbols-outlined text-[19px] shrink-0 text-inherit">{{ icon }}</span>
    <slot />
    <span v-if="iconRight" class="material-symbols-outlined text-[19px] shrink-0 text-inherit">{{ iconRight }}</span>
  </button>
</template>
