<template>
    <div class="chat-container d-flex flex-column rounded-5 shadow">
        <div class="p-3 bg-gradient bg-dark">
            <span class="fw-semibold text-light ">
                <i class="bi bi-chat-dots-fill mx-2" />
                Group Chat
            </span>
        </div>
        <div
            ref="messagesContainer"
            class="messages flex-grow-1 overflow-auto bg-light"
        >
            <div class="messages-wrapper">
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
import type { Prisma } from '@prisma/client'
import MessageInput from './MessageInput.vue'

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

const convertDates = (obj: any): any => {
    if (!obj) { return null }
    return Object.entries(obj).reduce((acc, [ key, value ]) => {
        if (key === 'createdAt' || key === 'updatedAt') {
            acc[key] = new Date(value as string)
        } else if (typeof value === 'object') {
            acc[key] = convertDates(value)
        } else {
            acc[key] = value
        }
        return acc
    }, {} as any)
}

const props = defineProps<{
    groupId: string
    messages: MessageWithRelations[]
    members: Prisma.GroupUserGetPayload<{
        include: {
            profile: true
        }
    }>[]
}>()

const messages = ref<MessageWithRelations[]>(props.messages)
const messagesContainer = ref<HTMLElement>()
const editingMessage = ref<MessageWithRelations | null>(null)
const replyingTo = ref<MessageWithRelations | undefined>()
const activeMember = ref<Prisma.GroupUserGetPayload<{ include: { profile: true } }> | null>(null)
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

    const response = await $fetch(`/api/chat/${props.groupId}`, {
        method: 'POST',
        body: {
            content,
            replyToId: replyingTo.value?.id,
        },
    })

    if (response) {
        messages.value.push(convertDates(response) as MessageWithRelations)
        replyingTo.value = undefined
        await nextTick()
        scrollToBottom()
    }
}

const editMessage = (message: MessageWithRelations) => {
    editingMessage.value = message
}

const saveEdit = async (content: string) => {
    if (!editingMessage.value || !content.trim()) { return }

    const response = await $fetch(`/api/chat/${props.groupId}/${editingMessage.value.id}`, {
        method: 'PUT',
        body: { content },
    })

    if (response) {
        const index = messages.value.findIndex(m => m.id === editingMessage.value?.id)
        if (index !== -1) {
            messages.value[index] = convertDates(response) as MessageWithRelations
        }
        editingMessage.value = null
    }
}

const cancelEdit = () => {
    editingMessage.value = null
}

const deleteMessage = async (message: MessageWithRelations) => {
    if (!confirm('Are you sure you want to delete this message?')) { return }

    await $fetch(`/api/chat/${props.groupId}/${message.id}`, {
        method: 'DELETE',
    })

    const index = messages.value.findIndex(m => m.id === message.id)
    if (index !== -1) {
        messages.value.splice(index, 1)
    }
}

const replyTo = (message: MessageWithRelations) => {
    replyingTo.value = message
}

const cancelReply = () => {
    replyingTo.value = undefined
}

const handleAvatarClick = (author: Prisma.GroupUserGetPayload<{ include: { profile: true } }>) => {
    activeMember.value = author
    setActivePopover(author.id)
}

const mentionUser = (member: Prisma.GroupUserGetPayload<{ include: { profile: true } }>) => {
    messageInputRef.value?.insertMention(member)
}

const handleMentionSuggestion = (_suggestion: { startPosition: number, query: string }) => {
    // This function is just a pass-through for the mention suggestion event
    // The actual handling is done in the MessageInput component
}

onMounted(() => {
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
.chat-container {
    height: 75vh;
    overflow: hidden;
    position: relative;
}

.messages {
    position: relative;

    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--bs-gray-300);
        border-radius: 3px;

        &:hover {
            background: var(--bs-gray-400);
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
</style>
