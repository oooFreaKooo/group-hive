import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { invitationCode, profileId } = body

        // Find the group by invitation code
        const group = await prisma.group.findUnique({
            where: { invitationCode },
            include: { members: true },
        })

        if (!group) {
            throw createError({
                statusCode: 404,
                message: 'Group not found',
            })
        }

        // Check if user is already a member
        const existingMember = group.members.find(member => member.profileId === profileId)
        if (existingMember) {
            throw createError({
                statusCode: 400,
                message: 'You are already a member of this group',
            })
        }

        // Add user to group as a member
        const groupUser = await prisma.groupUser.create({
            data: {
                profileId,
                groupId: group.id,
                role: 'MEMBER',
            },
            include: {
                group: true,
                profile: true,
            },
        })

        return groupUser
    } catch (error: unknown) {
        console.error('Error joining group:', error)
        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
        }
        throw createError({
            statusCode: 500,
            message: 'Error joining group',
        })
    }
})
