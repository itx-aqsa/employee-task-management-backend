import express from "express";
import { createUser, loginUser, findUser, editUser, removeUser, getProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/", findUser);
router.put("/:id", editUser);
router.delete("/:id", removeUser);
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

export default router