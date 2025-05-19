<template>
  <div>
    <h1>Blocked</h1>

    <button @click="pickRandomQuestion">Get Random Question</button>
    <div v-if="currentQuestion">
      <h2>{{ currentQuestion.question }}</h2>

      <ul v-if="currentAnswers.length">
        <li v-for="(choice, index) in currentAnswers" :key="index">
          <label>
            <input type="radio" :value="choice" v-model="selectedAnswer" name="quiz-options" @change="checkAnswer" />
            {{ choice }}
          </label>
        </li>
      </ul>

      <div v-else>
        <input type="text" v-model="selectedAnswer" placeholder="Enter your answer" @keyup.enter="checkAnswer" />
        <button @click="checkAnswer">Check Answer</button>
      </div>

      <p v-if="result !== null">
        {{ result ? 'Correct!' : 'Incorrect. Try again.' }}
      </p>
    </div>
    <div v-else>
      <h2>No quizzes available</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuizStorage } from '../composables/quizStorage.js';

const { quizzes } = useQuizStorage();

const currentQuestion = ref(null);
const currentAnswers = ref([]);
const selectedAnswer = ref('');
const result = ref(null);

// computed list of enabled quizzes
const enabledQuizzes = computed(() => quizzes.value.filter((q) => q.enabled));

// Pick a random quiz and question
function pickRandomQuestion() {
  if (enabledQuizzes.value.length === 0) {
    currentQuestion.value = null;
    currentAnswers.value = [];
    return;
  }

  const quiz = enabledQuizzes.value[Math.floor(Math.random() * enabledQuizzes.value.length)];

  if (!quiz.data || quiz.data.length === 0) {
    currentQuestion.value = null;
    currentAnswers.value = [];
    return;
  }

  const question = quiz.data[Math.floor(Math.random() * quiz.data.length)];

  currentQuestion.value = question;
  currentAnswers.value = question.choices || [];
}

function checkAnswer(index) {
  if (!currentAnswers.value || !selectedAnswer.value) {
    result.value = null;
    return;
  }

  const isCorrect = selectedAnswer.value.toLowerCase() === currentQuestion.value.answer.toLowerCase();
  result.value = isCorrect;

  if (isCorrect) {
    browser.storage.local.get(['blockedUrl', 'temporarilyAllowed']).then((result) => {
      const targetUrl = result.blockedUrl;
      const allowed = result.temporarilyAllowed || [];
      console.log(`[Blocked] Redirecting to:`, targetUrl);

      allowed.push(targetUrl);
      browser.storage.local.set({ temporarilyAllowed: allowed }).then(() => {
        window.location.href = targetUrl;
      });
    });
  }
}

onMounted(() => {
  pickRandomQuestion();
});
</script>

<style lang="scss" scoped></style>
