<template>
    <main>
        <AppSection>
            <SideNavigation
                :navigation-items="sideNavConfig.navigationItems"
                :footer-items="sideNavConfig.footerItems"
                :profile-items="sideNavConfig.profileItems"
                :active-component="activeComponent"
                @navigate="handleNavigation"
            />

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
                            :key="activeComponent"
                            :group="data.profile?.ownedGroups[0] as unknown as GroupWithMembers"
                            :profile="data.profile as unknown as Profile"
                        />
                    </Transition>
                </div>
            </div>
        </AppSection>
    </main>
</template>

<script setup lang="ts">
import type { Group, GroupUser, Profile } from '@prisma/client'

interface GroupWithMembers extends Group {
    members: (GroupUser & {
        profile: Profile
    })[]
}

interface NavigationItem {
    label: string
    component: string
    icon: string
}

interface ProfileItem {
    name: string
    email: string
    component: string
    avatar: string
}

interface SideNavConfig {
    navigationItems: NavigationItem[]
    footerItems: NavigationItem[]
    profileItems: ProfileItem[]
}

const { data, status } = await useFetch('/api/profile/get')
const user = useSupabaseUser()
const activeComponent = ref('overview')

const sideNavConfig = computed<SideNavConfig>(() => {
    const isAdminOrOwner = data.value?.profile?.ownedGroups[0]?.ownerId === data.value?.profile?.id ||
        data.value?.profile?.ownedGroups[0]?.members.some(
            m => m.profileId === data.value?.profile?.id && m.role === 'ADMIN',
        )

    const navigationItems: NavigationItem[] = [
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
            label: 'Tasks',
            component: 'tasks',
            icon: 'list-task',
        },
        {
            label: 'Leaderboard',
            component: 'leaderboard',
            icon: 'trophy',
        },
    ]

    // Only show edit group option for admins and owners
    if (isAdminOrOwner) {
        navigationItems.push({
            label: 'Edit Group',
            component: 'edit-group',
            icon: 'person-lock',
        })
    }

    return {
        navigationItems,
        footerItems: [
            {
                label: 'App Settings',
                component: 'settings',
                icon: 'gear',
            },
        ],
        profileItems: [
            {
                name: data.value?.profile?.displayName ?? '',
                email: user.value?.email ?? '',
                component: 'profile',
                avatar: data.value?.profile?.avatarUrl ?? '',
            },
        ],
    }
})

const handleNavigation = (component: string) => {
    activeComponent.value = component
}

const currentComponent = computed(() => {
    switch (activeComponent.value) {
        case 'chat':
            return resolveComponent('ChatSection')
        case 'tasks':
            return resolveComponent('TasksSection')
        case 'leaderboard':
            return resolveComponent('LeaderboardSection')
        case 'overview':
            return resolveComponent('ChatSection')
        case 'edit-group':
            return resolveComponent('EditGroupSection')
        case 'profile':
            return resolveComponent('ProfileSettings')
        default:
            return resolveComponent('MembersSection')
    }
})

definePageMeta({
    middleware: ['auth'],
})
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
