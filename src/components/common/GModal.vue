<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: boolean;
  title?: string;
  icon?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  closeOnBackdrop?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  maxWidth: 'md',
  closeOnBackdrop: true,
});

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

// Expanded modal dimensions for spacious reading and high clarity
const maxWidthClass = computed(() => ({
  sm: 'max-w-lg',
  md: 'max-w-2xl',
  lg: 'max-w-3xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-5xl',
}[props.maxWidth]));
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
        @click.self="closeOnBackdrop && $emit('update:modelValue', false)"
      >
        <Transition
          enter-active-class="transition duration-250 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <!-- Seamless Modal Card (No nested sub-containers) -->
          <div
            class="relative w-full bg-surface-secondary dark:bg-[#1E1B18] border border-border-subtle rounded-3xl shadow-warm-xl overflow-hidden flex flex-col my-auto"
            :class="maxWidthClass"
          >
            <!-- Seamless Header -->
            <div
              v-if="title || $slots.header"
              class="flex items-center justify-between px-6 sm:px-8 py-5 sm:py-6 border-b border-border-subtle/80"
            >
              <slot name="header">
                <div class="flex items-center gap-3">
                  <span v-if="icon" class="material-symbols-outlined text-primary text-2xl sm:text-3xl">{{ icon }}</span>
                  <h3 class="font-display-lg font-bold text-on-surface dark:text-[#F3EFE6] text-xl sm:text-2xl leading-tight">
                    {{ title }}
                  </h3>
                </div>
              </slot>

              <!-- Close Button -->
              <button
                type="button"
                class="p-2 rounded-full text-text-muted dark:text-[#C5BBAF] hover:text-on-surface dark:hover:text-white hover:bg-surface-container transition-colors cursor-pointer active:scale-95 shrink-0 ml-2"
                title="Tutup Dialog"
                @click="$emit('update:modelValue', false)"
              >
                <span class="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <!-- Body with Large, Bright, Readable Typography -->
            <div class="px-6 sm:px-8 py-6 sm:py-8 overflow-y-auto max-h-[75vh] text-base sm:text-lg text-text-primary dark:text-[#E6DFD5] leading-relaxed custom-scrollbar">
              <slot />
            </div>

            <!-- Seamless Footer -->
            <div
              v-if="$slots.footer"
              class="flex items-center justify-end gap-3 px-6 sm:px-8 py-4 sm:py-5 border-t border-border-subtle/80"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
