import express from "express";
import { createUser, loginUser, findUser, editUser, removeUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/", findUser);
router.put("/:id", editUser);
router.delete("/:id", removeUser);

export default router