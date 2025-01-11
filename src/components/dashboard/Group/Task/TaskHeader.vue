<template>
    <div class="project-info">
        <h1>Homepage Design</h1>
        <div class="project-participants">
            <span
                v-for="n in 3"
                :key="n"
            />
            <button class="project-participants__add">
                Add Participant
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
// Component logic will be added when we implement participant management
</script>

<style scoped lang="scss">
.project-info {
  padding: 2rem 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.project-participants {
  display: flex;
  align-items: center;

  span,
  &__add {
    width: 30px;
    height: 30px;
    display: inline-block;
    background: var(--purple);
    border-radius: 100rem;
    margin: 0 0.2rem;
  }

  &__add {
    background: transparent;
    border: 1px dashed rgb(150, 150, 150);
    font-size: 0;
    cursor: pointer;
    position: relative;

    &:after {
      content: '+';
      font-size: 15px;
      color: rgb(150, 150, 150);
    }
  }
}
</style>
