<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useReaderStore } from '@/stores/useReaderStore';

const readerStore = useReaderStore();
const logContainerRef = ref<HTMLElement | null>(null);

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  if (!target) return;
  const isBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 15;
  if (isBottom) {
    readerStore.closeHistoryLog();
  }
};

onMounted(() => {
  nextTick(() => {
    if (logContainerRef.value) {
      logContainerRef.value.scrollTop = logContainerRef.value.scrollHeight;
    }
  });
});
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
        v-if="readerStore.isHistoryLogOpen"
        class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
        @click.self="readerStore.closeHistoryLog"
      >
        <!-- Header -->
        <div class="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b border-white/15">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary-fixed-dim text-2xl">history_edu</span>
            <div>
              <h2 class="font-display-lg text-xl sm:text-2xl font-bold text-white">
                Log Riwayat Bacaan (Backlog)
              </h2>
              <p class="text-xs font-sans text-zinc-400">
                Scroll ke bawah hingga mentok untuk otomatis menutup log dan kembali ke cerita.
              </p>
            </div>
          </div>

          <button
            type="button"
            class="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            @click="readerStore.closeHistoryLog"
          >
            <span class="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <!-- Scrollable Log Content -->
        <div
          ref="logContainerRef"
          class="max-w-4xl w-full mx-auto flex-1 overflow-y-auto py-6 space-y-6 px-2 my-2 custom-scrollbar"
          @scroll="handleScroll"
        >
          <div
            v-for="(item, idx) in readerStore.readingHistory"
            :key="idx"
            class="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors space-y-2"
          >
            <div class="flex items-center justify-between text-xs font-sans text-primary">
              <span class="font-bold">{{ item.chapterTitle }}</span>
              <span v-if="item.speaker" class="px-2 py-0.5 rounded bg-primary-container/30 text-primary">
                {{ item.speaker }} <span v-if="item.speakerTitle" class="opacity-70">({{ item.speakerTitle }})</span>
              </span>
            </div>
            <p class="font-reading-body text-base sm:text-lg text-zinc-200 leading-relaxed">
              {{ item.text }}
            </p>
          </div>

          <div class="text-center py-6 text-xs font-sans text-primary/80 animate-pulse border-t border-white/10">
            ▼ Terus scroll ke bawah untuk kembali membaca... ▼
          </div>
        </div>

        <!-- Bottom Return Indicator -->
        <div class="max-w-4xl w-full mx-auto pt-3 border-t border-white/15 flex items-center justify-between text-xs font-sans text-zinc-400">
          <span>{{ readerStore.readingHistory.length }} Paragraf Tersimpan</span>
          <button
            type="button"
            class="px-4 py-2 rounded-xl bg-primary-container text-white font-bold hover:bg-primary transition-colors cursor-pointer"
            @click="readerStore.closeHistoryLog"
          >
            Tutup Log Riwayat
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
