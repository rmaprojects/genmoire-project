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
  sm: 'sm:max-w-lg',
  md: 'sm:max-w-2xl',
  lg: 'sm:max-w-3xl',
  xl: 'sm:max-w-4xl',
  '2xl': 'sm:max-w-5xl',
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
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
        @click.self="closeOnBackdrop && $emit('update:modelValue', false)"
      >
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-12 sm:scale-95 sm:translate-y-4"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100 sm:translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100 sm:translate-y-0"
          leave-to-class="opacity-0 translate-y-12 sm:scale-95 sm:translate-y-4"
        >
          <!-- Bottom Sheet on Mobile (< sm), Centered Dialog on Tablet/Desktop (sm+) -->
          <div
            class="relative w-full bg-surface-secondary dark:bg-[#1E1B18] border border-border-subtle/80 dark:border-transparent rounded-t-3xl sm:rounded-3xl shadow-warm-xl dark:shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] sm:my-auto"
            :class="maxWidthClass"
          >
            <!-- Mobile Drag Handle Bar -->
            <div class="sm:hidden w-full pt-3 pb-1 flex justify-center items-center">
              <div class="w-12 h-1.5 rounded-full bg-border-subtle/80 dark:bg-white/20"></div>
            </div>

            <!-- Header -->
            <div
              v-if="title || $slots.header"
              class="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 border-b border-border-subtle/70 dark:border-transparent shrink-0"
            >
              <slot name="header">
                <div class="flex items-center gap-3 min-w-0">
                  <span v-if="icon" class="material-symbols-outlined text-primary text-2xl sm:text-3xl shrink-0">{{ icon }}</span>
                  <h3 class="font-display-lg font-bold text-on-surface dark:text-[#F3EFE6] text-lg sm:text-2xl leading-tight truncate">
                    {{ title }}
                  </h3>
                </div>
              </slot>

              <!-- Close Button (Touch Friendly 44x44px target) -->
              <button
                type="button"
                class="w-10 h-10 rounded-full text-text-muted dark:text-[#C5BBAF] hover:text-on-surface dark:hover:text-white hover:bg-surface-container dark:hover:bg-white/10 transition-colors cursor-pointer active:scale-95 flex items-center justify-center shrink-0 ml-2"
                title="Tutup Dialog"
                @click="$emit('update:modelValue', false)"
              >
                <span class="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <!-- Body with Large, Bright, Readable Typography -->
            <div class="px-5 sm:px-8 py-5 sm:py-7 overflow-y-auto text-sm sm:text-base text-text-primary dark:text-[#E6DFD5] leading-relaxed custom-scrollbar flex-1 pb-8 sm:pb-6">
              <slot />
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              class="flex items-center justify-end gap-3 px-5 sm:px-8 py-3.5 sm:py-5 border-t border-border-subtle/70 dark:border-transparent shrink-0 bg-surface-secondary dark:bg-[#1E1B18]"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
