<template>
    <div class="card p-4">
        <div class="d-flex justify-content-between align-items-center">
            <h2 class="h4 mb-0">
                {{ group.name }}
            </h2>
            <span class="badge bg-success">
                {{ group.members.length }} members
            </span>
        </div>
        <div class="mt-4">
            <ul class="list-unstyled">
                <li
                    v-for="member in group.members"
                    :key="member.id"
                    class="py-3 border-bottom"
                >
                    <div class="d-flex align-items-center gap-3">
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
defineProps<{
    group: {
        name: string
        members: Array<{
            id: string
            name: string
            avatar_url: string
            points: number
        }>
    }
}>()
</script>
