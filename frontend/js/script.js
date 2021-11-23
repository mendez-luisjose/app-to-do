//Constantes
const newTaskBotton = document.querySelector(".addTaskButton");
const addTaskContainer = document.querySelector(".addTask-container");
const taskLevelContainer = document.getElementById("task-levels");
const tasksContainer = document.querySelector(".tasks-container");
const addNewTaskButton = document.querySelector(".addNewTaskButton");
const inputField = document.querySelector(".inputNewTask");
const mainField = document.querySelector("main");
const trashIconAllField = document.querySelector(".trash-icon-delete-all");
const orderTasksButton = document.querySelector(".orderButton");
const container = document.querySelector(".container");
const spinner = document.querySelector(".div-spinner-container");

let taskNumber = 0;

const img = "check.png";

//Ypu must set your Port
const PORT = 0;

//Class that contains all the fetch requets, GET, PUT, DELETE and POST
class TaskService {
    constructor() {
        this.URl = `http://localhost:${PORT}/api/tasks`;
    }

    //Fetch GET request, to get all the tasks
    async getTasks() {
        try {
            const response = await fetch(this.URl);    
            const tasks = await response.json();
            return tasks;
        } catch {
            alert("Hubo un Error al Recibir Las Tareas, Revisa tu Conexion te Internet");
        }
    }

    //Fetch GET request, to get an id of one selected task
    async getTaskId(taskDescripcion, taskLevel, taskFinalizada) {
        try {
            const taskId = await fetch(`${this.URl}/get-task-id/${taskDescripcion}/${taskLevel}/${taskFinalizada}`);    
            const id = await taskId.json();
            return id;
        } catch {
            alert("Hubo un Error al Recibir Las Tareas, Revisa tu Conexion te Internet");            
        }
    }

    //Fetch POST request, to save one single tasks
    async postTask(task) {
        try {
            const res = await fetch(this.URl, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(task)
            });
            const data = await res.json();
            return data;
        } catch {
            alert("Hubo un Error al Guardar La Tarea, Revisa tu Conexion te Internet");            
        }
    }

    //Fetch DELETE request, to delete one single task
    async deleteTask(taskId, confirmation) {
        try {
            const res = await fetch(`${this.URl}/${taskId}/delete-all=${confirmation}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'DELETE'
            });
            const data = await res.json();
            console.log(data);
        } catch {
            alert("Hubo un Error al Elimina La Tarea, Revisa tu Conexion te Internet");            

        }
    }

    //Fetch PUT request, to edit one single task
    async editTask(taskId) {
        try {
            const res = await fetch(`${this.URl}/${taskId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'PUT'
            });
            const data = await res.json();
            console.log(data);
        } catch {
            alert("Hubo un Error al Modificar La Tarea, Revisa tu Conexion te Internet");            

        }
    }


}

//Function that create a new task in an object
const buildTask = (taskEstate, taskDesciption, taskLevel) => {
    let task = {
        finalizada: taskEstate,
        descripcion: taskDesciption,
        prioridad: taskLevel
    }

    return task;
}


const taskService = new TaskService();

//When there is a click on the New Task Button, it shows the menu to add a new task
newTaskBotton.addEventListener("click", () => {
    addTaskContainer.classList.toggle("show");
})

//When there is a click on the trash field, eliminate all the tasks from the Tasks Container
trashIconAllField.addEventListener("click", async () => {
    tasksContainer.innerHTML = "";
    taskNumber = 0;
    mainField.style.padding = "1rem 0rem 0rem";

    //Fetch that notifies the Nodejs Server when to eliminate all the tasks storage from de MongoDB Database
    await taskService.deleteTask("none", "yes");
})

//Function that creates a new task, and add it to the Tasks Container
const createNewTask = async (value) => {
    const task = document.createElement('div');
    const check = document.createElement("img");
    const taskDescription = document.createElement("span")
    const taskLevel = document.createElement("span")
    const trashIcon = document.createElement("i");
    const trashField = document.createElement("span");

    task.classList.add('task');
    check.src = `./img/${img}`;
    check.classList.add("task-to-do");
    taskDescription.classList.add("task-description");
    trashIcon.classList.add("bx", "bxs-trash", "trash-icon");
    taskDescription.innerText = value;
    taskLevel.innerText = taskLevelContainer.value;

    if (taskLevelContainer.value == "Bajo") {
        taskLevel.classList.add("task-level", "task-level-low");
    } else if (taskLevelContainer.value == "Medio") {
        taskLevel.classList.add("task-level", "task-level-medium");
    } else if (taskLevelContainer.value == "Alto") {
        taskLevel.classList.add("task-level", "task-level-high");
    }

    task.setAttribute("task-finished", "no");
    task.setAttribute("task-number", `${taskNumber}`);
    check.setAttribute("task-number", `${taskNumber}`);
    taskDescription.setAttribute("task-number", `${taskNumber}`);
    taskLevel.setAttribute("task-number", `${taskNumber}`);
    trashIcon.setAttribute("task-number", `${taskNumber}`);
    trashField.setAttribute("task-number", `${taskNumber}`);

    taskNumber++;

    trashField.append(trashIcon);

    check.addEventListener('click', changeTaskState);
    taskDescription.addEventListener('click', changeTaskState);
    taskLevel.addEventListener('click', changeTaskState);

    task.append(check, taskDescription, taskLevel, trashField);
    tasksContainer.prepend(task);

    trashIcon.addEventListener("click", eliminateTask)

    mainField.style.padding = "1rem 0rem";

    //Fetch that notifies the Nodejs Server when to storage a new task to the de MongoDB Database
    const response = await taskService.postTask(buildTask("no", value, taskLevelContainer.value));
    console.log(response);
    let taskId = await taskService.getTaskId(value, taskLevelContainer.value, "no");

    task.setAttribute("_id", `${taskId}`);
    check.setAttribute("_id", `${taskId}`);
    taskDescription.setAttribute("_id", `${taskId}`);
    taskLevel.setAttribute("_id", `${taskId}`);
    trashIcon.setAttribute("_id", `${taskId}`);
    trashField.setAttribute("_id", `${taskId}`);
}

//Function that change the task state to finished when there is a click on the task
const changeTaskState = async event => {
    let selectedTaskNumber = event.target.getAttribute("task-number");

    const allTasks = document.querySelectorAll(".task");
    let taskSelected = (allTasks.length-1)-selectedTaskNumber;
    
    allTasks[taskSelected].classList.toggle("task-terminada");

    //Fetch that notifies the Nodejs Server when to change the task state from the MongoDB Database
    await taskService.editTask(allTasks[taskSelected].getAttribute("_id"));
};

//Function that eliminates one single task selected
const eliminateTask = async event => {
    let selectedTaskNumber = event.target.getAttribute("task-number");
    let allTasks = document.querySelectorAll(".task");
    let allTasksFinished = [];

    let taskSelected = (allTasks.length-1)-selectedTaskNumber;

    allTasks[taskSelected].style.display = "none";
    allTasks[taskSelected].setAttribute("task-finished", "yes");

    allTasks.forEach(taks => {
        allTasksFinished.push(taks.getAttribute("task-finished"));
    })

    let isAllTasksFinished = allTasksFinished.every(task => {
        return task == "yes"
    })

    if (isAllTasksFinished) {
        mainField.style.padding = "1rem 0rem 0rem";
    } else {
        mainField.style.padding = "1rem 0rem";
    }

    //Fetch that notifies the Nodejs Server when to eliminate one single task from de MongoDB Database
    await taskService.deleteTask(allTasks[taskSelected].getAttribute("_id"), "no");
}

//When the input is sended, it create a new task and it is added to the Tasks Container
inputField.addEventListener("keypress", event => {
    const code = event.code;
    const value  = inputField.value;

    if (code != "Enter") {
        return;
    } 

    if(!value) return;

    createNewTask(value);
    inputField.value = "";
})

//When there is a click on the Symbol "+", it add the task to the Tasks Container
addNewTaskButton.addEventListener("click", () => {
    const value = inputField.value;
    if(!value) return;

    createNewTask(value);

    inputField.value = "";
    taskLevelContainer.value = "Bajo";
})

//Function that order the tasks that are NOT DONE to the top, and the tasks that are DONE to the bottom on the Tasks Container
const order = () => {
    const done = [];
    const toDo = [];
    let allTasks = document.querySelectorAll(".task");
    let newTaskNumber = allTasks.length - 1;

    allTasks.forEach( task => {
        task.classList.contains("task-terminada") ? done.push(task) : toDo.push(task)
    })

    let newTasksOrder = [...toDo, ...done];

    newTasksOrder.forEach(taskOrder => {
        taskOrder.setAttribute("task-number", `${newTaskNumber}`);
        taskOrder.childNodes[3].childNodes[0].setAttribute("task-number", `${newTaskNumber}`);
        taskOrder.childNodes.forEach(child => {
            child.setAttribute("task-number", `${newTaskNumber}`);

        })
        newTaskNumber--;
    });

    return newTasksOrder;
}

//When there is a click on the ORDENAR button, it order all the tasks that are NOT DONE to the top, and the tasks that are DONE to the bottom on the Tasks Container
orderTasksButton.addEventListener("click", () => {
    order().forEach(el => tasksContainer.appendChild(el))
});

//Function that create a new task that are stored on the MongoDB Database
const crearTareaRecibidaDelServidor = async (tarea) => {
    const task = document.createElement('div');
    const check = document.createElement("img");
    const taskDescription = document.createElement("span")
    const taskLevel = document.createElement("span")
    const trashIcon = document.createElement("i");
    const trashField = document.createElement("span");

    task.classList.add('task');
    check.src = `./img/${img}`;
    check.classList.add("task-to-do");
    taskDescription.classList.add("task-description");
    trashIcon.classList.add("bx", "bxs-trash", "trash-icon");
    taskDescription.innerText = tarea.descripcion;
    taskLevel.innerText = tarea.prioridad;

    if (tarea.prioridad == "Bajo") {
        taskLevel.classList.add("task-level", "task-level-low");
    } else if (tarea.prioridad == "Medio") {
        taskLevel.classList.add("task-level", "task-level-medium");
    } else if (tarea.prioridad == "Alto") {
        taskLevel.classList.add("task-level", "task-level-high");
    }

    task.setAttribute("task-finished", `${tarea.finalizada}`);
    task.setAttribute("task-number", `${taskNumber}`);
    check.setAttribute("task-number", `${taskNumber}`);
    taskDescription.setAttribute("task-number", `${taskNumber}`);
    taskLevel.setAttribute("task-number", `${taskNumber}`);
    trashIcon.setAttribute("task-number", `${taskNumber}`);
    trashField.setAttribute("task-number", `${taskNumber}`);

    taskNumber++;

    trashField.append(trashIcon);

    check.addEventListener('click', changeTaskState);
    taskDescription.addEventListener('click', changeTaskState);
    taskLevel.addEventListener('click', changeTaskState);

    task.append(check, taskDescription, taskLevel, trashField);

    tasksContainer.prepend(task);
    trashIcon.addEventListener("click", eliminateTask)

    if (tarea.finalizada == "yes") {
        task.classList.toggle("task-terminada");
    }

    mainField.style.padding = "1rem 0rem";

    let taskId = await taskService.getTaskId(tarea.descripcion, tarea.prioridad, tarea.finalizada);

    task.setAttribute("_id", `${taskId}`);
    check.setAttribute("_id", `${taskId}`);
    taskDescription.setAttribute("_id", `${taskId}`);
    taskLevel.setAttribute("_id", `${taskId}`);
    trashIcon.setAttribute("_id", `${taskId}`);
    trashField.setAttribute("_id", `${taskId}`);
}

//Function that receive all the tasks that are stored on the MongoDB Database
const recibirTasks = async () => {
    try {
        //Fetch that return all the tasks storage from the MongoDB Database
        let tasks = await taskService.getTasks();
        if (tasks.length > 0) {
            const done = [];
            const toDo = [];

            tasks.forEach( task => {
                task.finalizada == "yes" ? done.push(task) : toDo.push(task);
            })

            let newTasksOrder = [...done, ...toDo];
            console.log(newTasksOrder);

            for (let i = 0; i < newTasksOrder.length; i++) {
                crearTareaRecibidaDelServidor(newTasksOrder[i]);
            }

        } else {
            console.log("No hay ninguna Tarea guardada en el servidor");
        }

    } catch {
        alert("Hubo un Error al Recibir Las Tareas, Revisa tu Conexion te Internet");
    }
}

recibirTasks();


//setTimeout that after 2 seconds, the css loader animation disappear and it shows the app-todo ui
setTimeout(() => {
    container.style.display = "block";
    spinner.style.display = "none";
}, 2500);




