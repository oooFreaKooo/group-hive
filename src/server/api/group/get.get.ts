import { PrismaClient } from '@prisma/client'
import { serverSupabaseUser } from '#supabase/server'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        })
    }

    const groupData = await prisma.group.findMany({
        where: {
            members: {
                some: {
                    profileId: user.id,
                },
            },
        },
        select: {
            id: true,
            name: true,
            description: true,
            invitationCode: true,
            city: true,
            postalCode: true,
            createdAt: true,
            updatedAt: true,
        },
    })

    const members = await prisma.group.findMany({
        where: {
            members: {
                some: {
                    profileId: user.id,
                },
            },
        },
        select: {
            owner: true,
            members: true,
        },
    })

    const tasks = await prisma.group.findMany({
        where: {
            members: {
                some: {
                    profileId: user.id,
                },
            },
        },
        select: {
            tasks: true,
        },
    })

    const messages = await prisma.group.findMany({
        where: {
            members: {
                some: {
                    profileId: user.id,
                },
            },
        },
        select: {
            Message: true,
        },
    })

    return { groupData, members, tasks, messages }
})
