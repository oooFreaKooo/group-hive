import { PrismaClient } from '@prisma/client'
import { generateInviteCode } from '~/utils/group'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { name, description, city, postalCode, ownerId } = body

        // Create the group with a unique invitation code
        const group = await prisma.group.create({
            data: {
                name,
                description,
                city,
                postalCode,
                ownerId,
                invitationCode: await generateInviteCode(),
                // Create the owner as a group member with ADMIN role
                members: {
                    create: {
                        profileId: ownerId,
                        role: 'ADMIN',
                    },
                },
            },
            include: {
                members: true,
                owner: true,
            },
        })

        return group
    } catch (error) {
        console.error('Error creating group:', error)
        throw createError({
            statusCode: 500,
            message: 'Error creating group',
        })
    }
})
