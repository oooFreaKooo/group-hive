<template>
    <div class="d-md-none position-fixed start-0 top-0 z-1000 m-2">
        <div
            class="mobile-menu rounded-4 d-flex flex-column align-items-center overflow-hidden"
            :class="{ 'expanded bg-dark shadow': isOpen, 'bg-light': !isOpen }"
        >
            <!-- Menu Button (Always Visible) -->
            <button
                class="menu-trigger btn d-flex flex-column justify-content-center align-items-center position-relative m-2 border-0 p-0"
                :class="{ 'is-active': isOpen }"
                aria-label="Toggle menu"
                @click="toggleMenu"
            >
                <i
                    class="menu-trigger-bar top"
                    :class="{ 'bg-light': isOpen, 'bg-dark': !isOpen }"
                />
                <i
                    class="menu-trigger-bar middle"
                    :class="{ 'bg-light': isOpen, 'bg-dark': !isOpen }"
                />
                <i
                    class="menu-trigger-bar bottom"
                    :class="{ 'bg-light': isOpen, 'bg-dark': !isOpen }"
                />
            </button>

            <!-- Expandable Content -->
            <div class="mobile-menu-content d-flex flex-column align-items-center w-100">
                <!-- Main Navigation Section -->
                <div class="d-flex flex-column flex-grow-1 w-100">
                    <SidebarNavigation @click="isOpen = false" />
                </div>

                <!-- Footer Section -->
                <div class="d-flex flex-column align-items-center w-100 pt-5 pb-2">
                    <SidebarThemeToggle />
                    <SidebarProfileButton />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const router = useRouter()

const toggleMenu = () => {
    isOpen.value = !isOpen.value
}

// Close mobile sidebar on route change
onMounted(() => {
    router.afterEach(() => {
        isOpen.value = false
    })
})
</script>

<style scoped lang="scss">
// Mobile Navigation Styles
.mobile-menu {
    width: 46px;
    height: 46px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    &.expanded {
        height: 100%;
        overflow-y: auto;
    }
}

.mobile-menu-content {
    overflow-y: hidden;
    opacity: 0;
    pointer-events: none;
    max-height: 0;
    transition: opacity 0.3s ease, max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    .expanded & {
        opacity: 1;
        pointer-events: auto;
        max-height: 500px; // Large enough to contain all content
    }
}

.menu-trigger {
  width: 32px;
  height: 32px;
  cursor: pointer;
  z-index: 333;
  background-color: transparent;

  &:hover {
    background-color: transparent !important;
    outline: none !important;
    box-shadow: none !important;

    .menu-trigger-bar {
      &:before {
        width: 100%;
      }
    }
  }

  &.is-active {
    .menu-trigger-bar {
      transition: all 0.3s ease;

      &.top {
        width: 50%;
        transform: translate(5px, 13px) rotate(45deg);
        margin-left: 0;
      }

      &.middle {
        opacity: 0;
        background-color: var(--bs-dark);
      }

      &.bottom {
        width: 50%;
        transform: translate(-5px, -5px) rotate(-45deg);
        margin-left: 0;
      }
    }
  }
}

.menu-trigger-bar {
  display: block;
  width: 100%;
  height: 3px;
  margin-bottom: 6px;
  transform: rotate(-45deg);
  position: relative;
  transition: all 0.3s ease;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 0%;
    height: 100%;
    background-color: var(--bs-primary);
    transition: all 0.3s cubic-bezier(.55,0,.1,1);
  }

  &.top {
    width: 50%;
    margin-left: -50%;
  }

  &.middle {
    &:before {
      left: auto;
      right: 0;
    }
  }
  &.bottom {
    width: 50%;
    margin-left: 50%;
    margin-bottom: 0;
  }
}
</style>
