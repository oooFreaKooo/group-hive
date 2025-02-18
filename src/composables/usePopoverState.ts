const activePopover = ref<string | null>(null)

export const usePopoverState = () => {
    const setActivePopover = (id: string | null) => {
        activePopover.value = id
    }

    const handleClickOutside = (_event: MouseEvent) => {
        if (activePopover.value !== null) {
            activePopover.value = null
        }
    }

    const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && activePopover.value !== null) {
            activePopover.value = null
        }
    }

    return {
        activePopover,
        setActivePopover,
        handleClickOutside,
        handleEscKey,
    }
}
