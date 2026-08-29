const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const subjectInput = document.getElementById('subject-input');
const dueDateInput = document.getElementById('due-date-input');
const priorityInput = document.getElementById('priority-input');
const filterPriority = document.getElementById('filter-priority');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  const selectedFilter = filterPriority.value;

  const filteredTasks = tasks.filter(task => {
    if (selectedFilter === 'All') return true;
    return task.priority === selectedFilter;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    if (task.completed) {
      li.classList.add('completed');
    }

    li.innerHTML = `
      <span onclick="toggleTask(${index})" style="cursor:pointer; text-decoration: ${task.completed ? 'line-through' : 'none'}">
        <strong>${task.title}</strong> [${task.subject}] - Due:${task.dueDate} (${task.priority})
      </span>
      <button onclick="deleteTask(${index})">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newTask = {
    title: taskInput.value,
    subject: subjectInput.value,
    dueDate: dueDateInput.value,
    priority: priorityInput.value,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskForm.reset();
});

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

filterPriority.addEventListener('change', renderTasks);

// Initial render on load
renderTasks();