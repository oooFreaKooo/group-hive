<template>
    <section class="transfer-section">
        <div class="transfer-section-header">
            <h2>{{ title }}</h2>
            <div class="filter-options">
                <p>{{ filterDescription }}</p>
                <button
                    class="icon-button"
                    @click="$emit('filter')"
                >
                    <AppIcon
                        name="funnel"
                        color="white"
                    />
                </button>
                <button
                    class="icon-button"
                    @click="$emit('add')"
                >
                    <AppIcon
                        name="plus"
                        color="white"
                    />
                </button>
            </div>
        </div>
        <div class="transfers">
            <div
                v-for="transfer in transfers"
                :key="transfer.id"
                class="transfer"
            >
                <div class="transfer-logo">
                    <AppIcon
                        :name="transfer.logo"
                        color="black"
                        size="lg"
                    />
                </div>
                <dl class="transfer-details">
                    <div>
                        <dt>{{ transfer.company }}</dt>
                        <dd>{{ transfer.description }}</dd>
                    </div>
                    <div>
                        <dt>{{ transfer.lastDigits }}</dt>
                        <dd>Last four digits</dd>
                    </div>
                    <div>
                        <dt>{{ transfer.date }}</dt>
                        <dd>Date payment</dd>
                    </div>
                </dl>
                <div class="transfer-number">
                    {{ transfer.amount }}
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
interface Transfer {
    id: string | number
    logo: string
    company: string
    description: string
    lastDigits: string
    date: string
    amount: string
}

defineProps<{
    title: string
    filterDescription: string
    transfers: Transfer[]
}>()

defineEmits<{
    (e: 'filter'): void
    (e: 'add'): void
}>()
</script>
