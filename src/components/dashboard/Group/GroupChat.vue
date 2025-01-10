<template>
    <div class="bg-body text-black h-100 d-flex flex-column">
        <div
            ref="messagesContainer"
            class="messages flex-grow-1 overflow-auto p-2"
        >
            <div
                v-for="message in messages"
                :key="message.id"
                class="message mb-2 border rounded shadow-sm"
                :class="{ 'is-reply': message.replyTo }"
            >
                <div class="d-flex align-items-center justify-content-between p-2">
                    <div class="d-flex align-items-center">
                        <NuxtImg
                            class="rounded-circle me-2 border border-secondary"
                            width="24"
                            height="24"
                            :src="message.author.profile.avatarUrl || '/default-avatar.png'"
                            :alt="message.author.profile.displayName || 'User'"
                        />
                        <span class="fw-medium">{{ message.author.profile.displayName }}</span>
                    </div>

                    <div class="message-actions d-flex align-items-center gap-2">
                        <button
                            class="btn btn-link btn-sm p-1 text-muted"
                            @click="replyTo(message)"
                        >
                            <i class="bi bi-reply" />
                        </button>
                        <div
                            v-if="isOwnMessage(message)"
                            class="message-menu d-flex"
                        >
                            <button
                                class="btn btn-link btn-sm p-1 text-muted"
                                @click="editMessage(message)"
                            >
                                <i class="bi bi-pencil" />
                            </button>
                            <button
                                class="btn btn-link btn-sm p-1 text-danger"
                                @click="deleteMessage(message)"
                            >
                                <i class="bi bi-trash" />
                            </button>
                        </div>
                        <span class="message-time small text-muted mx-2">{{ formatDate(message.createdAt) }}</span>
                    </div>
                </div>
                <div
                    v-if="message.replyTo"
                    class="ms-2 mb-2"
                >
                    <div class="border-start border-4 border-primary p-2 bg-secondary text-light small rounded ms-4">
                        <div class="fw-bold">
                            {{ message.replyTo.author.profile.displayName }}
                        </div>
                        <div>
                            {{ message.replyTo.content }}
                        </div>
                    </div>
                </div>

                <div class="d-flex align-items-center justify-content-between mb-1">
                    <div
                        class="ps-4"
                        :class="{ 'bg-secondary rounded p-2': editingMessage?.id === message.id }"
                    >
                        <template v-if="editingMessage?.id !== message.id">
                            <span class="ms-3">{{ formatMessageContent(message.content) }}</span>
                            <span
                                v-if="message.isEdited"
                                class="mx-2 small text-muted"
                            >(edited)</span>
                        </template>
                        <template v-else>
                            <div class="text-white p-2">
                                Edit message
                            </div>
                            <textarea
                                v-model="editContent"
                                class="form-control border-white mb-2"
                                @keydown.enter.prevent="saveEdit"
                                @keydown.esc="cancelEdit"
                            />
                            <div class="d-flex gap-2">
                                <button
                                    class="btn btn-sm btn-success"
                                    @click="saveEdit"
                                >
                                    Save
                                </button>
                                <button
                                    class="btn btn-sm btn-outline-warning"
                                    @click="cancelEdit"
                                >
                                    Cancel
                                </button>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div class=" p-3 border-top">
                <div
                    v-if="replyingTo"
                    class="reply-preview mb-2 p-2 bg-secondary rounded"
                >
                    <div class="reply-info d-flex align-items-center justify-content-between small text-muted">
                        <span>Replying to {{ replyingTo.author.profile.displayName }}</span>
                        <button
                            class="btn btn-link btn-sm p-1 text-muted"
                            @click="cancelReply"
                        >
                            <i class="bi bi-x" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex gap-2 position-relative px-2">
            <textarea
                v-model="newMessage"
                class="form-control bg-transparent border-secondary"
                :placeholder="replyingTo ? 'Write your reply...' : 'Type a message...'"
                @keydown.enter.prevent="sendMessage"
                @input="handleInput"
            />
            <button
                class="btn btn-secondary align-self-end"
                :disabled="!newMessage.trim()"
                @click="sendMessage"
            >
                <i class="bi bi-send" />
            </button>
        </div>
        <div
            v-if="showMentionSuggestions"
            class="position-absolute bottom-100 start-0 bg-secondary border border-secondary rounded mb-2 overflow-auto"
            style="width: 200px; max-height: 200px;"
        >
            <div
                v-for="member in filteredMembers"
                :key="member.id"
                class="d-flex align-items-center p-2 cursor-pointer hover-bg-secondary"
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
.messages {
    scrollbar-color: var(--bs-secondary-900) var(--bs-secondary-800);
    scrollbar-width: thin;
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

.message-textarea {
    min-height: 40px;
    max-height: 120px;
    resize: vertical;
}

:deep(.mention) {
    color: var(--bs-primary);
    font-weight: 500;
}

.hover-bg-secondary:hover {
    background-color: var(--bs-secondary);
}

.cursor-pointer {
    cursor: pointer;
}
</style>
