<template>
  <span class="site">
    {{ props.site.name }}
    <div class="site-buttons">
    <button class="material-symbols-outlined" @click="editing = true">edit</button>
    <button class="material-symbols-outlined" @click="emit('remove')">delete</button>
    </div>
  </span>

  <div v-if="editing" class="edit-popup-overlay">
    <div class="edit-popup">
      <label>
        Site: 
        <input v-model="editedName" type="text" />
      </label>
      <label>
        Hours:
        <input v-model.number="editedHours" type="number" min="0" max="24" />
      </label>
      <label>
        Minutes:
        <input v-model.number="editedMinutes" type="number" min="0" max="60" />
      </label>
      <label>
        Enabled:
        <input v-model="editedEnabled" type="checkbox" />
      </label>
      
      <div>
        <button @click="saveEdit">Save</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['site', 'onUpdate']);
const emit = defineEmits(['remove']);

const editing = ref(false);
const editedName = ref(props.site.name || '');
const editedHours = ref(props.site.hours || 0);
const editedMinutes = ref(props.site.minutes || 0);
const editedEnabled = ref(props.site.enabled || false);

watch(() => props.site, () => {
    if (!editing.value) {
      editedName.value = props.site.name || '';
      editedHours.value = props.site.hours || 0;
      editedMinutes.value = props.site.minutes || 0;
      editedEnabled.value = props.site.enabled || false;
    }
});

function saveEdit() {
  if (props.onUpdate) {
    props.onUpdate({
      name: editedName.value.trim(),
      hours: editedHours.value,
      minutes: editedMinutes.value,
      enabled: editedEnabled.value,
    });
  }
  editing.value = false;
}

function cancelEdit() {
  editedName.value = props.site.name;
  editedHours.value = props.site.hours || 0;
  editedMinutes.value = props.site.minutes || 0;
  editedEnabled.value = props.site.enabled || false;
  editing.value = false;
}
</script>

<style scoped>

.site {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
}

.site-buttons {
  display: flex;
  gap: 0.25rem;
}

.site-buttons button {
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 0 10px;
}

.site-buttons button:nth-child(2) {
  background-color: var(--error-color);
}

.site-buttons button:hover {
  transition: 0.3s;
  filter: brightness(85%);
}

.edit-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-popup {
  background: var(--background-highlight);
  padding: 1rem;
  border-radius: 0.5rem;
  width: 30rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.edit-popup label {
  display: block;
  margin: 10px 0;
}

.popup-buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

</style>
