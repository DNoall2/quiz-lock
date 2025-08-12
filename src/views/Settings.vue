<template>
  <div class="settings-page">
    <h1>Settings</h1>

    <h4>Appearance</h4>
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

    <h4>Question Settings</h4>
    <div class="form-group">
      <label for="unblockDurationMinutes">Unblock Duration (minutes):</label>
      <input type="number" id="unblockDurationMinutes" v-model="settings.unblockDurationMinutes" />
    </div>

    <div class="form-group">
      <label for="newQuestionButtonCountdownSeconds">New Question Button Countdown (seconds):</label>
      <input type="number" id="newQuestionButtonCountdownSeconds" v-model="settings.newQuestionButtonCountdownSeconds" />
    </div>

    <div class="form-group">
      <label for="numberOfQuestions">Number of Questions:</label>
      <input type="number" id="numberOfQuestions" v-model="settings.numberOfQuestions" />
    </div>
  </div>
</template>

<script setup>
import { useSettingsStorage } from "../composables/settingsStorage.js";

const { settings } = useSettingsStorage();
</script>

<style scoped>
.settings-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f7f7f7;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.settings-page h1 {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #333;
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
  color: #444;
}

input[type="number"] {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input[type="number"]:focus {
  outline: none;
  border-color: #007bff;
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
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--color-accent);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--color-accent);
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
