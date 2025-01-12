import type { Group, GroupUser, Profile } from '@prisma/client'

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

    interface Task {
        id: number
        tag: {
            text: string
            type: 'copyright' | 'design' | 'illustration'
        }
        title: string
        dueDate: string
        points: number
        comments: number
        attachments: number
    }

    interface Column {
        title: string
        tasks: Task[]
    }

    type IconAnimationType = 'pulse' | 'spin' | 'bounce'
    type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
    type Color = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'white' | 'black'
}
