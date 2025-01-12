<template>
    <div class="card p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="h4 mb-0">
                Group Leaderboard
            </h2>
            <div class="dropdown">
                <button
                    class="btn btn-outline-secondary btn-sm dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                >
                    {{ selectedPeriod }}
                </button>
                <ul class="dropdown-menu">
                    <li>
                        <button
                            v-for="period in periods"
                            :key="period"
                            class="dropdown-item"
                            @click="selectedPeriod = period"
                        >
                            {{ period }}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        <div class="mt-4">
            <TransitionGroup
                name="list"
                tag="ul"
                class="list-unstyled"
            >
                <li
                    v-for="(member, index) in sortedMembers"
                    :key="member.profile.id"
                    class="py-3 border-bottom leaderboard-item"
                >
                    <div class="d-flex align-items-center gap-3">
                        <div
                            class="position-indicator fw-medium"
                            :class="getPositionClass(index)"
                        >
                            #{{ index + 1 }}
                        </div>
                        <div class="avatar-wrapper">
                            <img
                                class="rounded-circle"
                                width="40"
                                height="40"
                                :src="member.profile.avatarUrl ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + member.profile.id"
                                :alt="member.profile.displayName ?? 'Anonymous'"
                            >
                            <div
                                v-if="index < 3"
                                class="position-badge"
                                :class="getPositionClass(index)"
                            >
                                <AppIcon
                                    :name="getPositionIcon(index)"
                                    size="sm"
                                />
                            </div>
                        </div>
                        <div class="flex-grow-1 text-truncate">
                            <p class="mb-0 fw-medium text-truncate">
                                {{ member.profile.displayName }}
                            </p>
                            <p class="mb-0 small text-muted text-truncate">
                                {{ member.points }} points
                            </p>
                        </div>
                        <div class="points-trend">
                            <span
                                class="badge"
                                :class="member.trend > 0 ? 'text-bg-success' : 'text-bg-danger'"
                            >
                                {{ member.trend > 0 ? '+' : '' }}{{ member.trend }}
                            </span>
                        </div>
                    </div>
                </li>
            </TransitionGroup>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GroupUser, Profile } from '@prisma/client'

interface Props {
    group: {
        members: (GroupUser & {
            profile: Profile
        })[]
    }
}

const props = defineProps<Props>()
const periods = [
    'This Week', 'This Month', 'All Time',
]
const selectedPeriod = ref('This Week')

// In a real implementation, this would be calculated based on actual task completion data
const memberPoints = computed(() => {
    return props.group.members.map(member => ({
        ...member,
        points: Math.floor(Math.random() * 1000),
        trend: Math.floor(Math.random() * 200) - 100,
    }))
})

const sortedMembers = computed(() => {
    return [...memberPoints.value].sort((a, b) => b.points - a.points)
})

const getPositionClass = (index: number) => {
    switch (index) {
        case 0:
            return 'text-warning'
        case 1:
            return 'text-secondary'
        case 2:
            return 'text-warning-emphasis'
        default:
            return 'text-muted'
    }
}

const getPositionIcon = (index: number) => {
    switch (index) {
        case 0:
            return 'trophy'
        case 1:
            return 'award'
        case 2:
            return 'medal'
        default:
            return ''
    }
}
</script>

<style scoped lang="scss">
.avatar-wrapper {
    position: relative;
}

.position-badge {
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid currentColor;
}

.position-indicator {
    width: 32px;
}

.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.list-leave-active {
    position: absolute;
}

.leaderboard-item {
    background: white;
    transition: all 0.3s ease;

    &:hover {
        transform: translateX(4px);
        background: var(--bs-gray-100);
    }
}
</style>
