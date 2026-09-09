import { addTask, getAllTasks, getTask, updateTask, deleteTask, getMyTasks, updateTaskStatus } from "../models/taskModel.js";
import { getUser } from "../models/userModel.js";
import { taskSchema, updateTaskSchema, updateTaskStatusSchema } from "../validations/taskValidation.js";

                                                                                                                                                                                                                                                                                                    
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
        const id = req.params.id;

        const existingTask = await getTask(id);
        if (!existingTask) {
            return res.status(404).json({
                status: false,
                message: "Task not found"
            });
        }

        const validatedData = updateTaskSchema.parse(req.body);

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
        const id = req.params.id;

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

export const findOneTask = async (req, res) => {
    try {
        const id = req.params.id;

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
}

export const findMyTasks = async(req, res) => {
    try {
        const tasks = await getMyTasks(req.user.id);
        res.status(200).json({
            status: true,
            data: tasks
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

export const changeTaskStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await getTask(id);
        if(!task) {
            return res.status(404).json({
                status: false,
                message: "Task not found"
            })
        }

        if(task.userId !== req.user.id) {
            return res.status(403).json({
                status: false,
                message: "You can only update your own tasks"
            })
        }

        const validateData = updateTaskStatusSchema.parse(req.body);
        const updatedTask = await updateTaskStatus(id, validateData.status);
        res.status(200).json({
            status: true,
            message: "Task status updated successfully",
            data: updatedTask
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        })
    }
}