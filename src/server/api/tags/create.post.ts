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
    const { title, color, groupId } = body

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
            statusMessage: 'Only admins and group owners can create tags',
        })
    }

    // Create the tag
    try {
        const tag = await prisma.tag.create({
            data: {
                title,
                color,
                groupId,
            },
        })
        return tag
    } catch (error: any) {
        // Handle unique constraint violation
        if (error.code === 'P2002') {
            throw createError({
                statusCode: 400,
                statusMessage: 'A tag with this title already exists in the group',
            })
        }
        throw error
    }
})
