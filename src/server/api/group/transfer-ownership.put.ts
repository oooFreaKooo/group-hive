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
        const { groupId, currentOwnerId, newOwnerId } = body

        if (!groupId || !currentOwnerId || !newOwnerId) {
            throw createError({
                statusCode: 400,
                message: 'Missing required fields',
            })
        }

        // Verify the current user is the owner
        const group = await prisma.group.findUnique({
            where: { id: groupId },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                },
            },
        })

        if (!group) {
            throw createError({
                statusCode: 404,
                message: 'Group not found',
            })
        }

        if (group.ownerId !== currentOwnerId || currentOwnerId !== user.id) {
            throw createError({
                statusCode: 403,
                message: 'Only the current owner can transfer ownership',
            })
        }

        // Verify the new owner is a member of the group
        const newOwnerMember = group.members.find(m => m.profile.id === newOwnerId)
        if (!newOwnerMember) {
            throw createError({
                statusCode: 400,
                message: 'New owner must be a member of the group',
            })
        }

        // Verify the new owner is an admin
        if (newOwnerMember.role !== 'ADMIN') {
            throw createError({
                statusCode: 400,
                message: 'New owner must be an admin of the group',
            })
        }

        // Start a transaction to update both the group and member roles
        await prisma.$transaction(async (tx) => {
            // Update the group owner
            const group = await tx.group.update({
                where: { id: groupId },
                data: {
                    ownerId: newOwnerId,
                },
            })

            // Update the previous owner's role to ADMIN
            await tx.groupUser.update({
                where: {
                    profileId_groupId: {
                        profileId: currentOwnerId,
                        groupId,
                    },
                },
                data: {
                    role: 'ADMIN',
                },
            })

            return group
        })

        // Fetch the updated group with all necessary relations
        const finalGroup = await prisma.group.findUnique({
            where: { id: groupId },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                },
                owner: true,
            },
        })

        return finalGroup
    } catch (error) {
        console.error('Error transferring group ownership:', error)
        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
        }
        throw createError({
            statusCode: 500,
            message: 'Error transferring group ownership',
        })
    }
})
