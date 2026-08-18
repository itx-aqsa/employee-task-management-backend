import express from "express";
import { createTask, findTasks, findTask, updateTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", findTasks);
router.get("/:id", findTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;