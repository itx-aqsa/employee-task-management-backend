import { addTask, getAllTasks, getTask, updateTask, deleteTask } from "../models/taskModel.js";
import { getUser } from "../models/userModel.js";
import { taskSchema, updateTaskSchema } from "../validations/taskValidation.js";

                                                                                                                                                                                                                                                                                                    
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

export const editTask = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const existingTask = await getTask(id);
        if (!existingTask) {
            return res.status(404).json({
                status: false,
                message: "Task not found"
            });
        }

        const validatedData = updateTaskSchema.parse({
            ...req.body, 
            userId: req.body.userId ? Number(req.body.userId) : undefined
        })

        if(validatedData.userId) {
            const employee = await getUser(validatedData.userId);

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
        }

        const updatedTask = await updateTask(id, validatedData);
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

export const removeTask = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const existingTask = await getTask(id);
        if (!existingTask) {
            return res.status(404).json({
                status: false,
                message: "Task not found"
            });
        }

        await deleteTask(id);
        res.status(200).json({
            status: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};