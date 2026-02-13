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
          <div class="quiz-left">
            <!--<input type="checkbox" v-model="quiz.enabled" :disabled="!quiz.isValid" />-->
            <button
              class="checkbox-button"
              :class="{ disabled: !quiz.isValid }"
              @click="toggleEnabled(quiz)"
              :disabled="!quiz.isValid"
            >
              <Icon :path="quiz.isValid ? (quiz.enabled ? mdiCheckboxMarked : mdiCheckboxBlankOutline) : mdiAlertOutline" :size="20" />
            </button>
            <span class="quiz-name">{{ quiz.name }}</span>
          <p v-if="!quiz.isValid" class="error">
            There are errors in one or more of your questions. This quiz will be disabled until conflicts are resolved.
          </p>
          </div>
          <div class="quiz-right">
            <IconButton @click="editQuiz(quiz)" :path="mdiPencil" size="24" class="rounded-button" />
            <IconButton @click="deleteQuiz(quiz.id)" :path="mdiDelete" size="24" class="rounded-button" />
          </div>
        </li>
      </ul>

      <hr />
      <h4>Local Quizzes</h4>
      <ul>
        <li v-for="quiz in quizzes.filter((q) => q.origin === 'local')" :key="quiz.id">
          <label>
            <input type="checkbox" v-model="quiz.enabled" />
            <span class="quiz-name">{{ quiz.name }}</span>
          </label>
          <div class="quiz-right">
            <IconButton @click="editQuiz(quiz)" :path="mdiPencil" size="24" />
            <IconButton @click="deleteQuiz(quiz.id)" :path="mdiDelete" size="24" />
          </div>
        </li>
      </ul>
      <IconButton @click="addQuiz" :path="mdiPlusBox" size="24" />
      <IconButton @click="exportQuizzes" :path="mdiFileExport" size="24" :label="'Export Quizzes'" class="rounded-button" />
    </div>

    <EditQuizModal
      v-if="selectedQuiz !== null"
      :selectedQuiz="selectedQuiz"
      @close="selectedQuiz = null"
      @update-quiz-validity="handleQuizValidity"
    />
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useQuizStorage } from '../composables/quizStorage.js';
import EditQuizModal from '../components/EditQuizModal.vue';
import IconButton from '../components/IconButton.vue';
import { mdiPlusBox, mdiFileExport, mdiPencil, mdiDelete, mdiCheckboxMarked, mdiCheckboxBlankOutline, mdiAlertOutline } from '@mdi/js';
import Icon from '../components/Icon.vue';

const { quizzes, importQuiz, deleteQuiz } = useQuizStorage();
const selectedQuiz = ref(null);

const obsidianQuizzes = quizzes.value.filter((q) => q.origin === 'obsidian');

const importFailedMessage = ref(null);


// -----------------------------
// Adding / Deleting
// -----------------------------

// Add new blank quiz
function addQuiz() {
  const newQuiz = {
    name: 'Untitled Quiz',
    enabled: true,
    origin: 'local',
    data: [],
  };
  importQuiz(newQuiz, newQuiz.name, newQuiz.origin);
}

// DELETION HANDLED BY useQuizStorage


// -----------------------------
// Import / Export
// -----------------------------
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
            importQuiz(quiz, quiz.tag || 'Untitled Quiz', quiz.origin || 'obsidian');
          } else if (quiz.data && Array.isArray(quiz.data)) {
            importQuiz(quiz, quiz.tag || 'Untitled Quiz', quiz.origin || 'local');
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

function exportQuizzes() {
  const data = JSON.stringify({ quizzes: quizzes.value });
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quiz-lock-quizzes.json';
  link.click();
}


// -----------------------------
// Editing
// -----------------------------
function editQuiz(quiz) {
  selectedQuiz.value = quiz;
  console.log('Selected Quiz:', selectedQuiz.value);
}

function handleQuizValidity({ isValid, disable }) {
  if (!selectedQuiz.value) return;
  selectedQuiz.value.isValid = isValid;
  if (disable) selectedQuiz.value.enabled = false;
}

// -----------------------------
// Helpers
// -----------------------------
function toggleEnabled(quiz) {
  if (!quiz.isValid) return;
  quiz.enabled = !quiz.enabled;
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
  gap: 0.5rem;
  font-weight: 800;
}

.quiz-left {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
}

.quiz-name {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 1.2rem;
  position: relative;
  top: -1px;
}

.quiz-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}


/* Buttons */
.rounded-button {
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.rounded-button:hover {
  background-color: var(--accent-color-shade);
}

.checkbox-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--text-color);
  transition: transform 0.15s ease, color 0.2s ease;

  display: flex;
  justify-content: center;
  align-items: center;
}

.checkbox-button:hover:not(.disabled) {
  transform: scale(1.2);
  color: var(--accent-color);
}

.checkbox-button.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  color: var(--error-color);
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
