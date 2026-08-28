<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title?: string;
  icon?: string;
  side?: 'left' | 'right';
}

withDefaults(defineProps<Props>(), {
  modelValue: false,
  side: 'right',
});

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
        @click.self="$emit('update:modelValue', false)"
      >
        <Transition
          enter-active-class="transition duration-300 ease-out transform"
          :enter-from-class="side === 'right' ? 'translate-x-full' : '-translate-x-full'"
          enter-to-class="translate-x-0"
          leave-active-class="transition duration-200 ease-in transform"
          leave-from-class="translate-x-0"
          :leave-to-class="side === 'right' ? 'translate-x-full' : '-translate-x-full'"
        >
          <div
            class="fixed top-0 bottom-0 flex flex-col bg-surface-secondary border-border-subtle shadow-2xl z-50 w-full sm:max-w-md"
            :class="[
              side === 'right' ? 'right-0 border-l' : 'left-0 border-r'
            ]"
          >
            <!-- Drawer Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-border-subtle/60 bg-surface-container/50">
              <div class="flex items-center gap-2.5">
                <span v-if="icon" class="material-symbols-outlined text-primary text-[22px]">{{ icon }}</span>
                <h3 class="font-headline-h3 font-bold text-on-surface text-lg">{{ title }}</h3>
              </div>
              <button
                type="button"
                class="p-1 rounded-full text-text-muted dark:text-zinc-300 hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                @click="$emit('update:modelValue', false)"
              >
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <!-- Drawer Content -->
            <div class="flex-1 overflow-y-auto px-6 py-5">
              <slot />
            </div>

            <!-- Drawer Footer -->
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-border-subtle/60 bg-surface-container/30">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
