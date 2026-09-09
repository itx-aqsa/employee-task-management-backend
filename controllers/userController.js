import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addUser, getUserByEmail, getAllEmployees, getUser, updateUser, deleteUser, getDashboardStats } from "../models/userModel.js";
import { loginSchema, userSchema, updateUserSchema } from "../validations/userValidation.js";

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

        const newUser = await addUser({...validatedData, password: hashedPassword});

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

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000 
        })

        return res.status(200).json({
            status: true,
            message: "Login successful",
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

export const getEmployees = async (req, res) => {
    try {
        const employees = await getAllEmployees();
        res.status(200).json({
            status: true,
            data: employees
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

export const editUser = async (req, res) => {
    try {
        const id = req.params.id;

        const existingUser = await getUser(id);
        if (!existingUser) {
            return res.status(404).json({
                status: false,
                message: "Employee not found"
            })
        }

        if(existingUser.role !== "EMPLOYEE") {
            return res.status(403).json({
                status: false,
                message: "You can only edit employee"
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
            message: "Employee updated successfully",
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
        const id = req.params.id;

        const existingUser = await getUser(id);
        if (!existingUser) {
            return res.status(404).json({
                status: false,
                message: "Employee not found"
            })
        }

        if(existingUser.role !== "EMPLOYEE") {
            return res.status(403).json({
                status: false,
                message: "You can only delete employees"
            })
        }
        await deleteUser(id);

        res.status(200).json({
            status: true,
            message: "Employee deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

export const getOneEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await getUser(id);
        if(!user) {
            return res.status(404).json({
                status: false,
                message: "Employee not found"
            })
        }

        if(user.role !== "EMPLOYEE") {
            return res.status(404).json({
                status: false,
                message: "Employee not found"
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
 
export const getProfile = async (req, res) => {
    try {
        const user = await getUser(req.user.id);
        if(!user) {
            return res.status(404).json({
                status: false,
                message: "Employee not found"
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

export const dashboardStats = async (req, res) => {
    try {
        const stats = await getDashboardStats();
        res.status(200).json({
            status: true,
            data: stats
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

export const getEmployeeById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await getUser(id);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "Employee not found"
            })
        }

        if (user.role !== "EMPLOYEE") {
            return res.status(403).json({
                status: false,
                message: "User is not an employee"
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

export const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    })

    return res.status(200).json({
        status: true,
        message: "Logout successful"
    })
}