import { ref, watch } from 'vue';

export function useExtensionStorage(key, defaultValue = []) {
  const data = ref(defaultValue);

  const isExtension = typeof browser !== 'undefined' && browser.storage;

  // Load from storage
  if (isExtension) {
    browser.storage.local.get(key).then((result) => {
      if (result[key]) {
        data.value = result[key];
      }
    });
  } else {
    const stored = localStorage.getItem(key);
    if (stored) data.value = JSON.parse(stored);
  }
  

  // Watch and save on change
  watch(data, (newValue) => {
    if (isExtension) {
      browser.storage.local.set({ [key]: newValue });
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  }, { deep: true });
    

  return data;
}
