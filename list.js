// --- Code for Custom Cursor ---
const customCursor = document.getElementById('custom-cursor');

document.addEventListener('mousemove', (e) => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
});


// --- The rest of your to-do list code ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const taskInput = document.getElementById('taskInput');
    // ... (all your existing to-do list javascript) ...
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTask');
    const todoList = document.getElementById('todoList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // --- State Management ---
    // Load todos from localStorage or initialize as an empty array
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    // --- Initial Render ---
    renderTodos();

    // --- Main Functions ---

    /**
     * Adds a new task to the list.
     * @param {string} text - The text content of the task.
     */
    function addTask(text) {
        if (text.trim() === "") {
            // Optional: Add a visual cue for empty input, like shaking the input box
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

    /**
     * Deletes a task with a smooth animation.
     * @param {number} id - The ID of the todo to delete.
     * @param {HTMLElement} element - The list item element to animate.
     */
    function deleteTask(id, element) {
        // Add the 'removing' class to trigger the CSS slide-out animation
        element.classList.add('removing');
        
        // Wait for the animation to complete before removing the data
        element.addEventListener('animationend', () => {
            todos = todos.filter(todo => todo.id !== id);
            saveAndRender();
        });
    }

    /**
     * Toggles the completion status of a task.
     * @param {number} id - The ID of the todo to toggle.
     */
    function toggleTodoStatus(id) {
        const todo = todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            saveAndRender();
        }
    }

    /**
     * Renders the todo list based on the current filter.
     */
    function renderTodos() {
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true; // 'all' filter
        });

        todoList.innerHTML = ''; // Clear existing list

        if (filteredTodos.length === 0) {
            const emptyStateMessage = `
                <li class="empty-state">
                    <p>✨ No tasks here. Time to relax! ✨</p>
                </li>`;
            todoList.innerHTML = emptyStateMessage;
        } else {
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.dataset.id = todo.id;
                
                // **UPDATED**: HTML now includes Font Awesome icon for delete button
                li.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} aria-label="Mark task as complete">
                    <span class="todo-text">${todo.text}</span>
                    <button class="delete-btn" aria-label="Delete task">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;
                todoList.appendChild(li);
            });
        }
        updateTaskCount();
    }
    
    /**
     * Updates the count of active (uncompleted) tasks.
     */
    function updateTaskCount() {
        const activeTasksCount = todos.filter(todo => !todo.completed).length;
        taskCount.textContent = `${activeTasksCount} task${activeTasksCount !== 1 ? 's' : ''} left`;
    }

    /**
     * Saves the current todos array to localStorage and re-renders the list.
     */
    function saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    // --- Event Listeners ---

    addTaskBtn.addEventListener('click', () => addTask(taskInput.value));

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
        }
    });

    todoList.addEventListener('click', (e) => {
        const item = e.target.closest('.todo-item');
        if (!item) return;

        const id = parseInt(item.dataset.id);

        // Check if the delete button (or its icon) was clicked
        if (e.target.closest('.delete-btn')) {
            // **UPDATED**: Calls the new animated delete function
            deleteTask(id, item);
        } 
        // Check if the checkbox was clicked to toggle status
        else if (e.target.matches('.todo-checkbox')) {
            toggleTodoStatus(id);
        }
    });

    clearCompletedBtn.addEventListener('click', () => {
        todos = todos.filter(todo => !todo.completed);
        saveAndRender();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });
});

// **NOTE**: You might want to add this small CSS snippet for the empty input shake animation
/*
.shake {
    animation: shake 0.5s ease;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
.empty-state {
    text-align: center;
    padding: 20px;
    color: #a0aec0;
    pointer-events: none; /* Make it unclickable */