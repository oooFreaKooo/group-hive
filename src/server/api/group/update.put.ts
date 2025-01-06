import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { id, name, description, city, postalCode, profileId } = body

        // Check if the group exists
        const group = await prisma.group.findUnique({
            where: { id: Number.parseInt(id as string) },
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

        // Check if the user is an admin of the group
        const userMember = group.members.find(member => member.profileId === profileId)
        if (!userMember || userMember.role !== 'ADMIN') {
            throw createError({
                statusCode: 403,
                message: 'Only group admins can update group details',
            })
        }

        // Update the group
        const updatedGroup = await prisma.group.update({
            where: { id: Number.parseInt(id as string) },
            data: {
                name,
                description,
                city,
                postalCode,
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
    } catch (error: unknown) {
        console.error('Error updating group:', error)
        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
        }
        throw createError({
            statusCode: 500,
            message: 'Error updating group',
        })
    }
})
