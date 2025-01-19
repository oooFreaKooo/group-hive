<template>
    <AppPopover
        title="Create New Task"
        @close="$emit('close')"
    >
        <form @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label class="form-label">Tags*</label>
                <div class="d-flex flex-wrap gap-2 mb-2">
                    <span
                        v-for="tag in selectedTags"
                        :key="tag.id"
                        class="badge"
                        :style="{ backgroundColor: tag.color }"
                    >
                        {{ tag.title }}
                        <button
                            type="button"
                            class="btn-close btn-close-white ms-2"
                            style="font-size: 0.5rem"
                            @click="removeTag(tag)"
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
            <div class="mb-3">
                <label
                    for="taskDescription"
                    class="form-label"
                >Description</label>
                <textarea
                    id="taskDescription"
                    v-model="form.description"
                    class="form-control"
                    rows="3"
                />
            </div>
            <Accordion
                color="light"
            >
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
                    >
                </AccordionSection>

                <AccordionSection
                    class="border"
                    :title="`Assign To: ${form.assignedToId ? groupMembers.find(member => member.id === form.assignedToId)?.profile.displayName : 'Unassigned'}`"
                >
                    <select
                        id="taskAssignee"
                        v-model="form.assignedToId"
                        class="form-select"
                    >
                        <option value="">
                            Unassigned
                        </option>
                        <option
                            v-for="member in groupMembers"
                            :key="member.id"
                            :value="member.id"
                        >
                            {{ member.profile.displayName }}
                        </option>
                    </select>
                </AccordionSection>

                <AccordionSection
                    class="border"
                    :title="`Schedule: ${form.taskRowId ? taskRows.find(row => row.id === form.taskRowId)?.title + ' - ' + form.selectedDay : 'Unscheduled'}`"
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
                    title="Initial Comment"
                >
                    <textarea
                        id="taskComments"
                        v-model="form.comment"
                        class="form-control"
                        rows="2"
                        placeholder="Add a comment..."
                    />
                </AccordionSection>
            </Accordion>
            <div
                v-if="error"
                class="alert alert-danger"
                role="alert"
            >
                {{ error }}
            </div>
            <div class="d-flex justify-content-end gap-2">
                <button
                    type="button"
                    class="btn btn-secondary"
                    @click="$emit('close')"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="isSubmitting || !selectedTags.length"
                >
                    {{ isSubmitting ? 'Creating...' : 'Create Task' }}
                </button>
            </div>
        </form>
    </AppPopover>
</template>

<script setup lang="ts">
import type { GroupUser, Profile, Tag } from '@prisma/client'

interface Props {
    groupId: number
    groupMembers: (GroupUser & {
        profile: Profile
    })[]
    tags: Tag[]
    taskRows: TaskRowWithRelations[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'taskCreated'): void
    (e: 'close'): void
}>()

const form = ref({
    description: '',
    comment: '',
    pointValue: 1,
    assignedToId: undefined,
    taskRowId: undefined,
    selectedDay: undefined,
})

const selectedTags = ref<Tag[]>([])
const selectedTagId = ref('')
const error = ref('')
const isSubmitting = ref(false)

const availableTags = computed(() =>
    props.tags.filter(tag => !selectedTags.value.some(selected => selected.id === tag.id)),
)

const weekDays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
]

const addSelectedTag = () => {
    if (!selectedTagId.value) { return }
    const tag = props.tags.find(t => t.id === Number(selectedTagId.value))
    if (tag) {
        selectedTags.value.push(tag)
        selectedTagId.value = ''
    }
}

const removeTag = (tag: Tag) => {
    selectedTags.value = selectedTags.value.filter(t => t.id !== tag.id)
}

const handleSubmit = async () => {
    try {
        isSubmitting.value = true
        error.value = ''

        let dueDate: Date | null = null
        if (form.value.taskRowId && form.value.selectedDay) {
            const selectedRow = props.taskRows.find(row => row.id === Number(form.value.taskRowId))
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

        const response = await $fetch('/api/tasks/create', {
            method: 'POST',
            body: {
                ...form.value,
                taskRowId: form.value.taskRowId ? Number(form.value.taskRowId) : null,
                dueDate,
                tagIds: selectedTags.value.map(tag => tag.id),
                groupId: props.groupId,
            },
        })

        if (response) {
            emit('taskCreated')
            emit('close')
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
