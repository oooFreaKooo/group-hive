<template>
    <div class="chat-container d-flex flex-column rounded-5 shadow">
        <div class="p-3 bg-gradient bg-dark">
            <span class="fw-semibold text-light d-flex align-items-center justify-content-between w-100">
                <div class="d-flex align-items-center">
                    <i class="bi bi-people-fill mx-2" />
                    Members
                </div>
                <span class="px-2 border-bottom rounded-circle">{{ members.length }}</span>
            </span>
        </div>

        <div class="flex-grow-1 overflow-auto p-3 member-list position-relative">
            <div
                v-if="status === 'pending'"
                class="loading-overlay"
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
                        class="d-flex align-items-center gap-3 p-2 member-card border-bottom"
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
.chat-container {
    height: 75vh;
    overflow: hidden;
    position: relative;
}

.member-list {
    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--bs-gray-300);
        border-radius: 3px;

        &:hover {
            background: var(--bs-gray-400);
        }
    }
}

.member-card {
    border-color: rgba(var(--bs-dark-rgb), 0.05);
    transition: all 0.2s ease;
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
    backdrop-filter: blur(2px);
}
</style>
