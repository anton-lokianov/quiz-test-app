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

function processFormData(form) {
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

  return {
    question: formData.get("question"),
    options,
    correctAnswer,
  };
}

const handleFormSubmit = async (event) => {
  event.preventDefault();
  const form = event.target;
  const level = form.id;
  const validation = formValidation(form);

  if (!validation) {
    return;
  }

  const newQuestion = processFormData(form);

  // Send the new question to the server

  localStorage.removeItem(level);
  form.reset();
};

const saveFormData = (formId) => {
  const form = document.getElementById(formId);
  const newQuestion = processFormData(form);
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

const formValidation = (form) => {
  const question = form.querySelector("[name='question']").value;
  const options = form.querySelectorAll("[name^='option']");
  const correctAnswer = form.querySelector("[name='correctAnswer']:checked");

  if (!question || question.trim() === "") {
    alert("Question is required");
    return false;
  }

  if (options.length < 4) {
    alert("At least 4 options are required");
    return false;
  }

  for (let i = 0; i < options.length; i++) {
    if (!options[i].value || options[i].value.trim() === "") {
      alert(`Option ${i + 1} is required`);
      return false;
    }
  }

  if (!correctAnswer) {
    alert("Correct answer is required");
    return false;
  }

  return true;
};
