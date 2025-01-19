<template>
    <burron
        class="btn btn-primary w-100"
        @click="handleLogout"
    >
        Logout
    </burron>
</template>

<script lang="ts" setup>
const client = useSupabaseClient()
const router = useRouter()

const handleLogout = async () => {
    await client.auth.signOut()
    router.push('/auth/login')
}
</script>

<style scoped lang="scss">
.dropdown-toggle {
    color: transparent;
}

.user-profile {
    display: flex;
    align-items: center;
    border: 0;
    background: transparent;
    cursor: pointer;
    color: var(--c-text-tertiary);
    transition: 0.25s ease;

    &:hover,
    &:focus {
        color: var(--c-text-primary);
        span:last-child {
            box-shadow: 0 0 0 4px var(--c-gray-800), 0 0 0 5px var(--c-text-tertiary);
        }
    }

    span:first-child {
        display: flex;
        font-size: 1.125rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--c-gray-600);
        font-weight: 300;
    }

    span:last-child {
        transition: 0.25s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        overflow: hidden;
        margin-left: 1.5rem;
        flex-shrink: 0;
    }
}
</style>
