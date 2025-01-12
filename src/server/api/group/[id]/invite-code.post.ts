import { PrismaClient } from '@prisma/client'
import { serverSupabaseUser } from '#supabase/server'
import { generateInviteCode } from '~/utils/group'

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

        const groupId = getRouterParam(event, 'id')
        if (!groupId) {
            throw createError({
                statusCode: 400,
                message: 'Group ID is required',
            })
        }

        // Check if the user is an admin or owner of the group
        const group = await prisma.group.findUnique({
            where: { id: Number.parseInt(groupId) },
            include: {
                members: true,
            },
        })

        if (!group) {
            throw createError({
                statusCode: 404,
                message: 'Group not found',
            })
        }

        const member = group.members.find(m => m.profileId === user.id)
        if (!member || (member.role !== 'ADMIN' && group.ownerId !== user.id)) {
            throw createError({
                statusCode: 403,
                message: 'Only group admins can generate new invite codes',
            })
        }

        // Generate a new unique invite code
        const newInviteCode = await generateInviteCode()

        // Update the group with the new invite code
        const updatedGroup = await prisma.group.update({
            where: { id: Number.parseInt(groupId) },
            data: {
                invitationCode: newInviteCode,
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                },
                owner: true,
            },
        })

        return updatedGroup
    } catch (error) {
        console.error('Error generating new invite code:', error)
        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
        }
        throw createError({
            statusCode: 500,
            message: 'Error generating new invite code',
        })
    }
})
