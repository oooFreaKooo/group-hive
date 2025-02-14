<template>
    <div class="container py-5">
        <div class="row min-vh-100 align-items-center">
            <div class="col-14 col-lg-8 mx-auto text-center">
                <h1 class="display-4 fw-bold mb-4">
                    Manage your shared living space with ease
                </h1>
                <p class="lead text-muted mb-5">
                    GroupHive helps you and your roommates stay organized with task management, fair distribution of chores, and a fun
                    point system to keep everyone motivated.
                </p>
                <div class="d-flex justify-content-center gap-3">
                    <NuxtLink
                        to="/auth/register"
                        class="btn btn-primary"
                    >
                        Get started
                    </NuxtLink>
                    <NuxtLink
                        to="/"
                        class="btn btn-link text-decoration-none"
                    >
                        Learn more <span aria-hidden="true">→</span>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'guest',
})

useSeoMeta({
    title: 'GroupHive',
})

/*
// Helper functions
function calculateDueDate (weekStart: Date | string, columnIndex: number): Date {
    const startDate = new Date(weekStart)
    const dueDate = new Date(startDate)
    dueDate.setDate(startDate.getDate() + columnIndex)
    dueDate.setHours(23, 59, 59, 999)
    return dueDate
}

// Week columns computation with memoization
const getWeekColumns = computed(() => {
    const days = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    ]

    return (row: TaskRowWithRelations): TaskColumn[] => {
        const weekStart = new Date(row.weekStart)

        return days.map((day, index) => ({
            title: day,
            tasks: row.tasks.filter((task) => {
                if (!task.taskRowId || !task.dueDate) { return false }
                if (task.taskRowId !== row.id) { return false }

                const taskDate = new Date(task.dueDate)
                const columnDate = new Date(weekStart)
                columnDate.setDate(weekStart.getDate() + index)

                return taskDate.toDateString() === columnDate.toDateString()
            }),
        }))
    }
})
 */
</script>
