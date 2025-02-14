<template>
    <AppSection
        :padding="3"
        class="chat-page"
    >
        <div class="row g-4 justify-content-center mt-2">
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
.chat-page {
    display: flex;
    flex-direction: column;
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
</style>
