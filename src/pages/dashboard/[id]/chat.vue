<template>
    <AppSection
        :padding="3"
        class="chat-page"
    >
        <div class="chat-content">
            <div class="container h-100">
                <div class="row h-100 g-4 justify-content-center mt-2">
                    <div class="col-lg-8">
                        <GroupChat
                            :messages="data?.Message ?? []"
                            :members="data?.members ?? []"
                            :group-id="data?.id.toString() ?? ''"
                            :status="status"
                        />
                    </div>
                    <div class="col-lg-4">
                        <MemberList
                            :members="data?.members ?? []"
                            :status="status"
                            @member-details="$emit('member-details', $event)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </AppSection>
</template>

<script lang="ts" setup>
import type { Prisma } from '@prisma/client'

const route = useRoute()

definePageMeta({
    layout: 'group',
})

const { data, status } = useFetch<Prisma.GroupGetPayload<{
    select: {
        id: true
        name: true
        members: {
            include: {
                profile: true
            }
        }
        Message: {
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
        }
    }
}> | null>(`/api/group/:${route.params.id}`, {
    key: 'group',
    default: () => null,
})

defineEmits<{
    'member-details': [memberId: string]
}>()
</script>

<style scoped lang="scss">
.chat-wrapper {
    min-height: calc(100vh - var(--header-height, 60px));
    display: flex;
    flex-direction: column;
}

.chat-page {
    min-height: calc(100vh - var(--header-height, 60px));
    display: flex;
    flex-direction: column;
}

.chat-content {
    flex: 1;
    padding-bottom: 2rem;
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
