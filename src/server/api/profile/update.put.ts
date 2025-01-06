import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { id, displayName, avatarUrl, city, postalCode } = body

        const profile = await prisma.profile.update({
            where: { id: id as string },
            data: {
                displayName: displayName as string,
                avatarUrl: avatarUrl as string,
                city: city as string,
                postalCode: postalCode as string,
            },
        })
        return profile
    } catch (error) {
        console.error('Error updating profile:', error)
        throw createError({
            statusCode: 500,
            message: 'Error updating profile',
        })
    }
})
