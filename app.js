// API endpoint for CRUD app
const API_URL = "http://localhost:3000/notes";

const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const taskList = document.getElementById("task-list");

/* READ */
async function fetchTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();
  renderTasks(tasks);
}

/* DISPLAY */
function renderTasks(tasks) {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center gap-2";

    li.innerHTML = `
      <span class="task-title flex-grow-1">${task.title}</span>
      <div class="btn-group btn-group-sm">
        <button class="btn btn-secondary edit-btn">Edit</button>
        <button class="btn btn-danger delete-btn">Delete</button>
      </div>
    `;

    li.querySelector(".delete-btn").addEventListener("click", () => {
      deleteTask(task.id);
    });

    li.querySelector(".edit-btn").addEventListener("click", () => {
      enableEditMode(li, task);
    });

    taskList.appendChild(li);
  });
}

/* CREATE */
async function createTask(title) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });

  fetchTasks();
}

/* UPDATE */
async function updateTask(id, newTitle) {
  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle })
  });

  fetchTasks();
}

/* DELETE */
async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  fetchTasks();
}

/* EDIT MODE */
function enableEditMode(li, task) {
  li.innerHTML = `
    <input
      type="text"
      class="form-control form-control-sm me-2"
      value="${task.title}"
    />
    <div class="btn-group btn-group-sm">
      <button class="btn btn-success save-btn">Save</button>
      <button class="btn btn-outline-secondary cancel-btn">Cancel</button>
    </div>
  `;

  const input = li.querySelector("input");

  li.querySelector(".save-btn").addEventListener("click", () => {
    updateTask(task.id, input.value);
  });

  li.querySelector(".cancel-btn").addEventListener("click", () => {
    fetchTasks();
  });
}

/* FORM SUBMIT */
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  createTask(titleInput.value);
  titleInput.value = "";
});

/* INITIAL LOAD */
fetchTasks();
