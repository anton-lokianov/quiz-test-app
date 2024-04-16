document.addEventListener("DOMContentLoaded", () => {
  setupAccordions();
  setupFormSubmissions();
  fillFormsFromLocalStorage();
});

const fillFormsFromLocalStorage = () => {
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    const storedData = JSON.parse(localStorage.getItem(form.id));
    if (storedData) {
      fillFormWithData(form, storedData);
    }
  });
};

function setupAccordions() {
  const accordions = document.querySelectorAll(".accordion");
  const panels = document.querySelectorAll(".panel");

  accordions.forEach((accordion, index) => {
    accordion.addEventListener("click", function () {
      const isActive = this.classList.contains("active");

      accordions.forEach((_, idx) => {
        accordions[idx].classList.remove("active");
        panels[idx].style.maxHeight = null;
      });

      if (!isActive) {
        this.classList.add("active");
        panels[index].style.maxHeight = panels[index].scrollHeight + "px";
      }
    });
  });
}

function setupFormSubmissions() {
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", handleFormSubmit);

    const saveBtn = form.querySelector("button[type='button']");
    saveBtn.addEventListener("click", () => {
      saveFormData(form.id);
    });
  });
}

const handleFormSubmit = async (event) => {
  event.preventDefault();
  const form = event.target;
  const level = form.id;
  console.log("Form submitted:", level);
  const formData = new FormData(form);

  const options = [];
  let correctAnswer = "";

  formData.forEach((value, key) => {
    if (key.startsWith("option")) {
      options.push(value);
      if (formData.get("correctAnswer") === key) {
        correctAnswer = value;
      }
    }
  });

  const newQuestion = {
    question: formData.get("question"),
    options: options,
    answer: correctAnswer,
  };

  // Save the new question to the database

  localStorage.removeItem(level);
  form.reset();
};

const saveFormData = (formId) => {
  const form = document.getElementById(formId);
  const formData = new FormData(form);

  const options = [];
  let correctAnswer = "";

  formData.forEach((value, key) => {
    if (key.startsWith("option")) {
      options.push(value);
      if (formData.get("correctAnswer") === key) {
        correctAnswer = value;
      }
    }
  });

  const newQuestion = {
    question: formData.get("question"),
    options: options,
    correctAnswer: correctAnswer,
  };

  localStorage.setItem(formId, JSON.stringify(newQuestion));
};

const fillFormWithData = (form, data) => {
  form.querySelector("[name='question']").value = data.question;
  let correctAnswer = "";
  data.options.forEach((option, index) => {
    const optionInput = form.querySelector(`[name='option${index + 1}']`);
    if (optionInput) {
      optionInput.value = option;
      if (option === data.correctAnswer) {
        correctAnswer = optionInput.name;
      }
    }
  });
  form.querySelector(`[value='${correctAnswer}']`).checked = true;
};
