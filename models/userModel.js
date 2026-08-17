import { email } from "zod";
import { prisma } from "../lib/prisma.js";

export const addUSer = (data) => {
    return prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role
        }
    })
}

export const getUserByEmail = (email) => {
    return prisma.user.findUnique({
        where: {
            email: email
        }
    })
}