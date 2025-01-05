<template>
    <div class="card p-4">
        <h2 class="h4">
            Leaderboard
        </h2>
        <div class="mt-4">
            <ul class="list-unstyled">
                <li
                    v-for="(member, index) in sortedMembers"
                    :key="member.id"
                    class="py-3 border-bottom"
                >
                    <div class="d-flex align-items-center gap-3">
                        <div
                            class="fw-medium"
                            :class="getPositionClass(index)"
                        >
                            #{{ index + 1 }}
                        </div>
                        <div>
                            <img
                                class="rounded-circle"
                                width="32"
                                height="32"
                                :src="member.avatar_url"
                                :alt="member.name"
                            >
                        </div>
                        <div class="flex-grow-1 text-truncate">
                            <p class="mb-0 fw-medium text-truncate">
                                {{ member.name }}
                            </p>
                            <p class="mb-0 small text-muted text-truncate">
                                {{ member.points }} points
                            </p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
// Mock data - replace with actual data from Supabase
const members = ref([
    {
        id: 1,
        name: 'John Doe',
        avatar_url: 'https://api.dicebear.com/9.x/avataaars-neutral/svg',
        points: 100,
    },
])

const sortedMembers = computed(() => {
    return [...members.value].sort((a, b) => b.points - a.points)
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
</script>
