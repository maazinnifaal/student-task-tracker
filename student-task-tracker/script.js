// Retrieve tasks from localStorage or initialize empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// DOM Elements
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const priorityInput = document.getElementById('priority-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Calculate Overdue / Due Today badges
function getDeadlineBadge(dueDateStr) {
  if (!dueDateStr) return '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(dueDateStr);
  taskDate.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `<span class="badge badge-overdue">Overdue</span>`;
  } else if (diffDays === 0) {
    return `<span class="badge badge-today">Due Today</span>`;
  }
  return '';
}

// Sort tasks by due date (closest deadline first)
function sortTasksByDate() {
  tasks.sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
}

// Update Progress Bar & Stats & Empty State
function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById('progress-text').innerText = `${completed} of ${total} completed`;
  document.getElementById('progress-percent').innerText = `${percentage}%`;
  document.getElementById('progress-bar-fill').style.width = `${percentage}%`;

  const emptyState = document.getElementById('empty-state');
  if (emptyState) {
    const filteredTasks = tasks.filter(task => currentFilter === 'all' || task.priority === currentFilter);
    emptyState.style.display = filteredTasks.length === 0 ? 'block' : 'none';
  }
}

// Render Tasks to DOM
function renderTasks() {
  sortTasksByDate();
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'all') return true;
    return task.priority === currentFilter;
  });

  filteredTasks.forEach((task) => {
    const originalIndex = tasks.indexOf(task);
    const li = document.createElement('li');

    const badgeHTML = task.completed ? '' : getDeadlineBadge(task.dueDate);

    li.innerHTML = `
      <div class="task-content">
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${originalIndex})">
        <span class="${task.completed ? 'completed' : ''}">
          <strong>${task.text}</strong> [${task.priority}] - 📅 ${task.dueDate || 'No date'}
        </span>
        ${badgeHTML}
      </div>
      <button class="delete-btn" onclick="deleteTask(${originalIndex})">Delete</button>
    `;

    taskList.appendChild(li);
  });

  updateProgress();
}

// Add New Task
function addTask() {
  const text = taskInput.value.trim();
  const dueDate = dateInput.value;
  const priority = priorityInput.value;

  if (text === '') {
    alert('Please enter a task name!');
    return;
  }

  const newTask = {
    text: text,
    dueDate: dueDate,
    priority: priority,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = '';
  dateInput.value = '';
  priorityInput.value = 'Low';
}

// Toggle Task Completion
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Delete Task with confirmation prompt
function deleteTask(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

// Event Listeners for Filters
filterBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    filterBtns.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.getAttribute('data-filter');
    renderTasks();
  });
});

// Event Listener for Add Button
addBtn.addEventListener('click', addTask);

// Allow pressing Enter in input box to add task
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Initial Render on Page Load
renderTasks();