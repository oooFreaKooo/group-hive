<template>
    <div v-if="status === 'pending'">
        <div
            class="spinner-border"
            role="status"
        >
            Loading...
        </div>
    </div>
    <div v-else-if="data && status === 'success'">
        <CreateOrJoinGroup v-if="data.profile && data.profile.ownedGroups.length == 0" />
        <div v-else>
            <MembersSection
                :group="data.profile?.ownedGroups[0] as unknown as GroupWithMembers"
                :profile="data.profile as unknown as Profile"
            />
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

const { data, status } = await useFetch('/api/profile/get')

definePageMeta({
    middleware: ['auth'],
})
</script>
