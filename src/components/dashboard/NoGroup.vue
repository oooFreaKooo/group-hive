<template>
    <div class="card p-4">
        <div class="text-center">
            <h3 class="h4">
                Welcome to FlatMate!
            </h3>
            <p class="text-muted small mt-2">
                To get started, create a new group or join an existing one.
            </p>
            <div class="mt-4 d-flex justify-content-center gap-3">
                <button
                    class="btn btn-primary"
                    @click="showCreateModal = true"
                >
                    Create Group
                </button>
                <button
                    class="btn btn-outline-secondary"
                    @click="showJoinModal = true"
                >
                    Join Group
                </button>
            </div>
        </div>

        <CreateGroupModal v-model="showCreateModal" />
        <JoinGroupModal v-model="showJoinModal" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CreateGroupModal from './CreateGroupModal.vue'
import JoinGroupModal from './JoinGroupModal.vue'

const showCreateModal = ref(false)
const showJoinModal = ref(false)
</script>
