import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody, createError } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { tagId } = body

        if (!tagId) {
            throw createError({
                statusCode: 400,
                message: 'Tag ID is required',
            })
        }

        const tag = await prisma.tag.delete({
            where: {
                id: tagId,
            },
        })

        return tag
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to delete tag',
        })
    }
})
