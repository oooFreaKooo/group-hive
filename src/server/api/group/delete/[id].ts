import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id

    const group = await prisma.group.delete({
        where: { id },
    })
    return group
})
