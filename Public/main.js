const todos = [];

function addTask(event) {
  event.preventDefault();
  const container = document.getElementById("taskList");
  const inputTask = document.getElementById("taskInput").value;
  const inputDeadline = document.getElementById("deadlineInput").value;
  checkingDeadlines(inputDeadline);
  if (inputTask === "") {
    alert("Please enter a task");
  } else {
    const newTask = createTaskElement(inputTask, inputDeadline);
    container.appendChild(newTask);

    todos.push({
      text: inputTask,
      completed: false,
      deadline: inputDeadline,
    });

    document.getElementById("taskInput").value = "";
    document.getElementById("deadlineInput").value = "";

    updateTaskStatus();
  }
}

function createTaskElement(text, deadline) {
  const newTask = document.createElement("div");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => {
    toggleComplete(newTask);
    updateTaskStatus();
  });

  const taskText = document.createElement("input");
  taskText.type = "text";
  taskText.className = "textInput";
  taskText.value = text;
  taskText.disabled = true;

  const deadlineText = document.createElement("span");
  deadlineText.className = "deadlineTextName";
  deadlineText.textContent = deadline ? formatDeadline(deadline) : "";

  const editButton = document.createElement("button");
  editButton.className = "editBtn";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => enableEdit(newTask, taskText));

  const saveButton = document.createElement("button");
  saveButton.className = "saveBtn";
  saveButton.textContent = "Save";
  saveButton.style.display = "none";
  saveButton.addEventListener("click", () => saveTask(newTask, taskText));

  const deleteButton = document.createElement("button");
  deleteButton.className = "delBtn";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteTask(newTask));

  newTask.appendChild(checkbox);
  newTask.appendChild(taskText);
  newTask.appendChild(deadlineText);
  newTask.appendChild(editButton);
  newTask.appendChild(saveButton);
  newTask.appendChild(deleteButton);

  updateTaskStatus();

  return newTask;
}

function toggleComplete(task) {
  if (!task.classList.contains("editing")) {
    const index = findTaskIndex(task);
    if (index !== -1) {
      const todo = todos[index];
      todo.completed = !todo.completed;
      task.classList.toggle("completed");
      const taskText = task.querySelector("input[type='text']");
      taskText.style.textDecoration = todo.completed ? "line-through" : "none";
    }
  }
}

function enableEdit(task, taskTextElement) {
  taskTextElement.disabled = false;
  taskTextElement.focus();
  task.classList.add("editing");

  const editButton = task.querySelector("button");
  const saveButton = task.querySelector("button:nth-of-type(2)");

  editButton.style.display = "none";
  saveButton.style.display = "inline";

  taskTextElement.addEventListener("blur", () => {
    saveTask(task, taskTextElement);
  });
}

function saveTask(task, taskTextElement) {
  task.classList.remove("editing");
  const index = findTaskIndex(task);
  const newText = taskTextElement.value.trim();

  if (newText === "") {
    taskTextElement.value = todos[index].text;
    alert("Task cannot be empty.");
  } else {
    if (index !== -1) {
      todos[index].text = newText;
    }
    taskTextElement.disabled = true;
    const editButton = task.querySelector("button");
    const saveButton = task.querySelector("button:nth-of-type(2)");
    editButton.style.display = "inline";
    saveButton.style.display = "none";
  }
}

function deleteTask(task) {
  const index = findTaskIndex(task);
  if (index !== -1) {
    task.remove();
    todos.splice(index, 1);
  }
  updateTaskStatus();
}

function clearCompletedTasks() {
  const taskList = document.getElementById("taskList");
  const completedTasks = taskList.getElementsByClassName("completed");
  while (completedTasks.length > 0) {
    const task = completedTasks[0];
    deleteTask(task);
  }
}

function findTaskIndex(task) {
  const taskList = document.getElementById("taskList");
  return Array.from(taskList.children).indexOf(task);
}

function formatDeadline(deadline) {
  const date = new Date(deadline);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

function updateTaskStatus() {
  const taskList = document.getElementById("taskList");
  const completedTasks = taskList.getElementsByClassName("completed").length;
  const totalTasks = todos.length;
  const taskCountElement = document.getElementById("taskCount");
  taskCountElement.textContent = `${completedTasks} / ${totalTasks} completed`;
}

function checkingDeadlines(inputDeadline) {
    if (inputDeadline) {
        const day = 1;
        const hour = 1;
        const currentDate = new Date();
        const deadline = new Date(inputDeadline);
        const difference = deadline.getTime() - currentDate.getTime();
        const days = Math.floor(difference / 86400000);
        const hours = Math.floor((difference % 86400000) / 3600000);
        const minutes = Math.floor((difference % 3600000) / 60000);
        const seconds = Math.floor((difference % 60000) / 1000);
        if (hours <= hour) {
            alert(`Less than ${hour} hour(s) is left to complete the task.`);
        } else if (days <= day) {
            alert(`Less than ${day} day(s) is left to complete the task.`)
        } 
    }
}
