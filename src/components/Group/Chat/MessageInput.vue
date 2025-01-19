<template>
    <div class="d-flex gap-2 position-relative pt-4 my-2 p-2 border-top">
        <div
            v-if="replyingTo"
            class="reply-info position-absolute top-0 start-0 end-0 p-2 bg-body-tertiary border-bottom"
        >
            <div class="d-flex align-items-center justify-content-between small text-muted">
                <span>Replying to {{ replyingTo.author.profile.displayName }}</span>
                <button
                    class="btn btn-link btn-sm p-1 text-muted"
                    @click="$emit('cancel-reply')"
                >
                    <i class="bi bi-x" />
                </button>
            </div>
        </div>

        <div class="flex-grow-1 position-relative">
            <textarea
                ref="textareaRef"
                v-model="message"
                class="form-control bg-transparent border-secondary"
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
                    class="mention-item d-flex align-items-center p-2"
                    @click="handleMentionSelect(member)"
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
        <button
            class="btn btn-secondary align-self-end"
            :disabled="!message.trim()"
            @click="handleSend"
        >
            <i class="bi bi-send" />
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
    background-color: var(--bs-gray-100);
}

textarea {
    min-height: 40px;
    max-height: 120px;
    resize: vertical;
}

.mention-suggestions {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    margin-bottom: 4px;
    background: white;
    border: 1px solid var(--bs-border-color);
    border-radius: 0.375rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
}

.mention-item {
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: var(--bs-gray-100);
    }
}
</style>
