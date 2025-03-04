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

    <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="d-flex align-items-center gap-3">
            <h3 class="mb-0 h4">
                {{ currentMonthYear }}
            </h3>
            <div class="btn-group">
                <button
                    class="btn btn-sm btn-outline-dark"
                    :aria-label="viewMode === 'month' ? 'Previous month' : 'Previous week'"
                    @click="viewMode === 'month' ? previousMonth() : previousWeek()"
                >
                    <i class="bi bi-chevron-left" />
                </button>
                <button
                    class="btn btn-sm btn-outline-dark"
                    :aria-label="viewMode === 'month' ? 'Next month' : 'Next week'"
                    @click="viewMode === 'month' ? nextMonth() : nextWeek()"
                >
                    <i class="bi bi-chevron-right" />
                </button>
            </div>
            <button
                class="btn btn-sm btn-outline-dark"
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
                class="btn btn-sm "
                :class="{ active: viewMode === 'month' }"
                @click="viewMode = 'month'"
            >
                Month
            </button>
            <button
                class="btn btn-sm"
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

                    <!-- Add Task Button -->
                    <button
                        v-if="day.tasks.length === 0"
                        type="button"
                        class="add-task-button"
                        :title="`Add task for ${day.date.toLocaleDateString()}`"
                        @click="openCreateTask(day.date)"
                    >
                        <i class="bi bi-plus-lg" />
                    </button>

                    <draggable
                        class="task-list"
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
                                :view-mode="viewMode"
                                :task="{
                                    ...task,
                                    createdAt: new Date(task.createdAt),
                                    updatedAt: new Date(task.updatedAt),
                                    dueDate: task.dueDate ? new Date(task.dueDate) : null,
                                }"
                                @deleted="handleTaskDeleted"
                                @edited="handleTaskEdited"
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
                class="calendar-day week-view p-2"
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

                <!-- Add Task Button -->
                <button
                    v-if="day.tasks.length === 0"
                    type="button"
                    class="add-task-button"
                    :title="`Add task for ${day.date.toLocaleDateString()}`"
                    @click="openCreateTask(day.date)"
                >
                    <i class="bi bi-plus-lg" />
                </button>

                <draggable
                    class="task-list-week"
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
                            @deleted="handleTaskDeleted"
                        />
                    </TransitionGroup>
                </draggable>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { useTaskPopover } from '@/composables/useTaskPopover'

interface DayData {
    date: Date
    tasks: SerializedTask[]
}

const props = defineProps<{
    tasks: SerializedTask[]
    groupId: string
}>()

const emit = defineEmits<{
    (e: 'task-moved', payload: {
        task: SerializedTask
        date: Date
        onComplete?: () => void
    }): void
    (e: 'task-deleted', taskId: string): void
    (e: 'task-edited'): void
}>()

const taskPopover = useTaskPopover()

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

const previousWeek = () => {
    currentDate.value = new Date(
        currentDate.value.getTime() - 7 * 24 * 60 * 60 * 1000,
    )
}

const nextWeek = () => {
    currentDate.value = new Date(
        currentDate.value.getTime() + 7 * 24 * 60 * 60 * 1000,
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
    if (viewMode.value === 'month') {
        return currentDate.value.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
        })
    }

    // For week view, show the date range
    const weekStart = new Date(currentWeek.value[0].date)
    const weekEnd = new Date(currentWeek.value[6].date)

    // If week spans across months
    if (weekStart.getMonth() !== weekEnd.getMonth()) {
        return `${weekStart.toLocaleString('default', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }

    // If week is within the same month
    return `${weekStart.toLocaleString('default', { month: 'long', year: 'numeric' })} · ${weekStart.getDate()}-${weekEnd.getDate()}`
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

const handleTaskDeleted = (taskId: string) => {
    emit('task-deleted', taskId)
}

const handleTaskEdited = () => {
    emit('task-edited')
}

// Update openCreateTask method
const openCreateTask = (date: Date) => {
    taskPopover.open(date)
}
</script>

<style scoped lang="scss">
.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    background-color: var(--bs-gray-200);
    border: 2px solid var(--bs-gray-300);
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.calendar-header {
    background-color: white;
    font-size: 0.875rem;
    padding: 0.75rem;
    text-align: center;
    font-weight: 700;
    color: var(--bs-primary);
    border-bottom: 2px solid var(--bs-gray-200);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.calendar-week {
    display: contents;
}

.calendar-day {
    background-color: white;
    min-height: 100px;
    transition: all 0.2s ease;
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 0.5rem;
    margin: 1px;
    transition: all 0.2s cubic-bezier(0.68, 0.55, 0.265, 0.6);

    &.week-view {
        min-height: 200px;
    }

    &.text-muted {
        background-color: var(--bs-gray-100);
        .day-number {
            color: var(--bs-gray-500);
        }
        .add-task-button {
            background-color: var(--bs-gray-200);
            color: var(--bs-gray-600);
        }
    }

    &.is-source {
        background-color: var(--bs-success-subtle);
        transform: scale(0.98);
    }

    &:hover:not(.is-source) {

        .add-task-button {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            background-color: var(--bs-primary-subtle);
            color: var(--bs-primary);
        }
    }

    .day-number {
        transition: all 0.2s ease;
        font-weight: 600;
        font-size: 1.1rem;
        color: var(--bs-gray-700);
    }

    &.bg-light {
        background-color: var(--bs-secondary-subtle) !important;
        .day-number {
            color: var(--bs-primary);
            transform: scale(1.1);
            transform-origin: left;
        }
    }

    .task-list,
    .task-list-week {
        position: relative;
        flex: 1;
        min-height: 10px;
        z-index: 1;
        overflow: hidden;
    }

    .add-task-button {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        opacity: 0;
        transition: all 0.2s cubic-bezier(0.68, 0.55, 0.265, 0.6);
        background-color: var(--bs-gray-100);
        color: var(--bs-gray-400);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 2px dashed var(--bs-gray-300);
        z-index: 2;

        &:hover {
            background-color: var(--bs-primary);
            color: white;
            border-style: dashed;
            border-color: var(--bs-primary);
            transform: translate(-50%, -50%) scale(1.1);
        }

        &:active {
            transform: translate(-50%, -50%) scale(0.95);
        }

        i {
            font-size: 1.25rem;
            line-height: 0;
            margin-top: 1px;
        }
    }
}

.task-list,
.task-list-week {
    min-height: 10px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow-y: hidden;
    position: relative;
    z-index: 1;
}

.ghost {
    opacity: 0.5;
    filter: grayscale(0.85);
    transform: scale(0.95) rotate(1deg);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: wobble 0.5s ease infinite alternate;
}

.sync-indicator {
    display: flex;
    align-items: center;
    animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    z-index: 2;

    .spinner-border {
        width: 1.2rem;
        height: 1.2rem;
        border-width: 0.2em;
        animation: spin 1s linear infinite;
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

.btn-group {
    .btn {
        position: relative;
        overflow: hidden;
        transition: all 0.2s ease;

        &.active {
            background-color: var(--bs-primary);
            color: white;
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.2);
        }
    }
}

@keyframes wobble {
    from {
        transform: scale(0.95) rotate(-1deg);
    }
    to {
        transform: scale(0.95) rotate(1deg);
    }
}

@keyframes bounceIn {
    0% {
        opacity: 0;
        transform: scale(0.3) translateY(-10px);
    }
    50% {
        transform: scale(1.1) translateY(5px);
    }
    100% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.task-enter-active,
.task-leave-active {
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 0.6);
}

.task-enter-from,
.task-leave-to {
    opacity: 0;
    transform: scale(0.6);
    min-height: 100px;
}

@media (prefers-reduced-motion: reduce) {
    .calendar-day,
    .task-item,
    .day-number,
    .ghost,
    .sync-indicator,
    .btn {
        transition: none;
        animation: none;
        transform: none;
        backdrop-filter: none;
    }
}
</style>
