<template>
    <div class="mt-4">
        <div v-if="userGroups.length > 0">
            <div
                v-for="group in userGroups"
                :key="group.id"
                class="card mb-3"
            >
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-1">
                            {{ group.name }}
                        </h5>
                        <p class="card-text text-muted small mb-0">
                            {{ group.role }}
                        </p>
                    </div>
                    <button
                        v-if="group.role !== 'admin'"
                        :disabled="loading"
                        class="btn btn-outline-danger btn-sm"
                        @click="leaveGroup(group.id)"
                    >
                        Leave
                    </button>
                </div>
            </div>
        </div>
        <div
            v-else
            class="text-center text-muted"
        >
            You are not a member of any groups yet.
        </div>

        <button
            class="btn btn-outline-secondary w-100 mt-3"
            @click="showJoinGroupModal = true"
        >
            Join a Group
        </button>

        <JoinGroupModal
            v-model="showJoinGroupModal"
            @group-joined="fetchUserGroups"
        />
    </div>
</template>

<script setup lang="ts">
import type { GroupMemberWithGroup } from '~/composables/useGroup'

const emit = defineEmits<{
    (e: 'error', value: string): void
}>()

const client = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const showJoinGroupModal = ref(false)
const userGroups = ref<Array<{ id: string, name: string, role: string }>>([])

const fetchUserGroups = async () => {
    if (!user.value?.id) { return }

    const { data } = await client
        .from('group_members')
        .select(`
      role,
      group:groups(
        id,
        name
      )
    `)
        .eq('user_id', user.value.id)

    if (data) {
        userGroups.value = (data as unknown as GroupMemberWithGroup[]).map(item => ({
            id: item.group.id,
            name: item.group.name,
            role: item.role,
        }))
    }
}

const leaveGroup = async (groupId: string) => {
    loading.value = true

    try {
        const { error: err } = await client
            .from('group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', user.value?.id)

        if (err) { throw err }

        userGroups.value = userGroups.value.filter(g => g.id !== groupId)
    } catch (err: any) {
        emit('error', err.message)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    if (user.value) {
        fetchUserGroups()
    }
})
</script>
