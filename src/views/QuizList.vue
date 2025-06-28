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
        <button @click="editQuiz(quiz)">Edit</button>
      </li>
    </ul>

    <dialog ref="editDialog" v-if="selectedQuiz"> 
      <h2>Edit Quiz: {{ selectedQuiz.name }}</h2>
      <form method="dialog">
        <div v-for="(question, index) in selectedQuiz.data" :key="index">
          <label>Question:
            <textarea v-model="question.question" rows="1" @input="autoGrow($event)" />
          </label>
          <br />
          <label>Answer:
            <textarea v-model="question.answer" rows="1" @input="autoGrow($event)"/> 
          </label>
          <br />
          <div v-if="question.type === 'multiple'">
            <label>Choices (comma-separated):
              <textarea :value="question.choices.join(', ')" @input="updateChoices($event.target.value, question)" rows="2" />
            </label>
          </div>
          <hr />
        </div>
        <button type="submit">Save</button>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useQuizStorage } from "../composables/quizStorage.js";

const { quizzes, importQuiz, deleteQuiz } = useQuizStorage();
const editDialog = ref(null);
const selectedQuiz = ref(null);

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
      if (content.quizzes && Array.isArray(content.quizzes)) {
        content.quizzes.forEach((quiz) => {
          if (quiz.questions && Array.isArray(quiz.questions)) {
            importQuiz(quiz.questions, quiz.tag || "Untitled Quiz");
          }
        });
      } else {
        console.error("Invalid quiz format");
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

function editQuiz(quiz) {
  selectedQuiz.value = quiz;
  nextTick(() => { editDialog.value?.showModal(); }); 
}

function updateChoices(value, question) {
  question.choices = value.split(",").map((choice) => choice.trim());
}

function autoGrow(event) { 
  event.target.style.height = "auto"; 
  event.target.style.height = `${event.target.scrollHeight}px`; 
}
</script>

<style scoped>
/* Base page styling */
div {
  font-family: 'Segoe UI', Roboto, sans-serif;
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #fafafa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* Header */
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

/* File input */
input[type="file"] {
  margin-bottom: 1.5rem;
}

/* Quiz list */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  background-color: #fff;
  border: 1px solid #ddd;
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

/* Buttons */
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #0056b3;
}

/* MODAL (dialog) */
dialog {
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1.5rem;
  border: none;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
}

dialog h2 {
  margin-top: 0;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

/* Form inside modal */
form {
  display: flex;
  flex-direction: column;
  gap: 1.0rem;
}

form label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #444;
}

form input {
  width: 90%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

form textarea { 
  width: 90%;
  padding: 0.5rem;
  border: 1px solid #ccc; 
  border-radius: 6px; 
  font-size: 1rem; 
  resize: vertical; 
  min-height: 1rem;
  line-height: 1.5; 
}

/* Choice input inside modal */
form > div {
  background-color: #f7f7f7;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

form hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 0.5rem 0;
}

/* Save button inside modal */
form button[type="submit"] {
  align-self: flex-end;
  margin-top: 1rem;
}
</style>
