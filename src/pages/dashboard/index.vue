<template>
    <main class="row p-4">
        <div class="col-12 col-lg-2 pt-4">
            <SideNavigation
                :navigation-items="sideNavConfig.navigationItems"
                :footer-title="sideNavConfig.footerTitle"
                :footer-content="sideNavConfig.footerContent"
                :active-component="activeComponent"
                @navigate="handleNavigation"
            />
        </div>
        <div class="col-12 col-lg-10 pt-4">
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
                    <Transition
                        name="fade"
                        mode="out-in"
                    >
                        <component
                            :is="currentComponent"
                            :group="data.profile?.ownedGroups[0] as unknown as GroupWithMembers"
                            :profile="data.profile as unknown as Profile"
                        />
                    </Transition>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import type { Group, GroupUser, Profile } from '@prisma/client'

interface GroupWithMembers extends Group {
    members: (GroupUser & {
        profile: Profile
    })[]
}

const { data, status } = await useFetch('/api/profile/get')
const activeComponent = ref('overview')

const sideNavConfig = ref({
    navigationItems: [
        {
            label: 'Overview',
            component: 'overview',
            icon: 'house',
        },
        {
            label: 'Chat',
            component: 'chat',
            icon: 'chat',
        },
        {
            label: 'My Tasks',
            component: 'tasks',
            icon: 'list',
        },
        {
            label: 'Leaderboard',
            component: 'leaderboard',
            icon: 'trophy',
        },
        {
            label: 'Account',
            component: 'account',
            icon: 'person',
        },
    ],
    footerTitle: 'GroupHive',
    footerContent: 'All Rights Reserved 2025',
})

const handleNavigation = (component: string) => {
    activeComponent.value = component
}

const currentComponent = computed(() => {
    switch (activeComponent.value) {
        case 'chat':
            return resolveComponent('MembersSection')
        case 'leaderboard':
            return resolveComponent('Leaderboard')
        case 'overview':
            return resolveComponent('MembersSection')
        default:
            return resolveComponent('MembersSection')
    }
})

definePageMeta({
    middleware: ['auth'],
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
