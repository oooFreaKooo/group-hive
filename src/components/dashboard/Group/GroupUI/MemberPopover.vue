<template>
    <div
        class="custom-popover shadow-lg card rounded-5"
        @click.stop
    >
        <div class="container popover-body p-4">
            <div class="row">
                <div class="col-2 d-flex justify-content-center align-items-center">
                    <NuxtImg
                        class="rounded-5 profile-avatar border border-secondary"
                        width="124"
                        height="124"
                        :src="member.profile.avatarUrl || '/default-avatar.png'"
                        :alt="member.profile.displayName || 'Member'"
                    />
                </div>
                <div class="col-10">
                    <div class="card-title fw-bold fs-3 border-bottom">
                        {{ member.profile.displayName }}
                    </div>
                    <div
                        v-if="member.profile.city"
                        class="popover-item mb-2"
                    >
                        <i class="bi bi-geo-alt" />
                        {{ member.profile.city }}
                    </div>
                    <div class="popover-item my-2">
                        <i class="bi bi-calendar3" />
                        Joined {{ new Date(member.profile.createdAt).toLocaleDateString() }}
                    </div>
                    <div class="popover-item mt-2">
                        <i class="bi bi-star-fill text-warning" />
                        {{ member.points }} points
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    member: GroupWithMembers['members'][number]
    style?: string
}>()
</script>

<style scoped lang="scss">
.profile-avatar {
    position: absolute;
    left: -4rem;
}

.custom-popover {
    position: fixed;
    left: 55%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    width: 90%;
    max-width: 400px;
    z-index: 1050;
    animation: fadeIn 0.2s ease;
}

.popover-body {
    background: var(--c-gray-800);
    border-radius: 0 0 6px 6px;
}

.popover-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;

    i {
        width: 16px;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, -60%);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%);
    }
}
</style>
