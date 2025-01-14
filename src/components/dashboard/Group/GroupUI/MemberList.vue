<template>
    <div class="d-flex flex-column gap-2 border rounded h-100 p-3">
        <div class="d-flex gap-2 align-items-center">
            <p class="mb-0">
                MEMBERS — {{ group.members.length }}
            </p>
        </div>
        <div class="member-list">
            <div
                v-for="member in group.members"
                :key="member.id"
                class="member position-relative"
                @click.stop="setActivePopover(member.id)"
            >
                <div
                    class="member-details btn btn-light w-100 text-start p-2 rounded"
                >
                    <NuxtImg
                        class="rounded-circle"
                        width="32"
                        height="32"
                        :src="member.profile.avatarUrl || '/default-avatar.png'"
                        :alt="member.profile.displayName || 'Member'"
                    />
                    <div class="member-info">
                        {{ member.profile.displayName }}

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
</style>
