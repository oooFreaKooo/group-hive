<template>
    <div class="container mb-5">
        <div class="row g-4">
            <div class="col-14 col-lg-6">
                <div class="card shadow p-4 h-100">
                    <h3 class="h4 text-center">
                        Welcome to GroupHive!
                    </h3>
                    <p class="small my-4 text-center">
                        To get started, create a new group or join an existing one.
                    </p>
                    <form @submit.prevent="submitForm">
                        <div class="mb-3">
                            <label
                                for="displayName"
                                class="form-label"
                            >Group Name</label>
                            <input
                                id="displayName"
                                v-model="groupForm.name"
                                type="text"
                                class="form-control"
                                :class="{ 'is-invalid': formErrors.name }"
                                required
                            >
                            <div
                                v-if="formErrors.name"
                                class="invalid-feedback"
                            >
                                {{ formErrors.name }}
                            </div>
                        </div>
                        <div class="mb-3">
                            <label
                                for="description"
                                class="form-label"
                            >Description</label>
                            <textarea
                                id="description"
                                v-model="groupForm.description"
                                rows="3"
                                class="form-control"
                            />
                        </div>

                        <div class="mb-3">
                            <label
                                for="city"
                                class="form-label"
                            >City</label>
                            <input
                                id="city"
                                v-model="groupForm.city"
                                type="text"
                                class="form-control"
                                :class="{ 'is-invalid': formErrors.city }"
                                required
                            >
                            <div
                                v-if="formErrors.city"
                                class="invalid-feedback"
                            >
                                {{ formErrors.city }}
                            </div>
                        </div>

                        <div class="mb-4">
                            <label
                                for="postalCode"
                                class="form-label"
                            >Postal Code</label>
                            <input
                                id="postalCode"
                                v-model="groupForm.postalCode"
                                type="text"
                                class="form-control"
                                :class="{ 'is-invalid': formErrors.postalCode }"
                                required
                            >
                            <div
                                v-if="formErrors.postalCode"
                                class="invalid-feedback"
                            >
                                {{ formErrors.postalCode }}
                            </div>
                        </div>

                        <button
                            type="submit"
                            class="btn btn-secondary w-100"
                            :disabled="formStatus === 'pending'"
                        >
                            <span
                                v-if="formStatus === 'pending'"
                                class="spinner-border spinner-border-sm me-2"
                            />
                            Create Group
                        </button>
                    </form>
                </div>
            </div>
            <div class="col-14 col-lg-6">
                <button
                    class="card shadow card-btn h-100 w-100 align-items-center justify-content-center p-4"
                    @click="showJoinModal = true"
                >
                    <h5 class="card-text">
                        Join Group
                    </h5>
                    <p class="card-text">
                        Join an existing group with a code.
                    </p>
                </button>
            </div>
        </div>

        <!-- Join Group Modal -->
        <JoinGroupModal
            v-if="showJoinModal"
            @close="showJoinModal = false"
            @joined="handleGroupJoined"
        />
    </div>
</template>

<script setup lang="ts">
import JoinGroupModal from './JoinGroupModal.vue'

const router = useRouter()
const showJoinModal = ref(false)

const groupForm = ref({
    name: '',
    description: '',
    city: '',
    postalCode: '',
})

const formStatus = ref('idle')
const formErrors = ref({
    name: '',
    city: '',
    postalCode: '',
    general: '',
})

// Fetch the current user profile - we don't need to use the data directly
// as the server will use the authenticated user
await useFetch('/api/profile')

async function createGroup () {
    formStatus.value = 'pending'

    try {
        const response: any = await $fetch('/api/group/create', {
            method: 'POST',
            body: {
                ...groupForm.value,
            },
        })

        // Reset form status and navigate to the group page
        formStatus.value = 'success'

        // Navigate to the new group page
        if (response && response.id) {
            await router.push(`/dashboard/group/${response.id}`)
        }

        return { success: true }
    } catch (error: any) {
        formStatus.value = 'error'

        // Handle validation errors
        if (error.response?.status === 400 && error.response?.data?.validation) {
            const validationErrors = error.response.data.validation
            formErrors.value = {
                ...formErrors.value,
                ...validationErrors,
            }
        } else {
            // Generic error
            formErrors.value.general = error.message || 'Failed to create group'
        }

        return { success: false, error }
    }
}

function handleGroupJoined (_group: any) {
    showJoinModal.value = false
    // Additional logic if needed after joining a group
}

async function submitForm () {
    // Reset errors
    formErrors.value = {
        name: '',
        city: '',
        postalCode: '',
        general: '',
    }

    // Validate form
    if (!groupForm.value.name.trim()) {
        formErrors.value.name = 'Group name is required'
        return
    }

    if (!groupForm.value.city.trim()) {
        formErrors.value.city = 'City is required'
        return
    }

    if (!groupForm.value.postalCode.trim()) {
        formErrors.value.postalCode = 'Postal code is required'
        return
    }

    await createGroup()
}
</script>

<style scoped>
.card-btn {
    transition: all 0.3s ease-in-out;
}

.card-btn:hover {
    transform: scale(1.02);
}
</style>
