import express from "express";
import { createTask, findAllTasks, editTask, removeTask } from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("ADMIN"), createTask);
router.get("/", authMiddleware, roleMiddleware("ADMIN"), findAllTasks);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), editTask);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), removeTask);

export default router;