<template>
    <div class="container">
        <main class="row">
            <div class="col-14 col-lg-10">
                <h2 class="my-4">
                    Chat
                </h2>
            </div>
            <div class="col-14 col-lg-10">
                <GroupChat :group-id="group.id" />
            </div>
            <div class="col-14 col-lg-4">
                <MemberList
                    :group="group"
                    @member-details="$emit('member-details', $event)"
                />
            </div>
        </main>
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
