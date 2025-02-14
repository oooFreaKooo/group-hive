import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const groupId = event.context.params?.id
    const method = event.method
    const user = await serverSupabaseUser(event)

    if (!groupId) {
        throw createError({
            statusCode: 400,
            message: 'Group ID is required',
        })
    }

    // Handle GET request - fetch messages
    if (method === 'GET') {
        return await prisma.message.findMany({
            where: {
                groupId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        avatarUrl: true,
                        bgUrl: true,
                        role: true,
                        city: true,
                        postalCode: true,
                        createdAt: true,
                        updatedAt: true,
                        groupIds: true,
                    },
                },
                replyTo: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                avatarUrl: true,
                                bgUrl: true,
                                role: true,
                                city: true,
                                postalCode: true,
                                createdAt: true,
                                updatedAt: true,
                                groupIds: true,
                            },
                        },
                    },
                },
            },
            take: 50, // Limit to last 50 messages for performance
        })
    }

    // Handle POST request - create message
    if (method === 'POST') {
        if (!user?.id) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized',
            })
        }

        const body = await readBody(event)

        if (!body.content?.trim()) {
            throw createError({
                statusCode: 400,
                message: 'Message content is required',
            })
        }

        return await prisma.message.create({
            data: {
                content: body.content,
                groupId,
                authorId: user.id,
                replyToId: body.replyToId,
                mentionIds: body.mentionIds || [],
            },
            include: {
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        avatarUrl: true,
                        bgUrl: true,
                        role: true,
                        city: true,
                        postalCode: true,
                        createdAt: true,
                        updatedAt: true,
                        groupIds: true,
                    },
                },
                replyTo: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                avatarUrl: true,
                                bgUrl: true,
                                role: true,
                                city: true,
                                postalCode: true,
                                createdAt: true,
                                updatedAt: true,
                                groupIds: true,
                            },
                        },
                    },
                },
            },
        })
    }

    throw createError({
        statusCode: 405,
        message: 'Method not allowed',
    })
})
