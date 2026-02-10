<template>
  <div class="blocked-page">
    <h1>Blocked</h1>

    <button :disabled="isNewQuestionButtonDisabled" @click="handleNewQuestion">
      {{
        isNewQuestionButtonDisabled
          ? `Wait ${newQuestionButtonCountdown} seconds`
          : "New Question"
      }}
    </button>
    <button @click="openInObsidian">View in Obsidian</button>
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
          <input type="text" v-model="selectedAnswer" placeholder="Enter your answer"
            @keyup.enter.prevent="checkAnswer" />
          <button @click="checkAnswer">Check Answer</button>
        </span>
      </div>

      <p v-if="result !== null">
        {{ result ? "Correct!" : "Incorrect. Try again." }}
      </p>
    </div>

    <div v-else>
      <h2>No quizzes available</h2>
    </div>

    <div class="unblock-timer" v-if="settings.unblockTimerToggle">
      <h2>Unblock in: {{ unblockTimer }}</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useQuizStorage } from "../composables/quizStorage.js";
import { useSettingsStorage } from "../composables/settingsStorage.js";

const { quizzes } = useQuizStorage();
const { settings, settingsReady } = useSettingsStorage();

watch(settingsReady, (ready) => {
  if (ready) {
    if (settings.value.unblockTimerToggle) startUnblockTimer();
    const themeMode = settings.value.themeMode;
    document.documentElement.classList.toggle('dark', themeMode);
  }
});

watch(quizzes, (newVal) => {
  if (newVal && newVal.length > 0) {
    pickRandomQuestion();
  }
});

const currentQuestion = ref(null);
const currentAnswers = ref([]);
const selectedAnswer = ref("");
const result = ref(null);

const isNewQuestionButtonDisabled = ref(false);
const newQuestionButtonCountdown = ref(0);
const unblockTimer = ref(0);

const correctAnswersCount = ref(0);
const askedQuestions = ref([]);

// computed list of enabled quizzes
const enabledQuizzes = computed(() => quizzes.value.filter((q) => q.enabled));

// Pick a random quiz and question
function pickRandomQuestion() {
  if (enabledQuizzes.value.length === 0) {
    currentQuestion.value = null;
    currentAnswers.value = [];
    return;
  }

  const eligableQuizzes = enabledQuizzes.value.filter((quiz) => quiz.data?.some(q => !askedQuestions.value.includes(q.question)));

  if (eligableQuizzes.length === 0) {
    console.log(`[Blocked] No quizzes with unasked questions found`);
    currentQuestion.value = null;
    currentAnswers.value = [];
    return;
  }

  const quiz =
    eligableQuizzes[
    Math.floor(Math.random() * eligableQuizzes.length)
    ];


  const unaskedQuestions = quiz.data.filter((q) => !askedQuestions.value.includes(q.question));
  if (unaskedQuestions.length === 0) {
    console.log(`[Blocked] No unasked questions found for quiz ${quiz.name}`);
    askedQuestions.value = []; // Reset asked questions
    return;
  }

  const question = unaskedQuestions[Math.floor(Math.random() * unaskedQuestions.length)];
  askedQuestions.value.push(question.question);

  currentQuestion.value = question;
  currentAnswers.value = question.choices || [];
}

function openInObsidian() {
  const vault = "CodexArcana";
  const file = currentQuestion.value.file;
  console.log(`[Blocked] Opening ${file} in Obsidian`);
  const uri = `obsidian://open?vault=${encodeURIComponent(vault)}&file=${encodeURIComponent(file)}`;
  window.location.href = uri;
}

function checkAnswer() {
  if (!currentAnswers.value || !selectedAnswer.value) {
    result.value = null;
    return;
  }

  const isCorrect =
    selectedAnswer.value.toLowerCase() ===
    currentQuestion.value.answer.toLowerCase();
  result.value = isCorrect;

  if (isCorrect) {
    correctAnswersCount.value += 1;

    const requiredNumberOfCorrectAnswers = settings.value.numberOfQuestions;
    if (correctAnswersCount.value >= requiredNumberOfCorrectAnswers) {
      browser.storage.local
        .get(["blockedUrl", "temporarilyAllowed", "sites"])
        .then((result) => {
          const targetUrl = result.blockedUrl;
          const allowed = result.temporarilyAllowed || [];
          const sites = result.sites || [];
          console.log(`[Blocked] Redirecting to:`, targetUrl);

          const domain = new URL(targetUrl).hostname;
          const siteEntry = sites.find(
            (site) => typeof site === "object" && domain.includes(site.name),
          );
          const duration =
            (siteEntry.hours || 0) * 60 * 60 + (siteEntry.minutes || 0) * 60;
          const expiresAt = Date.now() + duration * 1000;

          allowed.push({ url: targetUrl, expiresAt });
          browser.storage.local
            .set({ temporarilyAllowed: allowed })
            .then(() => {
              window.location.href = targetUrl;
            });
        });
    } else {
      selectedAnswer.value = "";
      pickRandomQuestion();
    }
  }
}

function handleNewQuestion() {
  const waitTime = settings.value.newQuestionButtonCountdownSeconds;
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
  const waitTime = settings.value.unblockDurationMinutes * 60;
  unblockTimer.value = waitTime;
  console.log(
    `[Blocked] Unblock timer started with wait time: ${waitTime} seconds`,
  );

  const interval = setInterval(() => {
    unblockTimer.value -= 1;

    if (unblockTimer.value <= 0) {
      clearInterval(interval);
      unblockTimer.value = 0;

      browser.storage.local
        .get(["blockedUrl", "temporarilyAllowed"])
        .then((result) => {
          const targetUrl = result.blockedUrl;
          const allowed = result.temporarilyAllowed || [];
          console.log(`[Blocked] Redirecting to:`, targetUrl);

          allowed.push(targetUrl);
          browser.storage.local
            .set({ temporarilyAllowed: allowed })
            .then(() => {
              window.location.href = targetUrl;
            });
        });
    }
  }, 1000);
}

onMounted(() => {
  correctAnswersCount.value = 0;
  askedQuestions.value = [];
  if (quizzes.value.length > 0) {
    pickRandomQuestion();
  }
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
  background-color: var(--surface-0);
}
</style>

<style scoped>
.blocked-page {
  background: var(--surface-1);
  color: #f0f0f0;
  max-width: 600px;
  width: 90%;
  margin: 3rem auto;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.35);
  font-family: "Segoe UI", Roboto, sans-serif;
}

.blocked-page h1 {
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.blocked-page h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.blocked-page button {
  background-color: var(--accent-color);
  color: var(--text-color);
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: background-color 0.2s;
}

.blocked-page button:hover:enabled {
  transition: 0.3s;
  filter: brightness(85%);
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
  background: var(--surface-2);
  padding: 0.6rem 1rem;
  border-radius: 6px;
  transition: background 0.2s;
  cursor: pointer;
}

label:hover {
  background: #3c3c3f;
}

input[type="radio"] {
  accent-color: var(--accent-color);
}

.short-answer-input input[type="text"] {
  padding: 0.5rem;
  width: 100%;
  border-radius: 6px;
  border: none;
  background-color: var(--surface-2);
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
  color: var(--success-color);
}

p:has(+ input[type="radio"]:checked):not( :has(+ input[value="{{ currentQuestion.answer }}"]:checked)) {
  color: var(--error-color);
}

.unblock-timer {
  margin-top: 2rem;
  padding: 1rem;
  background-color: var(--surface-1);
  border-radius: 8px;
  font-size: 1.2rem;
  color: #ccc;
}
</style>
