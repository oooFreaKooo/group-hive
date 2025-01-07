export { }

declare global {

    interface NavigationItem {
        label: string
        href: string
        active?: boolean
    }

    type NavItems = NavigationItem[]

    type IconAnimationType = 'pulse' | 'spin' | 'bounce'
    type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
    type Color = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'white' | 'black'
}
