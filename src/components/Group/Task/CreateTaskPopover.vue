<template>
    <div>
        <button
            class="btn btn-primary btn-sm rounded-pill"
            @click="isOpen = true"
        >
            <i class="bi bi-plus-lg me-2" />
            Add Task
        </button>

        <AppPopover
            v-if="isOpen"
            title="Create New Task"
            @close="isOpen = false"
        >
            <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label
                        for="taskDescription"
                        class="form-label"
                    >Description*</label>
                    <textarea
                        id="taskDescription"
                        v-model="form.description"
                        class="form-control"
                        rows="3"
                        required
                    />
                </div>

                <div class="mb-3">
                    <label class="form-label">Tags</label>
                    <div class="d-flex flex-wrap gap-2 mb-2">
                        <span
                            v-for="tagId in form.tagIds"
                            :key="tagId"
                            class="badge"
                            :style="{ backgroundColor: getTagColor(tagId) }"
                        >
                            {{ getTagTitle(tagId) }}
                            <button
                                type="button"
                                class="btn-close btn-close-white ms-2"
                                style="font-size: 0.5rem"
                                @click="removeTag(tagId)"
                            />
                        </span>
                    </div>
                    <select
                        v-model="selectedTagId"
                        class="form-select"
                        :disabled="!availableTags.length"
                        @change="addSelectedTag"
                    >
                        <option value="">
                            Select a tag
                        </option>
                        <option
                            v-for="tag in availableTags"
                            :key="tag.id"
                            :value="tag.id"
                        >
                            {{ tag.title }}
                        </option>
                    </select>
                </div>

                <Accordion color="light">
                    <AccordionSection
                        :title="`Points: ${form.pointValue}`"
                        :active="true"
                        class="border"
                    >
                        <input
                            id="taskPoints"
                            v-model.number="form.pointValue"
                            type="number"
                            class="form-control"
                            min="0"
                            max="100"
                            required
                        >
                    </AccordionSection>

                    <AccordionSection
                        class="border"
                        :title="`Schedule: ${getScheduleTitle}`"
                    >
                        <div class="row g-2">
                            <div class="col">
                                <select
                                    v-model="form.taskRowId"
                                    class="form-select"
                                >
                                    <option value="">
                                        Select a week
                                    </option>
                                    <option
                                        v-for="row in taskRows"
                                        :key="row.id"
                                        :value="row.id"
                                    >
                                        {{ row.title }}
                                    </option>
                                </select>
                            </div>
                            <div class="col">
                                <select
                                    v-model="form.selectedDay"
                                    class="form-select"
                                    :disabled="!form.taskRowId"
                                >
                                    <option value="">
                                        Select a day
                                    </option>
                                    <option
                                        v-for="day in weekDays"
                                        :key="day"
                                        :value="day"
                                    >
                                        {{ day }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </AccordionSection>

                    <AccordionSection
                        class="border"
                        :title="`Assign To: ${form.assignedToId ? getProfileName(form.assignedToId) : 'Unassigned'}`"
                    >
                        <select
                            v-model="form.assignedToId"
                            class="form-select"
                        >
                            <option value="">
                                Unassigned
                            </option>
                            <option
                                v-for="profileId in groupProfileIds"
                                :key="profileId"
                                :value="profileId"
                            >
                                {{ getProfileName(profileId) }}
                            </option>
                        </select>
                    </AccordionSection>
                </Accordion>

                <div
                    v-if="error"
                    class="alert alert-danger mt-3"
                    role="alert"
                >
                    {{ error }}
                </div>

                <div class="d-flex justify-content-end gap-2 mt-3">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="isOpen = false"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="isSubmitting"
                    >
                        {{ isSubmitting ? 'Creating...' : 'Create Task' }}
                    </button>
                </div>
            </form>
        </AppPopover>
    </div>
</template>

<script setup lang="ts">
import type { Tag, TaskRow } from '@prisma/client'

const props = defineProps({
    groupId: {
        type: String,
        required: true,
    },
    taskRows: {
        type: Array as PropType<TaskRow[]>,
        required: true,
    },
})

const emit = defineEmits<{
    (e: 'task-created'): void
}>()

const isOpen = ref(false)
const error = ref('')
const isSubmitting = ref(false)

const form = ref({
    description: '',
    pointValue: 1,
    assignedToId: '',
    taskRowId: '',
    selectedDay: '',
    tagIds: [] as string[],
})

const selectedTagId = ref('')

// Fetch tags for this group
const { data: tags } = await useFetch<Tag[]>(() => `/api/group/${props.groupId}/tags`)

// Fetch group members
const { data: profiles } = await useFetch<{ id: string, displayName: string }[]>(() => `/api/group/${props.groupId}/profiles`)

const weekDays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
]

const availableTags = computed(() =>
    tags.value?.filter(tag => !form.value.tagIds.includes(tag.id)) || [],
)

const groupProfileIds = computed(() =>
    profiles.value?.map(p => p.id) || [],
)

const getTagColor = (tagId: string) => {
    return tags.value?.find(t => t.id === tagId)?.color || '#000000'
}

const getTagTitle = (tagId: string) => {
    return tags.value?.find(t => t.id === tagId)?.title || 'Unknown'
}

const getProfileName = (profileId: string) => {
    return profiles.value?.find(p => p.id === profileId)?.displayName || 'Unknown'
}

const getScheduleTitle = computed(() => {
    if (!form.value.taskRowId) { return 'Unscheduled' }
    const row = props.taskRows.find(r => r.id === form.value.taskRowId)
    return row ? `${row.title}${form.value.selectedDay ? ` - ${form.value.selectedDay}` : ''}` : 'Unscheduled'
})

const addSelectedTag = () => {
    if (!selectedTagId.value) { return }
    if (!form.value.tagIds.includes(selectedTagId.value)) {
        form.value.tagIds.push(selectedTagId.value)
    }
    selectedTagId.value = ''
}

const removeTag = (tagId: string) => {
    form.value.tagIds = form.value.tagIds.filter(id => id !== tagId)
}

const handleSubmit = async () => {
    try {
        isSubmitting.value = true
        error.value = ''

        let dueDate: Date | null = null
        if (form.value.taskRowId && form.value.selectedDay) {
            const selectedRow = props.taskRows.find(row => row.id === form.value.taskRowId)
            if (selectedRow) {
                const weekStart = new Date(selectedRow.weekStart)
                const dayOffset = weekDays.indexOf(form.value.selectedDay)
                if (dayOffset !== -1) {
                    dueDate = new Date(weekStart)
                    dueDate.setDate(weekStart.getDate() + dayOffset)
                    dueDate.setHours(23, 59, 59, 999)
                }
            }
        }

        await $fetch(`/api/group/${props.groupId}/task`, {
            method: 'POST',
            body: {
                description: form.value.description,
                pointValue: form.value.pointValue,
                assignedToId: form.value.assignedToId || null,
                taskRowId: form.value.taskRowId || null,
                dueDate,
                tagIds: form.value.tagIds,
            },
        })

        emit('task-created')
        isOpen.value = false
        // Reset form
        form.value = {
            description: '',
            pointValue: 1,
            assignedToId: '',
            taskRowId: '',
            selectedDay: '',
            tagIds: [],
        }
    } catch (e: any) {
        error.value = e.message || 'Failed to create task'
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped lang="scss">
.badge {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: normal;
    color: white;
}
</style>
