import { PrismaClient } from '@prisma/client'
import { defineEventHandler, getQuery, createError } from 'h3'
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

    const query = getQuery(event)
    const groupId = Number(query.groupId)

    if (!groupId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Group ID is required',
        })
    }

    // Verify user is member of the group
    const groupMember = await prisma.groupUser.findUnique({
        where: {
            profileId_groupId: {
                profileId: user.id,
                groupId,
            },
        },
    })

    if (!groupMember) {
        throw createError({
            statusCode: 403,
            statusMessage: 'You are not a member of this group',
        })
    }

    // Get task rows with their tasks
    const taskRows = await prisma.taskRow.findMany({
        where: { groupId },
        orderBy: { order: 'asc' },
        include: {
            tasks: {
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
            },
        },
    })

    return taskRows
})
