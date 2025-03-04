<template>
    <AppSection :padding="4">
        <div class="chat-container d-flex flex-column rounded-5 shadow-lg border mt-4">
            <div class="p-3 bg-dark rounded-top-5">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 me-3">
                            <i class="bi bi-chat-dots me-2" />
                            Chat
                        </span>
                        <h1 class="h5 text-light mb-0 fw-semibold">
                            Group Discussion
                        </h1>
                    </div>
                </div>
            </div>
            <div class="chat-content bg-white p-4 rounded-bottom-5">
                <div class="row g-4 justify-content-center">
                    <div class="col-lg-8">
                        <GroupChat
                            :messages="messages || []"
                            :members="members || []"
                            :group-id="groupData?.id || ''"
                            :status="messagesStatus"
                        />
                    </div>
                    <div class="col-lg-4">
                        <MemberList
                            :members="members || []"
                            :status="membersStatus"
                            @member-details="$emit('member-details', $event)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </AppSection>
</template>

<script setup lang="ts">
import type { Prisma, Profile } from '@prisma/client'

interface Group {
    id: string
    name: string
    description: string | null
    invitationCode: string
    ownerId: string
    city: string | null
    postalCode: string | null
    createdAt: Date
    updatedAt: Date
}

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

const route = useRoute()

definePageMeta({
    layout: 'group',
})

// Fetch group data
const { data: groupData } = await useFetch<Group>(`/api/group/${route.params.id}`, {
    key: route.fullPath,
    default: () => null,
})

// Fetch members separately
const { data: members, status: membersStatus } = await useFetch<Profile[]>(`/api/group/${route.params.id}/members`, {
    key: `${route.fullPath}-members`,
    default: () => [],
})

// Fetch messages separately with proper typing
const { data: messages, status: messagesStatus } = await useFetch<MessageWithAuthor[]>(`/api/group/${route.params.id}/messages`, {
    key: `${route.fullPath}-messages`,
    default: () => [],
})

defineEmits<{
    'member-details': [memberId: string]
}>()
</script>

<style scoped lang="scss">
.chat-container {
    min-height: 75vh;
    overflow: hidden;
    position: relative;
    border-color: var(--bs-gray-200) !important;
    transition: all 0.3s ease;
}

.chat-content {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    background: linear-gradient(to bottom, var(--bs-white), var(--bs-gray-100));

    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--bs-gray-300);
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: padding-box;

        &:hover {
            background: var(--bs-gray-400);
            border: 2px solid transparent;
            background-clip: padding-box;
        }
    }
}

@supports (scrollbar-color: auto) {
    .chat-content {
        scrollbar-color: var(--bs-gray-300) transparent;
        scrollbar-width: thin;
    }
}

@media (max-width: 991.98px) {
    .chat-content .row {
        flex-direction: column-reverse;
    }

    .chat-content .col-lg-4 {
        height: auto;
        min-height: 300px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .chat-container {
        transition: none;
    }
}
</style>
