<template>
    <div class="main-body">
        <div class="app">
            <div class="app-body">
                <div class="app-body-main-content">
                    <ServiceSection
                        :title="serviceConfig.title"
                        :search-placeholder="serviceConfig.searchPlaceholder"
                        :locations="serviceConfig.locations"
                        :service-tiles="serviceConfig.serviceTiles"
                        :footer-text="serviceConfig.footerText"
                        @search="handleServiceSearch"
                        @location-change="handleLocationChange"
                        @search-click="handleServiceSearchClick"
                        @toggle-search="handleToggleSearch"
                    />
                    <TransferSection
                        :title="transferConfig.title"
                        :filter-description="transferConfig.filterDescription"
                        :transfers="transferConfig.transfers"
                        @filter="handleTransferFilter"
                        @add="handleTransferAdd"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface ServiceConfig {
    title: string
    searchPlaceholder: string
    locations: string[]
    serviceTiles: Array<{
        title: string
        subtitle: string
        icon: string
        href: string
        linkText: string
    }>
    footerText: string
}

interface TransferConfig {
    title: string
    filterDescription: string
    transfers: Array<{
        id: string | number
        logo: string
        company: string
        description: string
        lastDigits: string
        date: string
        amount: string
    }>
}

interface PaymentConfig {
    title: string
    subtitle: string
    cardTypes: Array<{
        type: string
        icon: any
    }>
    payments: Array<{
        id: string | number
        cardType: string
        expiry: string
        lastDigits: string
        title: string
        amount: string
    }>
    faqTitle: string
    faqPlaceholder: string
}

// Define props with default values
withDefaults(defineProps<{
    serviceConfig?: ServiceConfig
    transferConfig?: TransferConfig
    paymentConfig?: PaymentConfig
}>(), {

    serviceConfig: () => ({
        title: 'Service',
        searchPlaceholder: 'Account number',
        locations: [ 'Home', 'Work' ],
        serviceTiles: [
            {
                title: 'Overview',
                subtitle: 'Overview',
                icon: 'bi bi-house',
                href: '/',
                linkText: 'Overview',
            },
            {
                title: 'Payments',
                subtitle: 'Payments',
                icon: 'bi bi-credit-card',
                href: '/',
                linkText: 'Payments',
            },
            {
                title: 'Cards',
                subtitle: 'Cards',
                icon: 'bi bi-credit-card',
                href: '/',
                linkText: 'Cards',
            },
        ],
        footerText: 'Services are paid according to the current state of the currency and tariff.',
    }),
    transferConfig: () => ({
        title: 'Latest transfers',
        filterDescription: 'Filter selected: more than 100 $',
        transfers: [
            {
                id: '1',
                logo: 'apple',
                company: 'Apple Inc.',
                description: 'Apple ID Payment',
                lastDigits: '1234',
                date: '2021-01-01',
                amount: '100 $',
            },
            {
                id: '2',
                logo: 'pinterest',
                company: 'Pinterest',
                description: 'Pinterest Payment',
                lastDigits: '1234',
                date: '2021-01-01',
                amount: '150 $',
            },
            {
                id: '3',
                logo: 'spotify',
                company: 'Spotify',
                description: 'Spotify Payment',
                lastDigits: '1234',
                date: '2021-01-01',
                amount: '150 $',
            },
        ],
    }),
})

const handleServiceSearch = (_query: string) => {
    // Implement service search handler
}

const handleLocationChange = (_location: string) => {
    // Implement location change handler
}

const handleServiceSearchClick = () => {
    // Implement service search click handler
}

const handleToggleSearch = () => {
    // Implement toggle search handler
}

const handleTransferFilter = () => {
    // Implement transfer filter handler
}

const handleTransferAdd = () => {
    // Implement transfer add handler
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

*,
*:before,
*:after {
    box-sizing: border-box;
}

img {
    display: block;
    max-width: 100%;
}

button,
select,
input,
textarea {
    font: inherit;
}

a {
    color: inherit;
}

.responsive-wrapper {
    width: 90%;
    max-width: 1600px;
    margin-left: auto;
    margin-right: auto;
}

.footer {
    margin-top: auto;
    h1 {
        font-size: 1.5rem;
        line-height: 1.125;
        display: flex;
        align-items: flex-start;
        small {
            font-size: 0.5em;
            margin-left: 0.25em;
        }
    }

    div {
        border-top: 1px solid var(--c-gray-600);
        margin-top: 1.5rem;
        padding-top: 1rem;
        font-size: 0.75rem;
        color: var(--c-text-tertiary);
    }
}

.tiles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 1rem;
    row-gap: 1rem;
    margin-top: 1.25rem;
    @media (max-width: 700px) {
        grid-template-columns: repeat(1, 1fr);
    }
}

.tile {
    padding: 1rem;
    border-radius: 8px;
    background-color: var(--c-olive-500);
    color: var(--c-gray-900);
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    transition: 0.25s ease;

    &:hover {
        transform: translateY(-5px);
    }

    &:focus-within {
        box-shadow: 0 0 0 2px var(--c-gray-800), 0 0 0 4px var(--c-olive-500);
    }

    &:nth-child(2) {
        background-color: var(--c-green-500);
        &:focus-within {
            box-shadow: 0 0 0 2px var(--c-gray-800), 0 0 0 4px var(--c-green-500);
        }
    }
    &:nth-child(3) {
        background-color: var(--c-gray-300);
        &:focus-within {
            box-shadow: 0 0 0 2px var(--c-gray-800), 0 0 0 4px var(--c-gray-300);
        }
    }

    a {
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 600;

        .icon-button {
            color: inherit;
            border-color: inherit;
            &:hover,
            &:focus {
                background-color: transparent;
                i {
                    transform: none;
                }
            }
        }

        &:focus {
            box-shadow: none;
        }

        &:after {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
}

.tile-header {
    display: flex;
    align-items: center;
    i {
        font-size: 2.5em;
    }

    h3 {
        display: flex;
        flex-direction: column;
        line-height: 1.375;
        margin-left: 0.5rem;
        span:first-child {
            font-weight: 600;
        }

        span:last-child {
            font-size: 0.825em;
            font-weight: 200;
        }
    }
}

.service-section {
    & > h2 {
        font-size: 1.5rem;
        margin-bottom: 1.25rem;
    }
}

.service-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > * + * {
        margin-left: 1.25rem;
    }

    @media (max-width: 1000px) {
        display: none;
    }
}

.service-section-footer {
    color: var(--c-text-tertiary);
    margin-top: 1rem;
}

.search-field {
    display: flex;
    flex-grow: 1;
    position: relative;
    input {
        width: 100%;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        border: 0;
        border-bottom: 1px solid var(--c-gray-600);
        background-color: transparent;
        padding-left: 1.5rem;
    }

    i {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
    }
}

.dropdown-field {
    display: flex;
    flex-grow: 1;
    position: relative;
    select {
        width: 100%;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        border: 0;
        border-bottom: 1px solid var(--c-gray-600);
        background-color: transparent;
        padding-right: 1.5rem;
        appearance: none;
        color: var(--c-text-tertiary);
        width: 100%;
    }

    i {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    }
}

.flat-button {
    border-radius: 6px;
    background-color: var(--c-gray-700);
    padding: 0.5em 1.5em;
    border: 0;
    color: var(--c-text-secondary);
    transition: 0.25s ease;
    cursor: pointer;
    &:hover,
    &:focus {
        background-color: var(--c-gray-600);
    }
}

.mobile-only {
    display: none;
    @media (max-width: 1000px) {
        display: inline-flex;
    }
}

.transfer-section {
    margin-top: 2.5rem;
}

.transfer-section-header {
    display: flex;
    align-items: center;
    width: 100%;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--c-gray-600);
    h2 {
        font-size: 1.5rem;
    }
}

.filter-options {
    margin-left: 1.25rem;
    padding-left: 1.25rem;
    border-left: 1px solid var(--c-gray-600);
    display: flex;
    align-items: center;
    flex: 1 1 auto;

    p {
        & + * {
            margin-left: auto;
            margin-right: 0.75rem;
        }
        color: var(--c-text-tertiary);
        font-size: 0.875rem;
        @media (max-width: 1000px) {
            display: none;
        }
    }
}

.transfers {
    display: flex;
    flex-direction: column;
    margin-top: 1.5rem;
}

.transfer {
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 0.875rem;
    @media (max-width: 1000px) {
        align-items: flex-start;
        flex-direction: column;
    }
    & + * {
        margin-top: 2rem;
    }
}

.transfer-logo {
    background-color: var(--c-gray-200);
    border-radius: 4px;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
        width: 45%;
    }
}

.transfer-details {
    margin-left: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    @media (max-width: 1000px) {
        flex-wrap: wrap;
        margin-left: 0;
        margin-top: 1rem;
    }
    div {
        width: calc(100% / 3 - 1rem);
        @media (max-width: 1000px) {
            width: 100%;
        }
        & + div {
            margin-left: 1rem;
            @media (max-width: 1000px) {
                margin-left: 0;
                margin-top: 1rem;
            }
        }
    }

    dd {
        color: var(--c-text-tertiary);
        margin-top: 2px;
    }
}

.transfer-number {
    margin-left: 2rem;
    font-size: 1.125rem;
    flex-shrink: 0;
    width: 15%;
    display: flex;
    justify-content: flex-end;
    @media (max-width: 1000px) {
        margin-left: 0;
        margin-top: 1.25rem;
        width: 100%;
        justify-content: flex-start;
    }
}

.payment-section {
    & > h2 {
        font-size: 1.5rem;
    }
}

.payment-section-header {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    p {
        color: var(--c-text-tertiary);
        font-size: 0.875rem;
    }

    div {
        padding-left: 1rem;
        margin-left: auto;
        display: flex;
        align-items: center;
        & > * + * {
            margin-left: 0.5rem;
        }
    }
}

.card-button {
    display: flex;
    width: 50px;
    height: 34px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: transparent;
    transition: 0.25s ease;
    border-radius: 4px;
    border: 2px solid var(--c-gray-600);
    color: var(--c-text-primary);
    cursor: pointer;
    &.mastercard svg {
        max-height: 15px;
    }

    &:focus,
    &:hover,
    &.active {
        color: var(--c-gray-800);
        background-color: var(--c-white);
        border-color: var(--c-white);
    }
}

.payment-section-footer {
    display: flex;
    align-items: center;
    margin-top: 1.5rem;
}

.save-button {
    border: 1px solid currentColor;
    color: var(--c-text-tertiary);
    border-radius: 6px;
    padding: 0.75em 2.5em;
    background-color: transparent;
    transition: 0.25s ease;
    cursor: pointer;
    &:focus,
    &:hover {
        color: var(--c-white);
    }
}

.settings-button {
    display: flex;
    align-items: center;
    color: var(--c-text-tertiary);
    background-color: transparent;
    border: 0;
    padding: 0;
    margin-left: 1.5rem;
    cursor: pointer;
    transition: 0.25s ease;
    i {
        margin-right: 0.5rem;
    }
    &:focus,
    &:hover {
        color: var(--c-white);
    }
}
</style>
