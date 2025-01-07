<template>
    <section class="payment-section">
        <h2>{{ title }}</h2>
        <div class="payment-section-header">
            <p>{{ subtitle }}</p>
            <div>
                <button
                    v-for="card in cardTypes"
                    :key="card.type"
                    class="card-button"
                    :class="[card.type, { active: selectedCard === card.type }]"
                    @click="selectCard(card.type)"
                >
                    <AppIcon
                        :name="card.icon"
                        color="white"
                    />
                </button>
            </div>
        </div>
        <div class="payments">
            <div
                v-for="payment in payments"
                :key="payment.id"
                class="payment"
            >
                <div
                    class="payment-card"
                    :class="`bg-${payment.cardType}`"
                >
                    <span>{{ payment.expiry }}</span>
                    <span>{{ payment.lastDigits }}</span>
                </div>
                <div class="payment-details">
                    <h3>{{ payment.title }}</h3>
                    <div>
                        <span>{{ payment.amount }}</span>
                        <button
                            class="icon-button"
                            @click="$emit('payment-details', payment.id)"
                        >
                            <i class="bi bi-caret-right-fill" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="faq">
            <p>{{ faqTitle }}</p>
            <div>
                <label>Question</label>
                <input
                    v-model="question"
                    type="text"
                    :placeholder="faqPlaceholder"
                    @input="$emit('faq-input', question)"
                >
            </div>
        </div>
        <div class="payment-section-footer">
            <button
                class="save-button"
                @click="$emit('save')"
            >
                Save
            </button>
            <button
                class="settings-button"
                @click="$emit('settings')"
            >
                <i class="ph-gear" />
                <span>More settings</span>
            </button>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface CardType {
    type: string
    icon: any // Component
}

interface Payment {
    id: string | number
    cardType: string
    expiry: string
    lastDigits: string
    title: string
    amount: string
}

const props = defineProps<{
    title: string
    subtitle: string
    cardTypes: CardType[]
    payments: Payment[]
    faqTitle: string
    faqPlaceholder: string
}>()

const selectedCard = ref(props.cardTypes[0]?.type)
const question = ref('')

const selectCard = (type: string) => {
    selectedCard.value = type
    emit('card-select', type)
}

const emit = defineEmits<{
    (e: 'card-select', type: string): void
    (e: 'payment-details', id: string | number): void
    (e: 'faq-input', question: string): void
    (e: 'save'): void
    (e: 'settings'): void
}>()
</script>
