import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody, createError } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const groupId = event.context.params?.id
    const body = await readBody(event)

    if (!groupId) {
        throw createError({
            statusCode: 400,
            message: 'Group ID is required',
        })
    }

    if (!body.title) {
        throw createError({
            statusCode: 400,
            message: 'Tag title is required',
        })
    }

    if (!body.color) {
        throw createError({
            statusCode: 400,
            message: 'Tag color is required',
        })
    }

    const tag = await prisma.tag.create({
        data: {
            title: body.title,
            color: body.color,
            groupId,
        },
    })

    return tag
})
