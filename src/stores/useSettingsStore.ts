import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  const isSettingsDrawerOpen = ref<boolean>(false);
  const fontSize = ref<'small' | 'medium' | 'large'>(
    (localStorage.getItem('gm-font-size') as any) || 'medium'
  );
  const typewriterSpeed = ref<number>(
    Number(localStorage.getItem('gm-typewriter-speed')) || 30 // ms per char
  );
  const bgmVolume = ref<number>(
    Number(localStorage.getItem('gm-bgm-volume')) || 70 // 0-100
  );
  const isMuted = ref<boolean>(
    localStorage.getItem('gm-is-muted') === 'true' || false
  );
  const autoAdvance = ref<boolean>(
    localStorage.getItem('gm-auto-advance') === 'true' || false
  );
  const autoAdvanceDelay = ref<number>(
    Number(localStorage.getItem('gm-auto-advance-delay')) || 2500 // ms
  );

  const openSettings = () => {
    isSettingsDrawerOpen.value = true;
  };

  const closeSettings = () => {
    isSettingsDrawerOpen.value = false;
  };

  const toggleSettings = () => {
    isSettingsDrawerOpen.value = !isSettingsDrawerOpen.value;
  };

  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    fontSize.value = size;
    localStorage.setItem('gm-font-size', size);
  };

  const setTypewriterSpeed = (speed: number) => {
    typewriterSpeed.value = speed;
    localStorage.setItem('gm-typewriter-speed', speed.toString());
  };

  const setBgmVolume = (volume: number) => {
    bgmVolume.value = volume;
    localStorage.setItem('gm-bgm-volume', volume.toString());
  };

  const toggleMute = () => {
    isMuted.value = !isMuted.value;
    localStorage.setItem('gm-is-muted', isMuted.value.toString());
  };

  const toggleAutoAdvance = () => {
    autoAdvance.value = !autoAdvance.value;
    localStorage.setItem('gm-auto-advance', autoAdvance.value.toString());
  };

  return {
    isSettingsDrawerOpen,
    fontSize,
    typewriterSpeed,
    bgmVolume,
    isMuted,
    autoAdvance,
    autoAdvanceDelay,
    openSettings,
    closeSettings,
    toggleSettings,
    setFontSize,
    setTypewriterSpeed,
    setBgmVolume,
    toggleMute,
    toggleAutoAdvance,
  };
});
