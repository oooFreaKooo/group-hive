<template>
    <div class="hexagon-wrapper">
        <div class="hexagon">
            <i class="bi bi-facebook" />
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps({
    angle: {
        type: String,
        default: '60deg',
    },
})
</script>

<style scoped lang="scss">
$hexagon-size: 100px;
$hexagon-color-1: #ffee00;
$hexagon-color-2: #d6c100;

.hexagon-wrapper {
  display: flex;
  text-align: initial;
  width: $hexagon-size;
  height: $hexagon-size;
  cursor: pointer;
}

.hexagon {
  position: relative;
  width: 46%;
  height: 80%;
  margin: auto;
  color: white;
  background: linear-gradient(-180deg, $hexagon-color-1, $hexagon-color-2);
  display: flex;
  align-content: center;
  justify-content: center;
  transition: 0.5s;
}

.hexagon i {
  z-index: 1;
  margin: auto;
  font-size: 30px;
  color: transparent;
  background: linear-gradient(45deg, #a58fe9, var(--bs-secondary));
  background-clip: text;
  -webkit-background-clip: text;
}

.hexagon:before,
.hexagon:after {
  position: absolute;
  content: "";
  background: inherit;
  height: 100%;
  width: 100%;
  border-radius: 0;
  transition: 0.5s;
  transform-origin: center;
}
.hexagon:before {
  transform: rotateZ(60deg);
}
.hexagon:after {
  transform: rotateZ(-60deg);
}
.hexagon:hover {
  border-radius: 50px;
  transition: 0.5s;
}
.hexagon:hover:before {
  border-radius: 50px;
  transition: 0.5s;
}
.hexagon:hover:after {
  border-radius: 50px;
  transition: 0.5s;
}
</style>
