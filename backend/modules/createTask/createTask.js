//Schema and Model from Mongoose that create a new task
const { Schema, model } = require('mongoose');

const taskSchema = new Schema({
    finalizada: { type: String, required: true },
    descripcion: { type: String, required: true },
    prioridad: { type: String, required: true }
});

module.exports = model("Task", taskSchema, "tasks");