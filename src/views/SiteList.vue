<template>
  <div class="site-list">
    <div>
      <h1>Site List</h1>
    </div>

    <div>
      <input v-model="newSite" type="text" />
      <button @click="addSite">Add</button>
      <button @click="clearInput">Clear</button>
    </div>

    <div>
      <ul>
        <li v-for="(site, index) in sites" :key="index">
          <BlockedSite :site="site" @remove="removeSite(index)" :onUpdate="(newName) => updateSite(index, newName)" />
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

function addSite() {
  const trimmed = newSite.value.trim();
  if (trimmed) {
    sites.value.push(trimmed);
    newSite.value = '';
  }
}

function clearInput() {
  newSite.value = '';
}

function updateSite(index, newName) {
  sites.value[index] = newName.trim();
}

function removeSite(index) {
  sites.value.splice(index, 1);
}
</script>

<style lang="scss" scoped></style>
