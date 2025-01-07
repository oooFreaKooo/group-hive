<template>
    <section class="service-section">
        <h2>{{ title }}</h2>
        <div class="service-section-header">
            <div class="search-field">
                <i class="ph-magnifying-glass" />
                <input
                    v-model="searchQuery"
                    type="text"
                    :placeholder="searchPlaceholder"
                    @input="$emit('search', searchQuery)"
                >
            </div>
            <div class="dropdown-field">
                <select
                    v-model="selectedLocation"
                    @change="$emit('location-change', selectedLocation)"
                >
                    <option
                        v-for="location in locations"
                        :key="location"
                        :value="location"
                    >
                        {{ location }}
                    </option>
                </select>
                <i class="ph-caret-down" />
            </div>
            <button
                class="flat-button"
                @click="$emit('search-click')"
            >
                Search
            </button>
        </div>
        <div class="mobile-only">
            <button
                class="flat-button"
                @click="$emit('toggle-search')"
            >
                Toggle search
            </button>
        </div>
        <div class="tiles">
            <article
                v-for="tile in serviceTiles"
                :key="tile.title"
                class="tile"
            >
                <div class="tile-header">
                    <i :class="tile.icon" />
                    <h3>
                        <span>{{ tile.title }}</span>
                        <span>{{ tile.subtitle }}</span>
                    </h3>
                </div>
                <a :href="tile.href">
                    <span>{{ tile.linkText }}</span>
                    <span class="icon-button">
                        <i class="ph-caret-right-bold" />
                    </span>
                </a>
            </article>
        </div>
        <div class="service-section-footer">
            <p>{{ footerText }}</p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ServiceTile {
    title: string
    subtitle: string
    icon: string
    href: string
    linkText: string
}

const props = defineProps<{
    title: string
    searchPlaceholder: string
    locations: string[]
    serviceTiles: ServiceTile[]
    footerText: string
}>()

const searchQuery = ref('')
const selectedLocation = ref(props.locations[0])

defineEmits<{
    (e: 'search', query: string): void
    (e: 'location-change', location: string): void
    (e: 'search-click'): void
    (e: 'toggle-search'): void
}>()
</script>
