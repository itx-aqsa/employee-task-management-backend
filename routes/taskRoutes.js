import express from "express";
import { createTask, findAllTasks, findTask, updateTask, deleteTask } from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("ADMIN"), createTask);
router.get("/", authMiddleware, roleMiddleware("ADMIN"), findAllTasks);
router.get("/:id", findTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;