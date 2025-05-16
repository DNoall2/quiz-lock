<template>
  <span v-if="!editing">
    {{ props.site }}
    <button @click="editing = true" v-if="!editing">Edit</button>
    <button @click="emit('remove')">Remove</button>
  </span>

  <div v-else class="edit-popup">
    <input v-model="editedName" type="text">
    <button @click="saveEdit">Save</button>
    <button @click="cancelEdit">Cancel</button>
  </div>

</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['site', 'onUpdate'])
const emit = defineEmits(['remove'])

const editing = ref(false)
const editedName = ref(props.site)

watch(() => props.site, () => {
  if (!editing.value) editedName.value = props.site
})

function saveEdit() {
  if (props.onUpdate) props.onUpdate(editedName.value)
  editing.value = false
}

function cancelEdit() {
  editedName.value = props.site
  editing.value = false
}

</script>

<style scoped>

</style>
