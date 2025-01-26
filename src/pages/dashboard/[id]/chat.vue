<template>
    <div
        v-if="status === 'pending'"
        class="loading-overlay"
    >
        <div class="loading-content">
            <div class="spinner" />
            <p class="loading-text">
                Loading chat...
            </p>
        </div>
    </div>

    <div class="chat-page">
        <div class="chat-content">
            <div class="container h-100">
                <div class="row h-100 g-4 justify-content-center mt-2">
                    <div class="chat-header col-12 col-lg-12">
                        <div class="d-flex align-items-center gap-3">
                            <i class="bi bi-chat-dots-fill text-primary" />
                            <h2 class="mb-0">
                                Group Chat
                            </h2>
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <GroupChat
                            v-if="data && status === 'success'"
                            :messages="data.Message"
                            :members="data.members"
                            :group-id="data.id.toString()"
                        />
                    </div>
                    <div class="col-lg-4">
                        <MemberList
                            v-if="data && status === 'success'"
                            :members="data.members"
                            @member-details="$emit('member-details', $event)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Prisma } from '@prisma/client'

const route = useRoute()

definePageMeta({
    layout: 'group',
})

const { data, status } = await useLazyFetch<Prisma.GroupGetPayload<{
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
})

defineEmits<{
    'member-details': [memberId: string]
}>()
</script>

<style scoped lang="scss">
.loading-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s ease;
}

.loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    animation: fadeIn 0.3s ease;
}

.spinner {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(var(--bs-primary-rgb), 0.1);
    border-top: 3px solid var(--bs-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.loading-text {
    font-size: 1.1rem;
    color: var(--bs-gray-600);
    margin: 0;
    font-weight: 500;
}

.chat-page {
    min-height: calc(100vh - var(--header-height, 60px));
    display: flex;
    flex-direction: column;
}

.chat-header {
    padding: 1.5rem 0;
    border-bottom: 1px solid rgba(var(--bs-dark-rgb), 0.08);

    h2 {
        font-size: 1.75rem;
        font-weight: 600;
        color: var(--bs-gray-800);
    }

    i {
        font-size: 1.75rem;
    }
}

.chat-content {
    flex: 1;
    padding-bottom: 2rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
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
