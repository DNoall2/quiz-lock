<template>
  <div class="blocked-page">
    <h1>Blocked</h1>

    <button :disabled="isNewQuestionButtonDisabled" @click="handleNewQuestion">
      {{ isNewQuestionButtonDisabled ? `Wait ${newQuestionButtonCountdown} seconds` : 'New Question' }}
    </button>
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

      <div v-else class="short-answer-input">
        <span>
          <input type="text" v-model="selectedAnswer" placeholder="Enter your answer" @keyup.enter.prevent="checkAnswer" />
          <button @click="checkAnswer">Check Answer</button>
        </span>
      </div>

      <p v-if="result !== null">
        {{ result ? 'Correct!' : 'Incorrect. Try again.' }}
      </p>
    </div>

    <div v-else>
      <h2>No quizzes available</h2>
    </div>

    <div class="unblock-timer">
      <h2>Unblock in: {{ unblockTimer }}</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useQuizStorage } from '../composables/quizStorage.js';

const { quizzes } = useQuizStorage();

watch(quizzes, (newVal) => {
  if (newVal && newVal.length > 0) {
    pickRandomQuestion();
  }
});

const currentQuestion = ref(null);
const currentAnswers = ref([]);
const selectedAnswer = ref('');
const result = ref(null);

const isNewQuestionButtonDisabled = ref(false);
const newQuestionButtonCountdown = ref(0);
const unblockTimer = ref(0);

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

function checkAnswer() {
  if (!currentAnswers.value || !selectedAnswer.value) {
    result.value = null;
    return;
  }

  const isCorrect = selectedAnswer.value.toLowerCase() === currentQuestion.value.answer.toLowerCase();
  result.value = isCorrect;

  if (isCorrect) {
    browser.storage.local.get(['blockedUrl', 'temporarilyAllowed', 'sites']).then((result) => {
      const targetUrl = result.blockedUrl;
      const allowed = result.temporarilyAllowed || [];
      const sites = result.sites || [];
      console.log(`[Blocked] Redirecting to:`, targetUrl);
      
      const domain = new URL(targetUrl).hostname;
      const siteEntry = sites.find((site) => typeof site === 'object' && domain.includes(site.name));
      const duration = (siteEntry.hours || 0) * 60 * 60 + (siteEntry.minutes || 0) * 60;
      const expiresAt = Date.now() + duration * 1000;

      allowed.push({url: targetUrl, expiresAt});
      browser.storage.local.set({ temporarilyAllowed: allowed }).then(() => {
        window.location.href = targetUrl;
      });
    });
  }
}

function handleNewQuestion() {
  const waitTime = 5; // Change this to a user-defined wait time
  pickRandomQuestion();
  isNewQuestionButtonDisabled.value = true;
  newQuestionButtonCountdown.value = waitTime;

  const interval = setInterval(() => {
    newQuestionButtonCountdown.value -= 1;

    if (newQuestionButtonCountdown.value <= 0) {
      clearInterval(interval);
      isNewQuestionButtonDisabled.value = false;
    }
  }, 1000);
}

function startUnblockTimer() {
  const waitTime = 60; // Change this to a user-defined wait time in settings
  unblockTimer.value = waitTime;

  const interval = setInterval(() => {
    unblockTimer.value -= 1;

    if (unblockTimer.value <= 0) {
      clearInterval(interval);
      unblockTimer.value = 0;

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
  }, 1000);
}

onMounted(() => {
  if (quizzes.value.length > 0) {
    pickRandomQuestion();
  }
  startUnblockTimer();
});
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #282828;
}
</style>

<style scoped>

.blocked-page {
  background: #1e1e1e;
  color: #f0f0f0;
  max-width: 600px;
  width: 90%;
  margin: 3rem auto;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.35);
  font-family: 'Segoe UI', Roboto, sans-serif;
}

.blocked-page h1 {
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.blocked-page h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #dddddd;
}

.blocked-page button {
  background-color: #4a90e2;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: background-color 0.2s;
}

.blocked-page button:hover:enabled {
  background-color: #3b7dd8;
}

.blocked-page button:disabled {
  background-color: #666;
  cursor: not-allowed;
}

ul {
  list-style: none;
  padding: 0;
  width: 100%;
}

li {
  margin: 0.5rem 0;
}

label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #2c2c2e;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  transition: background 0.2s;
  cursor: pointer;
}

label:hover {
  background: #3c3c3f;
}

input[type="radio"] {
  accent-color: #4a90e2;
}

.short-answer-input input[type="text"] {
  padding: 0.5rem;
  width: 100%;
  border-radius: 6px;
  border: none;
  background-color: #2c2c2e;
  color: #f0f0f0;
  font-size: 1rem;
  margin-bottom: 1rem;
}


.short-answer-input button {
  margin-top: 0.5rem;
}

.short-answer-input span {
  display: flex;
  flex-direction: column;
  width: 100%;
}

p {
  margin-top: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: #6ad76a;
}

p:has(+ input[type="radio"]:checked):not(:has(+ input[value='{{ currentQuestion.answer }}']:checked)) {
  color: #e56a6a;
}

.unblock-timer {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #2a2a2d;
  border-radius: 8px;
  font-size: 1.2rem;
  color: #ccc;
}
</style>
