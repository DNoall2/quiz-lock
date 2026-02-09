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
