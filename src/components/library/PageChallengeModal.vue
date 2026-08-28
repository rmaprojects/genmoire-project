<script setup lang="ts">
import { ref } from 'vue';
import GModal from '@/components/common/GModal.vue';
import GInput from '@/components/common/GInput.vue';
import GButton from '@/components/common/GButton.vue';

const props = defineProps<{
  modelValue: boolean;
  question: string;
  hint?: string;
  expectedWord: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const userAnswer = ref<string>('');
const errorMessage = ref<string>('');

const handleVerify = () => {
  if (userAnswer.value.trim().toLowerCase() === props.expectedWord.trim().toLowerCase()) {
    errorMessage.value = '';
    emit('success');
    emit('update:modelValue', false);
  } else {
    errorMessage.value = `Kata kunci tidak cocok. Pastikan memeriksa halaman yang tepat pada buku fisik Anda!`;
  }
};
</script>

<template>
  <GModal
    :modelValue="modelValue"
    title="Kuis Verifikasi Buku Fisik"
    icon="quiz"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <div class="space-y-5">
      <div class="p-5 rounded-2xl bg-primary-container/15 border border-primary/30 text-on-surface">
        <p class="text-xs font-sans font-bold text-primary uppercase mb-1.5">Tantangan Halaman Fisik</p>
        <p class="text-base font-bold leading-relaxed">{{ question }}</p>
        <p v-if="hint" class="text-xs text-text-muted mt-2 italic">Petunjuk: {{ hint }}</p>
      </div>

      <GInput
        v-model="userAnswer"
        placeholder="Ketik kata jawaban..."
        label="Jawaban Kata Kunci"
        icon="edit"
        clearable
        @enter="handleVerify"
      />

      <p v-if="errorMessage" class="text-xs font-semibold text-error">
        {{ errorMessage }}
      </p>
    </div>

    <template #footer>
      <GButton variant="ghost" size="sm" @click="$emit('update:modelValue', false)">
        Batal
      </GButton>
      <GButton variant="primary" size="sm" icon="check" @click="handleVerify">
        Verifikasi & Buka
      </GButton>
    </template>
  </GModal>
</template>
