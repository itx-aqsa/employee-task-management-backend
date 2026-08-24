import { addTask, getAllTasks, getTask, editTask, removeTask } from "../models/taskModel.js";
import { getUser } from "../models/userModel.js";
import { taskSchema } from "../validations/taskValidation.js";

                                                                                                                                                                                                                                                                                                    
export const createTask = async (req, res) => {
    try {
        const validateData = taskSchema.parse(req.body);
        const employee = await getUser(validateData.userId);

        if(!employee) {
            return res.status(404).json({
                status: false,
                message: "Employee not found"
            })
        }

        if(employee.role !== "EMPLOYEE") {
            return res.status(400).json({
                status: false,
                message: "Task can only be assigned to an employee"
            })
        }

        const task = await addTask(validateData);
        res.status(201).json({
            status: true,
            message: "Task created successfully",
            data: task
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        });
    }
};


export const findAllTasks = async (req, res) => {
    try {
        const tasks = await getAllTasks();
        res.status(200).json({
            status: true,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

export const findTask = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const task = await getTask(id);
        if (!task) {
            return res.status(404).json({
                status: false,
                message: "Task not found"
            });
        }
        res.status(200).json({
            status: true,
            data: task
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

export const updateTask = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const data = taskSchema.parse(req.body);

        const updatedTask = await editTask(id, data);
        res.status(200).json({
            status: true,
            message: "Task updated successfully",
            data: updatedTask
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const deletedTask = await removeTask(id);
        res.status(200).json({
            status: true,
            message: "Task deleted successfully",
            data: deletedTask
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};