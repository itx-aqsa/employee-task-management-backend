import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addUSer, getUserByEmail, getAllUsers, getUser, updateUser, deleteUser } from "../models/userModel.js";
import { loginSchema, userSchema, updateUserSchema } from "../validations/userValidation.js";
import { email } from "zod";

export const createUser = async (req, res) => {
    try {
        const body = req.body;

        const validatedData = userSchema.parse(body);

        const existingUSer = await getUserByEmail(validatedData.email);
        if(existingUSer){
            return res.status(409).json({
                status: false,
                message: "Email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        const newUser = await addUSer({...validatedData, password: hashedPassword});

        res.status(201).json({
            status: true,
            message: "User created successfully",
            data: newUser 
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const user = await getUserByEmail(validatedData.email);

        if(!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(
            validatedData.password,
            user.password,
        )

        if(!isPasswordCorrect) {
            return res.status(401).json({
                status: false,
                message: "Invalid password",
            })
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        return res.status(200).json({
            status: true,
            message: "Login successful",
            token: token,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        })
    }
} 

export const findUser = async (req, res) => {
    try {
        const showAllUser = await getAllUsers();
        res.status(200).json(showAllUser);
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

export const editUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const existingUser = await getUser(id);
        if (!existingUser) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }
        const validatedData = updateUserSchema.parse(req.body);

        if (validatedData.email && validatedData.email !== existingUser.email) {
            const emailTaken = await getUserByEmail(validatedData.email);
            if (emailTaken) {
                return res.status(409).json({
                    status: false,
                    message: "Email already exists"
                })
            }
        }
        if (validatedData.password) {
            validatedData.password = await bcrypt.hash(validatedData.password, 10);
        }

        const updatedUser = await updateUser(id, validatedData);

        res.status(200).json({
            status: true,
            message: "User updated successfully",
            data: updatedUser
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

export const removeUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const existingUser = await getUser(id);
        if (!existingUser) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }

        await deleteUser(id);

        res.status(200).json({
            status: true,
            message: "User deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

export const getProfile = async (req, res) => {
    try {
        const user = await getUser(req.user.id);
        if(!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            status: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}