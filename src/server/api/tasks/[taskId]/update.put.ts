import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        })
    }

    const taskId = Number(event.context.params?.taskId)
    if (!taskId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Task ID is required',
        })
    }

    const body = await readBody(event)

    // Get the task and verify user's permissions
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
            group: {
                include: {
                    members: {
                        where: {
                            profileId: user.id,
                            OR: [
                                { role: 'ADMIN' },
                                {
                                    group: {
                                        ownerId: user.id,
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        },
    })

    if (!task) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Task not found',
        })
    }

    if (!task.group.members.length) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Only admins and group owners can update tasks',
        })
    }

    // Update the task
    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
            ...body,
            dueDate: body.dueDate ? new Date(body.dueDate) : null,
        },
        include: {
            assignedTo: {
                include: {
                    profile: true,
                },
            },
            completedBy: {
                include: {
                    profile: true,
                },
            },
            tags: {
                include: {
                    tag: true,
                },
            },
            comments: {
                include: {
                    author: {
                        include: {
                            profile: true,
                        },
                    },
                },
            },
        },
    })

    return updatedTask
})
