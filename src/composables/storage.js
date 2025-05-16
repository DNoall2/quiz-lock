import { ref, watch, toRaw } from 'vue';

export function useExtensionStorage(key, defaultValue = []) {
  const data = ref(defaultValue);

  const isExtension = typeof browser !== 'undefined' && browser.storage;

  // Load from storage
  if (isExtension) {
    browser.storage.local.get(key).then((result) => {
      console.log(`[${key}]) Loaded from storage:`, result[key]);
      if (result[key]) {
        data.value = result[key];
      }
    });
  } else {
    const stored = localStorage.getItem(key);
    if (stored) {
      console.log(`[${key}]) Loaded from localStorage:`, stored);
      data.value = JSON.parse(stored);
    }
  }

  // Watch and save on change
  watch(data, (newValue) => {
    const raw = toRaw(newValue);
    console.log(`[${key}]) Saved to storage:`, raw);
      if (isExtension) {
        browser.storage.local.set({ [key]: toRaw(newValue) });
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    },
    { deep: true },
  );

  return data;
}
