export function createInitialQuizState() {
  return {
    currentQuestionIndex: 0,
    selectedAnswers: [],
    score: 0,
    feedback: null,
    isComplete: false,
  };
}

export function getCurrentQuestion(questions, quizState) {
  return questions[quizState.currentQuestionIndex] ?? null;
}

export function submitQuizAnswer(questions, quizState, selectedOptionId) {
  const currentQuestion = getCurrentQuestion(questions, quizState);

  if (!currentQuestion || quizState.isComplete || quizState.feedback) {
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

  return {
    ...quizState,
    selectedAnswers: updatedSelectedAnswers,
    score: calculateQuizScore(updatedSelectedAnswers),
    feedback: {
      questionId: currentQuestion.id,
      selectedOptionId,
      isCorrect: selectedOption.isCorrect,
      explanation: currentQuestion.explanation,
    },
  };
}

export function goToNextQuizQuestion(questions, quizState) {
  if (!quizState.feedback) {
    return quizState;
  }

  const isLastQuestion =
    quizState.currentQuestionIndex === questions.length - 1;

  if (isLastQuestion) {
    return {
      ...quizState,
      feedback: null,
      isComplete: true,
    };
  }

  return {
    ...quizState,
    currentQuestionIndex: quizState.currentQuestionIndex + 1,
    feedback: null,
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
  const uniqueAnswers = getUniqueAnswers(quizState.selectedAnswers);
  const correctCount = uniqueAnswers.filter((answer) => answer.isCorrect).length;

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
  const uniqueAnswers = getUniqueAnswers(selectedAnswers);

  return uniqueAnswers.filter((answer) => answer.isCorrect).length;
}

function getUniqueAnswers(selectedAnswers) {
  const latestAnswerByQuestion = new Map();

  selectedAnswers.forEach((answer) => {
    latestAnswerByQuestion.set(answer.questionId, answer);
  });

  return Array.from(latestAnswerByQuestion.values());
}