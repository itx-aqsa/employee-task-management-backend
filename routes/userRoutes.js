import express from "express";
import { createUser, loginUser, getEmployees, getEmployeeById, editUser, removeUser, getProfile, dashboardStats, logoutUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.get("/employees", authMiddleware, roleMiddleware("ADMIN"), getEmployees);
router.get("/profile", authMiddleware, getProfile);

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

router.get("/dashboard-stats", authMiddleware, roleMiddleware("ADMIN"), dashboardStats);
router.get("/:id", authMiddleware, roleMiddleware("ADMIN"), getEmployeeById);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), editUser);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), removeUser);

export default router