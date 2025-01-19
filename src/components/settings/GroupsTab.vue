<template>
    <div>
        <!-- Group Notifications -->
        <div class="card bg-light border-0 mb-4">
            <div class="card-body">
                <div class="d-flex align-items-center gap-3 mb-4">
                    <AppIcon
                        name="bell"
                        size="lg"
                        class="text-primary"
                    />
                    <div>
                        <h3 class="h6 mb-1">
                            Notification Preferences
                        </h3>
                        <p class="text-muted small mb-0">
                            Customize how you receive group notifications
                        </p>
                    </div>
                </div>

                <div class="list-group list-group-flush bg-white rounded">
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h4 class="h6 mb-1">
                                New Messages
                            </h4>
                            <p class="text-muted small mb-0">
                                Get notified when you receive new messages
                            </p>
                        </div>
                        <div class="form-check form-switch">
                            <input
                                v-model="preferences.newMessages"
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                            >
                        </div>
                    </div>

                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h4 class="h6 mb-1">
                                Task Updates
                            </h4>
                            <p class="text-muted small mb-0">
                                Get notified about task assignments and updates
                            </p>
                        </div>
                        <div class="form-check form-switch">
                            <input
                                v-model="preferences.taskUpdates"
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                            >
                        </div>
                    </div>

                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h4 class="h6 mb-1">
                                Group Events
                            </h4>
                            <p class="text-muted small mb-0">
                                Get notified about upcoming group events
                            </p>
                        </div>
                        <div class="form-check form-switch">
                            <input
                                v-model="preferences.groupEvents"
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Group Privacy -->
        <div class="card bg-light border-0 mb-4">
            <div class="card-body">
                <div class="d-flex align-items-center gap-3 mb-4">
                    <AppIcon
                        name="shield"
                        size="lg"
                        class="text-primary"
                    />
                    <div>
                        <h3 class="h6 mb-1">
                            Privacy Settings
                        </h3>
                        <p class="text-muted small mb-0">
                            Control your visibility and interaction preferences
                        </p>
                    </div>
                </div>

                <div class="list-group list-group-flush bg-white rounded">
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h4 class="h6 mb-1">
                                Show Online Status
                            </h4>
                            <p class="text-muted small mb-0">
                                Let others see when you're active
                            </p>
                        </div>
                        <div class="form-check form-switch">
                            <input
                                v-model="preferences.showOnlineStatus"
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                            >
                        </div>
                    </div>

                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h4 class="h6 mb-1">
                                Public Profile
                            </h4>
                            <p class="text-muted small mb-0">
                                Make your profile visible to other group members
                            </p>
                        </div>
                        <div class="form-check form-switch">
                            <input
                                v-model="preferences.publicProfile"
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Default Group Settings -->
        <div class="card bg-light border-0">
            <div class="card-body">
                <div class="d-flex align-items-center gap-3 mb-4">
                    <AppIcon
                        name="gear"
                        size="lg"
                        class="text-primary"
                    />
                    <div>
                        <h3 class="h6 mb-1">
                            Default Group Settings
                        </h3>
                        <p class="text-muted small mb-0">
                            Set your default preferences for new groups
                        </p>
                    </div>
                </div>

                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label">Default Role</label>
                            <select
                                v-model="preferences.defaultRole"
                                class="form-select"
                            >
                                <option value="member">
                                    Member
                                </option>
                                <option value="contributor">
                                    Contributor
                                </option>
                                <option value="moderator">
                                    Moderator
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label">Task Assignment Limit</label>
                            <select
                                v-model="preferences.taskLimit"
                                class="form-select"
                            >
                                <option value="1">
                                    1 Task
                                </option>
                                <option value="3">
                                    3 Tasks
                                </option>
                                <option value="5">
                                    5 Tasks
                                </option>
                                <option value="unlimited">
                                    Unlimited
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const preferences = ref<{
    newMessages: boolean
    taskUpdates: boolean
    groupEvents: boolean
    showOnlineStatus: boolean
    publicProfile: boolean
    defaultRole: string
    taskLimit: string
}>({
    // Notification preferences
    newMessages: true,
    taskUpdates: true,
    groupEvents: true,

    // Privacy settings
    showOnlineStatus: true,
    publicProfile: true,

    // Default settings
    defaultRole: 'member',
    taskLimit: '3',
})

/* // Watch for changes and save to backend
watch(preferences, async (newPrefs) => {
    try {
        await $fetch('/api/preferences/update', {
            method: 'PUT',
            body: newPrefs,
        })
    } catch (error) {
        console.error('Failed to save preferences:', error)
    }
}, { deep: true })

// Load preferences on mount
onMounted(async () => {
    try {
        const savedPrefs = await $fetch<{
            newMessages?: boolean
            taskUpdates?: boolean
            groupEvents?: boolean
            showOnlineStatus?: boolean
            publicProfile?: boolean
            defaultRole?: string
            taskLimit?: string
        }>('/api/preferences')

        if (savedPrefs) {
            preferences.value = {
                ...preferences.value,
                ...savedPrefs,
            }
        }
    } catch (error) {
        console.error('Failed to load preferences:', error)
    }
}) */
</script>

<style scoped>
.form-group {
    margin-bottom: 1rem;
}

.form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.card {
    border-radius: 0.5rem;
}

.list-group-item {
    padding: 1rem;
    border-color: var(--bs-border-color-translucent);
}

.form-check-input {
    width: 3rem;
    height: 1.5rem;
    cursor: pointer;
}

.form-check-input:checked {
    background-color: var(--bs-primary);
    border-color: var(--bs-primary);
}
</style>
