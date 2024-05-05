import { quizQuestions } from "./quiz.js";
import { startFireworks } from "./fireworks.js";

let currentLevel = 1;
const mainContainer = document.querySelector("main");
const quizContainer = document.createElement("div");

const startQuizBtn = document.querySelector("#startQuiz");
startQuizBtn.addEventListener("click", () => {
  startQuizBtn.classList.add("hidden");
  renderQuestion();
});

const getRandQuestion = (level) => {
  const questions = quizQuestions[`level${level}`];
  const randomQuestion = Math.floor(Math.random() * questions.length);
  return questions[randomQuestion];
};

const renderQuestion = () => {
  if (quizContainer.classList.contains("animate__bounceOutDown")) {
    quizContainer.classList.remove("animate__bounceOutDown");
  }
  quizContainer.className =
    "quiz-container animate__animated animate__bounceInDown";
  quizContainer.innerHTML = "";

  const options = document.createElement("div");
  options.classList.add("options");

  const currentQuestion = getRandQuestion(currentLevel);

  const questionText = document.createElement("p");
  questionText.classList.add("question-text");
  questionText.textContent = currentQuestion.question;
  quizContainer.appendChild(questionText);

  currentQuestion.options.forEach((option, idx) => {
    const answerBtn = document.createElement("button");
    answerBtn.textContent = `${idx + 1}. ${option}`;
    answerBtn.setAttribute("data-option", option);
    options.appendChild(answerBtn);
    answerBtn.addEventListener(
      "click",
      checkAnswerHandler(option, currentQuestion)
    );
  });

  quizContainer.appendChild(options);
  mainContainer.appendChild(quizContainer);
};

const checkAnswerHandler = (selectedOption, currentQuestion) => {
  return () => {
    const options = document.querySelectorAll(".options button");
    options.forEach((option) => {
      option.disabled = true;
      option.classList.add("disabled-button");

      if (option.getAttribute("data-option") === selectedOption) {
        option.classList.add("active");

        if (selectedOption === currentQuestion.answer) {
          option.classList.add("correct");
          currentLevel++;
          if (currentLevel > 3) {
            setTimeout(() => {
              finishedQuizVideo();
              startFireworks();
            }, 700);
          } else {
            setTimeout(() => {
              ExitAnimation();
            }, 700);
          }
        } else {
          option.classList.add("wrong");
          option.classList.add("animate__animated", "animate__headShake");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    });
  };
};

const ExitAnimation = () => {
  quizContainer.classList.replace(
    "animate__bounceInDown",
    "animate__bounceOutDown"
  );
  quizContainer.addEventListener(
    "animationend",
    () => {
      renderQuestion();
    },
    { once: true }
  );
};

const finishedQuizVideo = () => {
  const youtubeVideo = document.createElement("iframe");
  youtubeVideo.src = "https://www.youtube.com/embed/4gPJQr3Q7fc?autoplay=1";
  youtubeVideo.allow =
    "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
  youtubeVideo.className = "finishedQuiz-video";
  youtubeVideo.frameborder = "0";
  youtubeVideo.style.zIndex = "1000";

  quizContainer.classList.add("hidden");
  mainContainer.appendChild(youtubeVideo);
};
