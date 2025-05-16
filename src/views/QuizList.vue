<template>
  <div>
    <h1>Quiz List</h1>
    <input type="file" @change="handleImport" accept=".json" />

    <ul>
      <li v-for="quiz in quizzes" :key="quiz.id">
        <label>
          <input type="checkbox" v-model="quiz.enabled" @change="toggleQuiz(quiz.id)" />
          {{ quiz.name }}
        </label>
        <button @click="deleteQuiz(quiz.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useQuizStorage } from '../composables/quizStorage.js';

const { quizzes, importQuiz, toggleQuiz, deleteQuiz } = useQuizStorage();

function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const content = JSON.parse(reader.result);
      importQuiz(content, file.name);
    } catch (error) {
      console.error(error);
    }
  };
  reader.readAsText(file);
}
</script>

<style scoped></style>
