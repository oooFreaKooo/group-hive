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

        <textarea
            v-model="message"
            class="form-control bg-transparent border-secondary"
            :placeholder="replyingTo ? 'Write your reply...' : 'Type a message...'"
            @keydown.enter.prevent="$emit('send', message)"
            @input="handleInput"
        />
        <button
            class="btn btn-secondary align-self-end"
            :disabled="!message.trim()"
            @click="$emit('send', message)"
        >
            <i class="bi bi-send" />
        </button>

        <MentionSuggestions
            :show="showMentionSuggestions"
            :filtered-members="filteredMembers"
            @select="handleMentionSelect"
        />
    </div>
</template>

<script setup lang="ts">
import type { Message, GroupUser, MentionSuggestion } from './types'

const props = defineProps<{
    replyingTo: Message | null
    members: GroupUser[]
}>()

const emit = defineEmits<{
    'send': [message: string]
    'cancel-reply': []
    'mention-suggestion': [suggestion: MentionSuggestion]
}>()

const message = ref('')
const cursorPosition = ref(0)
const showMentionSuggestions = ref(false)
const mentionQuery = ref('')

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

const handleMentionSelect = (member: GroupUser) => {
    const mention = `@[${member.profile.displayName}](${member.id})`
    const lastAtSymbol = message.value.lastIndexOf('@', cursorPosition.value)

    message.value = message.value.slice(0, lastAtSymbol) + mention + message.value.slice(cursorPosition.value)
    showMentionSuggestions.value = false
    mentionQuery.value = ''

    // Set focus back to textarea and move cursor after mention
    nextTick(() => {
        const textarea = document.querySelector('textarea')
        if (textarea) {
            textarea.focus()
            const newCursorPos = lastAtSymbol + mention.length
            textarea.setSelectionRange(newCursorPos, newCursorPos)
        }
    })
}
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
</style>
