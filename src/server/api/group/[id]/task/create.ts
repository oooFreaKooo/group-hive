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

    const task = await prisma.task.create({
        data: {
            description: body.description,
            dueDate: body.dueDate ? new Date(body.dueDate) : null,
            pointValue: body.pointValue,
            groupId,
            taskRowId: body.taskRowId,
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

    return task
})
