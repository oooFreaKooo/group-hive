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

        const messageId = Number.parseInt(event.context.params?.messageId || '')

        // Get the message and verify ownership
        const message = await prisma.message.findUnique({
            where: { id: messageId },
            include: {
                author: {
                    include: {
                        profile: true,
                    },
                },
            },
        })

        if (!message) {
            throw createError({
                statusCode: 404,
                message: 'Message not found',
            })
        }

        if (message.author.profile.id !== user.id) {
            throw createError({
                statusCode: 403,
                message: 'Not authorized to delete this message',
            })
        }

        // Delete the message
        await prisma.message.delete({
            where: { id: messageId },
        })

        return { success: true }
    } catch (error) {
        console.error('Error deleting message:', error)
        throw createError({
            statusCode: 500,
            message: 'Error deleting message',
        })
    }
})
