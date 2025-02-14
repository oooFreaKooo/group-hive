export { }

declare global {

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
