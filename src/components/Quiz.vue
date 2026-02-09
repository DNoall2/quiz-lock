<template>
  <div>
    <label>
      <input type="checkbox" v-model="quiz.enabled" />
      {{ props.quiz.name }}
    </label>
    <button @click="editingQuiz = true">edit</button>
    <button @click="$emit('delete-quiz')">delete</button>
  </div>

  <div v-if="editingQuiz" class="edit-popup-overlay">
    <div class="edit-popup">
      <label>
        Quiz:
        <input v-model="editedName" type="text" />
      </label>
    </div>
    <div class="popup-buttons">
      <button @click="saveEdit">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['quiz', 'onUpdate']);
const emit = defineEmits(['delete-quiz']);

const editingQuiz = ref(false);
const editedName = ref(props.quiz.name || '');

watch(() => props.quiz, () => {
  if (!editingQuiz.value) {
    editedName.value = props.quiz.name || '';
  }
});

function saveEdit() {
  if (props.onUpdate) {
    props.onUpdate({
      name: editedName.value.trim(),
    });
  }
  editingQuiz.value = false;
}

function cancelEdit() {
  editedName.value = props.quiz.name;
  editingQuiz.value = false;
}

</script>

<style scoped></style>
