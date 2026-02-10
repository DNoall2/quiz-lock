<template>
  <div>
    <div class="page-container">
      <h1>Quiz List</h1>
      <div class="import">
        <input type="file" @change="handleImport" accept=".json" />
        <p v-if="importFailedMessage" class="error">
          {{ importFailedMessage }}
        </p>
      </div>

      <h4 v-if="obsidianQuizzes.length > 0">Obsidian Quizzes</h4>
      <ul>
        <li v-for="quiz in quizzes.filter((q) => q.origin === 'obsidian')" :key="quiz.id">
          <label>
            <input type="checkbox" v-model="quiz.enabled" :disabled="!quiz.isValid" />
            {{ quiz.name }}
          </label>
          <p v-if="!quiz.isValid" class="error">There are errors in one or more of your questions. This quiz will be disabled until conflicts are resolved.</p>
          <button @click="editQuiz(quiz)">Edit</button>
        </li>
      </ul>

      <hr />
      <h4>Local Quizzes</h4>
      <ul>
        <li v-for="quiz in quizzes.filter((q) => q.origin === 'local')" :key="quiz.id">
          <label>
            <input type="checkbox" v-model="quiz.enabled" />
            {{ quiz.name }}
          </label>
          <span>
            <button @click="editQuiz(quiz)" class="edit-quiz-button">Edit</button>
            <button @click="deleteQuiz(quiz.id)" class="delete-quiz-button">Delete</button>
          </span>
        </li>
      </ul>
      <button @click="addQuiz" class="add-quiz-button">Add Quiz</button>
    </div>

    <EditQuizModal v-if="selectedQuiz !== null" :selectedQuiz="selectedQuiz" @close="selectedQuiz = null" @update-quiz-validity="handleQuizValidity" />
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useQuizStorage } from '../composables/quizStorage.js';
import EditQuizModal from '../components/EditQuizModal.vue';

const { quizzes, importQuiz, deleteQuiz } = useQuizStorage();
const selectedQuiz = ref(null);

const obsidianQuizzes = quizzes.value.filter((q) => q.origin === 'obsidian');

const importFailedMessage = ref(null);

function addQuiz() {
  const newQuiz = {
    name: 'Untitled Quiz',
    enabled: true,
    origin: 'local',
    data: [],
  };
  importQuiz(newQuiz.data, newQuiz.name, newQuiz.origin);
}

function handleImport(event) {
  importFailedMessage.value = null;

  const input = event.target;
  const file = input.files[0];

  input.value = '';

  if (!file) {
    importFailedMessage.value = 'Error: file not found';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const content = JSON.parse(reader.result);
      console.log(`[IMPORT] Parsed content:`, content);
      if (content.quizzes && Array.isArray(content.quizzes)) {
        content.quizzes.forEach((quiz) => {
          if (quiz.questions && Array.isArray(quiz.questions)) {
            importQuiz(quiz.questions, quiz.tag || 'Untitled Quiz', quiz.origin || 'obsidian');
          }
        });
      } else {
        importFailedMessage.value = 'Invalid quiz format';
        console.error('Invalid quiz format');
      }
    } catch (error) {
      console.error(error);
      importFailedMessage.value = 'Failed to parse JSON file';
    }
  };
  reader.onerror = (error) => {
    console.error(`[IMPORT] FileReader error:`, error);
  };
  reader.readAsText(file);
}

function editQuiz(quiz) {
  selectedQuiz.value = quiz;
  console.log("Selected Quiz:", selectedQuiz.value);
}

function handleQuizValidity({ isValid, disable }) {
  if (!selectedQuiz.value) return;
  selectedQuiz.value.isValid = isValid;
  if (disable) selectedQuiz.value.enabled = false;
}
</script>

<style scoped>
/* Base page styling */
.page-container {
  font-family: 'Segoe UI', Roboto, sans-serif;
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: var(--surface-1);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* Header */
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

/* File input */
.import {
  margin-bottom: 1.5rem;
}

/* Quiz list */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  background-color: var(--surface-2);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.2s;
}

li:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

/* Buttons */
button {
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: var(--accent-color-shade);
}

.delete-quiz-button {
  background-color: var(--error-color);
}

.delete-quiz-button:hover {
  transition: 0.3s;
  filter: brightness(85%);
}

.add-quiz-button {
  background-color: var(--accent-color);
  color: white;
  border: none;
  display: block;
  margin-left: auto;
}

.error {
  color: var(--error-color);
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
</style>
