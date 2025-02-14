import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id

    const profile = await prisma.profile.findFirst({
        where: { id },
    })
    return profile
})
