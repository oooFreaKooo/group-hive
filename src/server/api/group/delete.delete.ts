import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { id, profileId } = body

        // Check if the group exists
        const group = await prisma.group.findUnique({
            where: { id: Number.parseInt(id as string) },
        })

        if (!group) {
            throw createError({
                statusCode: 404,
                message: 'Group not found',
            })
        }

        // Check if the user is the owner of the group
        if (group.ownerId !== profileId) {
            throw createError({
                statusCode: 403,
                message: 'Only the group owner can delete the group',
            })
        }

        // Delete all related records first (due to foreign key constraints)
        await prisma.$transaction([
            // Delete point history records
            prisma.pointHistory.deleteMany({
                where: {
                    groupUser: {
                        groupId: group.id,
                    },
                },
            }),
            // Delete tasks
            prisma.task.deleteMany({
                where: {
                    groupId: group.id,
                },
            }),
            // Delete group members
            prisma.groupUser.deleteMany({
                where: {
                    groupId: group.id,
                },
            }),
            // Finally, delete the group
            prisma.group.delete({
                where: {
                    id: group.id,
                },
            }),
        ])

        return { success: true }
    } catch (error: unknown) {
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
