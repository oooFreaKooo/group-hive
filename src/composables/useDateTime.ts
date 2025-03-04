/**
 * Composable for handling date and time operations consistently across components
 */
export const useDateTime = () => {
    /**
     * Get min and max dates for task date picker (3 months range)
     */
    const getDateLimits = () => {
        const minDate = new Date()
        const maxDate = new Date()
        maxDate.setMonth(maxDate.getMonth() + 3)

        return {
            minDate: minDate.toISOString().split('T')[0],
            maxDate: maxDate.toISOString().split('T')[0],
        }
    }

    /**
     * Format a date object to YYYY-MM-DD format for input[type="date"]
     */
    const formatDateForInput = (date: Date | null | undefined): string => {
        if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
            return ''
        }

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    /**
     * Format a date object to HH:mm format for input[type="time"]
     */
    const formatTimeForInput = (date: Date | null | undefined): string => {
        if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
            return ''
        }

        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${hours}:${minutes}`
    }

    /**
     * Convert form date and time to UTC Date object while preserving local time
     */
    const createUTCDate = (dateStr: string, timeStr: string | null = null): Date | null => {
        if (!dateStr) { return null }

        // Parse the date string
        const [
            year, month, day,
        ] = dateStr.split('-').map(Number)
        const date = new Date(year, month - 1, day)

        // Set time if provided, otherwise default to end of day
        if (timeStr) {
            const [ hours, minutes ] = timeStr.split(':').map(Number)
            date.setHours(hours, minutes, 0, 0)
        } else {
            date.setHours(23, 59, 59, 999)
        }

        return date
    }

    /**
     * Parse a Date object to local date and time strings
     */
    const parseUTCDate = (date: Date | string | null | undefined) => {
        if (!date) {
            return {
                date: '',
                time: '',
            }
        }

        // Convert string date to Date object if needed
        const dateObj = typeof date === 'string' ? new Date(date) : date

        return {
            date: formatDateForInput(dateObj),
            time: formatTimeForInput(dateObj),
        }
    }

    return {
        getDateLimits,
        formatDateForInput,
        formatTimeForInput,
        createUTCDate,
        parseUTCDate,
    }
}
