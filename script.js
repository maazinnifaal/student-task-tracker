// Select elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const subjectInput = document.getElementById('subject-input');
const dueDateInput = document.getElementById('due-date-input');
const priorityInput = document.getElementById('priority-input');
const taskList = document.getElementById('task-list');

// Load saved tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task event
taskForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const task = {
    id: Date.now(),
    title: taskInput.value,
    subject: subjectInput.value,
    dueDate: dueDateInput.value,
    priority: priorityInput.value
  };

  addTaskToDOM(task);
  saveTaskToStorage(task);
  taskForm.reset();
});

// Display task on UI
function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.setAttribute('data-id', task.id);
  li.innerHTML = `
    <div>
      <strong>${task.title}</strong> [${task.subject}] - Due:${task.dueDate} 
      <span class="priority-${task.priority.toLowerCase()}">(${task.priority})</span>
    </div>
    <button class="delete-btn">Delete</button>
  `;

  // Delete event
  li.querySelector('.delete-btn').addEventListener('click', function() {
    li.remove();
    removeTaskFromStorage(task.id);
  });

  taskList.appendChild(li);
}

// Save task to LocalStorage
function saveTaskToStorage(task) {
  const tasks = getTasksFromStorage();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Get tasks from LocalStorage
function getTasksFromStorage() {
  return localStorage.getItem('tasks') === null 
    ? [] 
    : JSON.parse(localStorage.getItem('tasks'));
}

// Load tasks from LocalStorage
function loadTasks() {
  const tasks = getTasksFromStorage();
  tasks.forEach(task => addTaskToDOM(task));
}

// Remove task from LocalStorage
function removeTaskFromStorage(id) {
  let tasks = getTasksFromStorage();
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}