import { prisma } from "../lib/prisma.js";

export const addTask = (data) => {
    return prisma.task.create({
        data: {
            title: data.title,
            description: data.description,
            priority: data.priority,
            userId: data.userId
        }
    });
};

export const getAllTasks = () => {
    return prisma.task.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
};

export const getTask = (id) => {
    return prisma.task.findUnique({
        where: {
            id
        }
    });
};

export const editTask = (id, data) => {
    return prisma.task.update({
        where: {
            id
        },
        data: {
            title: data.title,
            description: data.description,
            priority: data.priority,
            status: data.status,
            userId: data.userId
        }
    });
};

export const removeTask = (id) => {
    return prisma.task.delete({
        where: {
            id
        }
    });
};