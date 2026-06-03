const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const pendingList = document.querySelector("#pending-list");
const completedList = document.querySelector("#completed-list");
const totalCount = document.querySelector("#total-count");
const pendingCount = document.querySelector("#pending-count");
const completedCount = document.querySelector("#completed-count");
const clearPendingButton = document.querySelector("#clear-pending");
const clearCompletedButton = document.querySelector("#clear-completed");

const storageKey = "basicTodoWebappTasks";
let tasks = JSON.parse(localStorage.getItem(storageKey)) || [];

function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function createTask(title) {
  return {
    id: crypto.randomUUID(),
    title,
    completed: false,
    addedAt: new Date().toISOString(),
    completedAt: null,
  };
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

function addTask(title) {
  tasks.unshift(createTask(title));
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id !== id) {
      return task;
    }

    const completed = !task.completed;
    return {
      ...task,
      completed,
      completedAt: completed ? new Date().toISOString() : null,
    };
  });

  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return;
  }

  const updatedTitle = prompt("Edit task", task.title);

  if (!updatedTitle || !updatedTitle.trim()) {
    return;
  }

  task.title = updatedTitle.trim();
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function clearTasks(completedStatus) {
  tasks = tasks.filter((task) => task.completed !== completedStatus);
  saveTasks();
  renderTasks();
}

function createTaskElement(task) {
  const item = document.createElement("li");
  item.className = `task-item${task.completed ? " completed" : ""}`;

  const content = document.createElement("div");
  const title = document.createElement("p");
  title.className = "task-title";
  title.textContent = task.title;

  const meta = document.createElement("p");
  meta.className = "task-meta";
  meta.textContent = task.completed
    ? `Added ${formatDate(task.addedAt)} | Completed ${formatDate(task.completedAt)}`
    : `Added ${formatDate(task.addedAt)}`;

  content.append(title, meta);

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const completeButton = document.createElement("button");
  completeButton.className = "complete-button";
  completeButton.type = "button";
  completeButton.textContent = task.completed ? "Move to Pending" : "Complete";
  completeButton.addEventListener("click", () => toggleTask(task.id));

  const editButton = document.createElement("button");
  editButton.className = "edit-button";
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => editTask(task.id));

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  actions.append(completeButton, editButton, deleteButton);
  item.append(content, actions);

  return item;
}

function renderList(listElement, listTasks, emptyText) {
  listElement.innerHTML = "";

  if (listTasks.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-message";
    emptyItem.textContent = emptyText;
    listElement.append(emptyItem);
    return;
  }

  listTasks.forEach((task) => {
    listElement.append(createTaskElement(task));
  });
}

function renderCounts() {
  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  totalCount.textContent = tasks.length;
  pendingCount.textContent = pendingTasks.length;
  completedCount.textContent = completedTasks.length;
}

function renderTasks() {
  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  renderList(pendingList, pendingTasks, "No pending tasks yet.");
  renderList(completedList, completedTasks, "No completed tasks yet.");
  renderCounts();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();

  if (!title) {
    taskInput.focus();
    return;
  }

  addTask(title);
  taskInput.value = "";
  taskInput.focus();
});

clearPendingButton.addEventListener("click", () => clearTasks(false));
clearCompletedButton.addEventListener("click", () => clearTasks(true));

renderTasks();
