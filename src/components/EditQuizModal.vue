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
          <IconButton @click="addQuestion" :path="mdiPlusBox" size="24" class="add-question-button" />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import IconButton from './IconButton.vue';
import { mdiPlusBox } from '@mdi/js';

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
  overflow-x: hidden;
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

.add-question-button {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: sticky;
  border: none;
  bottom: 0;
  width: 100%;
  align-self: flex-end;
  background-color: transparent;
  margin-top: 1rem;
  color: var(--text-color);
}

.add-question-button::before,
.add-question-button::after {
  content: " ";
  display: block;
  height: 2px;
  background-color: var(--text-color);
  position: absolute;
  top: 50%;
  width: 45%;
}

.add-question-button::before {
  right: 0;
}

.add-question-button::after {
  left: 0;
}

.add-question-button:hover {
  color: var(--accent-color);
  background-color: transparent;
}

.add-question-button:hover::before, .add-question-button:hover::after {
  background-color: var(--accent-color);
}

/* Save button inside modal */
button[type='submit'] {
  align-self: flex-end;
  margin-top: 1rem;
}

</style>
