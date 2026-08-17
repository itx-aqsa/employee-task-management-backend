import bcrypt from "bcrypt";
import { addUSer, getUserByEmail } from "../models/userModel.js";
import { loginSchema, userSchema } from "../validations/userValidation.js";

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
        return res.status(200).json({
            status: true,
            message: "Login successful",
            data: user
        })

    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        })
    }
} 