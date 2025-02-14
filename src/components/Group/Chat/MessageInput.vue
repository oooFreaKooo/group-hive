<template>
    <div class="d-flex flex-column bg-gradient bg-dark position-relative mt-2 p-3">
        <div
            v-if="replyingTo"
            class="position-absolute top-0 start-0 end-0 bg-gradient bg-dark backdrop-blur px-3 py-2 rounded-top-3"
        >
            <div class="d-flex align-items-center justify-content-between">
                <span class="text-primary">
                    <i class="bi bi-reply me-2" />
                    Replying to {{ replyingTo.author.displayName }}
                </span>
                <button
                    class="btn btn-link btn-sm p-1 text-body-tertiary hover-danger transition-rotate"
                    @click="$emit('cancel-reply')"
                >
                    <i class="bi bi-x-lg" />
                </button>
            </div>
        </div>

        <div class="d-flex gap-3">
            <div class="flex-grow-1 position-relative">
                <textarea
                    ref="messageInput"
                    v-model="message"
                    class="form-control rounded-4 py-2 px-3"
                    :class="{ 'focus-primary': message }"
                    :placeholder="replyingTo ? 'Write your reply...' : 'Type a message...'"
                    @keydown.enter.prevent="handleSend"
                    @input="handleInput"
                />
                <div
                    v-if="isSuggestionsVisible && filteredMembers.length > 0"
                    class="position-absolute bottom-100 start-2 end-2 mb-2 border border-primary-subtle rounded-3 shadow-sm overflow-auto max-h-200 backdrop-blur z-3"
                >
                    <div
                        v-for="member in filteredMembers"
                        :key="member.id"
                        class="d-flex align-items-center px-3 py-2 cursor-pointer rounded-2 mx-1 my-1 hover-primary-soft transition"
                        @click="handleMentionSelect(member)"
                    >
                        <NuxtImg
                            class="rounded-circle me-2 border border-gray-200 transition-transform"
                            width="24"
                            height="24"
                            :src="member.avatarUrl || '/default-avatar.png'"
                            :alt="member.displayName || 'User'"
                        />
                        <span>{{ member.displayName }}</span>
                    </div>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <AppIcon
                    class="transition-transform p-2 border"
                    name="send-fill"
                    :btn="message.trim() ? true : false"
                    size="md"
                    circle
                    :class="{ 'opacity-70': !message.trim(), 'hover-scale shadow-primary ': message.trim() }"
                    :disabled="!message.trim()"
                    @click="handleSend"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Prisma, Profile } from '@prisma/client'

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
    replyingTo: MessageWithAuthor | null
    members: Profile[]
}>()

const emit = defineEmits<{
    'send': [content: string]
    'cancel-reply': []
    'mention-suggestion': [suggestion: { startPosition: number, query: string }]
}>()

const messageInput = ref<HTMLTextAreaElement | null>(null)
const message = ref('')
const mentionSuggestions = ref<Profile[]>([])
const selectedSuggestionIndex = ref(0)
const isSuggestionsVisible = ref(false)
const lastMentionStartPosition = ref(0)

const filteredMembers = computed(() => {
    if (!mentionSuggestions.value.length) { return [] }
    return mentionSuggestions.value
})

const handleInput = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement
    const cursorPos = textarea.selectionStart
    const text = textarea.value
    const lastAtSymbol = text.lastIndexOf('@', cursorPos)

    if (lastAtSymbol !== -1) {
        // Check if there's a space before @ (or it's at the start)
        const charBeforeAt = lastAtSymbol > 0 ? text[lastAtSymbol - 1] : ' '
        if (charBeforeAt === ' ' || charBeforeAt === '\n') {
            const query = text.slice(lastAtSymbol + 1, cursorPos)
            lastMentionStartPosition.value = lastAtSymbol
            filterMentionSuggestions(query)
            emit('mention-suggestion', {
                startPosition: lastAtSymbol,
                query,
            })
            return
        }
    }

    isSuggestionsVisible.value = false
    mentionSuggestions.value = []
}

const handleMentionSelect = (member: Profile) => {
    insertMention(member)
}

const handleSend = () => {
    if (!message.value.trim()) { return }
    emit('send', message.value)
    message.value = ''
}

function filterMentionSuggestions (query: string) {
    mentionSuggestions.value = props.members.filter(member =>
        member.displayName?.toLowerCase().includes(query.toLowerCase()),
    )
    selectedSuggestionIndex.value = 0
    isSuggestionsVisible.value = mentionSuggestions.value.length > 0
}

function insertMention (member: Profile) {
    const textarea = messageInput.value
    if (!textarea) { return }

    const mention = `@[${member.displayName}](${member.id})`
    const beforeMention = message.value.slice(0, lastMentionStartPosition.value)
    const afterMention = message.value.slice(textarea.selectionStart)
    message.value = `${beforeMention}${mention}${afterMention}`

    isSuggestionsVisible.value = false
    mentionSuggestions.value = []

    // Set cursor position after the mention
    nextTick(() => {
        if (textarea) {
            const cursorPosition = lastMentionStartPosition.value + mention.length
            textarea.selectionStart = cursorPosition
            textarea.selectionEnd = cursorPosition
            textarea.focus()
        }
    })
}

defineExpose({
    insertMention,
})
</script>

<style scoped lang="scss">
.transition {
    transition: all 0.2s ease;
}

.transition-transform {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.transition-rotate {
    &:hover {
        transform: rotate(90deg);
    }
}

.backdrop-blur {
    backdrop-filter: blur(8px);
}

.hover-danger:hover {
    color: var(--bs-danger) !important;
}

.hover-primary-soft:hover {
    background-color: rgba(var(--bs-primary-rgb), 0.05);

    img {
        transform: scale(1.1);
    }
}

.hover-scale:hover:not(:disabled) {
    transform: scale(1.1);
}

.focus-primary:focus {
    box-shadow: 0 0 0.15rem 0.15rem rgba(var(--bs-primary-rgb), 0.1);
}

.shadow-primary {
    box-shadow: 0 2px 8px rgba(var(--bs-primary-rgb), 0.2);

    &:hover:not(:disabled) {
        box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.3);
    }
}

.max-h-200 {
    max-height: 200px;
}

.cursor-pointer {
    cursor: pointer;
}

.send-icon {
    transform: translateX(1px) rotate(-30deg);

    .btn:hover:not(:disabled) & {
        transform: translateX(2px) rotate(-25deg);
    }
}

textarea {
    min-height: 44px;
    max-height: 150px;
    resize: vertical;
    line-height: 1.5;
    font-size: 0.95rem;

    &::placeholder {
        color: var(--bs-gray-500);
        font-size: 0.95rem;
    }
}
</style>
