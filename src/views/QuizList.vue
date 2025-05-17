<template>
  <div>
    <h1>Quiz List</h1>
    <input type="file" @change="handleImport" accept=".json" />

    <ul>
      <li v-for="quiz in quizzes" :key="quiz.id">
        <label>
          <input type="checkbox" v-model="quiz.enabled" />
          {{ quiz.name }}
        </label>
        <button @click="deleteQuiz(quiz.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useQuizStorage } from '../composables/quizStorage.js';

const { quizzes, importQuiz, deleteQuiz } = useQuizStorage();

function handleImport(event) {
  const file = event.target.files[0];
  console.log(`[IMPORT] File:`, file);
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      console.log(`[IMPORT] FileReader result:`, reader.result);
      const content = JSON.parse(reader.result);
      console.log(`[IMPORT] Parsed content:`, content);
      if (Array.isArray(content)) {
        importQuiz(content, file.name);
      } else {
        console.error('Invalid file format');
      }
    } catch (error) {
      console.error(error);
    }
  };
  reader.onerror = (error) => {
    console.error(`[IMPORT] FileReader error:`, error);
  };
  reader.readAsText(file);
}
</script>

<style scoped></style>
