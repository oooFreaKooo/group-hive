import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
    const groups = await prisma.group.findMany()
    return groups
})
