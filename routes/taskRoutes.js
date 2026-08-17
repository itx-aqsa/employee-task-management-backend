import { Router } from "express";
import { addTask, getAllTasks, getTask, editTask, removeTask } from "../models/taskModel.js";
import { taskSchema } from "../validations/taskValidation.js";

const router = Router();

export const createTask = async (req, res) => {
    try {
        const data = taskSchema.parse(req.body);

        const newTask = await addTask(data);
        res.status(201).json({
            status: true,
            message: "Task created successfully",
            data: newTask
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        });
    }
};

export const findTasks = async (req, res) => {
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

router.post("/", createTask);
router.get("/", findTasks);
router.get("/:id", findTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
