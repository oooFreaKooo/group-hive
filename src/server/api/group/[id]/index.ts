import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const groupId = getRouterParam(event, 'id')?.split(':')[1]

    const group = await prisma.group.findUnique({
        where: { id: Number.parseInt(groupId!) },
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

    if (group) {
        group.members = group.members.map(member => ({
            ...member,
            createdAt: new Date(member.createdAt),
            updatedAt: new Date(member.updatedAt),
        }))
    }
    return group
})
