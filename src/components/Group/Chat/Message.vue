<template>
    <div
        class="message mb-2"
        :class="{ 'is-reply': message.replyTo }"
    >
        <div
            class="message-container"
            :class="{ 'own-message': isOwnMessage }"
        >
            <NuxtImg
                ref="avatarRef"
                class="avatar rounded-circle border border-secondary"
                width="32"
                height="32"
                :src="message.author.profile.avatarUrl || '/default-avatar.png'"
                :alt="message.author.profile.displayName || 'User'"
                @click.stop="$emit('avatar-click', message.author)"
            />
            <div class="message-content">
                <div class="message-header">
                    <span
                        class="author fw-medium"
                        @click="$emit('mention-user', message.author)"
                    >{{ message.author.profile.displayName }}</span>
                    <span class="message-time small text-muted">{{ formattedDate }}</span>
                </div>
                <div class="message-actions">
                    <div class="dropdown">
                        <button
                            class="btn btn-link btn-sm p-1 text-muted menu-trigger"
                            type="button"
                            @click.stop="isMenuOpen = !isMenuOpen"
                            @blur="startCloseTimeout()"
                        >
                            <i class="bi bi-chevron-down" />
                        </button>
                        <div
                            class="dropdown-menu"
                            :class="{ show: isMenuOpen }"
                            @mousedown.prevent
                        >
                            <button
                                class="dropdown-item"
                                @click="$emit('reply', message); isMenuOpen = false"
                            >
                                <i class="bi bi-reply me-2" />
                                Reply
                            </button>
                            <template v-if="isOwnMessage">
                                <button
                                    class="dropdown-item"
                                    @click="$emit('edit', message); isMenuOpen = false"
                                >
                                    <i class="bi bi-pencil me-2" />
                                    Edit
                                </button>
                                <button
                                    class="dropdown-item text-danger"
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
                    class="reply-content"
                >
                    <div class="border-start border-4 border-primary p-2 bg-body-tertiary small rounded">
                        <div class="fw-bold">
                            {{ message.replyTo.author.profile.displayName }}
                        </div>
                        <div>
                            {{ message.replyTo.content }}
                        </div>
                    </div>
                </div>

                <div
                    class="message-bubble"
                    :class="{ editing: isEditing }"
                >
                    <template v-if="!isEditing">
                        <div class="bubble-content">
                            <span v-html="formattedContent" />
                            <span
                                v-if="message.isEdited"
                                class="edited-badge"
                            >(edited)</span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="edit-container">
                            <div class="edit-header">
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
.message {
    --bubble-bg: var(--bs-gray-100);
    --bubble-color: var(--bs-gray-800);
    position: relative;
    transition: all 0.3s ease;
    padding: 0.5rem 1rem;
    margin: 0.5rem 0;

    &:hover {
        background-color: rgba(var(--bs-primary-rgb), 0.02);
    }

    &.is-reply {
        margin-left: 2rem;
    }
}

.message-container {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    position: relative;
    transition: all 0.3s;

    &.own-message {
        flex-direction: row-reverse;

        .message-content {
            align-items: flex-end;
        }

        .message-bubble {
            background: linear-gradient(135deg, var(--bs-primary) 0%, #{adjust-color(#0d6efd, $lightness: -10%)});
            color: white;
            border-radius: 1.5rem 0.25rem 1.5rem 1.5rem;
            box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.15);

            &::before {
                display: none;
            }
        }
    }
}

.avatar {
    cursor: pointer;
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-width: 2px !important;

    &:hover {
        transform: scale(1.15);
    }
}

.message-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 75%;
    min-width: 140px;
    flex: 1;
}

.message-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 0.5rem;
}

.author {
    cursor: pointer;
    font-weight: 600;
    color: var(--bs-primary);
    transition: color 0.2s;

    &:hover {
        color: #{adjust-color(#0d6efd, $lightness: -15%)};
        text-decoration: underline;
    }
}

.message-bubble {
    position: relative;
    background-color: var(--bubble-bg);
    color: var(--bubble-color);
    padding: 0.5rem 1rem;
    border-radius: 0 1.5rem 1.5rem 1.5rem;
    word-break: break-word;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s;

    .bubble-content {
        width: 100%;
    }

    &::before {
        content: '';
        position: absolute;
        left: -0.75rem;
        top: 1rem;
        border: 0.75rem solid transparent;
        border-right-color: var(--bubble-bg);
        transition: transform 0.2s;
    }

    &.editing {
        background-color: white;
        border-radius: 1.5rem;
        padding: 1.5rem;
        border: 2px solid var(--bs-primary);
        box-shadow: 0 4px 16px rgba(var(--bs-primary-rgb), 0.1);

        &::before {
            display: none;
        }
    }
}

.message-actions {
    --action-size: 1.75rem;
    position: absolute;
    top: 0;
    left: 100%;
    opacity: 0;
    transition: all 0.2s ease;

    .dropdown {
        position: relative;
    }

    .menu-trigger {
        width: var(--action-size);
        height: var(--action-size);
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        color: var(--bs-gray-500);
        transition: all 0.2s;

        &:hover {
            color: var(--bs-primary);
            transform: translateY(-1px);
        }

        i {
            font-size: 0.9rem;
        }
    }

    .dropdown-menu {
        position: absolute;
        right: 0;
        top: 100%;
        margin-top: 0.25rem;
        min-width: 9rem;
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border: 1px solid var(--bs-gray-200);
        opacity: 0;
        pointer-events: none;
        transform: translateY(-5px);
        transition: all 0.2s ease;
        z-index: 1000;

        &.show {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0);
        }
    }

    .dropdown-item {
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        color: var(--bs-gray-700);
        font-weight: 500;
        font-size: 0.9rem;
        transition: all 0.2s;

        &:first-child {
            border-radius: 0.75rem 0.75rem 0 0;
        }

        &:last-child {
            border-radius: 0 0 0.75rem 0.75rem;
        }

        &:hover {
            background-color: var(--bs-gray-100);
            color: var(--bs-primary);
        }

        &.text-danger {
            color: var(--bs-danger);

            &:hover {
                background-color: var(--bs-danger-bg-subtle);
            }
        }

        i {
            font-size: 0.9rem;
            width: 1.5em;
            text-align: center;
        }
    }
}

.message-container.own-message {
    .message-actions {
        right: auto;
        left: 0.25rem;
    }

    .dropdown-menu {
        right: auto;
        left: 0;
    }
}

.message:hover .message-actions {
    opacity: 1;
}

.reply-content {
    margin: 0.5rem 0;
    max-width: 90%;

    .border-primary {
        --bs-border-opacity: 0.4;
    }

    .bg-body-tertiary {
        backdrop-filter: blur(8px);
        background-color: rgba(var(--bs-light-rgb), 0.85);
        border-radius: 1rem;
    }
}

.edited-badge {
    font-size: 0.75rem;
    opacity: 0.7;
    margin-left: 0.75rem;
    font-style: italic;
}

:deep(.mention) {
    color: var(--bs-primary);
    font-weight: 600;
    cursor: pointer;
    padding: 0.15rem 0.4rem;
    background-color: rgba(var(--bs-primary-rgb), 0.1);
    border-radius: 0.5rem;
    transition: all 0.2s;

    .own-message & {
        color: var(--bs-light);
        background-color: rgba(255, 255, 255, 0.25);
    }

    &:hover {
        text-decoration: underline;
        background-color: rgba(var(--bs-primary-rgb), 0.15);
    }
}

.edit-container {
    width: 100%;

    .edit-header {
        margin-bottom: 1rem;
        font-weight: 600;
        color: var(--bs-primary);
    }

    textarea {
        border-color: var(--bs-gray-300);
        transition: all 0.3s;
        resize: vertical;
        min-height: 100px;
        border-radius: 1rem;
        padding: 1rem;

        &:focus {
            border-color: var(--bs-primary);
            box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.15);
        }
    }

    .btn {
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        border-radius: 0.75rem;
        padding: 0.5rem 1rem;

        &:hover {
            transform: translateY(-2px);
        }
    }
}
</style>
