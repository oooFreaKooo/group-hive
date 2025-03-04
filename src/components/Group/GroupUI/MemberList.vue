<template>
    <div class="d-flex flex-column h-100 bg-white rounded-4 border">
        <div class="p-3 border-bottom bg-light rounded-top-4">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <i class="bi bi-people-fill text-primary me-2" />
                    <span class="fw-semibold">Members</span>
                </div>
                <span class="badge bg-primary-subtle text-primary rounded-pill px-2">
                    {{ members.length }}
                </span>
            </div>
        </div>

        <div class="flex-grow-1 overflow-auto p-3 member-list position-relative">
            <div
                v-if="status === 'pending'"
                class="loading-overlay rounded-4"
            >
                <div
                    class="spinner-border text-primary"
                    role="status"
                >
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <template v-else>
                <div
                    v-for="member in members"
                    :key="member.id"
                    class="position-relative mb-2"
                >
                    <div
                        class="d-flex align-items-center gap-3 p-2 member-card rounded-3 hover-bg-light"
                        @click="selectedMemberId = member.id"
                    >
                        <div class="position-relative flex-shrink-0 btn p-0 m-0 border-0">
                            <NuxtImg
                                class="rounded-circle member-avatar"
                                width="40"
                                height="40"
                                :src="member.avatarUrl || '/images/default-avatar.png'"
                                :alt="member.displayName || 'Member'"
                            />
                        </div>
                        <div class="flex-grow-1 min-w-0">
                            <div class="fw-semibold text-truncate">
                                {{ member.displayName }}
                                <span
                                    v-if="member.role === 'ADMIN'"
                                    class="text-primary"
                                    title="Admin"
                                >
                                    <i class="bi bi-shield-fill-check small" />
                                </span>
                            </div>

                            <div class="fs-7 text-gray-600 d-flex align-items-center gap-2">
                                <i class="bi bi-star-fill text-warning" />
                                <!-- We'll need to implement points calculation -->
                                0
                            </div>
                        </div>
                    </div>

                    <MemberPopover
                        v-if="selectedMemberId === member.id"
                        :member="member"
                        @close="selectedMemberId = null"
                    />
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Profile } from '@prisma/client'

defineProps<{
    members: Profile[]
    status: string
}>()

const selectedMemberId = ref<string | null>(null)
</script>

<style scoped lang="scss">
.member-list {
    height: calc(75vh - 180px);

    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--bs-gray-300);
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: padding-box;

        &:hover {
            background: var(--bs-gray-400);
            border: 2px solid transparent;
            background-clip: padding-box;
        }
    }
}

.member-card {
    transition: all 0.2s ease;
    cursor: pointer;
}

.member-avatar {
    border: 2px solid rgba(var(--bs-primary-rgb), 0.2);
    object-fit: cover;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--bs-primary);
        transform: scale(1.05);
    }
}

.fs-7 {
    font-size: 0.85rem;
}

.hover-bg-light:hover {
    background-color: var(--bs-light);
}

@supports (scrollbar-color: auto) {
    .member-list {
        scrollbar-color: var(--bs-gray-300) transparent;
        scrollbar-width: thin;
    }
}

.loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    z-index: 1;
}
</style>
