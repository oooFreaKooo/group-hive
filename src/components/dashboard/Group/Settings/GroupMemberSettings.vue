<template>
    <div class="group-member-settings">
        <div class="members-list">
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th scope="col">
                                Member
                            </th>
                            <th scope="col">
                                Role
                            </th>
                            <th scope="col">
                                Points
                            </th>
                            <th scope="col">
                                Joined
                            </th>
                            <th scope="col">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="member in sortedMembers"
                            :key="member.id"
                        >
                            <td>
                                <div class="d-flex align-items-center gap-2">
                                    <NuxtImg
                                        :src="member.profile.avatarUrl || '/default-avatar.png'"
                                        :alt="member.profile.displayName || ''"
                                        class="rounded-circle"
                                        width="32"
                                        height="32"
                                    />
                                    <div>
                                        <div class="fw-medium">
                                            {{ member.profile.displayName }}
                                        </div>
                                        <div class="text-muted small">
                                            {{ member.profile.id }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <select
                                    v-if="canManageRoles && member.profile.id !== group.ownerId"
                                    v-model="member.role"
                                    class="form-select form-select-sm w-auto"
                                    @change="updateMemberRole(member)"
                                >
                                    <option value="MEMBER">
                                        Member
                                    </option>
                                    <option value="ADMIN">
                                        Admin
                                    </option>
                                </select>
                                <span v-else>
                                    {{ member.profile.id === group.ownerId ? 'Owner' : member.role }}
                                </span>
                            </td>
                            <td>{{ member.points }}</td>
                            <td>{{ formatDate(member.createdAt) }}</td>
                            <td>
                                <div class="d-flex gap-2">
                                    <button
                                        v-if="canManageMembers && member.profile.id !== group.ownerId"
                                        class="btn btn-sm btn-outline-danger"
                                        @click="confirmRemoveMember(member)"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Remove Member Confirmation Modal -->
        <div
            v-if="memberToRemove"
            class="modal fade show"
            style="display: block;"
            tabindex="-1"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Remove Member
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            @click="memberToRemove = null"
                        />
                    </div>
                    <div class="modal-body">
                        <p>
                            Are you sure you want to remove
                            <strong>{{ memberToRemove.profile.displayName }}</strong>
                            from the group?
                        </p>
                        <p class="text-danger mb-0">
                            This action cannot be undone.
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            @click="memberToRemove = null"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="btn btn-danger"
                            :disabled="removingMember"
                            @click="removeMember"
                        >
                            <span v-if="removingMember">
                                <span class="spinner-border spinner-border-sm me-2" />
                                Removing...
                            </span>
                            <span v-else>Remove Member</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="memberToRemove"
            class="modal-backdrop fade show"
        />
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

const emit = defineEmits<{
    (e: 'update:group', group: GroupWithMembers): void
}>()

const memberToRemove = ref<(GroupUser & { profile: Profile }) | null>(null)
const removingMember = ref(false)

const sortedMembers = computed(() => {
    return [...props.group.members].sort((a, b) => {
        // Owner first
        if (a.profile.id === props.group.ownerId) { return -1 }
        if (b.profile.id === props.group.ownerId) { return 1 }
        // Then admins
        if (a.role === 'ADMIN' && b.role !== 'ADMIN') { return -1 }
        if (b.role === 'ADMIN' && a.role !== 'ADMIN') { return 1 }
        // Then by points
        return b.points - a.points
    })
})

const canManageRoles = computed(() => {
    const currentMember = props.group.members.find(m => m.profile.id === props.profile.id)
    return currentMember?.role === 'ADMIN' || props.profile.id === props.group.ownerId
})

const canManageMembers = computed(() => {
    const currentMember = props.group.members.find(m => m.profile.id === props.profile.id)
    return currentMember?.role === 'ADMIN' || props.profile.id === props.group.ownerId
})

function formatDate (date: Date) {
    return new Date(date).toLocaleDateString()
}

async function updateMemberRole (member: GroupUser & { profile: Profile }) {
    try {
        const { data, error: responseError } = await useFetch<GroupWithMembers>(`/api/group/member/update-role`, {
            method: 'PUT',
            body: {
                groupId: props.group.id,
                memberId: member.id,
                role: member.role,
                updatedById: props.profile.id,
            },
        })

        if (responseError.value) {
            throw new Error(responseError.value.message)
        }

        if (data.value) {
            // Convert dates back to Date objects
            const processedGroup: GroupWithMembers = {
                ...data.value,
                createdAt: new Date(data.value.createdAt),
                updatedAt: new Date(data.value.updatedAt),
                members: data.value.members.map(member => ({
                    ...member,
                    createdAt: new Date(member.createdAt),
                    updatedAt: new Date(member.updatedAt),
                    profile: {
                        ...member.profile,
                        createdAt: new Date(member.profile.createdAt),
                        updatedAt: new Date(member.profile.updatedAt),
                    },
                })),
            }
            emit('update:group', processedGroup)
        }
    } catch (error) {
        console.error('Failed to update member role:', error)
        // Reset the role
        member.role = props.group.members.find(m => m.id === member.id)?.role || 'MEMBER'
    }
}

function confirmRemoveMember (member: GroupUser & { profile: Profile }) {
    memberToRemove.value = member
}

async function removeMember () {
    if (!memberToRemove.value) { return }

    removingMember.value = true
    try {
        const { data, error: responseError } = await useFetch<GroupWithMembers>(`/api/group/member/remove`, {
            method: 'DELETE',
            body: {
                groupId: props.group.id,
                memberId: memberToRemove.value.id,
                removedById: props.profile.id,
            },
        })

        if (responseError.value) {
            throw new Error(responseError.value.message)
        }

        if (data.value) {
            // Convert dates back to Date objects
            const processedGroup: GroupWithMembers = {
                ...data.value,
                createdAt: new Date(data.value.createdAt),
                updatedAt: new Date(data.value.updatedAt),
                members: data.value.members.map(member => ({
                    ...member,
                    createdAt: new Date(member.createdAt),
                    updatedAt: new Date(member.updatedAt),
                    profile: {
                        ...member.profile,
                        createdAt: new Date(member.profile.createdAt),
                        updatedAt: new Date(member.profile.updatedAt),
                    },
                })),
            }
            emit('update:group', processedGroup)
            memberToRemove.value = null
        }
    } catch (error) {
        console.error('Failed to remove member:', error)
    } finally {
        removingMember.value = false
    }
}
</script>

<style scoped lang="scss">
.group-member-settings {
    position: relative;
}

.modal {
    background-color: rgba(0, 0, 0, 0.5);
}

.table {
    th {
        font-weight: 600;
        color: var(--bs-gray-600);
    }
}

.form-select {
    min-width: 100px;
}
</style>
