import express from "express";
import { createUser, loginUser, getEmployees, editUser, removeUser, getProfile, dashboardStats, getOneEmployee } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/employees", authMiddleware, roleMiddleware("ADMIN"), getEmployees);
router.get("/profile", authMiddleware, getProfile);
router.get("/dashboard-stats", authMiddleware, roleMiddleware("ADMIN"), dashboardStats);
router.get("/id", authMiddleware, roleMiddleware("ADMIN"), getOneEmployee)

router.get(
    "/admin-dashboard", authMiddleware, 
    roleMiddleware("ADMIN"), (req, res) => {
        res.status(200).json({
            status: true,
            message: "Welcome to Admin Dashboard",
            user: req.user
        })
    }
)

router.get(
    "/employee-dashboard", authMiddleware,
    roleMiddleware("EMPLOYEE"), (req, res) => {
        res.status(200).json({
            status: true,
            message: "Welcome to Employee Dashboard",
            user: req.user
        })
    }
)

router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), editUser);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), removeUser);

export default router