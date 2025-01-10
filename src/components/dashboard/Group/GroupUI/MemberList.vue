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
                @click.stop="setActivePopover(member.id)"
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

                <MemberPopover
                    v-if="activePopover === member.id"
                    :member="member"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    group: GroupWithMembers
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
</style>
