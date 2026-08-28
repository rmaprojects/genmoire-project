import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const isDarkMode = ref<boolean>(
    localStorage.getItem('gm-theme') === 'dark' || false
  );
  const isReaderView = ref<boolean>(false);

  // When inside reader view, dark mode is always locked active
  const activeDark = computed(() => {
    return isReaderView.value ? true : isDarkMode.value;
  });

  const toggleTheme = () => {
    if (isReaderView.value) return; // Cannot toggle while in reader view
    isDarkMode.value = !isDarkMode.value;
    localStorage.setItem('gm-theme', isDarkMode.value ? 'dark' : 'light');
    applyThemeClass();
  };

  const setReaderViewLock = (locked: boolean) => {
    isReaderView.value = locked;
    applyThemeClass();
  };

  const applyThemeClass = () => {
    if (activeDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize on app start
  applyThemeClass();

  return {
    isDarkMode,
    isReaderView,
    activeDark,
    toggleTheme,
    setReaderViewLock,
    applyThemeClass,
  };
});
