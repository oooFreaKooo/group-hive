<template>
    <div
        v-if="error"
        class="alert alert-danger mb-3 rounded-0 border-0"
        role="alert"
        aria-live="polite"
    >
        {{ error }}
        <button
            class="btn btn-link p-0 ms-2"
            aria-label="Dismiss error"
            @click="error = null"
        >
            Dismiss
        </button>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-3">
            <h3 class="mb-0">
                {{ currentMonthYear }}
            </h3>
            <div class="btn-group">
                <button
                    class="btn btn-outline-dark"
                    @click="previousMonth"
                >
                    <i class="bi bi-chevron-left" />
                </button>
                <button
                    class="btn btn-outline-dark"
                    @click="nextMonth"
                >
                    <i class="bi bi-chevron-right" />
                </button>
            </div>
            <button
                class="btn btn-outline-dark"
                @click="goToToday"
            >
                Today
            </button>
            <div
                v-if="isLoading"
                class="ms-2 sync-indicator"
                role="status"
                aria-label="Syncing changes"
            >
                <div class="spinner-border spinner-border-sm text-primary opacity-50" />
                <span class="visually-hidden">Syncing changes...</span>
            </div>
        </div>
        <div class="btn-group">
            <button
                class="btn btn-light"
                :class="{ active: viewMode === 'month' }"
                @click="viewMode = 'month'"
            >
                Month
            </button>
            <button
                class="btn btn-light"
                :class="{ active: viewMode === 'week' }"
                @click="viewMode = 'week'"
            >
                Week
            </button>
        </div>
    </div>

    <div class="calendar-grid">
        <!-- Week day headers -->
        <div
            v-for="day in weekDays"
            :key="day"
            class="calendar-header text-center p-2 fw-semibold text-muted"
        >
            {{ day }}
        </div>

        <!-- Calendar days -->
        <template v-if="viewMode === 'month'">
            <div
                v-for="(week, weekIndex) in weeks"
                :key="weekIndex"
                class="calendar-week"
            >
                <div
                    v-for="(day, dayIndex) in week"
                    :key="dayIndex"
                    class="calendar-day p-2"
                    :class="[
                        getDayStyle(day.date),
                        {
                            'bg-light': isToday(day.date),
                            'text-muted': !isCurrentMonth(day.date),
                            'is-dragging': isDragging,
                        },
                    ]"
                >
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="day-number">{{ day.date.getDate() }}</span>
                    </div>
                    <draggable
                        class="task-list rounded-3"
                        :list="day.tasks"
                        group="tasks"
                        :animation="200"
                        ghost-class="ghost"
                        :data-date="day.date.toISOString()"
                        :aria-label="`Tasks for ${day.date.toLocaleDateString()}`"
                        role="list"
                        @change="(e) => handleTaskMove(e, day.date)"
                        @start="(e) => handleDragStart(e, day.date)"
                        @end="handleDragEnd"
                        @enter="() => handleDragEnter(day.date)"
                    >
                        <TransitionGroup
                            name="task"
                            type="transition"
                        >
                            <TaskCard
                                v-for="task in day.tasks"
                                :key="task.id"
                                :task="{
                                    ...task,
                                    createdAt: new Date(task.createdAt),
                                    updatedAt: new Date(task.updatedAt),
                                    dueDate: task.dueDate ? new Date(task.dueDate) : null,
                                }"
                            />
                        </TransitionGroup>
                    </draggable>
                </div>
            </div>
        </template>

        <template v-else>
            <div
                v-for="(day, index) in currentWeek"
                :key="index"
                class="calendar-day week-view p-3"
                :class="[
                    getDayStyle(day.date),
                    {
                        'bg-light': isToday(day.date),
                        'has-tasks': day.tasks.length > 0,
                        'is-dragging': isDragging,
                    },
                ]"
            >
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="day-number">
                        {{ day.date.getDate() }}
                    </div>
                </div>
                <draggable
                    class="task-list-week rounded-3"
                    :list="day.tasks"
                    group="tasks"
                    :animation="200"
                    ghost-class="ghost"
                    :data-date="day.date.toISOString()"
                    :aria-label="`Tasks for ${day.date.toLocaleDateString()}`"
                    role="list"
                    @change="(e) => handleTaskMove(e, day.date)"
                    @start="(e) => handleDragStart(e, day.date)"
                    @end="handleDragEnd"
                    @enter="() => handleDragEnter(day.date)"
                >
                    <TransitionGroup
                        name="task"
                        type="transition"
                    >
                        <TaskCard
                            v-for="task in day.tasks"
                            :key="task.id"
                            :task="{
                                ...task,
                                createdAt: new Date(task.createdAt),
                                updatedAt: new Date(task.updatedAt),
                                dueDate: task.dueDate ? new Date(task.dueDate) : null,
                            }"
                        />
                    </TransitionGroup>
                </draggable>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { VueDraggableNext as draggable } from 'vue-draggable-next'

interface DayData {
    date: Date
    tasks: SerializedTask[]
}

const props = defineProps<{
    tasks: SerializedTask[]
}>()

const emit = defineEmits<{
    (e: 'task-moved', payload: {
        task: SerializedTask
        date: Date
        onComplete?: () => void
    }): void
}>()

// State
const isDragging = ref(false)
const error = ref<string | null>(null)
const isLoading = ref(false)
const dragSourceDay = ref<Date | null>(null)
const dragTargetDay = ref<Date | null>(null)

// Cleanup on unmount
onBeforeUnmount(() => {
    isDragging.value = false
    error.value = null
    isLoading.value = false
    dragSourceDay.value = null
    dragTargetDay.value = null
})

const weekDays = [
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
]
const viewMode = ref<'month' | 'week'>('month')
const currentDate = ref(new Date())

// Get tasks for a specific date
const getTasksForDate = (date: Date) => {
    if (!props.tasks?.length) {
        return []
    }

    const tasksForDate = props.tasks.filter((task) => {
        if (!task.dueDate) { return false }
        const taskDate = new Date(task.dueDate)
        return taskDate.toDateString() === date.toDateString()
    })
    return tasksForDate
}

// Computed
const getDayStyle = (date: Date) => ({
    'is-source': dragSourceDay.value?.toDateString() === date.toDateString(),
    'is-loading': isLoading.value,
})

// Generate calendar data
const weeks = computed(() => {
    const firstDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
    const lastDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0)

    const weeks: DayData[][] = []
    let currentWeek: DayData[] = []

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    let firstDayOfWeek = firstDay.getDay()
    // Convert Sunday from 0 to 7 to maintain Monday as start of week
    if (firstDayOfWeek === 0) { firstDayOfWeek = 7 }
    // Adjust to make Monday = 1
    firstDayOfWeek--

    // Fill in days from previous month
    if (firstDayOfWeek > 0) {
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const date = new Date(firstDay)
            date.setDate(date.getDate() - (i + 1))
            currentWeek.push({
                date,
                tasks: getTasksForDate(date),
            })
        }
    }

    // Fill in days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day)
        currentWeek.push({
            date,
            tasks: getTasksForDate(date),
        })

        // Start new week when we reach Sunday or last day
        if (currentWeek.length === 7 || day === lastDay.getDate()) {
            if (currentWeek.length < 7) {
                // Fill in days from next month
                const nextMonthDay = 1
                while (currentWeek.length < 7) {
                    const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, nextMonthDay)
                    currentWeek.push({
                        date,
                        tasks: getTasksForDate(date),
                    })
                }
            }
            weeks.push([...currentWeek])
            currentWeek = []
        }
    }

    return weeks
})

// Current week view
const currentWeek = computed(() => {
    const startOfWeek = new Date(currentDate.value)
    // Get Monday of current week
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)

    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek)
        date.setDate(startOfWeek.getDate() + i)
        return {
            date,
            tasks: getTasksForDate(date),
        }
    })
})

// Navigation methods
const previousMonth = () => {
    currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1,
        currentDate.value.getDate(),
    )
}

const nextMonth = () => {
    currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        currentDate.value.getDate(),
    )
}

const goToToday = () => {
    currentDate.value = new Date()
}

// Utility methods
const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
}

const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.value.getMonth()
}

const currentMonthYear = computed(() => {
    return currentDate.value.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
    })
})

// Drag and drop handlers
const handleDragStart = (e: any, date: Date) => {
    isDragging.value = true
    dragSourceDay.value = date
}

const handleDragEnd = () => {
    isDragging.value = false
    dragSourceDay.value = null
    dragTargetDay.value = null
}

const handleDragEnter = (date: Date) => {
    dragTargetDay.value = date
}

const handleTaskMove = async (event: any, targetDate: Date) => {
    const { added } = event
    if (!added) { return }

    try {
        error.value = null
        isLoading.value = true

        await new Promise<void>((resolve) => {
            emit('task-moved', {
                task: added.element,
                date: targetDate,
                onComplete: resolve,
            })
        })
    } catch (e) {
        error.value = 'Failed to move task. Please try again.'
        console.error('TaskCalendar - Failed to handle drag:', e)
    } finally {
        // Add a small delay before removing loading state to ensure smooth transition
        setTimeout(() => {
            isLoading.value = false
        }, 500)
    }
}
</script>

<style scoped lang="scss">
.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background-color: var(--bs-gray-200);
    border: 1px solid var(--bs-gray-200);
    border-radius: 0.5rem;
    overflow: hidden;
}

.calendar-header {
    background-color: white;
    font-size: 0.875rem;
    padding: 0.75rem;
    text-align: center;
    font-weight: 600;
    color: var(--bs-gray-700);
    border-bottom: 1px solid var(--bs-gray-200);
}

.calendar-week {
    display: contents;
}

.calendar-day {
    background-color: white;
    min-height: 120px;
    transition: background-color 0.2s ease;
    position: relative;
    display: flex;
    flex-direction: column;

    &.week-view {
        min-height: 200px;
    }

    &.text-muted {
        background-color: var(--bs-light);
        .day-number {
            color: var(--bs-gray-500);
        }
    }

    &.is-source {
        background-color: var(--bs-success-subtle);
    }

    &.is-loading {
        position: relative;
        &::after {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(2px);
            border-radius: 0.5rem;
            z-index: 1;
        }
    }

    .day-number {
        transition: color 0.2s ease;
    }

    &.bg-light {
        background-color: var(--bs-primary-subtle) !important;
        .day-number {
            color: var(--bs-primary);
        }
    }

}

.task-list,
.task-list-week {
    min-height: 10px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    overflow-y: hidden;
    max-height: calc(100% - 2rem);
    position: relative;
    z-index: 1;
}

.ghost {
    opacity: 0.5;
    padding: 0.5rem;
    border: 1px dashed var(--bs-secondary);
    transition: all 0.2s ease;
}

.sync-indicator {
    display: flex;
    align-items: center;
    animation: fadeIn 0.2s ease;
    z-index: 2;

    .spinner-border {
        width: 1rem;
        height: 1rem;
        border-width: 0.15em;
    }
}

.day-name {
    font-size: 0.75rem;
    color: var(--bs-gray-600);
    text-transform: uppercase;
}

.badge {
    font-weight: normal;
    font-size: 0.75rem;
}

.btn.active {
    background-color: var(--bs-primary);
    color: white;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .calendar-day,
    .task-item,
    .day-number,
    .ghost,
    .sync-indicator {
        transition: none;
        animation: none;
        transform: none;
        backdrop-filter: none;
    }
}

.task-enter-active,
.task-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

.task-enter-from,
.task-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.flip-list-move {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
