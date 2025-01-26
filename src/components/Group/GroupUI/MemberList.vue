<template>
    <div class="member-container">
        <div class="member-header">
            <span class="member-count">
                <i class="bi bi-people-fill me-2" />
                Members
                <span class="badge rounded-pill">{{ members.length }}</span>
            </span>
        </div>
        <div class="member-list">
            <div
                v-for="member in members"
                :key="member.id"
                class="member"
                @click.stop="setActivePopover(member.id)"
            >
                <div class="member-details">
                    <div class="avatar-wrapper">
                        <NuxtImg
                            class="avatar"
                            width="40"
                            height="40"
                            :src="member.profile.avatarUrl || '/default-avatar.png'"
                            :alt="member.profile.displayName || 'Member'"
                        />
                        <div
                            v-if="member.role === 'ADMIN'"
                            class="admin-badge"
                            title="Admin"
                        >
                            <i class="bi bi-shield-fill-check" />
                        </div>
                    </div>
                    <div class="member-info">
                        <div class="member-name">
                            {{ member.profile.displayName }}
                        </div>
                        <div class="member-points">
                            <i class="bi bi-star-fill" />
                            {{ member.points }} points
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
.member-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;
    border-radius: 1.5rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(var(--bs-dark-rgb), 0.08);
    overflow: hidden;
}

.member-header {
    padding: 1.25rem;
    border-bottom: 1px solid rgba(var(--bs-dark-rgb), 0.08);
    background: linear-gradient(to right,
        rgba(var(--bs-primary-rgb), 0.02),
        rgba(var(--bs-light-rgb), 0.5)
    );

    .member-count {
        font-weight: 600;
        color: var(--bs-gray-700);
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        i {
            color: var(--bs-primary);
            font-size: 1.2rem;
        }

        .badge {
            background: var(--bs-primary);
            font-size: 0.8rem;
            font-weight: 500;
            padding: 0.35rem 0.75rem;
        }
    }
}

.member-list {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

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

.member {
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover .member-details {
        transform: translateY(-1px);
        background: rgba(var(--bs-primary-rgb), 0.03);
    }
}

.member-details {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    border-radius: 1rem;
    background: white;
    transition: all 0.2s ease;
    border: 1px solid rgba(var(--bs-dark-rgb), 0.05);

    &:hover {
        border-color: rgba(var(--bs-primary-rgb), 0.2);
    }
}

.avatar-wrapper {
    position: relative;
    flex-shrink: 0;

    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(var(--bs-primary-rgb), 0.2);
        transition: all 0.2s ease;

        &:hover {
            border-color: var(--bs-primary);
            transform: scale(1.05);
        }
    }

    .admin-badge {
        position: absolute;
        bottom: -2px;
        right: -2px;
        background: var(--bs-primary);
        color: white;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
}

.member-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.member-name {
    font-weight: 600;
    color: var(--bs-gray-700);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.member-points {
    font-size: 0.85rem;
    color: var(--bs-gray-600);
    display: flex;
    align-items: center;
    gap: 0.35rem;

    i {
        color: #ffc107;
        font-size: 0.9rem;
    }
}

@supports (scrollbar-color: auto) {
    .member-list {
        scrollbar-color: var(--bs-gray-300) transparent;
        scrollbar-width: thin;
    }
}
</style>
