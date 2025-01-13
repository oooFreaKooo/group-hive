import { PrismaClient } from '@prisma/client'
import { defineEventHandler, createError } from 'h3'
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
    const groupMember = await prisma.groupUser.findFirst({
        where: {
            profileId: user.id,
            groupId,
        },
    })

    if (!groupMember) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Not a member of this group',
        })
    }

    // Get all tags for the group
    const tags = await prisma.tag.findMany({
        where: {
            groupId,
        },
        orderBy: {
            title: 'asc',
        },
    })

    return tags
})
