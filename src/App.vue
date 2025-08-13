<template>
  <div>
    <NavBar />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { watch, onMounted } from 'vue';
import NavBar from './components/NavBar.vue';
import { useSettingsStorage } from './composables/settingsStorage.js';

const { settings } = useSettingsStorage();

watch(() => settings.value.accentColor, (newValue) => {
  document.documentElement.style.setProperty('--accent-color', newValue);
}, { immediate: true });

watch(() => settings.value.themeMode, (isDark) => {
  document.documentElement.classList.toggle('dark', isDark);
}, { immediate: true });

/* onMounted(() => {
  if (settings.value.themeMode) {
    document.documentElement.classList.add('dark');
  }
}); */
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
<style>
:root {
  --background-color: #fff;
  --background-highlight: #f0f0f0;

  --text-color: #333;

  --accent-color: #d65d0e;
  --accent-color-shade: #b94c0a;
  --accent-color-highlight: #e8a400;

  --success-color: #4caf50;
  --warning-color: #ff9800;
  --error-color: #f44336;
  --info-color: #00bcd4;
}

:root.dark {
  --background-color: #282828;
  --background-highlight: #32302f;

  --text-color: #f0f0f0;

  --accent-color: #d65d0e;
  --accent-color-shade: #b94c0a;
  --accent-color-highlight: #e8a400;

  --success-color: #4caf50;
  --warning-color: #ff9800;
  --error-color: #f44336;
  --info-color: #00bcd4;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
  padding: 0;
  margin: 0;
}
</style>
