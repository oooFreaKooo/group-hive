import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const groupId = getRouterParam(event, 'id')
    if (!groupId) {
        throw createError({
            statusCode: 400,
            message: 'Group ID is required',
        })
    }

    const group = await prisma.group.findUnique({
        where: { id: Number.parseInt(groupId) },
        select: {
            id: true,
            name: true,
            members: {
                include: {
                    profile: true,
                },
            },
            Message: {
                include: {
                    author: {
                        include: {
                            profile: true,
                        },
                    },
                    replyTo: {
                        include: {
                            author: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    })

    if (!group) {
        throw createError({
            statusCode: 404,
            message: 'Group not found',
        })
    }

    return {
        ...group,
        members: group.members.map(member => ({
            ...member,
            createdAt: new Date(member.createdAt),
            updatedAt: new Date(member.updatedAt),
        })),
    }
})
