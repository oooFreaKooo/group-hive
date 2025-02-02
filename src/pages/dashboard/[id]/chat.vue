<template>
    <AppSection
        :padding="3"
        class="chat-page"
    >
        <div class="row g-4 justify-content-center mt-2">
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
    </AppSection>
</template>

<script lang="ts" setup>
import type { Prisma } from '@prisma/client'

const route = useRoute()

definePageMeta({
    layout: 'group',
})

const { data, status } = await useFetch<Prisma.GroupGetPayload<{
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
}> | null>(`/api/group/${route.params.id}`, {
    key: route.fullPath,
    default: () => null,
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
