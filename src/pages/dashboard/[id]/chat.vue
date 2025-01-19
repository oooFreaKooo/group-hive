<template>
    <div
        v-if="status === 'pending'"
        class="loading-container"
    >
        <div class="loading-content">
            <div class="spinner" />
            <p class="loading-text">
                Loading...
            </p>
        </div>
    </div>
    <div class="container">
        <h2 class="my-4">
            Chat
        </h2>

        <main class="row">
            <div class="col-14 col-lg-10">
                <GroupChat
                    v-if="data && status === 'success'"
                    :messages="data.Message"
                    :members="data.members"
                    :group-id="data.id.toString()"
                />
            </div>
            <div class="col-14 col-lg-4">
                <MemberList
                    v-if="data && status === 'success'"
                    :members="data.members"
                    @member-details="$emit('member-details', $event)"
                />
            </div>
        </main>
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

<style scoped>
.loading-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
}

.loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.loading-text {
    font-size: 1.2rem;
    color: #666;
    margin: 0;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
