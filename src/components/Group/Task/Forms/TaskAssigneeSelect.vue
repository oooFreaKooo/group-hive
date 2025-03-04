<template>
    <div class="col-md-6">
        <label class="form-label d-flex align-items-center gap-2 mb-2">
            <i class="bi bi-person-fill text-primary" />
            <span class="fw-medium">Assignee</span>
        </label>
        <select
            v-model="modelValue"
            class="form-select form-select-sm rounded-4 border-2"
        >
            <option value="">
                Unassigned
            </option>
            <option
                v-for="member in members"
                :key="member.id"
                :value="member.id"
            >
                {{ member.displayName }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
interface Member {
    id: string
    displayName: string | null
}

defineProps<{
    members: Member[]
}>()

const modelValue = defineModel<string>()
</script>
