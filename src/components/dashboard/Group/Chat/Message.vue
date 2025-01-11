<template>
    <div
        class="message mb-2 border rounded shadow-sm"
        :class="{ 'is-reply': message.replyTo }"
    >
        <div class="d-flex align-items-center justify-content-between p-2">
            <div class="d-flex align-items-center position-relative">
                <NuxtImg
                    ref="avatarRef"
                    class="rounded-circle me-2 border border-secondary"
                    width="24"
                    height="24"
                    :src="message.author.profile.avatarUrl || '/default-avatar.png'"
                    :alt="message.author.profile.displayName || 'User'"
                    @click.stop="$emit('avatar-click', message.author)"
                />
                <span
                    class="author fw-medium"
                    @click="$emit('mention-user', message.author)"
                >{{ message.author.profile.displayName }}</span>
            </div>
            <div class="message-actions d-flex align-items-center gap-2">
                <button
                    class="btn btn-link btn-sm p-1 text-muted"
                    @click="$emit('reply', message)"
                >
                    <i class="bi bi-reply" />
                </button>
                <div
                    v-if="isOwnMessage"
                    class="message-menu d-flex"
                >
                    <button
                        class="btn btn-link btn-sm p-1 text-muted"
                        @click="$emit('edit', message)"
                    >
                        <i class="bi bi-pencil" />
                    </button>
                    <button
                        class="btn btn-link btn-sm p-1 text-danger"
                        @click="$emit('delete', message)"
                    >
                        <i class="bi bi-trash" />
                    </button>
                </div>
                <span class="message-time small text-muted mx-2">{{ formattedDate }}</span>
            </div>
        </div>
        <div
            v-if="message.replyTo"
            class="ms-2 mb-2"
        >
            <div class="border-start border-4 border-primary p-2 bg-body-tertiary small rounded ms-4">
                <div class="fw-bold">
                    {{ message.replyTo.author.profile.displayName }}
                </div>
                <div>
                    {{ message.replyTo.content }}
                </div>
            </div>
        </div>

        <div
            class="mb-1"
            :class="{ 'bg-body-tertiary border rounded p-1 ms-4 mb-2': isEditing }"
        >
            <template v-if="!isEditing">
                <span
                    class="ms-3 ps-4"
                    v-html="formattedContent"
                />
                <span
                    v-if="message.isEdited"
                    class="m-2 badge text-muted"
                >(edited)</span>
            </template>
            <template v-else>
                <div class="px-2">
                    <div class="p-2">
                        Edit message
                    </div>
                    <textarea
                        v-model="editContent"
                        class="form-control mb-2"
                        @keydown.enter.prevent="$emit('save-edit', editContent)"
                        @keydown.esc="$emit('cancel-edit')"
                    />
                    <div class="d-flex gap-2">
                        <button
                            class="btn btn-sm btn-success"
                            @click="$emit('save-edit', editContent)"
                        >
                            Save
                        </button>
                        <button
                            class="btn btn-sm btn-outline-warning"
                            @click="$emit('cancel-edit')"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Message, GroupUser } from './types'

const props = defineProps<{
    message: Message
    isEditing: boolean
}>()

defineEmits<{
    'avatar-click': [author: GroupUser]
    'mention-user': [author: GroupUser]
    'reply': [message: Message]
    'edit': [message: Message]
    'delete': [message: Message]
    'save-edit': [content: string]
    'cancel-edit': []
}>()

const user = useSupabaseUser()
const editContent = ref(props.message.content)

const isOwnMessage = computed(() => {
    return props.message.author.profile.id === user.value?.id
})

const formattedDate = computed(() => {
    return new Date(props.message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

const formattedContent = computed(() => {
    // Replace mentions with styled spans
    return props.message.content.replace(/@\[([^\]]+)\]\((\d+)\)/g, (match, name, id) => {
        return `<span class="mention fw-bold" data-user-id="${id}">${name}</span>`
    })
})
</script>

<style scoped lang="scss">
img {
    cursor: pointer;
}

.author {
    cursor: pointer;
}

.message-time {
    opacity: 1 !important;
    transition: none;
}

.message-actions > *:not(.message-time) {
    opacity: 0;
    transition: opacity 0.2s;
}

.message:hover .message-actions > *:not(.message-time) {
    opacity: 1;
}

.message-actions {
    opacity: 1;
    transition: none;
}

:deep(.mention) {
    color: var(--bs-primary);
    font-weight: 500;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
}
</style>
