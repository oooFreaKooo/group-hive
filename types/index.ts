import type { Group, GroupUser, Profile, Task, TaskComment, TaskTag, TaskRow } from '@prisma/client'

export { }

declare global {

    interface NavigationItem {
        label: string
        href: string
        active?: boolean
    }

    interface GroupWithMembers extends Group {
        members: (GroupUser & {
            profile: Profile
        })[]
    }

    type NavItems = NavigationItem[]

    interface Column {
        title: string
        tasks: Task[]
    }

    export interface TaskWithRelations extends Task {
        assignedTo: (GroupUser & {
            profile: Profile
        }) | null
        completedBy: (GroupUser & {
            profile: Profile
        }) | null
        tags: (TaskTag & {

            tag: {
                id: number
                title: string
                color: string
            }
        })[]
        comments: (TaskComment & {
            author: GroupUser & {
                profile: Profile
            }
        })[]
        dueDate: Date | null
        taskRowId: number | null
    }

    interface TaskColumn {
        title: string
        tasks: TaskWithRelations[]
    }

    interface TaskRowWithRelations extends TaskRow {
        tasks: TaskWithRelations[]
    }

    interface GroupWithMembers extends Group {
        members: (GroupUser & {
            profile: Profile
        })[]
    }

    type IconAnimationType = 'pulse' | 'spin' | 'bounce'
    type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
    type Color = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'white' | 'black'
}
