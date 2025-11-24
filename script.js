document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Custom Cursor Logic ---
    const customCursor = document.getElementById('custom-cursor');
    
    // Smooth follow effect using requestAnimationFrame
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            customCursor.style.left = `${e.clientX}px`;
            customCursor.style.top = `${e.clientY}px`;
        });
    });

    // Add click animation (shrink slightly on click)
    document.addEventListener('mousedown', () => {
        customCursor.style.transform = "translate(-50%, -50%) scale(0.8)";
    });
    
    document.addEventListener('mouseup', () => {
        customCursor.style.transform = "translate(-50%, -50%) scale(1)";
    });

    // --- 2. Todo List Logic ---
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTask');
    const todoList = document.getElementById('todoList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Load from LocalStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    renderTodos();

    function addTask(text) {
        if (text.trim() === "") {
            // Shake animation if empty
            taskInput.classList.add('shake');
            setTimeout(() => taskInput.classList.remove('shake'), 500);
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: text.trim(),
            completed: false
        };

        todos.push(newTodo);
        saveAndRender();
        taskInput.value = '';
        taskInput.focus();
    }

    function deleteTask(id, element) {
        // Animate out before deleting
        element.classList.add('removing');
        element.addEventListener('animationend', () => {
            todos = todos.filter(todo => todo.id !== id);
            saveAndRender();
        });
    }

    function toggleTodoStatus(id) {
        const todo = todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            saveAndRender();
        }
    }

    function renderTodos() {
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });

        todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            let msg = currentFilter === 'completed' ? "No completed tasks yet." : "No tasks found. Add one!";
            todoList.innerHTML = `<li style="text-align:center; color:#94a3b8; padding:20px;">${msg}</li>`;
        } else {
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.dataset.id = todo.id;
                
                li.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text">${todo.text}</span>
                    <button class="delete-btn">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;
                todoList.appendChild(li);
            });
        }
        updateTaskCount();
    }
    
    function updateTaskCount() {
        const activeTasksCount = todos.filter(todo => !todo.completed).length;
        taskCount.textContent = `${activeTasksCount} task${activeTasksCount !== 1 ? 's' : ''} left`;
    }

    function saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    // --- Event Listeners ---
    
    // Add Button
    addTaskBtn.addEventListener('click', () => addTask(taskInput.value));
    
    // Enter Key
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask(taskInput.value);
    });

    // List Clicks (Delete & Toggle)
    todoList.addEventListener('click', (e) => {
        const item = e.target.closest('.todo-item');
        if (!item) return;
        const id = parseInt(item.dataset.id);

        if (e.target.closest('.delete-btn')) {
            deleteTask(id, item);
        } else if (e.target.matches('.todo-checkbox')) {
            toggleTodoStatus(id);
        }
    });

    // Clear Completed
    clearCompletedBtn.addEventListener('click', () => {
        todos = todos.filter(todo => !todo.completed);
        saveAndRender();
    });

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });
});
