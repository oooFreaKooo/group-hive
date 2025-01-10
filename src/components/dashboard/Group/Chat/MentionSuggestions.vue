<template>
    <div
        v-if="show"
        class="mention-suggestions"
    >
        <div
            v-for="member in filteredMembers"
            :key="member.id"
            class="mention-item d-flex align-items-center p-2"
            @click="$emit('select', member)"
        >
            <NuxtImg
                class="rounded-circle me-2"
                width="20"
                height="20"
                :src="member.profile.avatarUrl || '/default-avatar.png'"
                :alt="member.profile.displayName || 'User'"
            />
            <span>{{ member.profile.displayName }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GroupUser } from './types'

defineProps<{
    show: boolean
    filteredMembers: GroupUser[]
}>()

defineEmits<{
    select: [member: GroupUser]
}>()
</script>

<style scoped lang="scss">
.mention-suggestions {
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 250px;
    max-height: 200px;
    background: white;
    border: 1px solid var(--bs-border-color);
    border-radius: 0.375rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    z-index: 1000;
}

.mention-item {
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: var(--bs-gray-100);
    }
}
</style>
