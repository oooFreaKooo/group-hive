<template>
    <div
        class="message py-2 my-2 position-relative transition"
        :class="{ 'ps-5': message.replyTo, 'own-message': isOwnMessage }"
    >
        <div
            class="d-flex gap-3 align-items-start position-relative transition"
            :class="{ 'flex-row-reverse': isOwnMessage }"
        >
            <NuxtImg
                ref="avatarRef"
                class="avatar flex-shrink-0 rounded-circle border border-2 border-secondary shadow-sm cursor-pointer transition"
                width="32"
                height="32"
                :src="message.author.profile.avatarUrl || '/default-avatar.png'"
                :alt="message.author.profile.displayName || 'User'"
                @click.stop="$emit('avatar-click', message.author)"
            />
            <div
                class="message-content d-flex flex-column gap-2 flex-grow-1"
                :class="{ 'align-items-end': isOwnMessage }"
            >
                <div class="d-flex align-items-center gap-3">
                    <div class="message-actions">
                        <button
                            class="btn btn-link btn-sm p-1 text-muted menu-trigger d-flex align-items-center justify-content-center transition"
                            type="button"
                            @click.stop="isMenuOpen = !isMenuOpen"
                            @blur="startCloseTimeout()"
                        >
                            <i class="bi bi-chevron-down" />
                        </button>
                        <div
                            class="dropdown-menu shadow-sm border"
                            :class="{ show: isMenuOpen }"
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
                    <span
                        class="author fw-semibold cursor-pointer"
                        @click="$emit('mention-user', message.author)"
                    >{{ message.author.profile.displayName }}</span>
                    <span class="small text-muted">{{ formattedDate }}</span>
                </div>

                <div
                    v-if="message.replyTo"
                    class="reply-content my-2"
                >
                    <div class="border-start border-4 border-primary p-2 bg-body-tertiary small rounded-3">
                        <div class="fw-bold">
                            {{ message.replyTo.author.profile.displayName }}
                        </div>
                        <div>
                            {{ message.replyTo.content }}
                        </div>
                    </div>
                </div>

                <div
                    class="message-bubble bg-primary shadow-sm position-relative"
                    :class="{ 'rounded-4 p-4 border border-2 border-primary shadow': isEditing }"
                >
                    <template v-if="!isEditing">
                        <div class="text-light w-100">
                            <span v-html="formattedContent" />
                            <span
                                v-if="message.isEdited"
                                class="edited-badge small opacity-75 ms-3 fst-italic"
                            >(edited)</span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="edit-container w-100">
                            <div class="fw-semibold mb-3">
                                Edit message
                            </div>
                            <textarea
                                v-model="editContent"
                                class="form-control mb-2 rounded-3 p-3"
                                @keydown.enter.prevent="$emit('save-edit', editContent)"
                                @keydown.esc="$emit('cancel-edit')"
                            />
                            <div class="d-flex gap-2">
                                <button
                                    class="btn btn-sm btn-success rounded-3 px-3 py-2"
                                    @click="$emit('save-edit', editContent)"
                                >
                                    Save
                                </button>
                                <button
                                    class="btn btn-sm btn-outline-warning rounded-3 px-3 py-2"
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

type MessageWithRelations = Prisma.MessageGetPayload<{
    include: {
        author: {
            include: {
                profile: true
            }
        }
        replyTo: {
            include: {
                author: {
                    include: {
                        profile: true
                    }
                }
            }
        }
    }
}>

const props = defineProps<{
    message: MessageWithRelations
    isEditing: boolean
}>()

defineEmits<{
    'avatar-click': [author: Prisma.GroupUserGetPayload<{ include: { profile: true } }>]
    'mention-user': [author: Prisma.GroupUserGetPayload<{ include: { profile: true } }>]
    'reply': [message: MessageWithRelations]
    'edit': [message: MessageWithRelations]
    'delete': [message: MessageWithRelations]
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
// Custom styles that can't be achieved with Bootstrap utilities
.message {
    &:hover {
        background-color: rgba(var(--bs-primary-rgb), 0.02);
    }
}

.transition {
    transition: all 0.3s ease;
}

.cursor-pointer {
    cursor: pointer;
}

.avatar {
    width: 2.5rem;
    height: 2.5rem;

    &:hover {
        transform: scale(1.15);
    }
}

.message-content {
    max-width: 75%;
    min-width: 140px;
}

.author:hover {
    text-decoration: underline;
}

.message-bubble {
    padding: 0.5rem 1rem;
    border-radius: 0 1.5rem 1.5rem 1.5rem;
    word-break: break-word;

    &::before {
        content: '';
        position: absolute;
        left: -0.75rem;
        top: 1rem;
        border: 0.75rem solid transparent;
    }
}

.own-message .message-bubble {
    border-radius: 1.5rem 0.25rem 1.5rem 1.5rem;

    &::before {
        display: none;
    }
}

.message-actions {
    --action-size: 1.75rem;
    opacity: 0;

    .menu-trigger {
        width: var(--action-size);
        height: var(--action-size);

        &:hover {
            transform: translateY(-1px);
        }

        i {
            font-size: 0.9rem;
        }
    }
}

.own-message .message-actions {
    right: auto;
    left: 0.25rem;
}

.message:hover .message-actions {
    opacity: 1;
}

.reply-content {
    max-width: 90%;

    .bg-body-tertiary {
        backdrop-filter: blur(8px);
        background-color: rgba(var(--bs-light-rgb), 0.85);
    }
}

:deep(.mention) {
    font-weight: 600;
    cursor: pointer;
    padding: 0.15rem 0.4rem;
    border-radius: 0.5rem;

    .own-message & {
        color: var(--bs-light);
        background-color: rgba(255, 255, 255, 0.25);
    }

    &:hover {
        text-decoration: underline;
        background-color: rgba(var(--bs-primary-rgb), 0.15);
    }
}

textarea {
    resize: vertical;
    min-height: 100px;

    &:focus {
        box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.15);
    }
}

.btn:hover {
    transform: translateY(-2px);
}
</style>
