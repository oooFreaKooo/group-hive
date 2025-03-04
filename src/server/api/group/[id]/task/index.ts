import { PrismaClient } from '@prisma/client'
import { defineEventHandler, createError } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const groupId = event.context.params?.id

    if (!groupId) {
        throw createError({
            statusCode: 400,
            message: 'Group ID is required',
        })
    }

    // Fetch tasks for this group with tags included
    const tasks = await prisma.task.findMany({
        where: {
            groupId,
            // Only fetch parent tasks (tasks without a parent)
            parentId: null,
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

    return tasks
})
