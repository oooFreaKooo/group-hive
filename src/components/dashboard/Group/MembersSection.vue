<template>
    <section class="member-section">
        <h2>Members</h2>

        <p>{{ group.description }}</p>
        <div class="d-flex gap-2 align-items-center">
            <span class="badge bg-success">
                {{ group.members.length }} members
            </span>
            <Dropdown v-if="isAdmin(group)">
                <DropdownToggle class="d-flex align-items-center gap-2 btn btn-link text-dark text-decoration-none p-0">
                    <div class="d-flex align-items-center gap-2">
                        <span class="text-white">Manage</span>
                    </div>
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem
                        v-if="isAdmin(group)"
                        @click="showInviteModal = true"
                    >
                        Invite Members
                    </DropdownItem>
                    <DropdownItem @click="showEditModal = true">
                        Edit Group
                    </DropdownItem>
                    <DropdownItem
                        v-if="isOwner(group)"
                        class="text-danger"
                        @click="confirmDelete"
                    >
                        Delete Group
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>

        <div class="members">
            <div
                v-for="member in group.members"
                :key="member.id"
                class="member"
            >
                <div class="member-details">
                    <div class="profile-container py-2">
                        <NuxtImg
                            class="rounded-circle me-2"
                            width="32"
                            height="32"
                            :src="member.profile.avatarUrl || '/default-avatar.png'"
                            :alt="member.profile.displayName || 'Member'"
                        />
                        <p class="toast-header mb-0">
                            {{ member.profile.displayName }}
                        </p>
                    </div>

                    <div class="points-container py-2">
                        <span class="text-success">{{ member.points }} Points</span>
                        <button
                            class="icon-button d-flex align-items-center justify-content-center rounded-circle btn"
                            @click="$emit('member-details', member.id)"
                        >
                            <i class="bi bi-clock-history" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <GroupChat :group-id="group.id" />
    </section>
</template>

<script setup lang="ts">
const props = defineProps<{
    group: Group
}>()

const { isAdmin, isOwner, deleteGroup } = useGroup()
const showEditModal = ref(false)
const showInviteModal = ref(false)

const confirmDelete = async () => {
    if (confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
        await deleteGroup(props.group.id)
    }
}

defineEmits<{
    (e: 'card-select', type: string): void
    (e: 'member-details', id: string | number): void
    (e: 'save'): void
    (e: 'settings'): void
}>()
</script>

<style scoped>
.member-section {
    max-width: 600px;
}

.faq {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    p {
        color: var(--c-text-tertiary);
        font-size: 0.875rem;
    }

    div {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        border-top: 1px solid var(--c-gray-600);
        border-bottom: 1px solid var(--c-gray-600);
        font-size: 0.875rem;
        display: flex;
        align-items: center;

        label {
            padding-right: 1rem;
            margin-right: 1rem;
            border-right: 1px solid var(--c-gray-600);
        }

        input {
            border: 0;
            background-color: transparent;
            padding: 0.25em 0;
            width: 100%;
        }
    }
}

.members {
    display: flex;
    flex-direction: column;
    margin-top: 1.5rem;
}

.member {
    display: flex;
    align-items: center;
    & + * {
        margin-top: 1rem;
    }
}

.member-details {
    display: flex;
    width: 100%;
    flex-direction: column;

    .profile-container {
        border-top: 1px solid var(--c-gray-600);
        border-bottom: 1px solid var(--c-gray-600);
        display: flex;
        justify-content: start;
    }

    .points-container {
        border-top: 1px solid var(--c-gray-600);
        border-bottom: 1px solid var(--c-gray-600);
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
    }
}

.icon-button {
    width: 32px;
    height: 32px;
    background-color: transparent;
    color: var(--c-text-primary);
    transition: 0.25s ease;
    &.large {
        width: 42px;
        height: 42px;
        font-size: 1.25em;
    }

    i {
        transition: 0.25s ease;
    }

    &:hover,
    &:focus {
        background-color: var(--c-gray-600);
        box-shadow: 0 0 0 4px var(--c-gray-800), 0 0 0 5px var(--c-text-tertiary);
    }
}
</style>
