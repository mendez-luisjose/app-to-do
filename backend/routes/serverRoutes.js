//Frameworks
const { Router } = require('express');
const router = Router();

//Modules
const Task = require("../modules/createTask/createTask");

//When the client visits, the Mongo database return all the tasks storage on the database
router.get("/", async (request, response) => {
    const tasks = await Task.find();
    response.json(tasks);
})

//When the client visits, the Mongo database return the id task selected
router.get("/get-task-id/:descripcion/:level/:finalizada", async (request, response) => {
    const taskId = await Task.findOne({ descripcion: request.params.descripcion, prioridad: request.params.level, finalizada: request.params.finalizada});
    response.json(taskId._id);
})

//When the client visits, insert a new task to the Mongo database
router.post('/', async (request, response) => {
    const { finalizada, descripcion, prioridad } = request.body;
    const newTask = new Task({finalizada, descripcion, prioridad});
    await newTask.save();
    response.json({'message': 'Task Saved'});
});

//When the client visits, delete one single task or all the tasks from the Mongo database
router.delete('/:id/delete-all=:confirmation', async (request, response) => {
    if (request.params.confirmation == "yes") {
        await Task.deleteMany();
        response.json({message: 'All Tasks Deleted'});
    } else if (request.params.confirmation == "no") {
        const task = await Task.findByIdAndDelete(request.params.id);
        response.json({message: 'Task Deleted'});
    }
});

//When the client visits, change one single task from the Mongo database, declaring if the task is DONE with a `yes` or if the task is NOT DONE with a `no`
router.put('/:id', async (request, response) => {
    const task = await Task.findById(request.params.id);
    console.log(task.finalizada);
     if (task.finalizada == "yes") {
        await Task.updateOne({"_id": request.params.id}, {$set: {"finalizada": "no"}});
    } else if (task.finalizada == "no") {
        await Task.updateOne({"_id": request.params.id}, {$set: {"finalizada": "yes"}});
    }
    response.json({'message': 'Task Edited'});
});

module.exports = router;