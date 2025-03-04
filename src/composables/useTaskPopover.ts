export const useTaskPopover = () => {
    const isOpen = useState('task-popover-open', () => false)
    const selectedDate = useState<Date | null>('task-popover-date', () => null)

    const open = (date?: Date) => {
        isOpen.value = true
        selectedDate.value = date || null
    }

    const close = () => {
        isOpen.value = false
        selectedDate.value = null
    }

    return {
        isOpen,
        selectedDate,
        open,
        close,
    }
}
