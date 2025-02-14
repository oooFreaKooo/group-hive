import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const groupId = event.context.params?.id
    const taskId = event.context.params?.taskId
    const method = event.method
    const user = await serverSupabaseUser(event)

    if (!groupId || !taskId) {
        throw createError({
            statusCode: 400,
            message: 'Group ID and Task ID are required',
        })
    }

    // Verify task belongs to group
    const task = await prisma.task.findUnique({
        where: {
            id: taskId,
            groupId,
        },
    })

    if (!task) {
        throw createError({
            statusCode: 404,
            message: 'Task not found',
        })
    }

    // Handle GET request - fetch comments
    if (method === 'GET') {
        const comments = await prisma.comment.findMany({
            where: {
                taskId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                task: {
                    select: {
                        groupId: true,
                    },
                },
            },
        })

        // Fetch author profiles for all comments
        const authorIds = [...new Set(comments.map(c => c.authorId))]
        const profiles = await prisma.profile.findMany({
            where: {
                id: {
                    in: authorIds,
                },
            },
            select: {
                id: true,
                displayName: true,
                avatarUrl: true,
            },
        })

        // Map profiles to comments
        return comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            author: profiles.find(p => p.id === comment.authorId) || null,
        }))
    }

    // Handle POST request - create comment
    if (method === 'POST') {
        const body = await readBody(event)

        if (!body.content) {
            throw createError({
                statusCode: 400,
                message: 'Comment content is required',
            })
        }

        // Get user from session
        if (!user?.id) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized',
            })
        }

        const comment = await prisma.comment.create({
            data: {
                content: body.content,
                taskId,
                authorId: user.id,
            },
            include: {
                task: {
                    select: {
                        groupId: true,
                    },
                },
            },
        })

        // Fetch author profile
        const author = await prisma.profile.findUnique({
            where: {
                id: comment.authorId,
            },
            select: {
                id: true,
                displayName: true,
                avatarUrl: true,
            },
        })

        return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            author: author || null,
        }
    }

    throw createError({
        statusCode: 405,
        message: 'Method not allowed',
    })
})
