import { PrismaClient } from '@prisma/client'
import { serverSupabaseUser } from '#supabase/server'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const user = await serverSupabaseUser(event)
        if (!user?.id) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized',
            })
        }

        const groupId = Number.parseInt(event.context.params?.groupId || '')

        // Verify user is a member of the group
        const groupUser = await prisma.groupUser.findUnique({
            where: {
                profileId_groupId: {
                    profileId: user.id,
                    groupId,
                },
            },
        })

        if (!groupUser) {
            throw createError({
                statusCode: 403,
                message: 'Not a member of this group',
            })
        }

        const messages = await prisma.message.findMany({
            where: {
                groupId,
            },
            include: {
                author: {
                    include: {
                        profile: true,
                    },
                },
                replyTo: {
                    include: {
                        author: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        })

        return messages
    } catch (error) {
        console.error('Error fetching messages:', error)
        throw createError({
            statusCode: 500,
            message: 'Error fetching messages',
        })
    }
})
