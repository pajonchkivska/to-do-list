const monthYearElement = document.getElementById("month-year");
const daysElement = document.getElementById("days");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

let currentDate = new Date();
let selectedDate = currentDate;

function generateCalendar() {
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

  monthYearElement.textContent = `${currentDate.toLocaleString("en-US", { month: "long" })} ${currentDate.getFullYear()}`;

  let days = "";

  for (let i = firstDayOfMonth.getDay(); i > 0; i--) {
    days += `<div class="prev-month">${prevMonthLastDay - i + 1}</div>`;
  }

  for (let i = 1; i <= daysInMonth; i++) {
    if (selectedDate && i === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth() && currentDate.getFullYear() === selectedDate.getFullYear()) {
      days += `<div class="selected">${i}</div>`;
    } else if (i === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()) {
      days += `<div class="today">${i}</div>`;
    } else {
      days += `<div>${i}</div>`;
    }
  }

  daysElement.innerHTML = days;

  const calendarDays = daysElement.querySelectorAll(".days div:not(.prev-month)");
  calendarDays.forEach((day, index) => {
    day.addEventListener("click", () => {
      const dayValue = index + 1;
      selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayValue);
      generateCalendar();
    });
  });
}

function markToday() {
  const today = daysElement.querySelector(".today");
  if (today) {
    today.classList.remove("today");
  }
  generateCalendar();
}

prevButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  markToday();
});

nextButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  markToday();
});

generateCalendar();



const addButtons = document.querySelectorAll(".list__button");
const taskInputs = document.querySelectorAll(".list__input");
const taskLists = document.querySelectorAll(".list__tasks");

function addTaskToCard(event, index) {
    const inputValues = taskInputs[index];
    const taskList = taskLists[index];

    const inputValue = inputValues.value;

    if (inputValue === "") {
        alert("You must write something!");
    } else {
        const newTask = document.createElement("input");
        newTask.type = "checkbox";
        newTask.value = inputValue;

        newTask.addEventListener("change", function() {
            updateCheckboxState(index, newTask.checked, inputValue);
        });

        const label = document.createElement("label");
        label.appendChild(newTask);
        label.appendChild(document.createTextNode(inputValue));

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "♡";
        deleteButton.addEventListener("click", function() {
            listItem.remove();
            updateLocalStorageForCard(index);
        });

        const listItem = document.createElement("p");
        listItem.appendChild(label);
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);

        inputValues.value = "";
        updateLocalStorageForCard(index);
    }
}

function updateLocalStorageForCard(index) {
    const taskList = taskLists[index];
    const tasks = [];
    taskList.querySelectorAll("input[type='checkbox']").forEach(task => {
        const taskText = task.nextSibling.textContent;
        const isChecked = task.checked;
        tasks.push({ text: taskText, checked: isChecked });
    });
    localStorage.setItem(`tasks_${index}`, JSON.stringify(tasks));
}

function updateCheckboxState(index, isChecked, text) {
    const taskList = taskLists[index];
    const checkboxes = taskList.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        if (checkbox.value === text) {
            checkbox.checked = isChecked;
            updateLocalStorageForCard(index);
        }
    });
}

addButtons.forEach((button, index) => {
    button.addEventListener("click", function(event) {
        addTaskToCard(event, index);
    });

    const storedTasks = JSON.parse(localStorage.getItem(`tasks_${index}`)) || [];
    const taskList = taskLists[index];

    storedTasks.forEach(task => {
        const newTask = document.createElement("input");
        newTask.type = "checkbox";
        newTask.value = task.text;
        newTask.checked = task.checked;

        newTask.addEventListener("change", function() {
            updateCheckboxState(index, newTask.checked, task.text);
        });

        const label = document.createElement("label");
        label.appendChild(newTask);
        label.appendChild(document.createTextNode(task.text));

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "♡";
        deleteButton.addEventListener("click", function() {
            listItem.remove();
            updateLocalStorageForCard(index);
        });

        const listItem = document.createElement("p");
        listItem.appendChild(label);
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });
});