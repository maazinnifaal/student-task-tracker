// DOM Elements
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const priorityInput = document.getElementById('priorityInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAllBtn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const filterBtns = document.querySelectorAll('[data-filter]');

// Tasks State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Initialize App
renderTasks();

// Add Task Function
function addTask(e) {
  if (e) e.preventDefault();

  const title = taskInput.value.trim();
  const dueDate = dueDateInput ? dueDateInput.value : '';
  const priority = priorityInput ? priorityInput.value : 'low';

  if (!title) return;

  const newTask = {
    id: Date.now(),
    title: title,
    dueDate: dueDate,
    priority: priority,
    completed: false
  };

  tasks.push(newTask);
  saveAndRender();

  // Reset Input Fields
  taskInput.value = '';
  if (dueDateInput) dueDateInput.value = '';
}

// Toggle Complete
function toggleTask(id) {
  tasks = tasks.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveAndRender();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveAndRender();
}

// Clear All Tasks
function clearAllTasks() {
  if (confirm('Are you sure you want to delete all tasks?')) {
    tasks = [];
    saveAndRender();
  }
}

// Save to LocalStorage and Update UI
function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Render Tasks UI
function renderTasks() {
  // Filter Tasks
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'pending') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  // Render Task Items
  if (taskList) {
    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
      taskList.innerHTML = '<li style="text-align:center; color:#666; padding: 10px;">No tasks found.</li>';
    } else {
      filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
          <div class="task-info">
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <span class="task-title">${task.title}</span>
            ${task.dueDate ? `<span class="task-date">${task.dueDate}</span>` : ''}
            <span class="badge badge-${task.priority}">${task.priority}</span>
          </div>
          <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        
        taskList.appendChild(li);
      });
    }
  }

  // Update Progress Bar
  if (progressBar && progressText) {
    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;
    const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    progressBar.style.width = `${percent}%`;
    progressText.innerText = `${percent}%`;
  }
}

// Event Listeners
if (addBtn) addBtn.addEventListener('click', addTask);
if (clearAllBtn) clearAllBtn.addEventListener('click', clearAllTasks);

if (taskInput) {
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask(e);
    }
  });
}

// Filter Event Listeners
filterBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    filterBtns.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.getAttribute('data-filter');
    renderTasks();
  });
});