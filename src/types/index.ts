import type { Prisma } from '@prisma/client'

export type TaskWithRelations = Prisma.TaskGetPayload<{
    include: {
        assignee: {
            include: {
                profile: true
            }
        }
        tags: true
    }
}>

export type GroupWithMembers = Prisma.GroupGetPayload<{
    include: {
        members: {
            include: {
                profile: true
            }
        }
    }
}>
