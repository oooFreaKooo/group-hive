<template>
    <div class="card p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="h4 mb-0">
                    {{ group.name }}
                </h2>
                <p
                    v-if="group.description"
                    class="text-muted mb-0 mt-1"
                >
                    {{ group.description }}
                </p>
            </div>
            <div class="d-flex gap-2 align-items-center">
                <span class="badge bg-success">
                    {{ group.members.length }} members
                </span>
                <div
                    v-if="isAdmin(group)"
                    class="dropdown"
                >
                    <button
                        class="btn btn-outline-secondary btn-sm dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Manage
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <button
                                class="dropdown-item"
                                @click="showEditModal = true"
                            >
                                Edit Group
                            </button>
                        </li>
                        <li v-if="isOwner(group)">
                            <button
                                class="dropdown-item text-danger"
                                @click="confirmDelete"
                            >
                                Delete Group
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="mb-0">
                Members
            </h5>
            <b-button
                v-if="isAdmin(group)"
                class="btn btn-outline-primary btn-sm"
                target="#liveToast"
                toggle="toast"
                @click="copyInviteCode"
            >
                Copy Invite Code
            </b-button>
        </div>

        <div class="members-list">
            <ul class="list-unstyled">
                <li
                    v-for="member in group.members"
                    :key="member.id"
                    class="py-3 border-bottom"
                >
                    <div class="d-flex align-items-center gap-3">
                        <div>
                            <NuxtImg
                                class="rounded-circle"
                                width="32"
                                height="32"
                                :src="member.profile.avatarUrl || '/default-avatar.png'"
                                :alt="member.profile.displayName || 'Member'"
                            />
                        </div>
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-center">
                                <p class="mb-0 fw-medium">
                                    {{ member.profile.displayName }}
                                    <span
                                        v-if="member.role === 'ADMIN'"
                                        class="badge bg-primary ms-2"
                                    >
                                        Admin
                                    </span>
                                </p>
                                <p class="mb-0 text-muted">
                                    {{ member.points }} points
                                </p>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <!-- Edit Group Modal -->
        <EditGroupModal
            v-if="showEditModal"
            v-model="showEditModal"
            :group="group"
        />

        <!-- Toast Notification -->
        <div
            class="toast-container position-fixed bottom-0 end-0 p-3"
        >
            <Toast
                id="liveToast"
                variant="success"
            >
                <ToastBody>
                    Invitation code copied to clipboard!
                </ToastBody>
            </Toast>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Group } from '~/composables/useGroup'

const props = defineProps<{
    group: Group
}>()

const { isAdmin, isOwner, deleteGroup } = useGroup()
const showEditModal = ref(false)

const copyInviteCode = async () => {
    try {
        await navigator.clipboard?.writeText(props.group.invitationCode)
    } catch {
        // Fallback for browsers that don't support clipboard API
        const textarea = document.createElement('textarea')
        textarea.value = props.group.invitationCode
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
    }
}

const confirmDelete = async () => {
    if (confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
        await deleteGroup(props.group.id)
    }
}
</script>

<style scoped>
.members-list {
    max-height: 400px;
    overflow-y: auto;
}
</style>
