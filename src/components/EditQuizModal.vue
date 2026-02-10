<template>
  <div class="backdrop" @click="$emit('close')">
    <div class="edit-quiz-modal" @click.stop>
      <input type="text" v-model="selectedQuiz.name" class="quiz-name" placeholder="Quiz Name" />
      <p v-if="!isValid" class="error">
        There are errors in one of your questions. You will not be able to use them until all errors are resolved.
      </p>
      <form method="dialog">
        <div v-for="(question, index) in selectedQuiz.data || []" :key="index">
          <Question :question="question" @validation="handleValidation(index, $event)" />
          <hr />
        </div>
        <div class="end-buttons">
          <button type="button" @click="addQuestion" class="add-question-button">Add Question</button>
          <!--<button type="submit" @click="$emit('save-quiz', selectedQuiz)">Save</button>-->
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

import Question from './Question.vue';

const props = defineProps({
  selectedQuiz: Object,
});
const emit = defineEmits(['save-quiz', 'update-quiz-validity']);

const questionErrors = ref({});
const isValid = computed(() => {
  return Object.keys(questionErrors.value).length === 0;
});

watch(isValid, (valid) => {
  emit('update-quiz-validity', {
    isValid: valid,
    disable: !valid
  });
}, { immediate: true });

function addQuestion() {
  props.selectedQuiz.data.push({
    question: '',
    answer: '',
    type: 'multiple',
    choices: [],
  });
}

function handleValidation(index, payload) {
  if (payload.hasError) {
    questionErrors.value[index] = payload.errors;
  } else {
    delete questionErrors.value[index];
  }
}

function handleUpdateQuestion({index, update}) {
  props.selectedQuiz.data[index] = update
}
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.7);

  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-quiz-modal {
  position: relative;
  width: 50vw;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1.5rem;
  border: none;
  border-radius: 12px;
  background: var(--surface-0);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

.quiz-name {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  font-size: 2rem;
  background-color: var(--surface-0);
  color: var(--text-color);
}

.error {
  color: var(--error-color);
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

/* Form inside modal */
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

button {
  position: sticky;
  bottom: 0;
}

button:hover {
  background-color: var(--accent-color-shade);
}

.end-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: sticky;
  bottom: 0;
}

/* Save button inside modal */
button[type='submit'] {
  align-self: flex-end;
  margin-top: 1rem;
}

.add-question-button {
  align-self: flex-end;
  margin-top: 1rem;
}
</style>
