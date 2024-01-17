
let questionList = []; // list of questions
var currQUestion = 0; // index of ongoing question
let firstLoad = true;
var score = 0;
var min;
var sec;
var tim;
var timer;
var attemptHistory = [];
let isSubmitEvent = true;
var scoreCard = {
  name: "",
  email: "",
  scoreList: [[]]
};
const quizText = document.querySelector('.quiz_text');


const questionEL = document.getElementById("question");
const answerButtonsEL = document.getElementById("answer-buttons");

function showInstruction() {

}

function prepareAttempt() {
  // reset all data
  const params = new URLSearchParams(window.location.search);
  const name = params.get("n");
  document.getElementById("name-tag").textContent = (name ? `Hi, ${name}` : ``);
  clearInterval(timer);
  fetchQuestions();
  currQUestion = 0;
  if (firstLoad) {
    firstLoad = false;
    document.getElementById("next-btn").addEventListener("click", () => {
      if (currQUestion < questionList.length) {
        handleNextButton();
      }
      // else{
      //     startQuiz();
      // }
    })
    document.getElementById("prev-btn").addEventListener("click", () => {
      if (currQUestion > 0) {
        handlePrevButton();
      }
      // else{
      //     startQuiz();
      // }
    })
    document.getElementById("submit-btn").addEventListener("click", () => {
      handleSubmitButton();
    })
  }

}

function fetchQuestions() {
  fetch("./../questions.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {

      questionList = data.data.questions;
      attemptHistory = Array(questionList.length).fill(0);
      console.log(attemptHistory);
      showQuestion();
      min = questionList.length;
      sec = 0;
      console.log(min);
      timer = setInterval(() => setTimer(), 1000);
    });

}


function showQuestion() {
  resetState();
  let currentQuestion = questionList[currQUestion];
  let questionNo = currQUestion + 1;
  questionEL.innerHTML = questionNo + ". " + currentQuestion ? currentQuestion.title : '';

  currentQuestion.choices.forEach(choice => {
    const button = document.createElement("button");
    button.innerHTML = choice.content;
    button.classList.add("btn");
    answerButtonsEL.appendChild(button);

    document.getElementById("question-count").innerHTML = (currQUestion + 1) + '/' + questionList.length;
    console.log(currentQuestion.answers[0]);
    console.log(choice.id);
    button.dataset.id = choice.id;
    if (choice.id == currentQuestion.answers[0]) {
      button.dataset.correct = "true";
    } else {
      button.dataset.correct = "false";
    }

    if (attemptHistory[currQUestion]) {
      if (attemptHistory[currQUestion] === button.dataset.id) {
        if (button.dataset.correct === "true") {
          button.classList.add("correct");
        } else {
          button.classList.add("incorrect");
        }
      }
      Array.from(answerButtonsEL.children).forEach(button => {
        if (button.dataset.correct === "true") {
          button.classList.add("correct");
        }
        button.disabled = true;
      });
    }

    button.addEventListener("click", selectAnswer);
  });
}


function resetState() {
  while (answerButtonsEL.firstChild) {
    answerButtonsEL.removeChild(answerButtonsEL.firstChild);
  }
}


function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  attemptHistory[currQUestion] = selectedBtn.dataset.id;

  console.log(attemptHistory);
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }
  Array.from(answerButtonsEL.children).forEach(button => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  document.getElementById("next-btn").style.visibility = "visible";
}

function showScore() {
  resetState();
  questionEL.innerHTML = `You scored ${score} out of ${questionList.length}!`;
}

function handleNextButton() {
  currQUestion++;
  if (currQUestion < questionList.length) {
    showQuestion();
  }
  // else{
  //     showScore();
  // }
}

function handlePrevButton() {
  if (currQUestion === questionList.length) {
    currQUestion--;
  }
  if (currQUestion > 0) {
    currQUestion--;
    showQuestion();
  }
  // else{
  //     showScore();
  // }
}

function handleSubmitButton() {

  console.log(isSubmitEvent);
  if (isSubmitEvent) {
    confirm("Are you sure");
    isSubmitEvent = !isSubmitEvent;
    document.getElementById("submit-btn").innerHTML = "Play Again";
    document.getElementById("next-btn").style.visibility = "hidden";
    document.getElementById("question-count").style.visibility = "hidden";
    document.getElementById("prev-btn").style.visibility = "hidden";
    document.getElementById("showtime").style.visibility = "hidden";
    showScore();
  } else {
    // isSubmitEvent = !isSubmitEvent;
    // document.getElementById("submit-btn").innerHTML = "Submit Score";
    // document.getElementById("next-btn").style.visibility = "visible";
    // document.getElementById("question-count").style.visibility = "visible";
    // document.getElementById("prev-btn").style.visibility = "visible";
    // document.getElementById("showtime").style.visibility = "visible";
    //prepareAttempt();

    location.href = `./../index.html`;
  }
}

function setTimer() {
  if (parseInt(sec) > 0) {

    document.getElementById("showtime").innerHTML = min + ":" + (sec > 9 ? sec : '0' + sec);
    sec = parseInt(sec) - 1;
    // tim = setTimeout(setTimer(), 1000);
  }
  else {

    if (parseInt(min) == 0 && parseInt(sec) == 0) {
      document.getElementById("showtime").innerHTML = min + ":" + (sec > 9 ? sec : '0' + sec);
      alert("Time Up");
      showScore();

    }

    if (parseInt(sec) == 0) {
      document.getElementById("showtime").innerHTML = min + ":" + (sec > 9 ? sec : '0' + sec);
      min = parseInt(min) - 1;
      sec = 59;
      // tim = setTimeout(setTimer(), 1000);
    }

  }
}

prepareAttempt();