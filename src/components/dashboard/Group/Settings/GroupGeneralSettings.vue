<template>
    <div class="group-general-settings">
        <form @submit.prevent="handleSubmit">
            <div class="mb-4">
                <label
                    for="name"
                    class="form-label"
                >Group Name</label>
                <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    required
                >
            </div>

            <div class="mb-4">
                <label
                    for="description"
                    class="form-label"
                >Description</label>
                <textarea
                    id="description"
                    v-model="form.description"
                    rows="3"
                    class="form-control"
                    placeholder="Describe your group's purpose and goals..."
                />
            </div>

            <div class="row mb-4">
                <div class="col-md-6">
                    <label
                        for="city"
                        class="form-label"
                    >City</label>
                    <input
                        id="city"
                        v-model="form.city"
                        type="text"
                        class="form-control"
                        placeholder="Enter city name"
                    >
                </div>
                <div class="col-md-6">
                    <label
                        for="postalCode"
                        class="form-label"
                    >Postal Code</label>
                    <input
                        id="postalCode"
                        v-model="form.postalCode"
                        type="text"
                        class="form-control"
                        placeholder="Enter postal code"
                    >
                </div>
            </div>

            <div
                v-if="error"
                class="alert alert-danger mb-4"
            >
                {{ error }}
            </div>

            <div class="d-flex justify-content-end">
                <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="loading || !hasChanges"
                >
                    <span v-if="loading">
                        <span
                            class="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                        />
                        Saving...
                    </span>
                    <span v-else>Save Changes</span>
                </button>
            </div>
        </form>
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

const form = ref({
    name: props.group.name,
    description: props.group.description || '',
    city: props.group.city || '',
    postalCode: props.group.postalCode || '',
})

const loading = ref(false)
const error = ref<string | null>(null)

const hasChanges = computed(() => {
    return form.value.name !== props.group.name ||
        form.value.description !== props.group.description ||
        form.value.city !== props.group.city ||
        form.value.postalCode !== props.group.postalCode
})

async function handleSubmit () {
    if (!hasChanges.value) { return }

    loading.value = true
    error.value = null

    try {
        const { data, error: responseError } = await useFetch<GroupWithMembers>(`/api/group/update`, {
            method: 'PUT',
            body: {
                id: props.group.id,
                ...form.value,
                profileId: props.profile.id,
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
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to update group'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped lang="scss">
.group-general-settings {
    max-width: 800px;
    margin: 0 auto;
}

.form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
}
</style>
