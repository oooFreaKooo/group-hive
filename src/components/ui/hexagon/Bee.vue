<template>
    <div class="wrap">
        <div class="wrap2">
            <div class="body">
                <!-- Avatar Face -->
                <div class="face">
                    <NuxtImg
                        :src="avatar || '/default-avatar.png'"
                        class="avatar"
                    />
                </div>
            </div>
            <div class="wing1" />
            <div class="wing2" />
            <div class="stinger" />
            <div class="antenna-left" />
            <div class="antenna-right" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    avatar: string
}>()
</script>

<style scoped>
.wrap {
    position: relative;
    width: 100%;
    height: 100%;
}

.wrap2 {
    position: absolute;
    left: 25%;
    animation: dodging1 1s ease-in-out infinite;
}

.body {
    position: absolute;
    top: 0;
    left: 0;
    height: 85px;
    width: 75px;
    z-index: 2;
    border-radius: 100%;

    box-shadow:
        40px -3px 0 #000,
        50px -5px 0 #ffb733,
        60px -7px 0 #000,
        80px -11px 0 #ffb733;
}

.face {
    position: absolute;
    top: 0;
    left: 17px;
    width: 80px;
    height: 85px;
    border-radius: 50%;
    overflow: hidden;
}

.avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.wing1 {
    position: absolute;
    height: 55px;
    width: 55px;
    top: -40px;
    left: 30px;
    transform: rotate(20deg);
    transform-origin: bottom right;
    border-top-right-radius: 100%;
    border-bottom-left-radius: 100%;
    border-top-left-radius: 10px;
    background-color: #ddd;
    z-index: 1;
    filter: blur(1px);
    animation: flutter1 0.01s linear reverse infinite;
}

.wing2 {
    position: absolute;
    height: 55px;
    width: 55px;
    top: -45px;
    left: 40px;
    transform: rotate(80deg);
    transform-origin: bottom right;
    border-top-right-radius: 100%;
    border-bottom-left-radius: 100%;
    border-top-left-radius: 10px;
    background-color: #ddd;
    z-index: 2;
    filter: blur(1px);
    animation: flutter2 0.01s linear infinite;
}

.antenna-left {
    position: absolute;
    height: 30px;
    width: 3px;
    background-color: #000;
    top: -20px;
    left: 35px;
    transform: rotate(-20deg);
    z-index: 3;
}

.antenna-left::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background-color: #000;
    border-radius: 50%;
    top: -3px;
    left: -1.5px;
}

.antenna-right {
    position: absolute;
    height: 30px;
    width: 3px;
    background-color: #000;
    top: -22px;
    left: 60px;
    transform: rotate(10deg);
    z-index: 3;
}

.antenna-right::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background-color: #000;
    border-radius: 50%;
    top: -3px;
    left: -1.5px;
}

.stinger {
    position: absolute;
    height: 55px;
    width: 45px;
    top: 5px;
    left: 105px;
    transform: rotate(320deg);
    border-top-right-radius: 100%;
    border-bottom-left-radius: 100%;
    border-top-left-radius: 1px;
    background-color: #000;
    z-index: 1;
}

@keyframes dodging1 {
    0% {
        top: 40%;
    }
    50% {
        top: 45%;
    }
    100% {
        top: 40%;
    }
}

@keyframes flutter2 {
    0% {
        transform: rotate(80deg);
    }
    50% {
        transform: rotate(100deg);
    }
}

@keyframes flutter1 {
    0% {
        transform: rotate(20deg);
    }
    50% {
        transform: rotate(40deg);
    }
}
</style>
