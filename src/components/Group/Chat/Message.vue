<template>
    <div
        class="message py-2 position-relative transition"
        :class="{ 'ps-4': message.replyTo, 'own-message': isOwnMessage }"
    >
        <div
            class="d-flex gap-3 align-items-start position-relative transition"
            :class="{ 'flex-row-reverse': isOwnMessage }"
        >
            <NuxtImg
                ref="avatarRef"
                class="avatar flex-shrink-0 rounded-circle border-2 shadow-sm cursor-pointer transition"
                :class="isOwnMessage ? 'border-primary' : 'border-dark'"
                width="32"
                height="32"
                :src="message.author.avatarUrl || '/images/default-avatar.png'"
                :alt="message.author.displayName || 'User'"
                @click.stop="$emit('avatar-click', message.author)"
            />
            <div
                class="message-content d-flex flex-column gap-2 flex-grow-1"
                :class="{ 'align-items-end': isOwnMessage }"
            >
                <div
                    class="d-flex align-items-center gap-2"
                    :class="{ 'flex-row-reverse': isOwnMessage }"
                >
                    <span
                        class="author fw-semibold cursor-pointer small"
                        @click="$emit('mention-user', message.author)"
                    >{{ message.author.displayName }}</span>
                    <span class="small text-muted">{{ formattedDate }}</span>
                    <div class="message-actions ms-2">
                        <button
                            class="btn btn-sm p-0 text-muted menu-trigger d-flex align-items-center justify-content-center transition rounded-circle"
                            type="button"
                            @click.stop="isMenuOpen = !isMenuOpen"
                            @blur="startCloseTimeout()"
                        >
                            <i class="bi bi-three-dots-vertical" />
                        </button>
                        <div
                            class="dropdown-menu shadow-sm border rounded-3"
                            :class="{ 'show': isMenuOpen, 'dropdown-menu-end': isOwnMessage }"
                            @mousedown.prevent
                        >
                            <button
                                class="dropdown-item d-flex align-items-center fw-medium"
                                @click="$emit('reply', message); isMenuOpen = false"
                            >
                                <i class="bi bi-reply me-2" />
                                Reply
                            </button>
                            <template v-if="isOwnMessage">
                                <button
                                    class="dropdown-item d-flex align-items-center fw-medium"
                                    @click="$emit('edit', message); isMenuOpen = false"
                                >
                                    <i class="bi bi-pencil me-2" />
                                    Edit
                                </button>
                                <button
                                    class="dropdown-item d-flex align-items-center fw-medium text-danger"
                                    @click="$emit('delete', message); isMenuOpen = false"
                                >
                                    <i class="bi bi-trash me-2" />
                                    Delete
                                </button>
                            </template>
                        </div>
                    </div>
                </div>

                <div
                    v-if="message.replyTo"
                    class="reply-content mb-2"
                >
                    <div class="border-start border-4 border-primary-subtle p-2 bg-light small rounded-3">
                        <div class="fw-semibold text-primary-emphasis">
                            {{ message.replyTo.author.displayName }}
                        </div>
                        <div class="text-secondary">
                            {{ message.replyTo.content }}
                        </div>
                    </div>
                </div>

                <div
                    class="message-bubble position-relative"
                    :class="[
                        isOwnMessage ? 'bg-primary text-white' : 'bg-light border',
                        { 'rounded-4 p-4 border-2 shadow': isEditing },
                    ]"
                >
                    <template v-if="!isEditing">
                        <div :class="{ 'text-dark': !isOwnMessage }">
                            <span v-html="formattedContent" />
                            <span
                                v-if="message.isEdited"
                                class="edited-badge small opacity-75 ms-2 fst-italic"
                            >(edited)</span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="edit-container w-100">
                            <div class="fw-semibold mb-3 text-dark">
                                Edit message
                            </div>
                            <textarea
                                v-model="editContent"
                                class="form-control mb-3 rounded-3"
                                @keydown.enter.prevent="$emit('save-edit', editContent)"
                                @keydown.esc="$emit('cancel-edit')"
                            />
                            <div class="d-flex gap-2">
                                <button
                                    class="btn btn-sm btn-primary rounded-pill px-3"
                                    @click="$emit('save-edit', editContent)"
                                >
                                    Save changes
                                </button>
                                <button
                                    class="btn btn-sm btn-outline-secondary rounded-pill px-3"
                                    @click="$emit('cancel-edit')"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Prisma } from '@prisma/client'

type MessageWithAuthor = Prisma.MessageGetPayload<{
    include: {
        author: true
        replyTo: {
            include: {
                author: true
            }
        }
    }
}>

const props = defineProps<{
    message: MessageWithAuthor
    isEditing: boolean
}>()

defineEmits<{
    'avatar-click': [author: MessageWithAuthor['author']]
    'mention-user': [author: MessageWithAuthor['author']]
    'reply': [message: MessageWithAuthor]
    'edit': [message: MessageWithAuthor]
    'delete': [message: MessageWithAuthor]
    'save-edit': [content: string]
    'cancel-edit': []
}>()

const user = useSupabaseUser()
const editContent = ref(props.message.content)
const isMenuOpen = ref(false)
const { start: startCloseTimeout, stop: stopCloseTimeout } = useTimeoutFn(() => {
    isMenuOpen.value = false
}, 150)

onBeforeUnmount(() => {
    stopCloseTimeout()
})

const isOwnMessage = computed(() => {
    return props.message.authorId === user.value?.id
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
.message {
    &:hover {
        background-color: var(--bs-gray-100);
    }
}

.transition {
    transition: all 0.2s ease;
}

.cursor-pointer {
    cursor: pointer;
}

.avatar {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;

    &:hover {
        transform: scale(1.15);
        box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.15) !important;
    }
}

.message-content {
    max-width: 75%;
    min-width: 140px;
}

.author {
    &:hover {
        color: var(--bs-primary);
    }
}

.message-bubble {
    padding: 0.75rem 1rem;
    border-radius: 1rem 1rem 1rem 0.25rem;
    word-break: break-word;
}

.own-message .message-bubble {
    border-radius: 1rem 0.25rem 1rem 1rem;
}

.message-actions {
    --action-size: 1.75rem;
    opacity: 0;

    .menu-trigger {
        width: var(--action-size);
        height: var(--action-size);

        &:hover {
            background-color: var(--bs-gray-200);
            transform: translateY(-1px);
        }

        i {
            font-size: 1rem;
        }
    }

    .dropdown-menu {
        min-width: 180px;
        padding: 0.5rem;
        border-color: var(--bs-gray-200);

        .dropdown-item {
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.9rem;

            &:hover {
                background-color: var(--bs-light);
            }

            &.text-danger:hover {
                background-color: var(--bs-danger-subtle);
            }
        }
    }
}

.message:hover .message-actions {
    opacity: 1;
}

:deep(.mention) {
    font-weight: 600;
    cursor: pointer;
    padding: 0.15rem 0.4rem;
    border-radius: 0.5rem;
    background-color: rgba(var(--bs-primary-rgb), 0.1);

    .own-message & {
        color: var(--bs-white);
        background-color: rgba(255, 255, 255, 0.2);
    }

    &:hover {
        text-decoration: none;
        background-color: rgba(var(--bs-primary-rgb), 0.15);
    }
}

textarea {
    resize: vertical;
    min-height: 100px;
    border-color: var(--bs-gray-300);

    &:focus {
        border-color: var(--bs-primary);
        box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.15);
    }
}

.btn {
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
}
</style>
