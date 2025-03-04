<template>
    <div>
        <label class="form-label d-flex align-items-center gap-2 mb-2">
            <i class="bi bi-list-check text-primary" />
            <span class="fw-medium">Subtasks</span>
        </label>

        <!-- Subtasks List -->
        <div class="mb-2">
            <div
                v-for="(subtask, index) in modelValue"
                :key="index"
                class="d-flex gap-2 align-items-center mb-2"
            >
                <input
                    v-model="subtask.description"
                    type="text"
                    class="form-control form-control-sm rounded-4 border-2"
                    placeholder="Subtask description"
                    @input="updateSubtaskPoints"
                >
                <div
                    class="input-group input-group-sm"
                    style="width: 120px;"
                >
                    <span class="input-group-text border-2 rounded-start-4">
                        <i class="bi bi-star-fill text-warning" />
                    </span>
                    <input
                        v-model.number="subtask.pointValue"
                        type="number"
                        class="form-control form-control-sm border-2 rounded-end-4"
                        min="0"
                        max="100"
                        @input="updateSubtaskPoints"
                    >
                </div>
                <button
                    type="button"
                    class="btn btn-sm text-primary p-1 border-0"
                    @click="removeSubtask(index)"
                >
                    <i class="bi bi-trash" />
                </button>
            </div>
        </div>

        <!-- Add Subtask Button -->
        <button
            type="button"
            class="btn btn-outline-primary btn-sm rounded-4"
            @click="addSubtask"
        >
            + Add Subtask
        </button>
    </div>
</template>

<script setup lang="ts">
interface Subtask {
    description: string
    pointValue: number
}

const modelValue = defineModel<Subtask[]>()
const emit = defineEmits(['update:points'])

// Methods
const addSubtask = () => {
    modelValue.value = [ ...(modelValue.value || []), { description: '', pointValue: 1 } ]
    updateSubtaskPoints()
}

const removeSubtask = (index: number) => {
    modelValue.value = modelValue.value?.filter((_, i) => i !== index)
    updateSubtaskPoints()
}

const updateSubtaskPoints = () => {
    const total = modelValue.value?.reduce((sum, task) => sum + (task.pointValue || 0), 0) || 0
    emit('update:points', total)
}
</script>
