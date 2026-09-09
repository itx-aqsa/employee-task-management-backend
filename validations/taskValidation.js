import { z } from "zod";

export const taskSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    userId: z.string().uuid("Invalid employee id")
})

export const updateTaskSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters").optional(),
    description: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    userId: z.string().uuid("Invalid employee id").optional()
}).refine(
    data => Object.keys(data).length > 0,
    {
        message: "Atleast one field must be provided to update"
    }
)

export const updateTaskStatusSchema = z.object({
    status: z.enum(
        ["PENDING", "IN_PROGRESS", "COMPLETED"],
        "Invalid task status"
    )
})