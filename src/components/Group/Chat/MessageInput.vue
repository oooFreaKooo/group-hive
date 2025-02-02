<template>
    <div class="d-flex flex-column bg-gradient bg-dark position-relative mt-2 p-3">
        <div
            v-if="replyingTo"
            class="position-absolute top-0 start-0 end-0 bg-gradient bg-dark backdrop-blur px-3 py-2 rounded-top-3"
        >
            <div class="d-flex align-items-center justify-content-between">
                <span class="text-primary">
                    <i class="bi bi-reply me-2" />
                    Replying to {{ replyingTo.author.profile.displayName }}
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
                    ref="textareaRef"
                    v-model="message"
                    class="form-control rounded-4 py-2 px-3"
                    :class="{ 'focus-primary': message }"
                    :placeholder="replyingTo ? 'Write your reply...' : 'Type a message...'"
                    @keydown.enter.prevent="handleSend"
                    @input="handleInput"
                />
                <div
                    v-if="showMentionSuggestions && filteredMembers.length > 0"
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
                            :src="member.profile.avatarUrl || '/default-avatar.png'"
                            :alt="member.profile.displayName || 'User'"
                        />
                        <span>{{ member.profile.displayName }}</span>
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
