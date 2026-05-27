export function createInitialQuizState() {
  return {
    currentQuestionIndex: 0,
    selectedAnswers: [],
    score: 0,
    isComplete: false,
  };
}

export function getCurrentQuestion(questions, quizState) {
  return questions[quizState.currentQuestionIndex] ?? null;
}

export function submitQuizAnswer(questions, quizState, selectedOptionId) {
  const currentQuestion = getCurrentQuestion(questions, quizState);

  if (!currentQuestion || quizState.isComplete) {
    return quizState;
  }

  const selectedOption = currentQuestion.options.find((option) => {
    return option.id === selectedOptionId;
  });

  if (!selectedOption) {
    return quizState;
  }

  const answerRecord = {
    questionId: currentQuestion.id,
    selectedOptionId,
    isCorrect: selectedOption.isCorrect,
  };

  const updatedSelectedAnswers = [
    ...quizState.selectedAnswers,
    answerRecord,
  ];

  const isLastQuestion =
    quizState.currentQuestionIndex === questions.length - 1;

  return {
    currentQuestionIndex: isLastQuestion
      ? quizState.currentQuestionIndex
      : quizState.currentQuestionIndex + 1,
    selectedAnswers: updatedSelectedAnswers,
    score: calculateQuizScore(updatedSelectedAnswers),
    isComplete: isLastQuestion,
  };
}

export function restartQuiz() {
  return createInitialQuizState();
}

export function getQuizProgress(questions, quizState) {
  if (questions.length === 0) {
    return {
      answeredCount: 0,
      totalCount: 0,
      percentage: 0,
    };
  }

  const answeredCount = quizState.selectedAnswers.length;
  const percentage = Math.round((answeredCount / questions.length) * 100);

  return {
    answeredCount,
    totalCount: questions.length,
    percentage,
  };
}

export function getQuizResultSummary(questions, quizState) {
  const correctCount = quizState.selectedAnswers.filter((answer) => {
    return answer.isCorrect;
  }).length;

  return {
    correctCount,
    totalCount: questions.length,
    score: quizState.score,
    percentage: questions.length
      ? Math.round((correctCount / questions.length) * 100)
      : 0,
  };
}

function calculateQuizScore(selectedAnswers) {
  return selectedAnswers.filter((answer) => answer.isCorrect).length;
}