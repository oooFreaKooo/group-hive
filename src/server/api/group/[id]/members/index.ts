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

    // Fetch profiles that have this groupId in their groupIds array
    const members = await prisma.profile.findMany({
        where: {
            groupIds: {
                has: groupId,
            },
        },
    })

    return members
})
