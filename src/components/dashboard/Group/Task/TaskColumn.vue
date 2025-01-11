<template>
    <div
        class="project-column"
        @dragover.prevent
        @drop="handleDrop"
    >
        <div class="project-column-heading">
            <h2 class="project-column-heading__title">
                {{ title }}
            </h2>
            <button class="project-column-heading__options">
                <i class="fas fa-ellipsis-h" />
            </button>
        </div>

        <TaskCard
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            @dragstart="handleDragStart"
            @dragend="$emit('dragend')"
        />
    </div>
</template>

<script setup lang="ts">
interface DragEvent extends Event {
    dataTransfer: DataTransfer | null
    target: EventTarget | null
}

const props = defineProps<{
    title: string
    tasks: Task[]
    columnIndex: number
}>()

const emit = defineEmits<{
    dragstart: [event: DragEvent, task: Task]
    dragend: []
    drop: [columnIndex: number, event: DragEvent]
}>()

const handleDragStart = (event: DragEvent, task: Task) => {
    emit('dragstart', event, task)
}

const handleDrop = (event: DragEvent) => {
    emit('drop', props.columnIndex, event)
}
</script>

<style scoped lang="scss">
.project-column {
  &-heading {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__title {
      font-size: 20px;
    }

    &__options {
      background: transparent;
      color: var(--light-grey);
      font-size: 18px;
      border: 0;
      cursor: pointer;
    }
  }
}
</style>
