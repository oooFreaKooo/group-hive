import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { id, displayName, city, postalCode } = body

        const profile = await prisma.profile.create({
            data: {
                id,
                displayName,
                city,
                postalCode,
                role: 'USER',
            },
        })

        return profile
    } catch (error) {
        console.error('Error creating profile:', error)
        throw createError({
            statusCode: 500,
            message: 'Error creating profile',
        })
    }
})
