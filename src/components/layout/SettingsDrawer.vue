<script setup lang="ts">
import GDrawer from '@/components/common/GDrawer.vue';
import GToggle from '@/components/common/GToggle.vue';
import GButton from '@/components/common/GButton.vue';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useThemeStore } from '@/stores/useThemeStore';

const settingsStore = useSettingsStore();
const themeStore = useThemeStore();
</script>

<template>
  <GDrawer
    :modelValue="settingsStore.isSettingsDrawerOpen"
    title="Pengaturan Membaca"
    icon="tune"
    @update:modelValue="settingsStore.closeSettings"
  >
    <div class="space-y-6">
      <!-- Section: Tampilan -->
      <div>
        <p class="text-xs font-bold uppercase tracking-wider text-primary mb-3">Tampilan & Gaya</p>
        <div class="space-y-4 bg-surface-container/60 p-4 rounded-2xl border border-border-subtle/70">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-on-surface">Tema Warna</p>
              <p class="text-xs text-text-muted">Mode Terang (Sepia) / Mode Gelap (Obsidian)</p>
            </div>
            <GToggle
              :modelValue="themeStore.activeDark"
              :disabled="themeStore.isReaderView"
              @update:modelValue="themeStore.toggleTheme"
            />
          </div>

          <div class="border-t border-border-subtle/40 pt-3">
            <p class="text-xs font-bold text-on-surface mb-2">Ukuran Huruf Naskah</p>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="size in (['small', 'medium', 'large'] as const)"
                :key="size"
                type="button"
                :class="[
                  'py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer',
                  settingsStore.fontSize === size
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface-secondary text-text-secondary border-border-subtle hover:bg-surface-container'
                ]"
                @click="settingsStore.setFontSize(size)"
              >
                {{ size === 'small' ? 'Kecil (S)' : size === 'medium' ? 'Standar (M)' : 'Besar (L)' }}
              </button>
            </div>
          </div>

          <div class="border-t border-border-subtle/40 pt-3">
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs font-bold text-on-surface">Kecepatan Muncul Teks</span>
              <span class="text-xs font-sans text-primary font-bold">{{ settingsStore.typewriterSpeed }} ms/karakter</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              :value="settingsStore.typewriterSpeed"
              class="w-full accent-primary cursor-pointer"
              @input="settingsStore.setTypewriterSpeed(Number(($event.target as HTMLInputElement).value))"
            />
            <div class="flex justify-between text-[11px] font-sans text-text-muted mt-1">
              <span>Cepat (10ms)</span>
              <span>Standar (30ms)</span>
              <span>Lambat (60ms)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Audio Ambient -->
      <div>
        <p class="text-xs font-bold uppercase tracking-wider text-primary mb-3">Musik Latar & Suara</p>
        <div class="space-y-4 bg-surface-container/60 p-4 rounded-2xl border border-border-subtle/70">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-on-surface">Bisukan Suara (Mute)</p>
              <p class="text-xs text-text-muted">Matikan musik latar dan efek suara</p>
            </div>
            <GToggle
              :modelValue="settingsStore.isMuted"
              @update:modelValue="settingsStore.toggleMute"
            />
          </div>

          <div class="border-t border-border-subtle/40 pt-3">
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs font-bold text-on-surface">Volume Musik</span>
              <span class="text-xs font-sans text-primary font-bold">{{ settingsStore.bgmVolume }}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              :value="settingsStore.bgmVolume"
              :disabled="settingsStore.isMuted"
              class="w-full accent-primary disabled:opacity-50 cursor-pointer"
              @input="settingsStore.setBgmVolume(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>
      </div>

      <!-- Section: Otomatisasi -->
      <div>
        <p class="text-xs font-bold uppercase tracking-wider text-primary mb-3">Otomatisasi</p>
        <div class="space-y-4 bg-surface-container/60 p-4 rounded-2xl border border-border-subtle/70">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-on-surface">Lanjut Otomatis</p>
              <p class="text-xs text-text-muted">Lanjut ke kalimat berikutnya saat teks selesai muncul</p>
            </div>
            <GToggle
              :modelValue="settingsStore.autoAdvance"
              @update:modelValue="settingsStore.toggleAutoAdvance"
            />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="w-full flex justify-end">
        <GButton variant="primary" size="md" @click="settingsStore.closeSettings">
          Selesai
        </GButton>
      </div>
    </template>
  </GDrawer>
</template>
