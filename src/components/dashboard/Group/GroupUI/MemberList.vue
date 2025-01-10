<template>
    <div class="members">
        <div class="d-flex gap-2 align-items-center mb-3">
            <h6 class="mb-0">
                MEMBERS — {{ group.members.length }}
            </h6>
        </div>
        <div class="member-list">
            <div
                v-for="member in group.members"
                :key="member.id"
                class="member position-relative"
                @click.stop="activePopover = member.id"
            >
                <div
                    class="member-details btn btn-light border w-100 text-start p-2 rounded"
                >
                    <NuxtImg
                        class="rounded-circle"
                        width="32"
                        height="32"
                        :src="member.profile.avatarUrl || '/default-avatar.png'"
                        :alt="member.profile.displayName || 'Member'"
                    />
                    <div class="member-info">
                        <div class="member-name">
                            {{ member.profile.displayName }}
                        </div>
                        <div class="popover-item small">
                            <i class="bi bi-star-fill text-warning" />
                            {{ member.points }} points
                        </div>
                    </div>
                </div>

                <!-- Custom Popover -->
                <div
                    v-if="activePopover === member.id"
                    class="custom-popover shadow-lg card rounded-5"
                    @click.stop
                >
                    <div class="container popover-body p-4">
                        <div class="row">
                            <div class="col-2 d-flex justify-content-center align-items-center">
                                <NuxtImg
                                    class="rounded-5 profile-avatar border border-secondary"
                                    width="124"
                                    height="124"
                                    :src="member.profile.avatarUrl || '/default-avatar.png'"
                                    :alt="member.profile.displayName || 'Member'"
                                />
                            </div>
                            <div class="col-10">
                                <div class="card-title fw-bold fs-3 border-bottom">
                                    {{ member.profile.displayName }}
                                </div>
                                <div
                                    v-if="member.profile.city"
                                    class="popover-item mb-2"
                                >
                                    <i class="bi bi-geo-alt" />
                                    {{ member.profile.city }}
                                </div>
                                <div class="popover-item my-2">
                                    <i class="bi bi-calendar3" />
                                    Joined {{ new Date(member.profile.createdAt).toLocaleDateString() }}
                                </div>
                                <div class="popover-item mt-2">
                                    <i class="bi bi-star-fill text-warning" />
                                    {{ member.points }} points
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Group, GroupUser, Profile } from '@prisma/client'
import { ref, onMounted, onUnmounted } from 'vue'

interface GroupWithMembers extends Group {
    members: (GroupUser & {
        profile: Profile
    })[]
}

defineProps<{
    group: GroupWithMembers
}>()

const activePopover = ref<number | null>(null)

const handleClickOutside = (_event: MouseEvent) => {
    if (activePopover.value !== null) {
        activePopover.value = null
    }
}

const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && activePopover.value !== null) {
        activePopover.value = null
    }
}

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
.members {
    display: flex;
    flex-direction: column;
}

.member-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.member {
    border-radius: 4px;
    transition: background-color 0.2s ease;
}

.member-details {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.member-info {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
}

.profile-avatar {
    position: absolute;
    left: -4rem;
}

.custom-popover {
    position: fixed;
    left: 55%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    width: 90%;
    max-width: 400px;
    z-index: 1050;
    animation: fadeIn 0.2s ease;
}

.popover-body {
    background: var(--c-gray-800);
    border-radius: 0 0 6px 6px;
}

.popover-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;

    i {
        width: 16px;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, -60%);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%);
    }
}
</style>
