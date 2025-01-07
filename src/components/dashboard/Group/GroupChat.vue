<template>
    <div class="group-chat">
        <div
            ref="messagesContainer"
            class="messages"
        >
            <div
                v-for="message in messages"
                :key="message.id"
                class="message"
            >
                <div class="message-header">
                    <NuxtImg
                        class="rounded-circle me-2"
                        width="24"
                        height="24"
                        :src="message.author.profile.avatarUrl || '/default-avatar.png'"
                        :alt="message.author.profile.displayName"
                    />
                    <span class="author-name">{{ message.author.profile.displayName }}</span>
                    <span class="message-time">{{ formatDate(message.createdAt) }}</span>
                </div>
                <div class="message-content">
                    {{ message.content }}
                </div>
            </div>
        </div>
        <div class="message-input">
            <input
                v-model="newMessage"
                type="text"
                placeholder="Type a message..."
                @keyup.enter="sendMessage"
            >
            <button
                class="send-button"
                :disabled="!newMessage.trim()"
                @click="sendMessage"
            >
                <i class="bi bi-send" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    groupId: number
}>()

interface Message {
    id: number
    content: string
    createdAt: string
    author: {
        profile: {
            displayName: string
            avatarUrl: string | null
        }
    }
}

const messages = ref<Message[]>([])
const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()

const { data: groupMessages } = await useFetch<Message[]>(`/api/chat/${props.groupId}`)
messages.value = groupMessages.value || []

const formatDate = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

const sendMessage = async () => {
    if (!newMessage.value.trim()) { return }

    const response = await $fetch(`/api/chat/${props.groupId}`, {
        method: 'POST',
        body: {
            content: newMessage.value,
        },
    })

    if (response) {
        messages.value.push(response as Message)
        newMessage.value = ''
        await nextTick()
        scrollToBottom()
    }
}

// Scroll to bottom on initial load
onMounted(() => {
    scrollToBottom()
})
</script>

<style scoped>
.group-chat {
    display: flex;
    flex-direction: column;
    height: 400px;
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
}

.message-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.25rem;
}

.author-name {
    font-weight: 500;
    margin-right: 0.5rem;
}

.message-time {
    color: var(--c-text-tertiary);
    font-size: 0.75rem;
}

.message-content {
    padding-left: 2rem;
}

.message-input {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-top: 1px solid var(--c-gray-600);
    gap: 0.5rem;
}

.message-input input {
    flex: 1;
    border: 1px solid var(--c-gray-600);
    border-radius: 4px;
    padding: 0.5rem;
    background: transparent;
}

.send-button {
    background: var(--c-gray-600);
    border: none;
    border-radius: 4px;
    padding: 0.5rem;
    color: var(--c-text-primary);
    cursor: pointer;
    transition: 0.25s ease;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &:not(:disabled):hover {
        background: var(--c-gray-700);
    }
}
</style>
