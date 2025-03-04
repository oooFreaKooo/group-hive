<template>
    <div class="d-flex flex-column h-100">
        <div
            ref="messagesContainer"
            class="messages flex-grow-1 overflow-auto position-relative bg-white rounded-4 border mb-3"
        >
            <div
                v-if="status === 'pending'"
                class="loading-overlay rounded-4"
            >
                <div
                    class="spinner-border text-primary"
                    role="status"
                >
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div
                v-else
                class="messages-wrapper"
            >
                <Message
                    v-for="message in messages"
                    :key="message.id"
                    :message="message"
                    :is-editing="editingMessage?.id === message.id"
                    @avatar-click="handleAvatarClick"
                    @mention-user="mentionUser"
                    @reply="replyTo"
                    @edit="editMessage"
                    @delete="deleteMessage"
                    @save-edit="saveEdit"
                    @cancel-edit="cancelEdit"
                />
            </div>
        </div>

        <MessageInput
            ref="messageInputRef"
            :replying-to="replyingTo"
            :members="members"
            class="bg-white rounded-4 border shadow-sm"
            @send="sendMessage"
            @cancel-reply="cancelReply"
            @mention-suggestion="handleMentionSuggestion"
        />

        <MemberPopover
            v-if="activePopover !== null && activeMember"
            :member="activeMember"
            :style="popoverStyle"
        />
    </div>
</template>

<script setup lang="ts">
import type { Prisma, Profile } from '@prisma/client'
import MessageInput from './MessageInput.vue'

type MessageWithAuthor = Prisma.MessageGetPayload<{
    include: {
        author: {
            select: {
                id: true
                displayName: true
                email: true
                avatarUrl: true
                bgUrl: true
                role: true
                city: true
                postalCode: true
                createdAt: true
                updatedAt: true
                groupIds: true
            }
        }
        replyTo: {
            include: {
                author: {
                    select: {
                        id: true
                        displayName: true
                        email: true
                        avatarUrl: true
                        bgUrl: true
                        role: true
                        city: true
                        postalCode: true
                        createdAt: true
                        updatedAt: true
                        groupIds: true
                    }
                }
            }
        }
    }
}>

const props = defineProps<{
    groupId: string
    messages: MessageWithAuthor[]
    members: Profile[]
    status: string
}>()

const messages = ref<MessageWithAuthor[]>(props.messages)
const messagesContainer = ref<HTMLElement | null>(null)
const editingMessage = ref<MessageWithAuthor | null>(null)
const replyingTo = ref<MessageWithAuthor | null>(null)
const activeMember = ref<Profile | null>(null)
const popoverStyle = ref('')

const { activePopover, setActivePopover, handleClickOutside, handleEscKey } = usePopoverState()

const messageInputRef = ref<InstanceType<typeof MessageInput> | null>(null)

const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

const sendMessage = async (content: string) => {
    if (!content.trim()) { return }

    try {
        const response = await $fetch<MessageWithAuthor>(`/api/group/${props.groupId}/messages`, {
            method: 'POST',
            body: {
                content,
                replyToId: replyingTo.value?.id,
            },
        })

        messages.value.push(response)
        replyingTo.value = null
        await nextTick()
        scrollToBottom()
    } catch (error) {
        console.error('Failed to send message:', error)
    }
}

const editMessage = (message: MessageWithAuthor) => {
    editingMessage.value = message
}

const saveEdit = async (content: string) => {
    if (!editingMessage.value || !content.trim()) { return }

    try {
        const response = await $fetch<MessageWithAuthor>(`/api/group/${props.groupId}/messages/${editingMessage.value.id}`, {
            method: 'PUT',
            body: { content },
        })

        const index = messages.value.findIndex(m => m.id === editingMessage.value?.id)
        if (index !== -1) {
            messages.value[index] = response
        }
        editingMessage.value = null
    } catch (error) {
        console.error('Failed to edit message:', error)
    }
}

const cancelEdit = () => {
    editingMessage.value = null
}

const deleteMessage = async (message: MessageWithAuthor) => {
    if (!confirm('Are you sure you want to delete this message?')) { return }

    try {
        await $fetch(`/api/group/${props.groupId}/messages/${message.id}`, {
            method: 'DELETE',
        })

        const index = messages.value.findIndex(m => m.id === message.id)
        if (index !== -1) {
            messages.value.splice(index, 1)
        }
    } catch (error) {
        console.error('Failed to delete message:', error)
    }
}

const replyTo = (message: MessageWithAuthor) => {
    replyingTo.value = message
}

const cancelReply = () => {
    replyingTo.value = null
}

const handleAvatarClick = (author: MessageWithAuthor['author']) => {
    // Convert message author to Profile format
    const member: Profile = {
        id: author.id,
        displayName: author.displayName,
        email: author.email,
        avatarUrl: author.avatarUrl,
        bgUrl: author.bgUrl,
        role: author.role,
        city: author.city,
        postalCode: author.postalCode,
        createdAt: author.createdAt,
        updatedAt: author.updatedAt,
        groupIds: author.groupIds,
    }
    activeMember.value = member
    setActivePopover(author.id)
}

const mentionUser = (member: Profile) => {
    messageInputRef.value?.insertMention(member)
}

const handleMentionSuggestion = (_suggestion: { startPosition: number, query: string }) => {
    // This function is just a pass-through for the mention suggestion event
    // The actual handling is done in the MessageInput component
}

onMounted(() => {
    nextTick(() => {
        scrollToBottom()
    })
})

watch(() => props.messages, () => {
    nextTick(() => {
        scrollToBottom()
    })
}, { immediate: true })

onUpdated(() => {
    scrollToBottom()
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscKey)
})
</script>

<style scoped lang="scss">
.messages {
    position: relative;
    height: calc(75vh - 180px);

    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--bs-gray-300);
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: padding-box;

        &:hover {
            background: var(--bs-gray-400);
            border: 2px solid transparent;
            background-clip: padding-box;
        }
    }

    .messages-wrapper {
        padding: 1.5rem;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }
}

@supports (scrollbar-color: auto) {
    .messages {
        scrollbar-color: var(--bs-gray-300) transparent;
        scrollbar-width: thin;
    }
}

.loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    z-index: 1;
}
</style>
