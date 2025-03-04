import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody, createError } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const groupId = event.context.params?.id
    const taskId = event.context.params?.taskId
    const method = event.method

    if (!groupId || !taskId) {
        throw createError({
            statusCode: 400,
            message: 'Group ID and Task ID are required',
        })
    }

    // Verify task belongs to group
    const existingTask = await prisma.task.findUnique({
        where: {
            id: taskId,
            groupId,
        },
    })

    if (!existingTask) {
        throw createError({
            statusCode: 404,
            message: 'Task not found',
        })
    }

    // Handle GET request - fetch task details
    if (method === 'GET') {
        return await prisma.task.findUnique({
            where: {
                id: taskId,
            },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
                subtasks: true,
            },
        })
    }

    // Handle PUT request - update task
    if (method === 'PUT') {
        const body = await readBody(event)

        // Update main task
        const updatedTask = await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                description: body.description,
                dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
                pointValue: body.pointValue,
                completed: body.completed,
                assignedToId: body.assignedToId,
                completedById: body.completedById,
                tags: body.tagIds
                    ? {
                        deleteMany: {},
                        create: body.tagIds.map((tagId: string) => ({
                            tag: {
                                connect: { id: tagId },
                            },
                        })),
                    }
                    : undefined,
            },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
                subtasks: true,
            },
        })

        // Update or create subtasks if provided
        if (body.subtasks) {
            // Delete existing subtasks not in the new list
            await prisma.task.deleteMany({
                where: {
                    parentId: taskId,
                    id: {
                        notIn: body.subtasks
                            .filter((s: any) => s.id)
                            .map((s: any) => s.id),
                    },
                },
            })

            // Update or create subtasks
            for (const subtask of body.subtasks) {
                if (subtask.id) {
                    // Update existing subtask
                    await prisma.task.update({
                        where: { id: subtask.id },
                        data: {
                            description: subtask.description,
                            pointValue: subtask.pointValue,
                        },
                    })
                } else {
                    // Create new subtask
                    await prisma.task.create({
                        data: {
                            description: subtask.description,
                            pointValue: subtask.pointValue,
                            groupId,
                            parentId: taskId,
                            assignedToId: body.assignedToId,
                            dueDate: body.dueDate ? new Date(body.dueDate) : null,
                        },
                    })
                }
            }

            // Fetch updated task with all relations
            return await prisma.task.findUnique({
                where: { id: taskId },
                include: {
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                    subtasks: true,
                },
            })
        }

        return updatedTask
    }

    // Handle DELETE request
    if (method === 'DELETE') {
        // Delete subtasks first (should cascade automatically due to the relation)
        return await prisma.task.delete({
            where: {
                id: taskId,
            },
        })
    }

    throw createError({
        statusCode: 405,
        message: 'Method not allowed',
    })
})
