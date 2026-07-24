import { questions } from './questions.js';

const quizCard = document.getElementById('quiz-card');
let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;

function renderQuiz() {
  const question = questions[currentQuestionIndex];

  quizCard.innerHTML = `
    <div class="question-header">
      <span class="question-count">Question ${currentQuestionIndex + 1} of ${questions.length}</span>
      <h2>${question.question}</h2>
    </div>
    <div class="choices" role="list">
      ${question.choices
        .map(
          (choice, index) =>
            `<button type="button" class="choice-button" data-index="${index}">${choice}</button>`
        )
        .join('')}
    </div>
    <div class="quiz-controls">
      <button type="button" id="next-button" class="next-button" disabled>Next</button>
    </div>
  `;

  quizCard.querySelectorAll('.choice-button').forEach((button) => {
    button.addEventListener('click', handleChoiceClick);
  });

  document.getElementById('next-button').addEventListener('click', handleNextClick);
}

function handleChoiceClick(event) {
  if (hasAnswered) {
    return;
  }

  const selectedIndex = Number(event.currentTarget.dataset.index);
  const question = questions[currentQuestionIndex];
  const correctIndex = question.answerIndex;

  hasAnswered = true;

  quizCard.querySelectorAll('.choice-button').forEach((button) => {
    const buttonIndex = Number(button.dataset.index);

    button.disabled = true;
    button.classList.add('disabled-choice');

    if (buttonIndex === correctIndex) {
      button.classList.add('correct-choice');
    }

    if (buttonIndex === selectedIndex && buttonIndex !== correctIndex) {
      button.classList.add('wrong-choice');
    }
  });

  if (selectedIndex === correctIndex) {
    score += 1;
  }

  const feedback = document.createElement('div');
  feedback.className = 'feedback';
  feedback.textContent = selectedIndex === correctIndex
    ? 'Correct! Great job.'
    : `Wrong answer. The correct answer is “${question.choices[correctIndex]}”.`;

  quizCard.querySelector('.quiz-controls').prepend(feedback);
  document.getElementById('next-button').disabled = false;
}

function handleNextClick() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex += 1;
    hasAnswered = false;
    renderQuiz();
    return;
  }

  showResult();
}

function showResult() {
  quizCard.innerHTML = `
    <div class="result-card">
      <h2>Quiz complete!</h2>
      <p class="result-text">You scored ${score} out of ${questions.length}.</p>
      <button type="button" id="restart-button" class="restart-button">Try again</button>
    </div>
  `;

  document.getElementById('restart-button').addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    hasAnswered = false;
    renderQuiz();
  });
}

renderQuiz();

