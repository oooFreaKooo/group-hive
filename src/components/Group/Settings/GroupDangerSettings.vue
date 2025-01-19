<template>
    <div class="group-danger-settings">
        <div class="alert alert-warning mb-4">
            <h5 class="alert-heading">
                ⚠️ Danger Zone
            </h5>
            <p class="mb-0">
                The actions in this section can have serious consequences. Please proceed with caution.
            </p>
        </div>

        <div class="card border-danger mb-4">
            <div class="card-body">
                <h5 class="card-title text-danger">
                    Delete Group
                </h5>
                <p class="card-text">
                    Once you delete a group, there is no going back. Please be certain.
                </p>
                <button
                    class="btn btn-outline-danger"
                    :disabled="!isOwner"
                    @click="showDeleteConfirmation = true"
                >
                    Delete Group
                </button>
                <div
                    v-if="!isOwner"
                    class="form-text text-muted mt-2"
                >
                    Only the group owner can delete the group.
                </div>
            </div>
        </div>

        <div class="card border-warning">
            <div class="card-body">
                <h5 class="card-title text-warning">
                    Transfer Ownership
                </h5>
                <p class="card-text">
                    Transfer ownership of this group to another member. You will become an admin after the transfer.
                </p>
                <div class="mb-3">
                    <select
                        v-model="selectedNewOwner"
                        class="form-select"
                        :disabled="!isOwner"
                    >
                        <option value="">
                            Select a new owner
                        </option>
                        <option
                            v-for="member in otherMembers"
                            :key="member.id"
                            :value="member.id"
                        >
                            {{ member.profile.displayName }}
                        </option>
                    </select>
                </div>
                <button
                    class="btn btn-outline-warning"
                    :disabled="!isOwner || !selectedNewOwner"
                    @click="showTransferConfirmation = true"
                >
                    Transfer Ownership
                </button>
                <div
                    v-if="!isOwner"
                    class="form-text text-muted mt-2"
                >
                    Only the group owner can transfer ownership.
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div
            v-if="showDeleteConfirmation"
            class="modal fade show"
            style="display: block;"
            tabindex="-1"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Delete Group
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            @click="showDeleteConfirmation = false"
                        />
                    </div>
                    <div class="modal-body">
                        <p class="text-danger">
                            ⚠️ This action cannot be undone. This will permanently delete the group
                            <strong>{{ group.name }}</strong>, including:
                        </p>
                        <ul class="text-danger">
                            <li>All member data and roles</li>
                            <li>All tasks and their history</li>
                            <li>All chat messages</li>
                            <li>All point history</li>
                        </ul>
                        <div class="mb-3">
                            <label class="form-label">Please type <strong>{{ group.name }}</strong> to confirm</label>
                            <input
                                v-model="deleteConfirmation"
                                type="text"
                                class="form-control"
                                placeholder="Type group name here"
                            >
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            @click="showDeleteConfirmation = false"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="btn btn-danger"
                            :disabled="deleteConfirmation !== group.name || isDeleting"
                            @click="deleteGroup"
                        >
                            <span v-if="isDeleting">
                                <span class="spinner-border spinner-border-sm me-2" />
                                Deleting...
                            </span>
                            <span v-else>Delete Group</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Transfer Confirmation Modal -->
        <div
            v-if="showTransferConfirmation"
            class="modal fade show"
            style="display: block;"
            tabindex="-1"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Transfer Ownership
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            @click="showTransferConfirmation = false"
                        />
                    </div>
                    <div class="modal-body">
                        <p>
                            Are you sure you want to transfer ownership of
                            <strong>{{ group.name }}</strong> to
                            <strong>{{ selectedMember?.profile.displayName }}</strong>?
                        </p>
                        <p class="text-warning mb-0">
                            You will become an admin after the transfer.
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            @click="showTransferConfirmation = false"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="btn btn-warning"
                            :disabled="isTransferring"
                            @click="transferOwnership"
                        >
                            <span v-if="isTransferring">
                                <span class="spinner-border spinner-border-sm me-2" />
                                Transferring...
                            </span>
                            <span v-else>Transfer Ownership</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="showDeleteConfirmation || showTransferConfirmation"
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

const showDeleteConfirmation = ref(false)
const showTransferConfirmation = ref(false)
const deleteConfirmation = ref('')
const selectedNewOwner = ref('')
const isDeleting = ref(false)
const isTransferring = ref(false)

const isOwner = computed(() => props.profile.id === props.group.ownerId)

const otherMembers = computed(() => {
    return props.group.members.filter(member =>
        member.profile.id !== props.profile.id &&
        member.role === 'ADMIN',
    )
})

const selectedMember = computed(() => {
    return props.group.members.find(member => member.profile.id === selectedNewOwner.value)
})

async function deleteGroup () {
    if (deleteConfirmation.value !== props.group.name) { return }

    isDeleting.value = true
    try {
        const response = await useFetch(`/api/group/delete`, {
            method: 'DELETE',
            body: {
                groupId: props.group.id,
                ownerId: props.profile.id,
            },
        })

        if (response.error.value) {
            throw new Error(response.error.value.message)
        }

        // Redirect to dashboard after successful deletion
        navigateTo('/dashboard')
    } catch (error) {
        console.error('Failed to delete group:', error)
    } finally {
        isDeleting.value = false
        showDeleteConfirmation.value = false
    }
}

async function transferOwnership () {
    if (!selectedNewOwner.value) { return }

    isTransferring.value = true
    try {
        const { data, error: responseError } = await useFetch<GroupWithMembers>(`/api/group/transfer-ownership`, {
            method: 'PUT',
            body: {
                groupId: props.group.id,
                currentOwnerId: props.profile.id,
                newOwnerId: selectedMember.value?.profile.id,
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
            showTransferConfirmation.value = false
            selectedNewOwner.value = ''
        }
    } catch (error) {
        console.error('Failed to transfer ownership:', error)
    } finally {
        isTransferring.value = false
    }
}
</script>

<style scoped lang="scss">
.group-danger-settings {
    max-width: 800px;
    margin: 0 auto;
}

.modal {
    background-color: rgba(0, 0, 0, 0.5);
}

.card {
    .card-title {
        font-size: 1.1rem;
        font-weight: 600;
    }
}
</style>
