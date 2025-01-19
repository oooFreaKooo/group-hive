<template>
    <div class="edit-group-section">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3>Group Settings</h3>
            <div class="d-flex gap-2">
                <button
                    class="btn btn-outline-primary"
                    :disabled="isGeneratingCode"
                    @click="generateNewInviteCode"
                >
                    {{ isGeneratingCode ? 'Generating...' : 'Generate New Invite Code' }}
                </button>
                <button
                    class="btn btn-primary"
                    @click="copyInviteCode"
                >
                    Copy Invite Code
                </button>
            </div>
        </div>

        <div class="card shadow-sm">
            <div class="card-header">
                <ul class="nav nav-tabs card-header-tabs">
                    <li
                        v-for="tab in tabs"
                        :key="tab.id"
                        class="nav-item"
                    >
                        <button
                            class="nav-link"
                            :class="{ active: activeTab === tab.id }"
                            @click="activeTab = tab.id"
                        >
                            {{ tab.label }}
                        </button>
                    </li>
                </ul>
            </div>
            <div class="card-body p-4">
                <component
                    :is="currentTabComponent"
                    :group="group"
                    :profile="profile"
                    @update:group="$emit('update:group', $event)"
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

const props = defineProps<{
    group: GroupWithMembers
    profile: Profile
}>()

defineEmits<{
    (e: 'update:group', group: GroupWithMembers): void
}>()

const activeTab = ref('general')
const isGeneratingCode = ref(false)

const tabs = [
    { id: 'general', label: 'General Settings', component: resolveComponent('GroupGeneralSettings') },
    { id: 'members', label: 'Members', component: resolveComponent('GroupMemberSettings') },
    { id: 'roles', label: 'Roles & Permissions', component: resolveComponent('GroupRoleSettings') },
    { id: 'danger', label: 'Danger Zone', component: resolveComponent('GroupDangerSettings') },
]

const currentTabComponent = computed(() => {
    const tab = tabs.find(t => t.id === activeTab.value)
    return tab?.component
})

async function generateNewInviteCode () {
    isGeneratingCode.value = true
    try {
        const response = await useFetch(`/api/group/${props.group.id}/invite-code`, {
            method: 'POST',
        })
        if (response.error.value) {
            throw new Error(response.error.value.message)
        }
    } catch (error) {
        console.error('Failed to generate new invite code:', error)
    } finally {
        isGeneratingCode.value = false
    }
}

async function copyInviteCode () {
    try {
        await navigator.clipboard.writeText(props.group.invitationCode)
    } catch (error) {
        console.error('Failed to copy invite code:', error)
    }
}
</script>

<style scoped lang="scss">
.edit-group-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.nav-tabs {
    border-bottom: none;
}

.nav-link {
    border: none;
    color: var(--bs-body-color);
    padding: 1rem 1.5rem;

    &:hover {
        border: none;
        color: var(--bs-primary);
    }

    &.active {
        color: var(--bs-primary);
        border-bottom: 2px solid var(--bs-primary);
    }
}
</style>
