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
    const { description, comment, pointValue, groupId, assignedToId, tagIds, dueDate, taskRowId } = body

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
            statusMessage: 'Only admins and group owners can create tasks',
        })
    }

    // Create the task with tags and initial comment
    const task = await prisma.task.create({
        data: {
            description,
            pointValue,
            groupId,
            assignedToId: assignedToId ? Number(assignedToId) : null,
            dueDate: dueDate ? new Date(dueDate) : null,
            taskRowId: taskRowId ? Number(taskRowId) : null,
            tags: {
                create: tagIds.map((tagId: number) => ({
                    tag: {
                        connect: {
                            id: tagId,
                        },
                    },
                })),
            },
            comments: comment
                ? {
                    create: {
                        content: comment,
                        authorId: groupMember.id,
                    },
                }
                : undefined,
        },
        include: {
            assignedTo: {
                include: {
                    profile: true,
                },
            },
            tags: {
                include: {
                    tag: true,
                },
            },
            comments: {
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

    return task
})
