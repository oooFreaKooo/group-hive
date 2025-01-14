<template>
    <aside class="task-details">
        <div class="tag-progress">
            <slot name="unassigned" />
            <h2>
                Task Progress
            </h2>
            <TransitionGroup
                v-if="shouldAnimate"
                name="list"
                tag="div"
            >
                <div
                    v-for="progress in taskProgress"
                    :key="progress.type"
                    class="tag-progress"
                >
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="mb-1">
                            {{ progress.label }}
                            <span class="text-muted ms-2">{{ progress.completed }}/{{ progress.total }}</span>
                        </p>
                        <span
                            class="badge"
                            :class="`bg-${progress.type}`"
                        >
                            {{ Math.round((progress.completed / progress.total) * 100) }}%
                        </span>
                    </div>
                    <div class="progress">
                        <div
                            class="progress-bar"
                            :class="`bg-${progress.type}`"
                            role="progressbar"
                            :style="{ width: `${progressByType[progress.type]}%` }"
                            :aria-valuenow="progress.completed"
                            :aria-valuemin="0"
                            :aria-valuemax="progress.total"
                        />
                    </div>
                </div>
            </TransitionGroup>
            <div
                v-else
                class="tag-progress-static"
            >
                <div
                    v-for="progress in taskProgress"
                    :key="progress.type"
                    class="tag-progress"
                >
                    <p>{{ progress.label }} <span>{{ progress.completed }}/{{ progress.total }}</span></p>
                    <progress
                        :class="['progress', `progress--${progress.type}`]"
                        :max="progress.total"
                        :value="progress.completed"
                    >
                        {{ progress.completed }}
                    </progress>
                </div>
            </div>
        </div>

        <div class="task-activity">
            <h2>Recent Activity</h2>
            <TransitionGroup
                v-if="shouldAnimate"
                name="list"
                tag="ul"
                class="activity-list"
            >
                <template
                    v-for="(activities, date) in groupedActivities"
                    :key="date"
                >
                    <li class="activity-date">
                        {{ formatDate(activities[0].date) }}
                    </li>
                    <li
                        v-for="activity in activities"
                        :key="activity.id"
                        class="activity-item"
                    >
                        <span
                            :class="['task-icon', `task-icon--${activity.type}`]"
                            :aria-label="activity.type"
                        >
                            <i :class="activityIcons[activity.type]" />
                        </span>
                        <div class="activity-content">
                            <strong>{{ activity.user }}</strong>
                            {{ activity.action }}
                        </div>
                    </li>
                </template>
            </TransitionGroup>
            <ul
                v-else
                class="activity-list"
            >
                <li
                    v-for="activity in recentActivity"
                    :key="activity.id"
                >
                    <span :class="['task-icon', `task-icon--${activity.type}`]">
                        <i :class="activityIcons[activity.type]" />
                    </span>
                    <b>{{ activity.user }}</b>
                    {{ activity.action }}
                    <time :datetime="activity.date">{{ formatDate(activity.date) }}</time>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script setup lang="ts">
interface Progress {
    label: string
    type: string
    completed: number
    total: number
}

interface Activity {
    id: number
    type: 'attachment' | 'comment' | 'edit'
    user: string
    action: string
    date: string
}

const activityIcons = {
    attachment: 'bi bi-paperclip',
    comment: 'bi bi-chat-dots',
    edit: 'bi bi-pencil-square',
} as const

const taskProgress = ref<Progress[]>([
    { label: 'Copywriting', type: 'copyright', completed: 3, total: 8 },
    { label: 'Illustration', type: 'illustration', completed: 6, total: 10 },
    { label: 'UI Design', type: 'design', completed: 2, total: 7 },
])

const recentActivity = ref<Activity[]>([
    {
        id: 1,
        type: 'attachment',
        user: 'Andrea',
        action: 'uploaded 3 documents',
        date: '2021-08-10T20:00:00',
    },
    {
        id: 2,
        type: 'comment',
        user: 'Karen',
        action: 'left a comment',
        date: '2021-08-10T20:00:00',
    },
    {
        id: 3,
        type: 'edit',
        user: 'Karen',
        action: 'uploaded 3 documents',
        date: '2021-08-11T20:00:00',
    },
    {
        id: 4,
        type: 'attachment',
        user: 'Andrea',
        action: 'uploaded 3 documents',
        date: '2021-08-11T20:00:00',
    },
    {
        id: 5,
        type: 'comment',
        user: 'Karen',
        action: 'left a comment',
        date: '2021-08-12T20:00:00',
    },
])

const formatDate = (date: string) => {
    const dateObj = new Date(date)
    const now = new Date()
    const diff = now.getTime() - dateObj.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
        return 'Today'
    } else if (days === 1) {
        return 'Yesterday'
    } else if (days < 7) {
        return `${days} days ago`
    }

    return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    })
}

// Computed
const progressByType = computed(() =>
    taskProgress.value.reduce((acc, curr) => {
        acc[curr.type] = (curr.completed / curr.total) * 100
        return acc
    }, {} as Record<string, number>),
)

const groupedActivities = computed(() => {
    const groups: Record<string, Activity[]> = {}
    recentActivity.value.forEach((activity) => {
        const date = new Date(activity.date).toDateString()
        if (!groups[date]) {
            groups[date] = []
        }
        groups[date].push(activity)
    })
    return groups
})

// Animation hooks
const prefersReducedMotion = usePreferredReducedMotion()
const shouldAnimate = computed(() => prefersReducedMotion.value !== 'reduce')
</script>

<style scoped lang="scss">
.task-details {
    width: 100%;
    border-left: 1px solid #d9e0e9;
    display: inline-block;
    height: 100%;
    vertical-align: top;
}

.tag-progress {
    margin: 1.5rem 0;

    h2 {
        font-size: 16px;
        margin-bottom: 1rem;
    }

    .progress {
        height: 8px;
        margin-bottom: 1rem;
        background-color: var(--bs-gray-200);
        border-radius: 1rem;
        overflow: hidden;
    }

    .progress-bar {
        transition: width 0.6s ease;
        border-radius: 1rem;
    }
}

.activity-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.activity-date {
    font-size: 0.875rem;
    color: var(--bs-gray-600);
    margin: 1rem 0 0.5rem;
    padding-left: 3rem;
}

.activity-item {
    padding: 0.5rem 1rem 0.5rem 3rem;
    position: relative;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: var(--bs-gray-100);
        border-radius: 0.5rem;
    }
}

.activity-content {
    strong {
        color: var(--bs-primary);
    }
}

.task-icon {
    width: 30px;
    height: 30px;
    border-radius: 100rem;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;

    i {
        font-size: 12px;
        color: var(--bs-white);
    }

    &:hover {
        transform: translateY(-50%) scale(1.1);
    }

    &--attachment {
        background-color: var(--bs-warning);
    }

    &--comment {
        background-color: var(--bs-success);
    }

    &--edit {
        background-color: var(--bs-primary);
    }
}

// Animations
.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.list-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

// Progress colors
.bg-copyright {
    background-color: #d459e8 !important;
}

.bg-illustration {
    background-color: #46bd84 !important;
}

.bg-design {
    background-color: #08a0f7 !important;
}

// Responsive design
@media only screen and (max-width: 1300px) {
    .task-details {
        width: 100%;
        display: flex;
        border-left: none;
        border-top: 1px solid #d9e0e9;
        padding: 2rem 1rem;
    }

    .tag-progress,
    .task-activity {
        flex: 1;
        background: var(--bs-white);
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        margin: 0.5rem;
    }
}

@media only screen and (max-width: 768px) {
    .task-details {
        flex-direction: column;
    }

    .tag-progress,
    .task-activity {
        width: 100%;
        margin: 0.5rem 0;
    }

    .activity-item {
        padding-left: 2.5rem;
    }

    .task-icon {
        width: 24px;
        height: 24px;

        i {
            font-size: 10px;
        }
    }
}

@media (prefers-reduced-motion: reduce) {
    .progress-bar,
    .task-icon,
    .activity-item,
    .list-enter-active,
    .list-leave-active {
        transition: none;
    }
}
</style>
