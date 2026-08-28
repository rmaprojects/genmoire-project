<script setup lang="ts">
import { ref, watch } from 'vue';
import GModal from '@/components/common/GModal.vue';
import GButton from '@/components/common/GButton.vue';

const props = defineProps<{
  modelValue: boolean;
  targetPrompt: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'refined', newUrl: string): void;
}>();

const customPrompt = ref<string>(props.targetPrompt);
const isProcessing = ref<boolean>(false);
const logs = ref<string[]>([]);

watch(
  () => props.targetPrompt,
  (val) => {
    customPrompt.value = val;
  }
);

const runRefinement = () => {
  isProcessing.value = true;
  logs.value = [
    'User reported visual mood mismatch.',
    'Parsing syntactic tokens from chapter narrative...',
    `Base Prompt: "${customPrompt.value.substring(0, 50)}..."`,
    'Applying Negative Scrim Weights: [oversaturated, modern artifacts, distorted anatomy]',
    'Injecting Aesthetic Token: "Warm Material Narrative, 35mm cinematic film grain, golden hour sepia"',
    'Rendering updated background canvas via Imagen 3 Pipeline...',
  ];

  setTimeout(() => {
    logs.value.push('SUCCESS: High-fidelity canvas generated with 45% contrast calibration.');
    isProcessing.value = false;
    const refinedUrl = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80';
    emit('refined', refinedUrl);
    setTimeout(() => {
      emit('update:modelValue', false);
    }, 800);
  }, 1600);
};
</script>

<template>
  <GModal
    :modelValue="modelValue"
    title="Refinement Terminal — Crowdsourced AI Loop"
    icon="terminal"
    maxWidth="lg"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <div class="space-y-4">
      <div class="p-4 rounded-2xl bg-[#0F0E0C] text-[#4ADE80] font-sans text-xs border border-white/10 shadow-inner max-h-60 overflow-y-auto space-y-1">
        <p class="text-zinc-500">// Simulating Client-Side AI Prompt Refinement Loop...</p>
        <p v-for="(log, idx) in logs" :key="idx" class="leading-relaxed">
          <span class="text-primary-fixed-dim">></span> {{ log }}
        </p>
        <div v-if="isProcessing" class="flex items-center gap-2 text-primary-fixed-dim pt-2">
          <span class="inline-block w-2 h-4 bg-[#4ADE80] animate-pulse"></span>
          <span>Memproses penyempurnaan generasi...</span>
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-xs font-bold text-text-secondary uppercase tracking-wider">
          Prompt Visual yang Dimurnikan (Refined Prompt):
        </label>
        <textarea
          v-model="customPrompt"
          rows="3"
          class="w-full bg-surface-container/80 border border-border-subtle rounded-xl p-3.5 text-sm font-sans text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none shadow-inner"
          placeholder="Tulis instruksi perbaikan visual CG..."
        />
      </div>
    </div>

    <template #footer>
      <GButton variant="ghost" size="sm" @click="$emit('update:modelValue', false)">
        Batal
      </GButton>
      <GButton
        variant="primary"
        size="sm"
        icon="magic_button"
        :loading="isProcessing"
        @click="runRefinement"
      >
        Jalankan Refinement Loop
      </GButton>
    </template>
  </GModal>
</template>
