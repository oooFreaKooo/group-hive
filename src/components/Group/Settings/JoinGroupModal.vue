<template>
    <AppPopover
        title="Join a Group"
        overlay
        @close="$emit('close')"
    >
        <form @submit.prevent="submitForm">
            <div class="mb-3">
                <label
                    for="invitationCode"
                    class="form-label"
                >Invitation Code</label>
                <input
                    id="invitationCode"
                    v-model="invitationCode"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': error }"
                    placeholder="Enter the invitation code"
                    required
                >
                <div
                    v-if="error"
                    class="invalid-feedback"
                >
                    {{ error }}
                </div>
            </div>
            <div class="d-flex justify-content-end mt-4">
                <button
                    type="button"
                    class="btn btn-secondary me-2"
                    @click="$emit('close')"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="status === 'pending'"
                >
                    <span
                        v-if="status === 'pending'"
                        class="spinner-border spinner-border-sm me-2"
                    />
                    Join Group
                </button>
            </div>
        </form>
    </AppPopover>
</template>

<script setup lang="ts">
const router = useRouter()
const invitationCode = ref('')
const status = ref('idle')
const error = ref('')

const emit = defineEmits([ 'close', 'joined' ])

async function joinGroupWithCode () {
    status.value = 'pending'
    error.value = ''

    try {
        const response: any = await $fetch('/api/group/join', {
            method: 'POST',
            body: {
                invitationCode: invitationCode.value,
            },
        })

        status.value = 'success'

        // Emit joined event
        emit('joined', response)

        // Navigate to the group page
        if (response && response.id) {
            await router.push(`/dashboard/group/${response.id}`)
        }

        return { success: true }
    } catch (err: any) {
        status.value = 'error'
        error.value = err.data?.message || 'Failed to join group. Please check the invitation code.'
        return { success: false, error: err }
    }
}

function submitForm () {
    if (!invitationCode.value.trim()) {
        error.value = 'Invitation code is required'
        return
    }

    joinGroupWithCode()
}
</script>
