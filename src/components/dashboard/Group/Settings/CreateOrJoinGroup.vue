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
                                :class="{ 'is-invalid': formError }"
                                required
                            >
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
                                :class="{ 'is-invalid': formError }"
                                required
                            >
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
                                required
                            >
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
                    @click="joinGroup = true"
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
    </div>
</template>

<script setup lang="ts">
const joinGroup = ref(false)

const groupForm = ref({
    name: '',
    description: '',
    city: '',
    postalCode: '',
})

const formStatus = ref('idle')
const formError = ref()

const { data } = await useFetch('/api/profile/get')

async function createGroup () {
    const { error, status } = await useFetch('/api/group/create', {
        method: 'POST',
        body: { ...groupForm.value, ownerId: data.value?.profile?.id },
    })

    return { status, error }
}

async function submitForm () {
    const { status, error } = await createGroup()
    formStatus.value = status.value
    formError.value = error.value
    return { status, error }
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
