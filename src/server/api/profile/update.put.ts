import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { id, displayName, avatarUrl } = body

        if (!id) {
            throw createError({
                statusCode: 400,
                message: 'User ID is required',
            })
        }

        const profile = await prisma.profile.update({
            where: { id },
            data: {
                displayName,
                avatarUrl,
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
