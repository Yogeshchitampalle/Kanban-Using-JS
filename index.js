import kanban from "./kanban.js";

// Get the DOM elements for each column of the kanban board
const todo = document.querySelector(".cards.todo");
const pending = document.querySelector(".cards.pending");
const completed = document.querySelector(".cards.completed");

// Store the DOM elements in an array for easy iteration
const taskbox = [todo, pending, completed];

// Function to add a task card to the kanban board
function addTaskCard(task, index) {
  const element = document.createElement("form");
  element.className = "card";
  element.draggable = true;
  element.dataset.id = task.taskId;
  element.innerHTML = `
    <input value="${task.content}" type="text" name="task" class="task" disabled>
    <div>
      <span class="task-id">#${task.taskId}</span>
      <span>
        <button class="bi bi-pencil edit" data-id="${task.taskId}"></button>
        <button class="bi bi-check-lg update hide" data-id="${task.taskId}" data-column="${index}"></button>
        <button class="bi bi-trash3 delete" data-id="${task.taskId}"></button>
      </span>
    </div>
  `;
  taskbox[index].appendChild(element);
}

// Loop through all tasks and add them to their respective columns
kanban.getAllTasks().forEach((tasks, index) => {
  tasks.forEach((task) => {
    addTaskCard(task, index);
  });
});

// Add event listeners for adding, editing, and deleting tasks
const addForm = document.querySelectorAll(".add");
addForm.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.task.value) {
      const task = kanban.insertTask(form.submit.dataset.id, form.task.value.trim());
      addTaskCard(task, form.submit.dataset.id);
      form.reset();
    }
  });
});

// Add event listeners for editing and deleting tasks
taskbox.forEach((column) => {
  column.addEventListener("click", (event) => {
    event.preventDefault();

    const formInput = event.target.parentElement.parentElement.previousElementSibling;

    if (event.target.classList.contains("edit")) {
      formInput.removeAttribute("disabled");
      event.target.classList.add("hide");
      event.target.nextElementSibling.classList.remove("hide");
    }
    if (event.target.classList.contains("update")) {
      formInput.setAttribute("disabled", "disabled");
      event.target.classList.add("hide");
      event.target.previousElementSibling.classList.remove("hide");

      const taskId = event.target.dataset.id;
      const columnId = event.target.dataset.column;
      const content = formInput.value;

      kanban.updateTask(taskId, {
        columnId: columnId,
        content: content
      });
    }
    if (event.target.classList.contains("delete")) {
      formInput.parentElement.remove();
      kanban.deleteTask(event.target.dataset.id);
    }
  });

  // Add event listeners for dragging and dropping tasks
  column.addEventListener("dragstart", (event) => {
    if (event.target.classList.contains("card")) {
      event.target.classList.add("dragging");
    }
  });

  column.addEventListener("dragover", (event) => {
    const card = document.querySelector(".dragging");
    column.appendChild(card);
  });

  column.addEventListener("dragend", (event) => {
    if (event.target.classList.contains("card")) {
      event.target.classList.remove("dragging");

      const taskId = event.target.dataset.id;
      const columnId = event.target.parentElement.dataset.id;
      const content = event.target.task.value;
      kanban.updateTask(taskId, {
      columnId,
      content
    })
    }
    });
            
})
