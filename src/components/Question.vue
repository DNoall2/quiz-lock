<template>
  <div class="question">
    <label
      >Question Type:
      <select v-model="question.type">
        <option value="multiple">Multiple Choice</option>
        <option value="short">Short Answer</option>
      </select>
    </label>
    <br />
    <label
      >Question:
      <textarea v-model="question.question" rows="1" @input="autoGrow($event)" @blur="touched = true" />
      <p v-if="errors.question && touched" class="error">{{ errors.question }}</p>
    </label>
    <br />
    <label
      >Answer:
      <textarea v-model="question.answer" rows="1" @input="autoGrow($event)" @blur="touched = true" />
      <p v-if="errors.answer && touched" class="error">{{ errors.answer }}</p>
    </label>
    <br />
    <div v-if="question.type === 'multiple'">
      <label>Choices (comma-separated): </label>
      <div v-for="(choice, index) in question.choices || []" :key="index" class="choice-row">
        <input type="text" v-model="question.choices[index]" />
        <button @click="deleteChoice(index)">Delete</button>
      </div>
      <button @click="addChoice">Add Choice</button>
      <p v-if="errors.choices && touched" class="error">{{ errors.choices }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const touched = ref(false);

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['validation']); 

// ---------- CHOICES ----------
watch(
  () => props.question.type,
  (type) => {
    if (type === 'multiple' && !Array.isArray(props.question.choices)) {
      props.question.choices = [];
    }
  }, { immediate: true }
);

function addChoice() {
  props.question.choices.push('');
}

function deleteChoice(index) {
  props.question.choices.splice(index, 1);
}

// ---------- ERRORS ----------
const errors = computed(() => {
  const errs = {};
  const q = props.question ?? {};

  if (!q.question || q.question.length === 0) {
    errs.question = "Question is required";
  }

  if (!q.answer) {
    errs.answer = "Answer is required";
  }

  if (q.type === 'multiple' && (!q.choices || q.choices.length < 2)) {
    errs.choices = "At least 2 choices are required";
  }

  return errs;
});

watch(errors, (newErrors) => {
  if (!props.question) return;
  emit('validation', { hasError: Object.keys(newErrors).length > 0, errors: newErrors });
}, { immediate: true });

// Input field growth functions
function autoGrow(event) {
  event.target.style.height = 'auto';
  event.target.style.height = `${event.target.scrollHeight}px`;
}
</script>

<style scoped>
.question {
  background-color: var(--background-color);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--background-highlight);
}

.error {
  color: var(--error-color);
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--text-color);
}

input {
  width: 90%;
  padding: 0.5rem;
  border: 1px solid var(--background-highlight);
  border-radius: 6px;
  font-size: 1rem;
}

textarea {
  width: 90%;
  padding: 0.5rem;
  border: 1px solid var(--background-highlight);
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  min-height: 1rem;
  line-height: 1.5;
}

/* Choice input inside modal */
div {
  background-color: var(--background-color);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--background-highlight);
}

hr {
  border: none;
  border-top: 1px solid var(--background-highlight);
  margin: 0.5rem 0;
}

.choice-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.choice-row input {
  flex: 1;
}

.choice-row button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--error-color);
  font-size: 1.2rem;
}
</style>
