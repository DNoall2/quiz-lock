import { ref, watch, toRaw, reactive } from "vue";
import { v4 as uuidv4 } from "uuid";

export function useQuizStorage() {
  const quizzes = ref([]);

  // Load from extension storage
  if (typeof browser !== "undefined" && browser.storage) {
    browser.storage.local.get("quizzes").then((result) => {
      console.log(`[quizzes]) Loaded from storage:`, result.quizzes);
      if (result.quizzes) {
        quizzes.value = result.quizzes;
      }
    });

    // Watch and save on change
    watch(
      quizzes,
      (newValue) => {
        const raw = toRaw(newValue);
        console.log(`[quizzes]) Saved to storage:`, raw);
        browser.storage.local.set({ quizzes: toRaw(newValue) });
      },
      { deep: true },
    );
  }

  function importQuiz(quiz, name = "Untitled Quiz", origin = 'obsidian') {
    const data = quiz.questions || quiz.data;
    const newQuestions = data.map((entry) => {
      return {
        type: entry.choices && entry.choices.length > 0 ? "multiple" : "short",
        question: entry.question,
        answer: entry.answer,
        choices: entry.choices || [],
      };
    });
    // check for duplicates
    const existingQuiz = quizzes.value.find((q) => q.name === name);
    if (existingQuiz && existingQuiz.name != "Untitled Quiz" ) {
      const existingQuestionsSet = new Set(
        existingQuiz.data.map((q) => q.question.trim().toLowerCase()),
      );
      const filteredNewQuestions = newQuestions.filter(
        (q) => !existingQuestionsSet.has(q.question.trim().toLowerCase()),
      );
      if (filteredNewQuestions.length > 0) {
        existingQuiz.data.push(...filteredNewQuestions);
      }
    } else if (quiz.id) {
      console.log("Importing quiz with id:", quiz.id);
      const newQuiz = {
        id: quiz.id,
        name: quiz.name,
        enabled: quiz.enabled,
        isValid: quiz.isValid,
        origin: quiz.origin,
        data: newQuestions,
      };
      quizzes.value.push(reactive(newQuiz));
    } else {
      const newQuiz = {
        id: uuidv4(),
        name,
        enabled: true,
        isValid: true,
        origin,
        data: newQuestions,
      };
      quizzes.value.push(reactive(newQuiz));
    }
  }

  function deleteQuiz(id) {
    const index = quizzes.value.findIndex((q) => q.id === id);
    if (index !== -1) quizzes.value.splice(index, 1);
  }

  return {
    quizzes,
    importQuiz,
    deleteQuiz,
  };
}
