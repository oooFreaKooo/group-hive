import { PrismaClient } from '@prisma/client'
import { defineEventHandler, createError } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Group ID is required',
        })
    }

    // Get task rows with tasks and their tags
    const taskRows = await prisma.taskRow.findMany({
        where: { groupId: id },
        orderBy: { order: 'asc' },
        include: {
            tasks: {
                include: {
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                },
            },
        },
    })

    return taskRows
})
