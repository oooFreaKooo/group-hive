<template>
    <NuxtLayout>
        <div class="error-container min-vh-100 d-flex align-items-center justify-content-center position-relative py-5 bg-primary bg-gradient">
            <div class="error-content container px-4">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-10 col-lg-8">
                        <div class="p-4 p-md-5 position-relative">
                            <div class="text-center position-relative mb-4">
                                <h1 class="error-code display-1 mb-0 fw-bolder text-white">
                                    {{ error?.statusCode || 500 }}
                                </h1>
                                <div class="error-line my-3" />
                            </div>
                            <div class="text-center mb-4">
                                <div class="d-flex align-items-center justify-content-center gap-3">
                                    <h2 class="error-message h1 mb-0 fw-semibold text-light">
                                        {{ getErrorTitle }}
                                    </h2>
                                    <AppIcon
                                        class="error-icon opacity-90 fs-1"
                                        name="emoji-frown"
                                        size="lg"
                                    />
                                </div>
                            </div>
                            <div class="text-center mb-5">
                                <p
                                    class="text-light fs-5 lh-sm mb-0 mx-auto"
                                    style="max-width: 600px; white-space: pre-line"
                                >
                                    {{ getErrorDescription }}
                                </p>
                            </div>
                            <div class="text-center">
                                <AnimatedButton
                                    :label="error?.statusCode === 404 ? 'Zur Startseite' : 'Erneut versuchen'"
                                    :to="error?.statusCode === 404 ? '/' : ''"
                                    color="light"
                                    :icon="error?.statusCode === 404 ? 'skip-backward' : 'arrow-repeat'"
                                    width="50"
                                    class="btn btn-lg rounded-0 px-4 py-3"
                                    @click="error?.statusCode !== 404 && handleRetry()"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import type { H3Error } from 'h3'

const props = defineProps<{
    error: H3Error
}>()

const getErrorTitle = computed(() => {
    // Handle undefined error object
    if (!props.error) {
        return 'Ein Fehler ist aufgetreten'
    }

    // Map English status messages to German ones
    if (props.error.statusMessage && typeof props.error.statusMessage === 'string') {
        const englishToGerman: Record<string, string> = {
            'Page Not Found': 'Seite nicht gefunden',
            'Not Found': 'Seite nicht gefunden',
            'Forbidden': 'Zugriff verweigert',
            'Server Error': 'Serverfehler',
            'Service Unavailable': 'Service nicht verfügbar',
            'Internal Server Error': 'Serverfehler',
            'Critical Error': 'Kritischer Fehler',
        }

        const germanMessage = englishToGerman[props.error.statusMessage]
        if (germanMessage) {
            return germanMessage
        }
    }

    // Otherwise fallback to default messages
    switch (props.error.statusCode) {
        case 404:
            return 'Seite nicht gefunden'
        case 403:
            return 'Zugriff verweigert'
        case 500:
            return props.error.fatal ? 'Kritischer Fehler' : 'Serverfehler'
        case 503:
            return 'Service nicht verfügbar'
        default:
            return 'Ein Fehler ist aufgetreten'
    }
})

const getErrorDescription = computed(() => {
    // Handle undefined error object
    if (!props.error) {
        return 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
    }

    let description = ''

    try {
        // If we have custom error data, use it
        if (props.error.data) {
            if (typeof props.error.data === 'string') {
                description = props.error.data
            } else if (typeof props.error.data === 'object' && props.error.data !== null) {
                // Handle custom error data object
                const errorData = props.error.data as Record<string, unknown>

                // Check for URL in the error message (common in 404 errors)
                if (typeof errorData.url === 'string') {
                    return `Die angeforderte URL "${errorData.url}" wurde nicht gefunden.`
                }

                // Try to extract a message from the error data
                if (errorData.message && typeof errorData.message === 'string') {
                    description = errorData.message
                } else if (errorData.statusMessage && typeof errorData.statusMessage === 'string') {
                    description = errorData.statusMessage
                } else {
                    // If we can't extract a proper message, use default messages
                    return getDefaultErrorMessage(props.error.statusCode)
                }
            }
        }

        // If no custom data message, check for cause
        if (!description && props.error.cause) {
            if (typeof props.error.cause === 'string') {
                description = props.error.cause
            } else if (typeof props.error.cause === 'object' && props.error.cause !== null) {
                const cause = props.error.cause as Record<string, unknown>
                if (cause.message && typeof cause.message === 'string') {
                    description = cause.message
                } else {
                    return getDefaultErrorMessage(props.error.statusCode)
                }
            }
        }

        // Add additional context based on error type
        if (description.includes('url')) {
            return 'Ein Bild konnte nicht geladen werden. Bitte überprüfen Sie, ob alle Bilder korrekt hochgeladen wurden und verfügbar sind.\n\nTechnische Details:\n' + description
        }

        // If still no description, use default messages
        if (!description) {
            return getDefaultErrorMessage(props.error.statusCode)
        }

        return description
    } catch (e) {
        console.error('Error while processing error description:', e)
        return getDefaultErrorMessage(props.error.statusCode)
    }
})

// Helper function to get default error messages
const getDefaultErrorMessage = (statusCode?: number) => {
    switch (statusCode) {
        case 404:
            return 'Entschuldigung, die gesuchte Seite wurde möglicherweise verschoben oder existiert nicht mehr.'
        case 403:
            return 'Sie haben keine Berechtigung, auf diese Seite zuzugreifen.'
        case 500:
            return props.error?.fatal
                ? 'Ein kritischer Fehler ist aufgetreten. Bitte laden Sie die Seite neu.'
                : 'Ein interner Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
        case 503:
            return 'Der Service ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.'
        default:
            return props.error?.unhandled
                ? 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
                : 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
    }
}

// Debug logging in development
if (import.meta.dev) {
    watchEffect(() => {
        console.log('Nuxt Error Object:', {
            statusCode: props.error?.statusCode,
            statusMessage: props.error?.statusMessage,
            fatal: props.error?.fatal,
            unhandled: props.error?.unhandled,
            data: props.error?.data,
            cause: props.error?.cause,
        })
    })
}

const handleRetry = () => {
    window.location.reload()
}
</script>

<style scoped lang="scss">
.error-container {

    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        width: 200%;
        height: 200%;
        top: -50%;
        left: -50%;
        background: radial-gradient(circle, rgba(var(--bs-tertiary-rgb), 0.15) 0%, transparent 70%);
        animation: rotate 30s linear infinite;
    }
}

.error-content {
    animation: fadeIn 0.5s ease-out;
}

.error-code {
    font-size: 6rem;
    letter-spacing: -0.05em;
    text-shadow: 2px 2px 2px rgba(var(--bs-dark-rgb), 0.5);
    background: linear-gradient(90deg, var(--bs-danger), var(--bs-danger));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    @media (min-width: 768px) {
        font-size: 8rem;
    }

}

.error-line {
    height: 2px;
    background: linear-gradient(90deg, var(--bs-light), var(--bs-light));
    animation: lineGrow 0.5s ease-out 0.5s forwards;
    box-shadow: 0 0 10px rgba(var(--bs-primary-rgb), 0.5);
    max-width: 200px;
    margin-left: auto;
    margin-right: auto;

}

.error-message {
    animation: slideDown 0.5s ease-out 0.1s both;
}

.error-icon {
    animation: slideDown 0.5s ease-out 0.1s both;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes lineGrow {
    from { width: 0; }
    to { width: 100%; }
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
