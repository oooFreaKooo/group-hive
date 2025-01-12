import { PrismaClient } from '@prisma/client'
import { serverSupabaseUser } from '#supabase/server'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const user = await serverSupabaseUser(event)
        if (!user) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized',
            })
        }

        const body = await readBody(event)
        const { groupId, ownerId } = body

        if (!groupId || !ownerId) {
            throw createError({
                statusCode: 400,
                message: 'Missing required fields',
            })
        }

        // Verify the current user is the owner
        const group = await prisma.group.findUnique({
            where: { id: groupId },
        })

        if (!group) {
            throw createError({
                statusCode: 404,
                message: 'Group not found',
            })
        }

        if (group.ownerId !== ownerId || ownerId !== user.id) {
            throw createError({
                statusCode: 403,
                message: 'Only the owner can delete the group',
            })
        }

        // Delete all related data in a transaction
        await prisma.$transaction(async (tx) => {
            // Delete message mentions
            await tx.messageMention.deleteMany({
                where: {
                    message: {
                        groupId,
                    },
                },
            })

            // Delete messages
            await tx.message.deleteMany({
                where: { groupId },
            })

            // Delete point history
            await tx.pointHistory.deleteMany({
                where: {
                    groupUser: {
                        groupId,
                    },
                },
            })

            // Delete tasks
            await tx.task.deleteMany({
                where: { groupId },
            })

            // Delete group members
            await tx.groupUser.deleteMany({
                where: { groupId },
            })

            // Finally, delete the group
            await tx.group.delete({
                where: { id: groupId },
            })
        })

        return { success: true }
    } catch (error) {
        console.error('Error deleting group:', error)
        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
        }
        throw createError({
            statusCode: 500,
            message: 'Error deleting group',
        })
    }
})
