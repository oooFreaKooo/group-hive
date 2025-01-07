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
        const body = await readBody(event)

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
                message: 'Not authorized to edit this message',
            })
        }

        // Update the message
        const updatedMessage = await prisma.message.update({
            where: { id: messageId },
            data: {
                content: body.content,
                isEdited: true,
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
        })

        return updatedMessage
    } catch (error) {
        console.error('Error updating message:', error)
        throw createError({
            statusCode: 500,
            message: 'Error updating message',
        })
    }
})
