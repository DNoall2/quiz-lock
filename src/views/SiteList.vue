<template>
  <div class="site-list">
    <div>
      <h1>Site List</h1>
    </div>

    <div>
      <p v-if="siteAlreadyExists" class="exists-warning">This site already exists in your list!</p>
    </div>

    <div>
      <input v-model="newSite" type="text" id="site-input" @click="handleSiteExistsText" />
      <button @click="addSite">Add</button>
      <button @click="clearInput">Clear</button>
    </div>

    <div>
      <ul>
        <li v-for="(site, index) in sites" :key="index">
          <BlockedSite :site="site" @remove="removeSite(index)" :onUpdate="(newSite) => updateSite(index, newSite)" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BlockedSite from '../components/BlockedSite.vue';
import { useExtensionStorage } from '../composables/storage.js';

const sites = useExtensionStorage('sites', []);
const newSite = ref('');

const siteAlreadyExists = ref(false);

function handleSiteExistsText() {
  if (siteAlreadyExists.value === true) {
    siteAlreadyExists.value = false;
  }
}

function addSite() {
  const trimmed = newSite.value.trim();
  const exists = sites.value.some((site) => site.name.toLowerCase().includes(trimmed));
  if (trimmed && !exists) {
    sites.value.push({ name: trimmed, hours: 0, minutes: 1, enabled: true }); // default to 0 hours and 1 minute
    newSite.value = '';
  } else {
    siteAlreadyExists.value = true;
  }
}

function clearInput() {
  newSite.value = '';
}

function updateSite(index, updatedSite) {
  sites.value[index] = { ...sites.value[index], ...updatedSite };
}

function removeSite(index) {
  sites.value.splice(index, 1);
}
</script>

<style scoped>
.site-list {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--background-color);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', Roboto, sans-serif;
}

.site-list h1 {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 1.5rem;
}

/* Input row */
.site-list > div:nth-child(3) {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.site-list input[type='text'] {
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--background-highlight);
  border-radius: 6px;
  transition: border-color 0.2s;
}

.site-list input[type='text']:focus {
  border-color: var(--accent-color);
  outline: none;
}

/* Buttons */
.site-list button {
  background-color: var(--accent-color);
  color: white;
  padding: 0.5rem 0.9rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.site-list button:hover {
  transition: 0.3s;
  filter: brightness(85%);
}

.site-list button:nth-child(3) {
  background-color: #6c757d;
}

.site-list button:nth-child(3):hover {
  background-color: #5a6268;
}

/* List of sites */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  background-color: var(--background-highlight);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid var(--accent-color);
  transition: box-shadow 0.2s;
}

li:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style>
