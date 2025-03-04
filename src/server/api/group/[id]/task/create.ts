import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody, createError } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const groupId = event.context.params?.id
    const body = await readBody(event)

    if (!groupId) {
        throw createError({
            statusCode: 400,
            message: 'Group ID is required',
        })
    }

    // Create the main task first
    const task = await prisma.task.create({
        data: {
            description: body.description,
            dueDate: body.dueDate ? new Date(body.dueDate) : null,
            pointValue: body.pointValue,
            groupId,
            assignedToId: body.assignedToId,
            tags: {
                create: body.tagIds?.map((tagId: string) => ({
                    tag: {
                        connect: { id: tagId },
                    },
                    createdAt: new Date(),
                })) || [],
            },
        },
        include: {
            tags: {
                include: {
                    tag: true,
                },
            },
        },
    })

    // Create subtasks if any
    if (body.subtasks?.length) {
        await prisma.task.createMany({
            data: body.subtasks.map((subtask: { description: string, pointValue: number }) => ({
                description: subtask.description,
                pointValue: subtask.pointValue,
                groupId,
                assignedToId: body.assignedToId,
                dueDate: body.dueDate ? new Date(body.dueDate) : null,
                parentId: task.id,
            })),
        })

        // Fetch the complete task with subtasks
        return await prisma.task.findUnique({
            where: { id: task.id },
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

    return task
})
