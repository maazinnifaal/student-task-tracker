document.getElementById('task-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const subject = document.getElementById('subject').value;
  const dueDate = document.getElementById('due-date').value;
  const priority = document.getElementById('priority').value;
  
  const li = document.createElement('li');
  li.innerHTML = `<span><strong>${title}</strong> (${subject}) - Due: ${dueDate} [${priority}]</span> <button onclick="this.parentElement.remove()">Delete</button>`;
  document.getElementById('task-list').appendChild(li);
  this.reset();
});