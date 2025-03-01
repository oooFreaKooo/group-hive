import type { Task, TaskRow } from '@prisma/client'

export { }

declare global {

    export interface TaskTag {
        tagId: string
        tag: {
            id: string
            title: string
            color: string
        }
    }

    export interface SerializedTask extends Omit<Task, 'dueDate' | 'createdAt' | 'updatedAt'> {
        dueDate: string | null
        createdAt: string
        updatedAt: string
        tags: TaskTag[]
    }

    export interface SerializedTaskRow extends Omit<TaskRow, 'weekStart' | 'weekEnd' | 'createdAt' | 'updatedAt'> {
        weekStart: string
        weekEnd: string
        createdAt: string
        updatedAt: string
        tasks: SerializedTask[]
    }
    interface NavigationItem {
        label: string
        href: string
        icon: string
    }

    interface ProfileItem {
        name: string
        email: string
        href: string
        avatar: string
    }

    interface HeaderItem {
        label: string
        href: string
    }

    type NavItems = NavigationItem[]

    type IconAnimationType = 'pulse' | 'spin' | 'bounce'
    type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
    type Color = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'white' | 'black'
}
