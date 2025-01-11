<template>
    <div class="task">
        <div class="task__tags">
            <span :class="['task__tag', `task__tag--${task.tag.type}`]">{{ task.tag.text }}</span>
            <button class="task__options">
                <i class="fas fa-ellipsis-h" />
            </button>
        </div>
        <p>{{ task.title }}</p>
        <div class="task__stats">
            <span>
                <time :datetime="task.dueDate">
                    <i class="fas fa-flag" />{{ formatDate(task.dueDate) }}
                </time>
            </span>
            <span><i class="fas fa-comment" />{{ task.comments }}</span>
            <span><i class="fas fa-paperclip" />{{ task.attachments }}</span>
            <span class="task__owner" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    task: Task
}>()

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    })
}
</script>

<style scoped lang="scss">
.task {
  cursor: move;
  background-color: var(--white);
  padding: 1rem;
  border-radius: 8px;
  width: 100%;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
  margin-bottom: 1rem;
  border: 3px dashed transparent;

  &:hover {
    box-shadow: rgba(99, 99, 99, 0.3) 0px 2px 8px 0px;
    border-color: rgba(162, 179, 207, 0.2) !important;
  }

  p {
    font-size: 15px;
    margin: 1.2rem 0;
  }

  &__tag {
    border-radius: 100px;
    padding: 2px 13px;
    font-size: 12px;

    &--copyright {
      color: var(--tag-4-text);
      background-color: var(--tag-4);
    }
    &--design {
      color: var(--tag-3-text);
      background-color: var(--tag-3);
    }
    &--illustration {
      color: var(--tag-2-text);
      background-color: var(--tag-2);
    }
  }

  &__tags {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__options {
    background: transparent;
    border: 0;
    color: var(--light-grey);
    font-size: 17px;
  }

  &__stats {
    position: relative;
    width: 100%;
    color: var(--light-grey);
    font-size: 12px;

    span:not(:last-of-type) {
      margin-right: 1rem;
    }

    i {
      margin-right: 5px;
    }
  }

  &__owner {
    width: 25px;
    height: 25px;
    border-radius: 100rem;
    background: var(--purple);
    position: absolute;
    display: inline-block;
    right: 0;
    bottom: 0;
  }
}

.task-hover {
  border: 3px dashed var(--light-grey) !important;
}
</style>
