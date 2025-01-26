<template>
    <div
        class="navigation position-fixed bg-dark start-50 translate-middle-x"
        :class="smallerThanLg ? 'bottom-0 sm rounded-top-5 w-75' : 'top-0 lg w-100'"
    >
        <div class="nav-container">
            <ul class="d-flex list-unstyled position-relative mb-0">
                <li
                    v-for="(item, index) in navigationItems"
                    :key="item.label + index"
                    class="list position-relative"
                    :class="smallerThanLg ? 'sm' : 'lg'"
                >
                    <NuxtLink
                        :to="item.href"
                        class="d-flex flex-column align-items-center text-decoration-none position-relative"
                    >
                        <span
                            :class="`bi bi-${item.icon} icon-${smallerThanLg ? 'sm' : 'lg'}`"
                        />
                        <span :class="smallerThanLg ? 'text-sm' : 'text-lg'">{{ item.label }}</span>
                    </NuxtLink>
                </li>
                <div
                    class="position-absolute"
                    :class="smallerThanLg ? 'indicator-sm' : 'indicator-lg'"
                    :style="{ transform: `translateX(calc(90px * ${$route.path.split('/').length - 3})) scale(0.8)` }"
                />
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'

defineProps<{
    navigationItems: NavigationItem[]
}>()

const breakpoints = useBreakpoints(breakpointsBootstrapV5)

const smallerThanLg = breakpoints.smaller('lg')
</script>

<style scoped lang="scss">
// Variables
$nav-height-sm: 70px;
$nav-height-lg: 46px;
$nav-height-default-sm: 46px;
$nav-height-default-lg: 56px;
$nav-height-hover: 66px;
$nav-item-width: 90px;
$indicator-size: 70px;
$border-light-sm: 10px solid var(--bs-light);
$border-light-lg: 16px solid var(--bs-light);
$transition-duration: 0.35s;

// Mixins
@mixin indicator-pseudo {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: transparent;
}

@mixin nav-icon {
  position: relative;
  display: block;
  line-height: 56px;
  font-size: 1.15em;
  text-align: center;
  color: var(--bs-light);
  transform: translateY(0);
  transition: all $transition-duration ease;
}

@mixin nav-text {
  position: absolute;
  color: var(--bs-light);
  font-weight: 400;
  font-size: 0.7em;
  letter-spacing: 0.05em;
  opacity: 0;
  transition: all $transition-duration ease;
}

.navigation {

    &.sm {
        height: $nav-height-default-sm;
        border-top: $border-light-sm;
    }

    &.lg {
        position: relative;
        border-bottom: none;
        height: $nav-height-hover;

        &::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 110%;
            height: 16px;
            background-color: var(--bs-light);
        }

        .list a {
            .icon-lg {
                font-size: 1.25em;
            }
        }

        .indicator-lg {
            top: 50%;
            transform: scale(1);
        }

        .list a.router-link-active {
            .text-lg {
                opacity: 1;
                transform: translateX(-10px) translateY(-8px);
                visibility: visible;
            }

            .icon-lg {
                transform: translateX(-10px) translateY(34px);
            }
        }
    }

    &:hover {
        height: $nav-height-hover;

        .list a {
            .icon-sm {
                font-size: 1.25em;
                transform: translateY(10px);
            }
        }

        .indicator-sm {
            transform: scale(1);
        }

        .list a.router-link-active {
            .text-sm {
                opacity: 1;
                transform: translateX(-10px) translateY(20px);
                visibility: visible;
            }

            .icon-sm {
                transform: translateX(-10px) translateY(-22px);
            }
        }
    }

    .nav-container {
        display: flex;
        justify-content: center;

        ul {
            width: fit-content;
            gap: 0;
            display: flex;
            justify-content: center;
            position: relative;
        }
    }

    .list {
        position: relative;
        width: $nav-item-width;
        z-index: 1;
        transition: all $transition-duration ease;

        &.sm {
            height: $nav-height-sm;
        }

        &.lg {
            height: $nav-height-lg;
        }

        a {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 100%;
            text-align: center;
            font-weight: 500;

            .icon-sm {
                @include nav-icon;
                line-height: 40px;
            }

            .icon-lg {
                @include nav-icon;
                line-height: 48px;
            }

            .text-sm, .text-lg {
                @include nav-text;
                opacity: 0;
                visibility: hidden;
            }

            .text-sm {
                transform: translateY(20px);
            }

            &.router-link-active {
                .icon-sm {
                    transform: translateX(-10px) translateY(-22px);
                }

                .icon-lg {
                    transform: translateX(-10px) translateY(24px);
                }

                .text-sm, .text-lg {
                    transform: translateX(-10px);
                    opacity: 0;
                    visibility: hidden;
                }
            }
        }
    }

    %indicator-base {
        position: absolute;
        left: 0;
        width: $indicator-size;
        height: $indicator-size;
        background: var(--bs-primary);
        border: 6px solid var(--bs-light);
        border-radius: 50%;
        transition: all $transition-duration ease;
        transform: scale(0.9);

        &::before,
        &::after {
            @include indicator-pseudo;
        }
    }

    .indicator-sm {
        @extend %indicator-base;
        top: -50%;

        &::before,
        &::after {
            top: 50%;
        }

        &::before {
            left: -22px;
            border-top-right-radius: 20px;
            box-shadow: 1px -10px 0 var(--bs-light);
        }

        &::after {
            right: -22px;
            border-top-left-radius: 20px;
            box-shadow: -1px -10px 0 var(--bs-light);
        }
    }

    .indicator-lg {
        @extend %indicator-base;
        top: 25%;

        &::before,
        &::after {
            top: 0;
        }

        &::before {
            left: -18px;
            border-bottom-right-radius: 20px;
            box-shadow: 1px 10px 0 var(--bs-light);
        }

        &::after {
            right: -18px;
            border-bottom-left-radius: 20px;
            box-shadow: -1px 10px 0 var(--bs-light);
        }
    }
}
</style>
