<template>
    <AppSection :padding="4">
        <div class="leaderboard-container d-flex flex-column rounded-5 shadow-lg border mt-4">
            <div class="p-3 bg-dark rounded-top-5">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 me-3">
                            <i class="bi bi-trophy me-2" />
                            Leaderboard
                        </span>
                        <h1 class="h5 text-light mb-0 fw-semibold">
                            Group Rankings
                        </h1>
                    </div>
                    <div class="d-flex gap-2 align-items-center">
                        <div class="dropdown">
                            <button
                                class="btn btn-sm btn-outline-light rounded-pill px-3 dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                            >
                                {{ selectedPeriod }}
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li
                                    v-for="period in periods"
                                    :key="period.value"
                                >
                                    <button
                                        class="dropdown-item d-flex align-items-center"
                                        :class="{ active: selectedPeriod === period.label }"
                                        @click="selectedPeriod = period.label"
                                    >
                                        <i
                                            :class="period.icon"
                                            class="me-2"
                                        />
                                        {{ period.label }}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="leaderboard-content bg-white p-4 rounded-bottom-5">
                <!-- Top 3 Winners Podium -->
                <div class="winners-podium d-flex justify-content-center align-items-end mb-5 pb-4">
                    <!-- Second Place -->
                    <div
                        v-if="sortedMembers[1]"
                        class="position-wrapper second-place mx-3 text-center"
                    >
                        <div class="position-avatar">
                            <NuxtImg
                                class="rounded-circle border-3 border-secondary shadow-lg"
                                width="80"
                                height="80"
                                :src="sortedMembers[1].profile.avatarUrl || '/images/default-avatar.png'"
                                :alt="sortedMembers[1].profile.displayName || 'Anonymous'"
                            />
                            <div class="position-badge bg-secondary">
                                <i class="bi bi-2-circle-fill" />
                            </div>
                        </div>
                        <div class="podium bg-secondary">
                            <div class="points-badge bg-white text-secondary shadow-sm">
                                {{ sortedMembers[1].points }} pts
                            </div>
                        </div>
                        <div class="mt-2 text-secondary fw-semibold">
                            {{ sortedMembers[1].profile.displayName }}
                        </div>
                    </div>

                    <!-- First Place -->
                    <div
                        v-if="sortedMembers[0]"
                        class="position-wrapper first-place mx-3 text-center"
                    >
                        <div class="position-crown">
                            <i class="bi bi-crown-fill text-warning" />
                        </div>
                        <div class="position-avatar">
                            <NuxtImg
                                class="rounded-circle border-3 border-warning shadow-lg"
                                width="100"
                                height="100"
                                :src="sortedMembers[0].profile.avatarUrl || '/images/default-avatar.png'"
                                :alt="sortedMembers[0].profile.displayName || 'Anonymous'"
                            />
                            <div class="position-badge bg-warning">
                                <i class="bi bi-1-circle-fill" />
                            </div>
                        </div>
                        <div class="podium bg-warning">
                            <div class="points-badge bg-white text-warning shadow-sm">
                                {{ sortedMembers[0].points }} pts
                            </div>
                        </div>
                        <div class="mt-2 text-warning fw-semibold">
                            {{ sortedMembers[0].profile.displayName }}
                        </div>
                    </div>

                    <!-- Third Place -->
                    <div
                        v-if="sortedMembers[2]"
                        class="position-wrapper third-place mx-3 text-center"
                    >
                        <div class="position-avatar">
                            <NuxtImg
                                class="rounded-circle border-3 border-warning-subtle shadow-lg"
                                width="60"
                                height="60"
                                :src="sortedMembers[2].profile.avatarUrl || '/images/default-avatar.png'"
                                :alt="sortedMembers[2].profile.displayName || 'Anonymous'"
                            />
                            <div class="position-badge bg-warning-subtle">
                                <i class="bi bi-3-circle-fill" />
                            </div>
                        </div>
                        <div class="podium bg-warning-subtle">
                            <div class="points-badge bg-white text-warning-emphasis shadow-sm">
                                {{ sortedMembers[2].points }} pts
                            </div>
                        </div>
                        <div class="mt-2 text-warning-emphasis fw-semibold">
                            {{ sortedMembers[2].profile.displayName }}
                        </div>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="row g-4 mb-4">
                    <div class="col-md-3">
                        <div class="stat-card bg-primary-subtle rounded-4 p-3">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <div class="text-primary-emphasis small">
                                        Total Tasks
                                    </div>
                                    <div class="h4 mb-0">
                                        {{ totalTasks }}
                                    </div>
                                </div>
                                <div class="stat-icon bg-primary text-white rounded-circle">
                                    <i class="bi bi-list-task" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card bg-success-subtle rounded-4 p-3">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <div class="text-success-emphasis small">
                                        Completed
                                    </div>
                                    <div class="h4 mb-0">
                                        {{ completedTasks }}
                                    </div>
                                </div>
                                <div class="stat-icon bg-success text-white rounded-circle">
                                    <i class="bi bi-check2-circle" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card bg-info-subtle rounded-4 p-3">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <div class="text-info-emphasis small">
                                        Active Members
                                    </div>
                                    <div class="h4 mb-0">
                                        {{ activeMembers }}
                                    </div>
                                </div>
                                <div class="stat-icon bg-info text-white rounded-circle">
                                    <i class="bi bi-people" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card bg-warning-subtle rounded-4 p-3">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <div class="text-warning-emphasis small">
                                        Total Points
                                    </div>
                                    <div class="h4 mb-0">
                                        {{ totalPoints }}
                                    </div>
                                </div>
                                <div class="stat-icon bg-warning text-white rounded-circle">
                                    <i class="bi bi-star" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Rankings Table -->
                <div class="rankings-table bg-light rounded-4 p-3">
                    <div
                        v-if="membersStatus === 'pending'"
                        class="d-flex justify-content-center py-5"
                    >
                        <div
                            class="spinner-border text-primary"
                            role="status"
                        >
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <TransitionGroup
                        v-else
                        name="list"
                        tag="div"
                        class="d-flex flex-column gap-2"
                    >
                        <div
                            v-for="(member, index) in sortedMembers.slice(3)"
                            :key="member.profile.id"
                            class="ranking-item bg-white rounded-3 p-3 d-flex align-items-center gap-3"
                        >
                            <div class="position-number fw-bold text-muted">
                                #{{ index + 4 }}
                            </div>
                            <NuxtImg
                                class="rounded-circle border-2"
                                :class="getMemberBorderClass(member)"
                                width="40"
                                height="40"
                                :src="member.profile.avatarUrl || '/images/default-avatar.png'"
                                :alt="member.profile.displayName || 'Anonymous'"
                            />
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <div class="fw-semibold">
                                            {{ member.profile.displayName }}
                                        </div>
                                        <div class="d-flex align-items-center gap-3 small text-muted">
                                            <span>
                                                <i class="bi bi-check2-circle me-1" />
                                                {{ member.completedTasks }} tasks
                                            </span>
                                            <span>
                                                <i class="bi bi-star-fill me-1 text-warning" />
                                                {{ member.points }} points
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        class="trend-indicator"
                                        :class="getTrendClass(member.trend)"
                                    >
                                        <i
                                            :class="getTrendIcon(member.trend)"
                                            class="me-1"
                                        />
                                        {{ Math.abs(member.trend) }}%
                                    </div>
                                </div>
                                <div
                                    class="progress mt-2"
                                    style="height: 6px"
                                >
                                    <div
                                        class="progress-bar bg-success"
                                        role="progressbar"
                                        :style="{ width: getProgressWidth(member) }"
                                    />
                                </div>
                            </div>
                        </div>
                    </TransitionGroup>
                </div>
            </div>
        </div>
    </AppSection>
</template>

<script setup lang="ts">
import type { Profile } from '@prisma/client'

interface MemberWithStats {
    id: number
    profile: Profile
    groupId: number
    createdAt: Date
    updatedAt: Date
    profileId: string
    role: 'ADMIN' | 'MEMBER'
    points: number
    trend: number
    completedTasks: number
    tasksInProgress: number
}

definePageMeta({
    layout: 'group',
})

const route = useRoute()

// Fetch members with their stats
const { data: membersData, status: membersStatus } = await useFetch<MemberWithStats[]>(`/api/group/${route.params.id}/members`, {
    key: `${route.fullPath}-members`,
    default: () => [],
})

const periods = [
    { label: 'This Week', value: 'week', icon: 'bi bi-calendar-week' },
    { label: 'This Month', value: 'month', icon: 'bi bi-calendar-month' },
    { label: 'All Time', value: 'all', icon: 'bi bi-infinity' },
]
const selectedPeriod = ref('This Week')

// Fetch tasks statistics
const { data: tasksStats } = await useFetch<{
    total: number
    completed: number
}>(`/api/group/${route.params.id}/tasks/stats`, {
    key: `${route.fullPath}-tasks-stats`,
    query: {
        period: selectedPeriod.value.toLowerCase(),
    },
    default: () => ({
        total: 0,
        completed: 0,
    }),
})

// Reactive references
const totalTasks = computed(() => tasksStats.value?.total ?? 0)
const completedTasks = computed(() => tasksStats.value?.completed ?? 0)
const activeMembers = computed(() => membersData.value?.length ?? 0)

// Enhanced member data with additional stats
const memberStats = computed(() => {
    if (!membersData.value) { return [] }

    return membersData.value.map(member => ({
        ...member,
        points: member.points || 0,
        trend: member.trend || 0,
        completedTasks: member.completedTasks || 0,
        tasksInProgress: member.tasksInProgress || 0,
    }))
})

const sortedMembers = computed(() => {
    return [...memberStats.value].sort((a, b) => b.points - a.points)
})

const totalPoints = computed(() => sortedMembers.value.reduce((sum, member) => sum + member.points, 0))

// Watch period changes to refetch data
watch(selectedPeriod, async (newPeriod) => {
    await useFetch<{
        total: number
        completed: number
    }>(`/api/group/${route.params.id}/tasks/stats`, {
        key: `${route.fullPath}-tasks-stats`,
        query: {
            period: newPeriod.toLowerCase(),
        },
    })
})

// Utility functions
const getMemberBorderClass = (member: MemberWithStats) => {
    if (member.role === 'ADMIN') { return 'border-primary' }
    return member.points > 500 ? 'border-warning' : 'border-dark'
}

const getTrendClass = (trend: number) => {
    if (trend > 0) { return 'text-success' }
    if (trend < 0) { return 'text-danger' }
    return 'text-muted'
}

const getTrendIcon = (trend: number) => {
    if (trend > 0) { return 'bi bi-graph-up-arrow' }
    if (trend < 0) { return 'bi bi-graph-down-arrow' }
    return 'bi bi-dash'
}

const getProgressWidth = (member: MemberWithStats) => {
    const maxPoints = Math.max(...memberStats.value.map(m => m.points))
    return `${(member.points / maxPoints) * 100}%`
}
</script>

<style scoped lang="scss">
.leaderboard-container {
    min-height: 75vh;
    overflow: hidden;
    position: relative;
    border-color: var(--bs-gray-200) !important;
}

.leaderboard-content {
    flex-grow: 1;
    overflow-y: auto;
    background: linear-gradient(to bottom, var(--bs-white), var(--bs-gray-100));
}

.winners-podium {
    position: relative;
    min-height: 260px;

    .position-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .position-crown {
        position: absolute;
        top: -30px;
        font-size: 2rem;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        animation: float 3s ease-in-out infinite;
    }

    .position-avatar {
        position: relative;
        margin-bottom: 1rem;
        z-index: 1;
    }

    .position-badge {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem;
        color: white;
        border: 2px solid white;
    }

    .podium {
        width: 100px;
        height: 80px;
        position: relative;
        border-radius: 8px 8px 0 0;

        .points-badge {
            position: absolute;
            top: 8px;
            left: 50%;
            transform: translateX(-50%);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.875rem;
            font-weight: 600;
        }
    }

    .first-place {
        z-index: 3;
        .podium {
            height: 120px;
        }
    }

    .second-place {
        z-index: 2;
        .podium {
            height: 90px;
        }
    }

    .third-place {
        z-index: 1;
        .podium {
            height: 60px;
        }
    }
}

.stat-card {
    .stat-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
    }
}

.ranking-item {
    transition: all 0.2s ease;
    border: 1px solid var(--bs-gray-200);

    &:hover {
        transform: translateX(4px);
        border-color: var(--bs-primary);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
}

.trend-indicator {
    font-size: 0.875rem;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 12px;

    &.text-success {
        background-color: var(--bs-success-subtle);
    }

    &.text-danger {
        background-color: var(--bs-danger-subtle);
    }

    &.text-muted {
        background-color: var(--bs-gray-200);
    }
}

.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.list-leave-active {
    position: absolute;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .position-crown {
        animation: none;
    }
}
</style>
