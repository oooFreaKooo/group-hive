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
        const body = await readBody(event)

        // Get the GroupUser record for the current user in this group
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

        const message = await prisma.message.create({
            data: {
                content: body.content,
                groupId,
                authorId: groupUser.id,
            },
            include: {
                author: {
                    include: {
                        profile: true,
                    },
                },
            },
        })

        return message
    } catch (error) {
        console.error('Error creating message:', error)
        throw createError({
            statusCode: 500,
            message: 'Error creating message',
        })
    }
})
