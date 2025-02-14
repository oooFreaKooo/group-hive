import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const groupId = event.context.params?.id
    const messageId = event.context.params?.messageId
    const method = event.method
    const user = await serverSupabaseUser(event)

    if (!groupId || !messageId) {
        throw createError({
            statusCode: 400,
            message: 'Group ID and Message ID are required',
        })
    }

    if (!user?.id) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    // Verify message exists and belongs to group
    const existingMessage = await prisma.message.findUnique({
        where: {
            id: messageId,
            groupId,
        },
    })

    if (!existingMessage) {
        throw createError({
            statusCode: 404,
            message: 'Message not found',
        })
    }

    // Verify user owns the message
    if (existingMessage.authorId !== user.id) {
        throw createError({
            statusCode: 403,
            message: 'You can only modify your own messages',
        })
    }

    // Handle PUT request - edit message
    if (method === 'PUT') {
        const body = await readBody(event)

        if (!body.content?.trim()) {
            throw createError({
                statusCode: 400,
                message: 'Message content is required',
            })
        }

        return await prisma.message.update({
            where: {
                id: messageId,
            },
            data: {
                content: body.content,
                isEdited: true,
            },
            include: {
                author: true,
                replyTo: {
                    include: {
                        author: true,
                    },
                },
            },
        })
    }

    // Handle DELETE request
    if (method === 'DELETE') {
        return await prisma.message.delete({
            where: {
                id: messageId,
            },
        })
    }

    throw createError({
        statusCode: 405,
        message: 'Method not allowed',
    })
})
