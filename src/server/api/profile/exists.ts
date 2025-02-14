import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const { userId } = query

        const profile = await prisma.profile.findUnique({
            where: { id: userId as string },
        })

        return { exists: !!profile }
    } catch (error) {
        console.error('Error checking profile:', error)
        throw createError({
            statusCode: 500,
            message: 'Error checking profile',
        })
    }
})
