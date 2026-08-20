import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(2, "Name must be atleast 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
})

export const loginSchema = z.object({
    email: z.string().email("Please enter valid email"),
    password: z.string().min(6, "Password must be atlest 6 characters")
})

export const updateUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Please enter a valid email").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update"
})