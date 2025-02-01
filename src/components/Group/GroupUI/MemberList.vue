<template>
    <div class="chat-container d-flex flex-column rounded-5 border border-2">
        <div class="p-3 bg-gradient bg-dark">
            <span class="fw-semibold text-light d-flex align-items-center justify-content-between w-100">
                <div class="d-flex align-items-center">
                    <i class="bi bi-people-fill mx-2" />
                    Members
                </div>
                <span class="px-2 border-bottom rounded-circle">{{ members.length }}</span>
            </span>
        </div>

        <div class="flex-grow-1 overflow-auto p-3 member-list">
            <div
                v-for="member in members"
                :key="member.id"
                class="position-relative cursor-pointer mb-2"
                @click.stop="setActivePopover(member.id)"
            >
                <div class="d-flex align-items-center gap-3 p-2 member-card border-bottom">
                    <div class="position-relative flex-shrink-0">
                        <NuxtImg
                            class="rounded-circle member-avatar"
                            width="40"
                            height="40"
                            :src="member.profile.avatarUrl || '/default-avatar.png'"
                            :alt="member.profile.displayName || 'Member'"
                        />
                    </div>
                    <div class="flex-grow-1 min-w-0">
                        <div class="fw-semibold text-truncate">
                            {{ member.profile.displayName }}
                            <span
                                v-if="member.role === 'ADMIN'"
                                title="Admin"
                            >
                                <i class="bi bi-shield-fill-check small" />
                            </span>
                        </div>

                        <div class="fs-7 text-gray-600 d-flex align-items-center gap-2">
                            <i class="bi bi-star-fill text-warning" />
                            {{ member.points }}
                        </div>
                    </div>
                </div>

                <MemberPopover
                    v-if="activePopover === member.id"
                    :member="member"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Prisma } from '@prisma/client'

defineProps<{
    members: Prisma.GroupUserGetPayload<{
        include: {
            profile: true
        }
    }>[]
}>()

const { activePopover, setActivePopover, handleClickOutside, handleEscKey } = usePopoverState()

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscKey)
})
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

    &:hover {
        transform: translateY(-1px);
        background: rgba(var(--bs-primary-rgb), 0.03) !important;
        border-color: rgba(var(--bs-primary-rgb), 0.2);
    }
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

.cursor-pointer {
    cursor: pointer;
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
</style>
