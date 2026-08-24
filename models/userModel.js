import { prisma } from "../lib/prisma.js";

export const addUser = (data) => {
    return prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
            role: "EMPLOYEE"
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

export const getAllEmployees = () => {
    return prisma.user.findMany({
        where: {
            role: "EMPLOYEE"
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}

export const getUser = (id) => {
    return prisma.user.findUnique({
        where: {
            id
        }
    })
}

export const updateUser = (id, data) => {
    return prisma.user.update({
        where: { id },
        data
    })
}

export const deleteUser = (id) => {
    return prisma.user.delete({
        where: { id }
    })
}