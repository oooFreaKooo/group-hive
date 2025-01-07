<template>
    <h2 class="mt-3">
        Group Chat
    </h2>
    <div class="group-chat">
        <div
            ref="messagesContainer"
            class="messages"
        >
            <div
                v-for="message in messages"
                :key="message.id"
                class="message"
                :class="{ 'is-reply': message.replyTo }"
            >
                <div
                    v-if="message.replyTo"
                    class="reply-to"
                >
                    <div class="reply-content card py-1 px-2">
                        <span class="fw-bold">{{ message.replyTo.author.profile.displayName }}</span>
                        {{ message.replyTo.content }}
                    </div>
                </div>
                <div class="message-header">
                    <div class="message-author">
                        <NuxtImg
                            class="rounded-circle me-2"
                            width="24"
                            height="24"
                            :src="message.author.profile.avatarUrl || '/default-avatar.png'"
                            :alt="message.author.profile.displayName || 'User'"
                        />
                        <span class="author-name">{{ message.author.profile.displayName }}</span>
                        <span
                            v-if="message.isEdited"
                            class="edited-badge"
                        >(edited)</span>
                    </div>
                    <div class="message-actions">
                        <span class="message-time">{{ formatDate(message.createdAt) }}</span>
                        <button
                            class="action-button"
                            @click="replyTo(message)"
                        >
                            <i class="bi bi-reply" />
                        </button>
                        <div
                            v-if="isOwnMessage(message)"
                            class="message-menu"
                        >
                            <button
                                class="action-button"
                                @click="editMessage(message)"
                            >
                                <i class="bi bi-pencil" />
                            </button>
                            <button
                                class="action-button text-danger"
                                @click="deleteMessage(message)"
                            >
                                <i class="bi bi-trash" />
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    class="message-content"
                    :class="{ editing: editingMessage?.id === message.id }"
                >
                    <template v-if="editingMessage?.id === message.id">
                        <textarea
                            v-model="editContent"
                            class="edit-input"
                            @keydown.enter.prevent="saveEdit"
                            @keydown.esc="cancelEdit"
                        />
                        <div class="edit-actions">
                            <button
                                class="btn btn-sm btn-primary"
                                @click="saveEdit"
                            >
                                Save
                            </button>
                            <button
                                class="btn btn-sm btn-secondary"
                                @click="cancelEdit"
                            >
                                Cancel
                            </button>
                        </div>
                    </template>
                    <template v-else>
                        <span v-html="formatMessageContent(message.content)" />
                    </template>
                </div>
            </div>
        </div>
        <div class="message-input">
            <div
                v-if="replyingTo"
                class="reply-preview"
            >
                <div class="reply-info">
                    <span>Replying to {{ replyingTo.author.profile.displayName }}</span>
                    <button
                        class="close-button"
                        @click="cancelReply"
                    >
                        <i class="bi bi-x" />
                    </button>
                </div>
            </div>
            <div class="input-container">
                <textarea
                    v-model="newMessage"
                    class="message-textarea"
                    :placeholder="replyingTo ? 'Write your reply...' : 'Type a message...'"
                    @keydown.enter.prevent="sendMessage"
                    @input="handleInput"
                />
                <button
                    class="send-button"
                    :disabled="!newMessage.trim()"
                    @click="sendMessage"
                >
                    <i class="bi bi-send" />
                </button>
            </div>
            <div
                v-if="showMentionSuggestions"
                class="mention-suggestions"
            >
                <div
                    v-for="member in filteredMembers"
                    :key="member.id"
                    class="mention-item"
                    @click="selectMention(member)"
                >
                    <NuxtImg
                        class="rounded-circle me-2"
                        width="20"
                        height="20"
                        :src="member.profile.avatarUrl || '/default-avatar.png'"
                        :alt="member.profile.displayName || 'User'"
                    />
                    <span>{{ member.profile.displayName }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Profile {
    id: string
    displayName: string | null
    avatarUrl: string | null
}

interface GroupUser {
    id: number
    profile: Profile
}

interface Message {
    id: number
    content: string
    groupId: number
    authorId: number
    createdAt: string
    updatedAt: string
    isEdited: boolean
    replyToId: number | null
    author: GroupUser
    replyTo: Message | null
}

const props = defineProps<{
    groupId: number
}>()

const messages = ref<Message[]>([])
const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()
const editingMessage = ref<Message | null>(null)
const editContent = ref('')
const replyingTo = ref<Message | null>(null)
const mentionQuery = ref('')
const showMentionSuggestions = ref(false)
const cursorPosition = ref(0)

const { data: groupMessages } = await useFetch<Message[]>(`/api/chat/${props.groupId}`)
messages.value = groupMessages.value || []

const { data: groupMembers } = await useFetch<GroupUser[]>(`/api/group/${props.groupId}/members`)
const members = ref(groupMembers.value || [])

const user = useSupabaseUser()

const isOwnMessage = (message: Message) => {
    return message.author.profile.id === user.value?.id
}

const filteredMembers = computed(() => {
    if (!mentionQuery.value) { return [] }
    return members.value.filter(member =>
        (member.profile.displayName || '').toLowerCase().includes(mentionQuery.value.toLowerCase()),
    )
})

const formatDate = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

const formatMessageContent = (content: string) => {
    // Replace mentions with styled spans
    return content.replace(/@\[([^\]]+)\]\((\d+)\)/g, '<span class="mention">@$1</span>')
}

const handleInput = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement
    cursorPosition.value = textarea.selectionStart

    // Check for @ symbol
    const text = newMessage.value
    const lastAtSymbol = text.lastIndexOf('@', cursorPosition.value)
    if (lastAtSymbol !== -1) {
        const query = text.slice(lastAtSymbol + 1, cursorPosition.value)
        if (query) {
            mentionQuery.value = query
            showMentionSuggestions.value = true
        }
    } else {
        showMentionSuggestions.value = false
    }
}

const selectMention = (member: GroupUser) => {
    const text = newMessage.value
    const lastAtSymbol = text.lastIndexOf('@', cursorPosition.value)
    const mention = `@[${member.profile.displayName}](${member.id})`
    newMessage.value = text.slice(0, lastAtSymbol) + mention + text.slice(cursorPosition.value)
    showMentionSuggestions.value = false
}

const sendMessage = async () => {
    if (!newMessage.value.trim()) { return }

    const response = await $fetch(`/api/chat/${props.groupId}`, {
        method: 'POST',
        body: {
            content: newMessage.value,
            replyToId: replyingTo.value?.id,
        },
    })

    if (response) {
        messages.value.push(response as unknown as Message)
        newMessage.value = ''
        replyingTo.value = null
        await nextTick()
        scrollToBottom()
    }
}

const editMessage = (message: Message) => {
    editingMessage.value = message
    editContent.value = message.content
}

const saveEdit = async () => {
    if (!editingMessage.value || !editContent.value.trim()) { return }

    const response = await $fetch(`/api/chat/${props.groupId}/${editingMessage.value.id}`, {
        method: 'PUT',
        body: {
            content: editContent.value,
        },
    })

    if (response) {
        const index = messages.value.findIndex(m => m.id === editingMessage.value?.id)
        if (index !== -1) {
            messages.value[index] = response as unknown as Message
        }
        editingMessage.value = null
        editContent.value = ''
    }
}

const cancelEdit = () => {
    editingMessage.value = null
    editContent.value = ''
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

// Scroll to bottom on initial load
onMounted(() => {
    scrollToBottom()
})
</script>

<style scoped lang="scss">
.group-chat {
    display: flex;
    flex-direction: column;
    height: 600px;
    margin-top: 1.5rem;
    border: 1px solid var(--c-gray-600);
    border-radius: 8px;
}

.messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
}

.message {
    margin-bottom: 1rem;
    &.is-reply {
        margin-top: 0.5rem;
    }
}

.reply-to {
    margin-bottom: 0.5rem;
    padding-left: 0.5rem;
    border-left: 2px solid var(--c-gray-600);
}

.reply-content {
    font-size: 0.875rem;
    background: var(--c-gray-700);
    color: var(--c-text-tertiary);
}

.message-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.25rem;
}

.message-author {
    display: flex;
    align-items: center;
}

.author-name {
    font-weight: 500;
    margin-right: 0.5rem;
}

.edited-badge {
    font-size: 0.75rem;
    color: var(--c-text-tertiary);
}

.message-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity 0.2s;
}

.message:hover .message-actions {
    opacity: 1;
}

.message-time {
    color: var(--c-text-tertiary);
    font-size: 0.75rem;
}

.action-button {
    background: transparent;
    border: none;
    padding: 0.25rem;
    color: var(--c-text-tertiary);
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: var(--c-text-primary);
    }
}

.message-content {
    padding-left: 2rem;
    &.editing {
        padding: 0.5rem;
        background: var(--c-gray-700);
        border-radius: 4px;
    }
}

.edit-input {
    width: 100%;
    min-height: 60px;
    background: transparent;
    border: 1px solid var(--c-gray-600);
    border-radius: 4px;
    padding: 0.5rem;
    color: var(--c-text-primary);
    resize: vertical;
}

.edit-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.message-input {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border-top: 1px solid var(--c-gray-600);
}

.reply-preview {
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    background: var(--c-gray-700);
    border-radius: 4px;
}

.reply-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.875rem;
    color: var(--c-text-tertiary);
}

.close-button {
    background: transparent;
    border: none;
    color: var(--c-text-tertiary);
    cursor: pointer;
    padding: 0.25rem;

    &:hover {
        color: var(--c-text-primary);
    }
}

.input-container {
    display: flex;
    gap: 0.5rem;
    position: relative;
}

.message-textarea {
    flex: 1;
    min-height: 40px;
    max-height: 120px;
    background: transparent;
    border: 1px solid var(--c-gray-600);
    border-radius: 4px;
    padding: 0.5rem;
    color: var(--c-text-primary);
    resize: vertical;
}

.send-button {
    background: var(--c-gray-600);
    border: none;
    border-radius: 4px;
    padding: 0.5rem;
    color: var(--c-text-primary);
    cursor: pointer;
    transition: 0.25s ease;
    align-self: flex-end;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &:not(:disabled):hover {
        background: var(--c-gray-700);
    }
}

.mention-suggestions {
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 200px;
    max-height: 200px;
    overflow-y: auto;
    background: var(--c-gray-700);
    border: 1px solid var(--c-gray-600);
    border-radius: 4px;
    margin-bottom: 0.5rem;
}

.mention-item {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background: var(--c-gray-600);
    }
}

:deep(.mention) {
    color: var(--c-primary);
    font-weight: 500;
}
</style>
