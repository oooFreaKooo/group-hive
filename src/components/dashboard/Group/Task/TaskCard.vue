<template>
    <div class="border shadow-sm mb-3 rounded p-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="d-flex gap-2">
                <div
                    class="rounded-circle bg-primary"
                    style="width: 25px; height: 25px;"
                />
            </span>
            <button class="btn btn-link text-muted p-0">
                <i class="bi bi-three-dots" />
            </button>
        </div>

        <span
            :class="[
                'badge mb-2',
                {
                    'bg-info text-dark': task.tag.type === 'copyright',
                    'bg-primary': task.tag.type === 'design',
                    'bg-success': task.tag.type === 'illustration',
                },
            ]"
        >
            {{ task.tag.text }}
        </span>

        <div class="d-flex justify-content-between align-items-center text-muted small text-nowrap border-top pt-2">
            <span>
                <i class="bi bi-star-fill me-1 text-warning" />
                {{ task.points }}
            </span>
            <span>
                <i class="bi bi-chat-dots me-1" />
                {{ task.comments }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    task: Task
}>()
</script>
