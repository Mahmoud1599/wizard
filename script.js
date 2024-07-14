document.addEventListener("DOMContentLoaded", function () {
  // Get references to elements
  const form = document.getElementById("test");
  const nextButton = document.getElementById("next");
  const submitButton = document.getElementById("submit");
  const dataButton = document.querySelector(".result-btn");
  const fieldsets = document.querySelectorAll("fieldset");
  const sectionTabs = document
    .getElementById("section-tabs")
    .querySelectorAll("li");
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"][name="language"]'
  );
  const erorrLabel = document.querySelectorAll(".valid-erorr");
  const nameInput = document.querySelector("input[type='text']");
  const textareaInput = document.querySelector("textarea[type='text']");

  
  nextButton.addEventListener("click", () => {
    const currentFieldset = getCurrentFieldset();
    if (validateSection(currentFieldset)) {
      nextSection();
    } else if (
      !validateSection(currentFieldset) &&
      getCurrentFieldsetIndex() === 0
    ) {
      erorrLabel.forEach((i) => {
        i.classList.remove("hidden");
      });
      nameInput.classList.add("error");
      textareaInput.classList.add("error");
    }
  });

  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    saveFormData();
    alert("Form submitted and data saved!");
    resetForm();
  });

  // Add event listener to each section tab
  sectionTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      const currentSectionIndex = getCurrentFieldsetIndex();
      if (tab.classList.contains("current") && index > currentSectionIndex) {
        goToSection(index);
      } else if (index < currentSectionIndex) {
        goToSection(index);
        nextButton.classList.remove("hidden");
        submitButton.classList.add("hidden");
      } else if (index === sectionTabs.length - 1) {
        alert("sorry no go back.");
        goToSection(sectionTabs.length - 1);
      } else {
        alert("Please complete current section first.");
      }
    });
  });

  // Function to update fieldset
  function updateFieldsets(sectionIndex) {
    fieldsets.forEach(function (fieldset, i) {
      fieldset.classList.remove("current", "next", "previous");
      if (i < sectionIndex) {
        fieldset.classList.add("previous");
      } else if (i === sectionIndex) {
        fieldset.classList.add("current");
      } else {
        fieldset.classList.add("next");
      }
    });
  }

  // Function to update taps
  function updateTaps(sectionIndex) {
    sectionTabs.forEach(function (tab, i) {
      tab.classList.remove("current");
      if (i === sectionIndex) {
        tab.classList.add("current");
      } else if (i < sectionIndex) {
        tab.classList.add("previous");
      }
    });
  }

  // Function to update submit button
  function updateButton(sectionIndex) {
    if (sectionIndex === fieldsets.length - 1) {
      nextButton.classList.add("hidden");
      submitButton.classList.remove("hidden");
      dataButton.classList.remove("hidden");
    } else {
      nextButton.classList.add("current");
    }
  }

  // Function to go to a specific section
  function goToSection(sectionIndex) {
    updateFieldsets(sectionIndex);
    updateTaps(sectionIndex);
    updateButton(sectionIndex);
  }

  // Function to move to the next section
  function nextSection() {
    const currentSectionIndex = getCurrentFieldsetIndex();
    if (currentSectionIndex < fieldsets.length - 1) {
      goToSection(currentSectionIndex + 1);
    }
  }

  // Helper function to get the current fieldset index
  const getCurrentFieldsetIndex = () => {
    const currentFieldset = document.querySelector("fieldset.current");
    return [...fieldsets].indexOf(currentFieldset);
  };

  // Helper function to check if the last fieldset is active
  function isLastFieldset() {
    return getCurrentFieldsetIndex() === fieldsets.length - 1;
  }

  // Add your validation logic here (replace with your own implementation)
  function validateSection(fieldset) {
    const inputs = fieldset.querySelectorAll(".required");

    let isValid = true;

    inputs.forEach((input) => {
      if (input.type === "radio") {
        const radioGroup = form.querySelectorAll(".required");
        const isChecked = Array.from(radioGroup).some((radio) => radio.checked);
        if (!isChecked) {
          isValid = false;
        }
      }
      if (input.type === "checkbox") {
        const boxGroup = form.querySelectorAll(`input[name="${input.name}"]`);
        const isChecked = Array.from(boxGroup).some((input) => input.checked);
        if (!isChecked) {
          isValid = false;
        }
      } else {
        if (input.value.trim() === "") {
          isValid = false;
        }
      }
    });
    erorrLabel.forEach((i) => {
      i.classList.add("hidden");
    });
    nameInput.classList.remove("error");
    textareaInput.classList.remove("error");
    return isValid;
  }

  // to make sure only one check box is chosen
  function unchecked(checkbox) {
    checkboxes.forEach((cb) => {
      if (cb !== checkbox) {
        cb.checked = false;
      }
    });
  }

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        unchecked(this);
      }
    });
  });

  // save data
  function saveFormData() {
    const formData = {
      title: document.querySelector('input[name="title"]').value,
      description:
        document.querySelector('textarea[name="description"]').value || "",
      club: document.querySelector('input[name="club"]:checked').value,
      range: document.querySelector('input[name="range"]').value,
      language: document.querySelector('input[name="language"]:checked').value,
    };
    const storedData = JSON.parse(localStorage.getItem("formDataArray")) || [];
    storedData.push(formData);
    localStorage.setItem("formDataArray", JSON.stringify(storedData));
  }

  // Reset form and go to the first section
  function resetForm() {
    form.reset();
    goToSection(0);
    nextButton.classList.remove("hidden");
    submitButton.classList.add("hidden");
  }
  function getCurrentFieldset() {
    return document.querySelector("fieldset.current");
  }
  // Initial setup (assuming first section is active)
  validcheck();
  goToSection(0);
});
