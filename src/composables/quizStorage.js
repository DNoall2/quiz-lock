import { ref, watch, toRaw, reactive } from 'vue'; 
import { v4 as uuidv4 } from 'uuid';

export function useQuizStorage() {
  const quizzes = ref([]);

  // Load from extension storage
  if (typeof browser !== 'undefined' && browser.storage) {
    browser.storage.local.get('quizzes').then((result) => {
      console.log(`[quizzes]) Loaded from storage:`, result.quizzes);
      if (result.quizzes) {
        quizzes.value = result.quizzes;
      }
    });

    // Watch and save on change
    watch(quizzes, (newValue) => {
      const raw = toRaw(newValue);
      console.log(`[quizzes]) Saved to storage:`, raw);
      browser.storage.local.set({ quizzes: toRaw(newValue) });
    }, { deep: true });
  }

  function importQuiz(data, name = 'Untitled Quiz') {
    const quiz = {
      id: uuidv4(),
      name,
      enabled: true,
      data: data.map(entry => {
        if ('choices' in entry && entry.choices.length > 0) {
          return {
            type: 'multiple',
            question: entry.question,
            answer: entry.answer,
            choices: entry.choices,
          };
        } else {
          return {
            type: 'short',
            question: entry.question,
            answer: entry.answer,
          };
        }
      })
    };
    quizzes.value.push(reactive(quiz)); 
  }

  function deleteQuiz(id) {
    const index = quizzes.value.findIndex(q => q.id === id);
    if (index !== -1) quizzes.value.splice(index, 1);
  }

  return {
    quizzes,
    importQuiz,
    deleteQuiz,
  };
}


