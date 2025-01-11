<template>
    <div class="chat-container bg-body text-black d-flex flex-column border rounded">
        <div
            ref="messagesContainer"
            class="messages flex-grow-1 overflow-auto p-2"
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
import type { Message, GroupUser, MentionSuggestion } from './types'
import MessageInput from './MessageInput.vue'

const props = defineProps<{
    groupId: number
}>()

const messages = ref<Message[]>([])
const messagesContainer = ref<HTMLElement>()
const editingMessage = ref<Message | null>(null)
const replyingTo = ref<Message | null>(null)
const activeMember = ref<GroupUser | null>(null)
const popoverStyle = ref('')

const { activePopover, setActivePopover, handleClickOutside, handleEscKey } = usePopoverState()

const messageInputRef = ref<InstanceType<typeof MessageInput> | null>(null)

// Fetch initial messages
const { data: groupMessages } = await useFetch<Message[]>(`/api/chat/${props.groupId}`)
messages.value = groupMessages.value || []

// Fetch group members
const { data: groupData } = await useFetch('/api/group/get', {
    transform: (data) => {
        return {
            ...data,
            members: data.members[0]?.members.map((member: any) => ({
                ...member,
                profile: member.profile || { displayName: 'Unknown', id: member.profileId },
            })),
        }
    },
})
const members = ref<GroupUser[]>(groupData.value?.members || [])

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
        messages.value.push(response as unknown as Message)
        replyingTo.value = null
        await nextTick()
        scrollToBottom()
    }
}

const editMessage = (message: Message) => {
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
            messages.value[index] = response as unknown as Message
        }
        editingMessage.value = null
    }
}

const cancelEdit = () => {
    editingMessage.value = null
}

const deleteMessage = async (message: Message) => {
    if (!confirm('Are you sure you want to delete this message?')) { return }

    await $fetch(`/api/chat/${props.groupId}/${message.id}`, {
        method: 'DELETE',
    })

    const index = messages.value.findIndex(m => m.id === message.id)
    if (index !== -1) {
        messages.value.splice(index, 1)
    }
}

const replyTo = (message: Message) => {
    replyingTo.value = message
}

const cancelReply = () => {
    replyingTo.value = null
}

const handleAvatarClick = (author: GroupUser) => {
    activeMember.value = author
    setActivePopover(author.id)
}

const mentionUser = (member: GroupUser) => {
    messageInputRef.value?.insertMention(member)
}

const handleMentionSuggestion = (_suggestion: MentionSuggestion) => {
    // We don't need to handle this in the parent as it's handled in MessageInput
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
    max-height: 800px;
}

.messages {
    scrollbar-color: var(--bs-secondary-900) var(--bs-secondary-800);
    scrollbar-width: thin;
}
</style>
