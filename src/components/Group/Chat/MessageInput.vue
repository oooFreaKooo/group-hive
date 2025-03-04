<template>
    <div class="d-flex flex-column position-relative p-3">
        <div
            v-if="replyingTo"
            class="position-absolute top-0 start-0 end-0 bg-light border-bottom px-3 py-2 rounded-top-4"
        >
            <div class="d-flex align-items-center justify-content-between">
                <span class="text-primary d-flex align-items-center">
                    <i class="bi bi-reply me-2" />
                    <span class="small">Replying to</span>
                    <span class="fw-semibold ms-1">{{ replyingTo.author.displayName }}</span>
                </span>
                <button
                    class="btn btn-sm p-0 text-secondary hover-danger transition-rotate"
                    @click="$emit('cancel-reply')"
                >
                    <i class="bi bi-x-lg" />
                </button>
            </div>
        </div>

        <div class="d-flex gap-3 align-items-end">
            <div class="flex-grow-1 position-relative">
                <textarea
                    ref="messageInput"
                    v-model="message"
                    class="form-control rounded-4 border-0 bg-light"
                    :class="{ 'focus-primary': message }"
                    :placeholder="replyingTo ? 'Write your reply...' : 'Type a message...'"
                    @keydown.enter.prevent="handleSend"
                    @input="handleInput"
                />
                <div
                    v-if="isSuggestionsVisible && filteredMembers.length > 0"
                    class="position-absolute bottom-100 start-0 end-0 mb-2 border rounded-4 shadow-sm overflow-hidden bg-white"
                >
                    <div
                        v-for="member in filteredMembers"
                        :key="member.id"
                        class="d-flex align-items-center px-3 py-2 cursor-pointer hover-bg-light transition"
                        @click="handleMentionSelect(member)"
                    >
                        <NuxtImg
                            class="rounded-circle me-2 border border-2"
                            :class="member.role === 'ADMIN' ? 'border-primary' : 'border-dark'"
                            width="24"
                            height="24"
                            :src="member.avatarUrl || '/images/default-avatar.png'"
                            :alt="member.displayName || 'User'"
                        />
                        <div class="d-flex flex-column">
                            <span class="fw-semibold">{{ member.displayName }}</span>
                            <span
                                v-if="member.role === 'ADMIN'"
                                class="text-primary small"
                            >Admin</span>
                        </div>
                    </div>
                </div>
            </div>
            <button
                class="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm transition"
                :class="{ 'opacity-50': !message.trim() }"
                style="width: 42px; height: 42px;"
                :disabled="!message.trim()"
                @click="handleSend"
            >
                <i class="bi bi-send-fill fs-5" />
            </button>
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

.transition-rotate {
    &:hover {
        transform: rotate(90deg);
    }
}

.hover-danger:hover {
    color: var(--bs-danger) !important;
}

.hover-bg-light {
    &:hover {
        background-color: var(--bs-light);
    }
}

.focus-primary:focus {
    background-color: white !important;
    box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.15);
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

    &:focus {
        background-color: white;
    }
}

.btn {
    &:hover:not(:disabled) {
        transform: translateY(-2px);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    i {
        transform: translateX(1px) rotate(-30deg);
    }

    &:hover:not(:disabled) i {
        transform: translateX(2px) rotate(-25deg);
    }
}

@media (prefers-reduced-motion: reduce) {
    .transition,
    .transition-rotate,
    .btn,
    textarea {
        transition: none;
    }

    .btn:hover:not(:disabled) {
        transform: none;
    }
}
</style>
