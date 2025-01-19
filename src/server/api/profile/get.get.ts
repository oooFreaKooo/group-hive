import { PrismaClient } from '@prisma/client'
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

    const profile = await prisma.profile.findUnique({
        where: {
            id: user.id,
        },
        select: {
            id: true,
            email: true,
            displayName: true,
            avatarUrl: true,
            bgUrl: true,
            city: true,
            postalCode: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            groupMembers: true,
            ownedGroups: {
                include: {
                    members: {
                        include: {
                            profile: true,
                        },
                    },
                },
            },
        },
    })

    return { profile }
})
