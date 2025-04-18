
const input = document.querySelector('#todo-input');
const searchInput = document.querySelector('#search-input');
const sortSelect = document.querySelector('#sort-select');
const themeToggle = document.querySelector('.theme-toggle');
let todos = JSON.parse(localStorage.getItem('todos')) || [];


function init() {
  renderTodos();
  loadTheme();
  

  document.querySelector('#submit').addEventListener('click', addTodo);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });
  
  searchInput.addEventListener('input', filterTodos);
  sortSelect.addEventListener('change', sortTodos);
  themeToggle.addEventListener('click', toggleTheme);
}


function addTodo() {
  const inputData = input.value.trim();
  if (!inputData) return;
  
  const newTodo = {
    id: Date.now(),
    text: inputData,
    completed: false,
    date: new Date().toLocaleString(),
    lastUpdated: new Date().getTime()
  };
  
  todos.push(newTodo);
  saveTodos();
  renderTodos();
  input.value = "";
}


function renderTodos() {
  const todoList = document.querySelector('.todo-lists');
  todoList.innerHTML = '';
  
  if (todos.length === 0) {
    todoList.innerHTML = '<p class="empty-message">No tasks found. Add a new one!</p>';
    return;
  }
  

  let filteredTodos = [...todos];
  const searchTerm = searchInput.value.toLowerCase();
  const sortValue = sortSelect.value;
  
  // Filter by search term
  if (searchTerm) {
    filteredTodos = filteredTodos.filter(todo => 
      todo.text.toLowerCase().includes(searchTerm))
  }
  
  
  if (sortValue === 'pending') {
    filteredTodos = filteredTodos.filter(todo => !todo.completed);
  } else if (sortValue === 'completed') {
    filteredTodos = filteredTodos.filter(todo => todo.completed);
  }
  

  if (sortValue === 'date') {
    filteredTodos.sort((a, b) => b.lastUpdated - a.lastUpdated);
  } else {
  
    filteredTodos.sort((a, b) => a.completed - b.completed);
  }
  
 
  filteredTodos.forEach(todo => {
    const todoEl = createTodoElement(todo);
    todoList.appendChild(todoEl);
  });
}


function createTodoElement(todo) {
  const todoEl = document.createElement('div');
  todoEl.classList.add('todo-item');
  if (todo.completed) todoEl.classList.add('done');
  
  const todoContent = document.createElement('div');
  todoContent.classList.add('todo-content');
  
  const todoInput = document.createElement('input');
  todoInput.type = 'text';
  todoInput.value = todo.text;
  todoInput.setAttribute('readonly', 'readonly');
  
  const todoDate = document.createElement('div');
  todoDate.classList.add('todo-date');
  todoDate.textContent = `Added: ${todo.date}`;
  
  todoContent.appendChild(todoInput);
  todoContent.appendChild(todoDate);
  todoEl.appendChild(todoContent);
  
  const actions = document.createElement('div');
  actions.classList.add('action-items');
  
  const doneBtn = createIcon('fa-check', () => toggleComplete(todo.id));
  const editBtn = createIcon('fa-pen-to-square', () => toggleEdit(todo.id, todoInput, editBtn));
  const deleteBtn = createIcon('fa-trash', () => deleteTodo(todo.id));
  
  actions.appendChild(doneBtn);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  todoEl.appendChild(actions);
  
  return todoEl;
}


function createIcon(iconClass, clickHandler) {
  const icon = document.createElement('i');
  icon.classList.add('fa-solid', iconClass);
  icon.addEventListener('click', clickHandler);
  return icon;
}


function toggleComplete(id) {
  todos = todos.map(todo => 
    todo.id === id ? {...todo, completed: !todo.completed, lastUpdated: new Date().getTime()} : todo
  );
  saveTodos();
  renderTodos();
}

function toggleEdit(id, input, btn) {
  if (btn.classList.contains('edit')) {
    
    btn.classList.remove('fa-pen-to-square', 'edit');
    btn.classList.add('fa-x', 'save');
    input.removeAttribute('readonly');
    input.focus();
  } else {
    // Save changes
    const newText = input.value.trim();
    if (newText) {
      todos = todos.map(todo => 
        todo.id === id ? {...todo, text: newText, lastUpdated: new Date().getTime()} : todo
      );
      saveTodos();
    }
    btn.classList.remove('fa-x', 'save');
    btn.classList.add('fa-pen-to-square', 'edit');
    input.setAttribute('readonly', 'readonly');
    renderTodos();
  }
}


function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
}


function filterTodos() {
  renderTodos();
}


function sortTodos() {
  renderTodos();
}


function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}


function loadTheme() {
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
}


function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}


init();