
const monthYearElement = document.getElementById("month-year");
const daysElement = document.getElementById("days");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

let currentDate = new Date();
let selectedDate = null;

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

prevButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generateCalendar();
});

nextButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generateCalendar();
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
    taskList.querySelectorAll("p").forEach(task => {
        const taskText = task.querySelector("label").innerText;
        tasks.push(taskText);
    });
    localStorage.setItem(`tasks_${index}`, JSON.stringify(tasks));
}

addButtons.forEach((button, index) => {
    button.addEventListener("click", function(event) {
        addTaskToCard(event, index);
    });

    const storedTasks = JSON.parse(localStorage.getItem(`tasks_${index}`)) || [];
    const taskList = taskLists[index];

    storedTasks.forEach(taskText => {
        const newTask = document.createElement("input");
        newTask.type = "checkbox";
        newTask.value = taskText;

        const label = document.createElement("label");
        label.appendChild(newTask);
        label.appendChild(document.createTextNode(taskText));

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "♡";
        deleteButton.addEventListener("click", function() {
            listItem.remove();
            updateLocalStorage(index);
        });

        const listItem = document.createElement("p");
        listItem.appendChild(label);
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });
});


