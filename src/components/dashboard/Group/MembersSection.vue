<template>
    <div class="container mb-5">
        <div class="row g-4">
            <div class="col-12 col-lg-8">
                <GroupChat :group-id="group.id" />
            </div>
            <div class="col-12 col-lg-4">
                <MemberList
                    :group="group"
                    @member-details="$emit('member-details', $event)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Group, GroupUser, Profile } from '@prisma/client'

interface GroupWithMembers extends Group {
    members: (GroupUser & {
        profile: Profile
    })[]
}

defineProps<{
    group: GroupWithMembers
    profile: Profile
}>()

defineEmits<{
    'member-details': [memberId: string]
}>()
</script>

<style scoped>
</style>
