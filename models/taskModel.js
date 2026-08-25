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
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
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

export const updateTask = (id, data) => {
    return prisma.task.update({
        where: {
            id
        },
        data: {
            title: data.title,
            description: data.description,
            priority: data.priority,
            userId: data.userId
        }
    });
};

export const deleteTask = (id) => {
    return prisma.task.delete({
        where: {
            id
        }
    });
};

export const getMyTasks = (userId) => {
    return prisma.task.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}

export const updateTaskStatus = (id, status) => {
    return prisma.task.update({
        where: {
            id
        },
        data: {
            status
        }
    })
}