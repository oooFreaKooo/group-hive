<template>
    <div
        class="profile-card rounded-4 bg-white shadow-lg"
        @click.stop
    >
        <div class="bee-container bg-white shadow-lg rounded-4">
            <NuxtImg
                :src="member.profile.bgUrl || 'https://picsum.photos/300'"
                class="bee-avatar"
            />
            <Bee3D
                class="bee-avatar"
                :avatar="member.profile.avatarUrl || undefined"
                is-popover
            />
        </div>

        <div class="content">
            <div class="details">
                <h2>
                    {{ member.profile.displayName }}   <b-button
                        v-if="member.role === 'ADMIN'"
                        toggle="tooltip"
                        title="Admin"
                        size="md"
                        padding="0"
                    >
                        <i
                            class="bi bi-shield-fill-check"
                        />
                    </b-button><br>
                    <span class="text-muted">
                        <i class="bi bi-geo-alt me-1" />
                        {{ member.profile.city }}
                    </span>
                </h2>
                <div class="data">
                    <h3>342<br><span>Posts</span></h3>
                    <h3>123<br><span>Achievements</span></h3>
                    <h3>123<br><span>Points</span></h3>
                </div>
                <div class="action-btn">
                    <button>
                        Follow
                    </button>
                    <button>
                        Message
                    </button>
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
.profile-card {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 350px;
    height: 450px;
    z-index: 1050;
    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.bee-container {
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    width: 250px;
    height: 250px;
    overflow: hidden;
}

.bee-avatar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    &:hover {
        transform: rotate(5deg) scale(1.05);
    }
}

.profile-card .content {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
}

.profile-card .content .details {
    padding: 40px;
    text-align: center;
    width: 100%;
}

.profile-card .content .details h2 {
    font-size: 1.25em;
    font-weight: 600;
    line-height: 1.2;
}

.profile-card .content .details h2 span {
    font-size: 0.75em;
    font-weight: 500;
    line-height: 0.5;
}

.profile-card .content .details .data {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
}

.profile-card .content .details .data h3 {
    font-size: 1em;
    font-weight: 600;
    line-height: 1.2em;
}

.profile-card .content .details .data h3 span {
    font-size: 0.85em;
    font-weight: 400;
    opacity: 0.5;
}

.profile-card .content .details .action-btn {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.profile-card .content .details .action-btn button {
    padding: 10px 30px;
    border: none;
    outline: none;
    border-radius: 5px;
    background-color: #ff5795;
    color: white;
    font-size: 1em;
    font-weight: 500;
    cursor: pointer;
}

.profile-card .content .details .action-btn button:nth-child(2) {
    border: 1px solid #999;
    background-color: #fff;
    color: #999;
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
    .profile-card {
        width: 95%;
    }
}
</style>
