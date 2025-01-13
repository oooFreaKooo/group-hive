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

    const taskId = Number(event.context.params?.taskId)
    if (!taskId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Task ID is required',
        })
    }

    const body = await readBody(event)
    const { content } = body

    if (!content?.trim()) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Comment content is required',
        })
    }

    // Get the task and verify user is member of the group
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
            group: {
                include: {
                    members: true,
                },
            },
        },
    })

    if (!task) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Task not found',
        })
    }

    const groupMember = task.group.members.find(m => m.profileId === user.id)
    if (!groupMember) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Not a member of this group',
        })
    }

    // Create the comment
    const comment = await prisma.taskComment.create({
        data: {
            content,
            taskId,
            authorId: groupMember.id,
        },
        include: {
            author: {
                include: {
                    profile: true,
                },
            },
        },
    })

    return comment
})
