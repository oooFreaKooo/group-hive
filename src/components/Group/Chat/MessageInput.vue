<template>
    <div class="input-container">
        <div
            v-if="replyingTo"
            class="reply-info position-absolute top-0 start-0 end-0"
        >
            <div class="d-flex align-items-center justify-content-between">
                <span class="text-primary">
                    <i class="bi bi-reply me-2" />
                    Replying to {{ replyingTo.author.profile.displayName }}
                </span>
                <button
                    class="btn btn-link btn-sm p-1"
                    @click="$emit('cancel-reply')"
                >
                    <i class="bi bi-x-lg" />
                </button>
            </div>
        </div>

        <div class="flex-grow-1 position-relative">
            <textarea
                ref="textareaRef"
                v-model="message"
                class="form-control"
                :placeholder="replyingTo ? 'Write your reply...' : 'Type a message...'"
                @keydown.enter.prevent="handleSend"
                @input="handleInput"
            />
            <div
                v-if="showMentionSuggestions && filteredMembers.length > 0"
                class="mention-suggestions"
            >
                <div
                    v-for="member in filteredMembers"
                    :key="member.id"
                    class="mention-item d-flex align-items-center"
                    @click="handleMentionSelect(member)"
                >
                    <NuxtImg
                        class="rounded-circle me-2"
                        width="24"
                        height="24"
                        :src="member.profile.avatarUrl || '/default-avatar.png'"
                        :alt="member.profile.displayName || 'User'"
                    />
                    <span>{{ member.profile.displayName }}</span>
                </div>
            </div>
        </div>
        <button
            class="btn btn-send"
            :disabled="!message.trim()"
            @click="handleSend"
        >
            <i class="bi bi-send-fill" />
        </button>
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
    replyingTo: MessageWithRelations | undefined
    members: Prisma.GroupUserGetPayload<{
        include: {
            profile: true
        }
    }>[]
}>()

const emit = defineEmits<{
    'send': [message: string]
    'cancel-reply': []
    'mention-suggestion': [suggestion: { startPosition: number, query: string }]
}>()

const message = ref('')
const cursorPosition = ref(0)
const showMentionSuggestions = ref(false)
const mentionQuery = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const filteredMembers = computed(() => {
    if (!mentionQuery.value) { return [] }
    return props.members.filter(member =>
        (member.profile.displayName || '').toLowerCase().includes(mentionQuery.value.toLowerCase()),
    )
})

const handleInput = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement
    cursorPosition.value = textarea.selectionStart

    // Check for @ symbol
    const text = textarea.value
    const lastAtSymbol = text.lastIndexOf('@', cursorPosition.value)

    if (lastAtSymbol !== -1) {
        // Check if there's a space before @ (or it's at the start)
        const charBeforeAt = lastAtSymbol > 0 ? text[lastAtSymbol - 1] : ' '
        if (charBeforeAt === ' ' || charBeforeAt === '\n') {
            const query = text.slice(lastAtSymbol + 1, cursorPosition.value)
            mentionQuery.value = query
            showMentionSuggestions.value = true
            emit('mention-suggestion', {
                startPosition: lastAtSymbol,
                query,
            })
            return
        }
    }

    showMentionSuggestions.value = false
    mentionQuery.value = ''
}

const handleMentionSelect = (member: Prisma.GroupUserGetPayload<{ include: { profile: true } }>) => {
    insertMention(member)
}

const handleSend = () => {
    if (!message.value.trim()) { return }
    emit('send', message.value)
    message.value = ''
}

const insertMention = (member: Prisma.GroupUserGetPayload<{ include: { profile: true } }>) => {
    const mention = `@[${member.profile.displayName}](${member.id})`
    const textarea = textareaRef.value

    if (textarea) {
        const currentPos = textarea.selectionStart
        const text = message.value
        const lastAtSymbol = text.lastIndexOf('@', currentPos)

        if (showMentionSuggestions.value) {
            // If suggestions are shown, replace from @ to cursor
            message.value = text.slice(0, lastAtSymbol) + mention + text.slice(currentPos) + ' '
        } else {
            // If clicked on name, insert at cursor
            message.value = text.slice(0, currentPos) + mention + ' ' + text.slice(currentPos)
        }

        // Focus and move cursor after mention and space
        nextTick(() => {
            textarea.focus()
            const newCursorPos = (lastAtSymbol !== -1 ? lastAtSymbol : currentPos) + mention.length + 1
            textarea.setSelectionRange(newCursorPos, newCursorPos)
        })
    }

    showMentionSuggestions.value = false
    mentionQuery.value = ''
}

defineExpose({
    insertMention,
})
</script>

<style scoped lang="scss">
.reply-info {
    background-color: rgba(var(--bs-primary-rgb), 0.03);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(var(--bs-primary-rgb), 0.1);
    padding: 0.75rem 1rem;
    margin: -0.5rem -0.5rem 0.5rem;
    border-radius: 1rem 1rem 0 0;

    .btn-link {
        color: var(--bs-gray-600);
        transition: all 0.2s;

        &:hover {
            color: var(--bs-danger);
            transform: rotate(90deg);
        }
    }
}

textarea {
    min-height: 44px;
    max-height: 150px;
    resize: vertical;
    border-radius: 1.25rem !important;
    padding: 0.75rem 1.25rem !important;
    border-width: 1px !important;
    line-height: 1.5;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    background-color: var(--bs-gray-100) !important;
    border-color: transparent !important;

    &:focus {
        background-color: white !important;
        border-color: var(--bs-primary) !important;
        box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.1);
    }

    &::placeholder {
        color: var(--bs-gray-500);
        font-size: 0.95rem;
    }
}

.mention-suggestions {
    position: absolute;
    bottom: 100%;
    left: 0.5rem;
    right: 0.5rem;
    margin-bottom: 0.5rem;
    background: white;
    border: 1px solid rgba(var(--bs-primary-rgb), 0.1);
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    backdrop-filter: blur(8px);
}

.mention-item {
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 0.75rem;
    margin: 0.25rem;
    padding: 0.5rem 0.75rem !important;

    img {
        border: 1px solid var(--bs-gray-200);
        transition: transform 0.2s;
    }

    &:hover {
        background-color: rgba(var(--bs-primary-rgb), 0.05);

        img {
            transform: scale(1.1);
        }
    }
}

.btn-send {
    --size: 44px;
    min-width: var(--size);
    width: var(--size);
    height: var(--size);
    padding: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bs-primary);
    border: none;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 2px 8px rgba(var(--bs-primary-rgb), 0.2);
    margin-bottom: 0.25rem;

    &:hover:not(:disabled) {
        transform: scale(1.1);
        background: var(--bs-primary);
        box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.3);
    }

    &:disabled {
        background: var(--bs-gray-300);
        opacity: 0.7;
    }

    i {
        font-size: 1.1rem;
        transform: translateX(1px) rotate(-30deg);
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    &:hover:not(:disabled) i {
        transform: translateX(2px) rotate(-25deg);
    }
}

.input-container {
    display: flex;
    gap: 0.75rem;
    padding: 0.5rem;
    border-top: 1px solid rgba(var(--bs-dark-rgb), 0.08);
    background: white;
    position: relative;
    margin-top: 0.5rem;
}
</style>
