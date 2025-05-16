// src/composables/useQuizStorage.js
import { useExtensionStorage } from './storage.js';
import { v4 as uuidv4 } from 'uuid';

export function useQuizStorage() {
  const quizzes = useExtensionStorage('quizzes', []);

  function importQuiz(data, name = 'Untitled Quiz') {
    const quiz = {
      id: uuidv4(),
      name,
      enabled: true,
      data: JSON.parse(JSON.stringify(data)), // the actual quiz content
    };
    quizzes.value.push(quiz);
  }

  function toggleQuiz(id) {
    const quiz = quizzes.value.find(q => q.id === id);
    if (quiz) quiz.enabled = !quiz.enabled;
  }

  function deleteQuiz(id) {
    const index = quizzes.value.findIndex(q => q.id === id);
    if (index !== -1) quizzes.value.splice(index, 1);
  }

  return {
    quizzes,
    importQuiz,
    toggleQuiz,
    deleteQuiz
  };
}


