import { part1Matching } from './data/part1-matching.js';
import { part2Identification } from './data/part2-identification.js';
import { part3Symbols } from './data/part3-symbols.js';
import { part4MultipleChoice } from './data/part4-multiple-choice.js';

const quizCard = document.getElementById('quiz-card');

function shuffle(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function createSections() {
  return [
    { name: 'Part 1 - Matching Type Questions', items: shuffle(part1Matching) },
    { name: 'Part 2 - Identification', items: shuffle(part2Identification) },
    { name: 'Part 3 - Identifying Electro-Technical Symbols', items: shuffle(part3Symbols) },
    { name: 'Part 4 - Multiple Choice', items: shuffle(part4MultipleChoice) },
  ];
}

let sections = createSections();
let currentSectionIndex = 0;
let currentQuestionIndex = 0;

let score = 0;
let wrongAnswers = 0;

let part3Correct = 0;
let part3Wrong = 0;

let hasAnswered = false;

function getCurrentQuestions() {
  return sections[currentSectionIndex].items;
}

function isMatchingSection() {
  return sections[currentSectionIndex].name.toLowerCase().includes('matching');
}

function normalizeAnswer(value) {
  return value.toLowerCase().trim().replace(/\s+/g, ' ');
}

function renderQuiz() {
  if (isMatchingSection()) {
    renderMatchingSection();
    return;
  }

  if (sections[currentSectionIndex].name.includes('Part 2')) {
    renderIdentificationSection();
    return;
  }

  if (sections[currentSectionIndex].name.includes('Part 3')) {
    renderSymbolSection();
    return;
  }

  const questions = getCurrentQuestions();
  const question = questions[currentQuestionIndex];

quizCard.innerHTML = `
<div class="question-header">
    <span class="question-count">
        ${sections[currentSectionIndex].name}
        • Question ${currentQuestionIndex + 1}
        of ${questions.length}
    </span>

    <h2>${question.question || question.prompt}</h2>
</div>

<div class="choices">

${question.choices.map((choice,index)=>`

<button
type="button"
class="choice-button"
data-index="${index}">

${choice}

</button>

`).join("")}

</div>

<div class="quiz-controls">

<button
id="next-button"
class="next-button">

Next

</button>

</div>
`;
  document.getElementById('next-button').addEventListener('click', handleNextClick);
}

function renderMatchingSection() {
  const questions = getCurrentQuestions();

  quizCard.innerHTML = `
    <div class="question-header">
      <span class="question-count">${sections[currentSectionIndex].name}</span>
      <h2>Identify the following by matching them with the selections given below.</h2>
      <p class="section-instruction">Write your answers in the space provided before the number.</p>
    </div>

    <div class="matching-instruction-card">
      <p>Part I. Matching Type Questions. The following are important things that Electro-Technical Officers onboard the ship should know for the safety of the crew, the equipment, and the environment. Identify the following by matching them with the selections given below. Write your answers in the space provided before the number.</p>
      <img class="matching-image" src="files/images/matching-type/matching-type.JPG" alt="Matching type answer reference image" />
    </div>

    <div class="matching-table-wrapper">
      <table class="matching-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Question</th>
            <th>Answer</th>
          </tr>
        </thead>
        <tbody>
          ${questions
            .map((question, index) => `
              <tr>
                <td>${index + 1}</td>
                <td class="question-cell">${question.prompt}</td>
                <td>
                  <input type="text" class="matching-input" data-index="${index}" autocomplete="off" spellcheck="false" aria-label="Answer for question ${index + 1}" />
                </td>
              </tr>
            `)
            .join('')}
        </tbody>
      </table>
    </div>

    <div class="quiz-controls">
      <button type="button" id="submit-button" class="next-button">Submit</button>
    </div>
  `;

  document.getElementById('submit-button').addEventListener('click', handleMatchingSubmit);
}

function renderIdentificationSection() {
  const questions = getCurrentQuestions();

  quizCard.innerHTML = `
    <div class="question-header">
      <span class="question-count">${sections[currentSectionIndex].name}</span>
      <h2>Identify the following terminologies used in electro-technical equipment relevant to the job of an Electro-Technical Officer onboard the ship.</h2>
      <p class="section-instruction">Write your answer in the space provided before the number.</p>
    </div>

    <div class="identification-list">
      ${questions
        .map((question, index) => `
          <div class="identification-item">
            <label class="identification-label" for="answer-${index}">${index + 1}. ${question.prompt}</label>
            <input id="answer-${index}" type="text" class="matching-input identification-input" data-index="${index}" autocomplete="off" spellcheck="false" aria-label="Answer for question ${index + 1}" />
          </div>
        `)
        .join('')}
    </div>

    <div class="quiz-controls">
      <button type="button" id="submit-button" class="next-button">Submit</button>
    </div>
  `;

  document.getElementById('submit-button').addEventListener('click', handleIdentificationSubmit);
}

function renderSymbolSection() {
  const questions = getCurrentQuestions();
  const question = questions[currentQuestionIndex];

  quizCard.innerHTML = `
    <div class="question-header">
      <span class="question-count">${sections[currentSectionIndex].name} • Question ${currentQuestionIndex + 1} of ${questions.length}</span>
      <p class="section-instruction">Identify the given symbol and briefly describe its function or operation.</p>
    </div>

    <div class="symbol-card">
      <img class="symbol-image" src="${question.image}" alt="Electro-Technical Symbol" />
      <div class="symbol-fields">
        <label class="identification-label" for="symbol-name-${currentQuestionIndex}">Name/Description</label>
        <input id="symbol-name-${currentQuestionIndex}" type="text" class="matching-input" data-role="name" />
        <label class="identification-label" for="symbol-function-${currentQuestionIndex}">Operation/Function</label>
        ${question.customTable
          ? `
            <div class="logic-table">
              <div class="logic-table-row logic-table-head">
                <span>${question.id === 19 ? 'A' : 'A'}</span>
                ${question.id === 19 ? '' : `<span>${question.id === 20 || question.id === 21 ? 'B' : ''}</span>`}
                <span>Q</span>
              </div>
              <div class="logic-table-row">
                <span>${question.id === 19 ? '0' : '0'}</span>
                ${question.id === 19 ? '' : `<span>${question.id === 20 || question.id === 21 ? '0' : ''}</span>`}
                <span>${question.id === 19 ? '1' : '0'}</span>
              </div>
              <div class="logic-table-row">
                <span>${question.id === 19 ? '1' : '0'}</span>
                ${question.id === 19 ? '' : `<span>${question.id === 20 || question.id === 21 ? '1' : ''}</span>`}
                <span>${question.id === 19 ? '0' : '0'}</span>
              </div>
              ${question.id === 19 ? '' : `
                <div class="logic-table-row">
                  <span>1</span>
                  <span>${question.id === 20 || question.id === 21 ? '0' : ''}</span>
                  <span>${question.id === 21 ? '1' : '0'}</span>
                </div>
              `}
              ${question.id === 20 || question.id === 21 ? `
                <div class="logic-table-row">
                  <span>1</span>
                  <span>1</span>
                  <span>1</span>
                </div>
              ` : ''}
            </div>
            <textarea id="symbol-function-${currentQuestionIndex}" class="matching-input symbol-textarea" data-role="function" placeholder="Type the operation/function here"></textarea>
          `
          : `<textarea id="symbol-function-${currentQuestionIndex}" class="matching-input symbol-textarea" data-role="function" placeholder="Type the operation/function here"></textarea>`}
      </div>
    </div>

    <div class="quiz-controls">
      <button type="button" id="next-button" class="next-button">Next</button>
    </div>
  `;

  document.getElementById('next-button').addEventListener('click', handleSymbolNext);
}

function handleChoiceClick(event) {
  if (hasAnswered) {
    return;
  }

  const questions = getCurrentQuestions();
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
  } else {
    wrongAnswers += 1;
  }

  const feedback = document.createElement('div');
  feedback.className = 'feedback';
  feedback.textContent = selectedIndex === correctIndex
    ? 'Correct! Great job.'
    : `Wrong answer. The correct answer is “${question.choices[correctIndex]}”.`;

  quizCard.querySelector('.quiz-controls').prepend(feedback);
  document.getElementById('next-button').disabled = false;
}

function handleMatchingSubmit() {
  const questions = getCurrentQuestions();
  const inputs = Array.from(quizCard.querySelectorAll('.matching-input'));
  const results = inputs.map((input, index) => {
    const actual = input.value.trim();
    const expected = questions[index].answer.trim();
    const isCorrect = normalizeAnswer(actual) === normalizeAnswer(expected);

    return { actual, expected, isCorrect };
  });

  const correctCount = results.filter((result) => result.isCorrect).length;
  const incorrectCount = results.length - correctCount;

  score += correctCount;
  wrongAnswers += incorrectCount;
  hasAnswered = true;

  quizCard.innerHTML = `
    <div class="question-header">
      <span class="question-count">${sections[currentSectionIndex].name}</span>
      <h2>Matching review</h2>
    </div>

    <div class="feedback-card">
      <div class="feedback-score">${correctCount}/${questions.length}</div>
      <p class="feedback-summary">You answered ${correctCount} correctly and ${incorrectCount} incorrectly.</p>
      <div class="review-list">
        ${results.map((result, index) => `
          <div class="review-item ${result.isCorrect ? 'review-correct' : 'review-wrong'}">
            <strong>${index + 1}.</strong> ${result.isCorrect ? '✅' : '❌'}
            <span>Your answer: ${result.actual || '—'}</span>
            <span>Correct answer: ${result.expected}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="quiz-controls">
      <button type="button" id="next-button" class="next-button">Next Section</button>
    </div>
  `;

  document.getElementById('next-button').addEventListener('click', handleNextClick);
}

function handleSymbolNext() {

    const questions = getCurrentQuestions();
    const question = questions[currentQuestionIndex];

    const nameInput = quizCard.querySelector('[data-role="name"]');
    const functionInput = quizCard.querySelector('[data-role="function"]');

    const nameAnswer = nameInput.value.trim();
    const functionAnswer = functionInput.value.trim();

    const isNameCorrect =
        normalizeAnswer(nameAnswer) === normalizeAnswer(question.answer);

    const isFunctionCorrect =
        normalizeAnswer(functionAnswer) === normalizeAnswer(question.functionAnswer);

    if (isNameCorrect) {
        score++;
        part3Correct++;
    } else {
        wrongAnswers++;
        part3Wrong++;
    }

    if (isFunctionCorrect) {
        score++;
        part3Correct++;
    } else {
        wrongAnswers++;
        part3Wrong++;
    }

    showSymbolReview(
        question,
        nameAnswer,
        functionAnswer,
        isNameCorrect,
        isFunctionCorrect
    );

}

function showSymbolReview(
    question,
    nameAnswer,
    functionAnswer,
    isNameCorrect,
    isFunctionCorrect
) {

    const questions = getCurrentQuestions();

    quizCard.innerHTML = `

<div class="question-header">

<h2>Review</h2>

</div>

<img
class="review-symbol-image"
src="${question.image}"
alt="${question.answer}"
>

<div class="feedback-card">

<div class="review-section ${isNameCorrect ? "review-correct" : "review-wrong"}">

<h3>Name</h3>

<p class="review-answer">

<strong>Your Answer</strong>

<br>

${nameAnswer || "No Answer"}

</p>

<p class="review-answer">

<strong>Correct Answer</strong>

<br>

${question.answer}

</p>

</div>

<div class="review-section ${isFunctionCorrect ? "review-correct" : "review-wrong"}">

<h3>Function</h3>

<p class="review-answer">

<strong>Your Answer</strong>

<br>

${functionAnswer || "No Answer"}

</p>

<p class="review-answer">

<strong>Correct Answer</strong>

<br>

${question.functionAnswer}

</p>

</div>

</div>

<div class="quiz-controls">

<button
id="next-review"
class="next-button">

${
currentQuestionIndex===questions.length-1
?
"Part 3 Summary"
:
"Next Question"
}

</button>

</div>

`;

document
.getElementById("next-review")
.addEventListener("click",nextSymbolQuestion);

}

function nextSymbolQuestion() {

    const questions = getCurrentQuestions();

    if (currentQuestionIndex < questions.length - 1) {

        currentQuestionIndex++;

        renderQuiz();

    } else {

        showPart3Summary();

    }

}

function showPart3Summary() {

    quizCard.innerHTML = `

    <div class="result-card">

        <h2>Part 3 Summary</h2>

        <div class="result-summary">

            <div class="result-pill">

                <span class="result-label">
                    Correct
                </span>

                <strong>${part3Correct}</strong>

            </div>

            <div class="result-pill">

                <span class="result-label">
                    Wrong
                </span>

                <strong>${part3Wrong}</strong>

            </div>

        </div>

        <button
            id="next-section"
            class="next-button">

            Next Section

        </button>

    </div>

    `;

    document
        .getElementById("next-section")
        .addEventListener("click", handleNextClick);

}

function handleIdentificationSubmit() {
  const questions = getCurrentQuestions();
  const inputs = Array.from(quizCard.querySelectorAll('.identification-input'));
  const results = inputs.map((input, index) => {
    const actual = input.value.trim();
    const expected = questions[index].answer.trim();
    const isCorrect = normalizeAnswer(actual) === normalizeAnswer(expected);

    return { actual, expected, isCorrect };
  });

  const correctCount = results.filter((result) => result.isCorrect).length;
  const incorrectCount = results.length - correctCount;

  score += correctCount;
  wrongAnswers += incorrectCount;
  hasAnswered = true;

  quizCard.innerHTML = `
    <div class="question-header">
      <span class="question-count">${sections[currentSectionIndex].name}</span>
      <h2>Part 2 summary</h2>
    </div>

    <div class="feedback-card">
      <div class="feedback-score">${correctCount}/${questions.length}</div>
      <p class="feedback-summary">You answered ${correctCount} correctly and ${incorrectCount} incorrectly.</p>
      <div class="review-list">
        ${results.map((result, index) => `
          <div class="review-item ${result.isCorrect ? 'review-correct' : 'review-wrong'}">
            <strong>${index + 1}.</strong> ${result.isCorrect ? '✅' : '❌'}
            <span>Your answer: ${result.actual || '—'}</span>
            <span>Correct answer: ${result.expected}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="quiz-controls">
      <button type="button" id="next-button" class="next-button">Next Section</button>
    </div>
  `;

  document.getElementById('next-button').addEventListener('click', handleNextClick);
}

function handleNextClick() {
  if (currentSectionIndex < sections.length - 1) {
    currentSectionIndex += 1;
    currentQuestionIndex = 0;
    hasAnswered = false;
    renderQuiz();
    return;
  }

  showResult();
}

function showResult() {
  const totalQuestions = sections.reduce((sum, section) => sum + section.items.length, 0);

  quizCard.innerHTML = `
    <div class="result-card">
      <h2>Quiz complete!</h2>
      <div class="result-summary">
        <div class="result-pill">
          <span class="result-label">Correct</span>
          <strong>${score}/${totalQuestions}</strong>
        </div>
        <div class="result-pill">
          <span class="result-label">Wrong</span>
          <strong>${wrongAnswers}/${totalQuestions}</strong>
        </div>
      </div>
      <p class="result-text">You answered ${score} correctly and ${wrongAnswers} incorrectly.</p>
      <button type="button" id="restart-button" class="restart-button">Try again</button>
    </div>
  `;

  document.getElementById('restart-button').addEventListener('click', () => {
    sections = createSections();
    currentSectionIndex = 0;
    currentQuestionIndex = 0;
    score = 0;
    wrongAnswers = 0;

    part3Correct = 0;
    part3Wrong = 0;

    hasAnswered = false;
    renderQuiz();
  });
}

renderQuiz();

