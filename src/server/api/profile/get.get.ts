import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const { userId } = getQuery(event)

        if (!userId) {
            throw createError({
                statusCode: 400,
                message: 'User ID is required',
            })
        }

        const profile = await prisma.profile.findUnique({
            where: {
                id: userId as string,
            },
            select: {
                displayName: true,
                avatarUrl: true,
                city: true,
                postalCode: true,
                role: true,
            },
        })

        if (!profile) {
            throw createError({
                statusCode: 404,
                message: 'Profile not found',
            })
        }

        return profile
    } catch (error) {
        console.error('Error fetching profile:', error)
        throw createError({
            statusCode: 500,
            message: 'Error fetching profile',
        })
    }
})
