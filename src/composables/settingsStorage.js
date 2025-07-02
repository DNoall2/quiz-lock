import { ref, watch, toRaw } from "vue";

const defaultSettings = {
  unblockDurationMinutes: 1,
  newQuestionButtonCountdownSeconds: 5,
  numberOfQuestions: 1,
};

const settings = ref({ ...defaultSettings });
const settingsReady = ref(false);

// Load settings from extension storage
browser.storage.local.get('settings').then((result) => {
  if (result.settings) {
    settings.value = { ...defaultSettings, ...result.settings }; // Merge default settings with user settings
  }
  settingsReady.value = true;
});

// Watch and save on change
watch(settings, (newValue) => {
  const raw = toRaw(newValue);
  console.log(`[settings]) Saved to storage:`, raw);
  browser.storage.local.set({ settings: raw });
}, { deep: true });

export function useSettingsStorage() {
  return {
    settings,
    settingsReady,
  };
}
