import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const { id, profileId } = query

        if (!id) {
            // If no ID is provided, get all groups where the user is a member
            const groups = await prisma.group.findMany({
                where: {
                    members: {
                        some: {
                            profileId: profileId as string,
                        },
                    },
                },
                include: {
                    members: {
                        include: {
                            profile: true,
                        },
                    },
                    tasks: {
                        include: {
                            assignedTo: {
                                include: {
                                    profile: true,
                                },
                            },
                            completedBy: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    },
                    owner: true,
                },
            })
            return groups
        }

        // Get specific group by ID
        const group = await prisma.group.findUnique({
            where: { id: Number.parseInt(id as string) },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                },
                tasks: {
                    include: {
                        assignedTo: {
                            include: {
                                profile: true,
                            },
                        },
                        completedBy: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
                owner: true,
            },
        })

        if (!group) {
            throw createError({
                statusCode: 404,
                message: 'Group not found',
            })
        }

        // Check if the requesting user is a member of the group
        if (profileId && !group.members.some(member => member.profileId === profileId)) {
            throw createError({
                statusCode: 403,
                message: 'You are not a member of this group',
            })
        }

        return group
    } catch (error: unknown) {
        console.error('Error getting group:', error)
        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
        }
        throw createError({
            statusCode: 500,
            message: 'Error getting group',
        })
    }
})
