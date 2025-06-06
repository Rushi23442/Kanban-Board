let draggedCard = null;
let rightClickedCard = null;
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.cards').forEach(card => {
        card.classList.remove('highlight');
    });
});

const todoRemove = document.getElementById('todo-remove');
const doingRemove = document.getElementById('doing-remove');
const doneRemove = document.getElementById('done-remove');

const todoCount = document.getElementById('todo-count');
const doingCount = document.getElementById('doing-count');
const doneCount = document.getElementById('done-count');

const todoTasks = document.getElementById('todo-tasks');
const doingTasks = document.getElementById('doing-tasks');
const doneTasks = document.getElementById('done-tasks');

document.addEventListener('DOMContentLoaded', loadLocalStorage);

function addTask(columnId) {
    const input = document.getElementById(`${columnId}-input`);
    const taskText = input.value.trim();
    if (taskText === "") return;

    const taskDate = new Date().toLocaleString();
    const taskId = `${columnId}-${taskText}-${taskDate}`;
    const taskElement = createTaskElement(taskText, taskDate, taskId);

    document.getElementById(`${columnId}-tasks`).appendChild(taskElement);

    input.value = "";
    updateTasksCount(columnId);
    saveTaskstoLocalStorage(columnId, taskText, taskDate, taskId);
}

function createTaskElement(taskText, taskDate, taskId) {
    const element = document.createElement("div");
    element.innerHTML = `<span>${taskText}</span><br><small class="time">${taskDate}</small>`;
    element.classList.add('cards');
    element.draggable = true;
    element.dataset.id = taskId;

    element.addEventListener("dragstart", dragStart);
    element.addEventListener("dragend", dragEnd);
    element.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        rightClickedCard = this;
        showContextMenu(event.pageX, event.pageY);
    });
    element.classList.add('highlight');
    setTimeout(() => { element.classList.remove('highlight') },5000);

    return element;
}

function dragStart() {
    this.classList.add('dragging');
    draggedCard = this;
    this.classList.add('highlight');

}

function dragEnd() {
    this.classList.remove('dragging');
    this.classList.add('highlight');
    setTimeout(() => {this.classList.remove('highlight') },5000);


    const timeElement = this.querySelector('small');
    if (timeElement) {
        timeElement.textContent = new Date().toLocaleString();
    }
    setTimeout(() => { element.classList.remove('highlight') },5000);

    updateLocalStorage();
}

const columns = document.querySelectorAll(".column .tasks");

columns.forEach((column) => {
    column.addEventListener('dragover', dragOver);
});

function dragOver(event) {
    event.preventDefault();
    this.appendChild(draggedCard);

    ["todo", "doing", "done"].forEach((columnId) => {
        updateTasksCount(columnId);
    });
}

const contextMenu = document.querySelector(".context-menu");

function showContextMenu(x, y) {
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.display = "block";
}

document.addEventListener("click", () => {
    contextMenu.style.display = "none";
});

function editTask() {
    if (rightClickedCard !== null) {
        const newTaskText = prompt("Edit Task", rightClickedCard.querySelector('span').textContent);
        if (newTaskText !== "") {
            rightClickedCard.querySelector('span').textContent = newTaskText;
            rightClickedCard.querySelector('small').textContent = new Date().toLocaleString();
            updateLocalStorage();
        }

    }
}

function deleteTask() {
    if (rightClickedCard !== null) {
        const parentColumn = rightClickedCard.parentElement.parentElement.id.split('-')[0];
        rightClickedCard.remove();
        updateTasksCount(parentColumn);
        updateLocalStorage();
    }
}

function updateTasksCount(columnId) {
    const column = document.getElementById(columnId);
    const countSpan = column.querySelector("h2 span");
    const taskContainer = document.getElementById(`${columnId}-tasks`);
    countSpan.textContent = taskContainer.children.length;
}

function saveTaskstoLocalStorage(columnId, taskText, taskDate, taskId) {
    const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
    const taskExists = tasks.some(task => task.id === taskId);
    if (!taskExists) {
        tasks.push({ text: taskText, date: taskDate, id: taskId });
        localStorage.setItem(columnId, JSON.stringify(tasks));
    }
}

function loadLocalStorage() {
    ["todo", "doing", "done"].forEach((columnId) => {
        const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
        const taskContainer = document.getElementById(`${columnId}-tasks`);

        tasks.forEach(({ text, date, id }) => {
            const taskExists = taskContainer.querySelector(`[data-id="${id}"]`);
            if (!taskExists) {
                const taskElement = createTaskElement(text, date, id);
                taskContainer.appendChild(taskElement);
            }
        });
        updateTasksCount(columnId);
    });
}

function updateLocalStorage() {
    ["todo", "doing", "done"].forEach((columnId) => {
        const tasks = [];
        document.querySelectorAll(`#${columnId}-tasks .cards`).forEach((card) => {
            const taskText = card.querySelector("span").textContent;
            const taskDate = card.querySelector("small").textContent;
            const taskId = card.dataset.id;
            tasks.push({ text: taskText, date: taskDate, id: taskId });
        });
        localStorage.setItem(columnId, JSON.stringify(tasks));
    });
}


todoRemove.addEventListener('click', () => removeTasks('todo'));
doingRemove.addEventListener('click', () => removeTasks('doing'));
doneRemove.addEventListener('click', () => removeTasks('done'));

function removeTasks(columnId) {
    const taskContainer = document.getElementById(`${columnId}-tasks`);
    const countElement = document.getElementById(`${columnId}-count`);

    const resp = confirm("Do you want to remove all tasks? Select Ok for proceeding or Cancel for returning");
    if (resp) {
        taskContainer.innerHTML = "";
        updateTasksCount(columnId);
        updateLocalStorage();
    }
}


document.addEventListener('contextmenu', function (event) {
    rightClickedCard = event.target.closest('.cards'); 
    if (rightClickedCard) {
        rightClickedCard.classList.add('highlight'); 
        setTimeout(() => {
            if (rightClickedCard) { 
                rightClickedCard.classList.remove('highlight');
            }
        },8000);
    }
});

document.querySelectorAll('.cards').forEach(card => {
    card.addEventListener('dragstart', function () {
        this.classList.add('highlight');
    });

    card.addEventListener('dragend', function () {
        this.classList.remove('highlight');
    });
});
