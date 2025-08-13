<template>
  <div v-if="settingsReady">
  <div class="settings-page">
    <h1>Settings</h1>

    <h2>Appearance</h2>
    <div class="form-group">
      <label for="themeMode">Theme:</label>
      <label class="theme-mode-switch">
        <input type="checkbox" id="themeMode" v-model="settings.themeMode" />
        <span class="slider round"></span>
      </label>
    </div>

    <div class="form-group">
      <label for="accentColor">Accent Color:</label>
      <input type="color" id="accentColor" v-model="settings.accentColor" />
    </div>

    <h2>Question Settings</h2>
    <div class="form-group">
      <label for="unblockDurationMinutes">Unblock Duration (minutes):</label>
      <input type="number" id="unblockDurationMinutes" v-model="settings.unblockDurationMinutes" />
    </div>

    <div class="form-group">
      <label for="newQuestionButtonCountdownSeconds"
        >New Question Button Countdown (seconds):</label
      >
      <input
        type="number"
        id="newQuestionButtonCountdownSeconds"
        v-model="settings.newQuestionButtonCountdownSeconds"
      />
    </div>

    <div class="form-group">
      <label for="numberOfQuestions">Number of Questions:</label>
      <input type="number" id="numberOfQuestions" v-model="settings.numberOfQuestions" />
    </div>
  </div>
  </div>
  <div v-else>
    <h1>Loading...</h1>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useSettingsStorage } from '../composables/settingsStorage.js';

const { settings, settingsReady } = useSettingsStorage();

// Watch and update color
watch(settings.value.accentColor, (newValue) => {
  document.documentElement.style.setProperty('--accent-color', newValue);
  settings.value.accentColor = newValue;
});

/* THEME MODE */

// Watch and update theme
watch(settings.value.themeMode, (newValue) => {
  settings.value.themeMode = newValue;
});
</script>

<style scoped>
.settings-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--background-color);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.settings-page h1 {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: var(--text-color);
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-color);
}

input[type='number'] {
  padding: 0.5rem;
  border: 1px solid var(--background-highlight);
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input[type='number']:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}

.theme-mode-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.theme-mode-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--background-highlight);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: var(--accent-color);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--accent-color);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
