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

    const body = await readBody(event)
    const { title, weekStart, weekEnd, groupId } = body

    // Verify user is admin or owner of the group
    const groupMember = await prisma.groupUser.findFirst({
        where: {
            profileId: user.id,
            groupId,
            OR: [
                { role: 'ADMIN' },
                {
                    group: {
                        ownerId: user.id,
                    },
                },
            ],
        },
    })

    if (!groupMember) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Only admins and group owners can create task rows',
        })
    }

    // Get the highest order number for the group
    const highestOrder = await prisma.taskRow.findFirst({
        where: { groupId },
        orderBy: { order: 'desc' },
        select: { order: true },
    })

    // Create the task row
    const taskRow = await prisma.taskRow.create({
        data: {
            title,
            weekStart: new Date(weekStart),
            weekEnd: new Date(weekEnd),
            groupId,
            order: (highestOrder?.order ?? -1) + 1,
        },
    })

    return taskRow
})
