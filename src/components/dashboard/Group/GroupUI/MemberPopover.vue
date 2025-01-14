<template>
    <div
        class="custom-popover rounded-4 bg-white shadow-lg"
        @click.stop
    >
        <!-- Header Section -->
        <div class="position-relative p-4">
            <div class="row align-items-center">
                <div class="col-12 col-md-8 order-2 order-md-1">
                    <h3 class="display-6 fw-bold text-dark mb-2">
                        {{ member.profile.displayName }}
                        <b-button
                            v-if="member.role === 'ADMIN'"
                            toggle="tooltip"
                            title="Admin"
                            size="md"
                            padding="0"
                        >
                            <i
                                class="bi bi-shield-fill-check"
                            />
                        </b-button>
                    </h3>
                    <div class="d-flex flex-wrap gap-3 mb-3">
                        <span
                            v-if="member.profile.city"
                            class="badge bg-light text-dark border"
                        >
                            <i class="bi bi-geo-alt me-1" />
                            {{ member.profile.city }}
                        </span>
                        <span class="badge bg-light text-dark border">
                            <i class="bi bi-calendar3 me-1" />
                            {{ new Date(member.profile.createdAt).toLocaleDateString() }}
                        </span>
                    </div>
                    <span class="badge bg-light text-dark border">
                        <i class="bi bi-hexagon me-1" />
                        {{ member.points }}
                    </span>
                </div>
            </div>
        </div>

        <Bee3D
            class="bee-avatar"
            :avatar="member.profile.avatarUrl || undefined"
            is-popover
        />
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    member: GroupWithMembers['members'][number]
    style?: string
}>()
</script>

<style scoped lang="scss">
.custom-popover {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 600px;
    z-index: 1050;
    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.bee-avatar {
    position: absolute;
    top: -4rem;
    left: 45%;
    width: 200px;
    height: 200px;
    transition: transform 0.3s ease;
    &:hover {
        transform: rotate(5deg) scale(1.05);
    }
}

.achievement-card {
    transition: transform 0.2s ease;
    &:hover {
        transform: translateY(-2px);
    }
}

.achievement-icon {
    opacity: 0.8;
    transition: opacity 0.2s ease;
    &:hover {
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translate(-50%, -48%);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%);
    }
}

@media (max-width: 768px) {
    .custom-popover {
        width: 95%;
    }
}
</style>
