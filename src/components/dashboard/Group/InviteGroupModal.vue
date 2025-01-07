<template>
    <TransitionRoot
        appear
        :show="modelValue"
        as="template"
    >
        <Dialog
            as="div"
            class="modal-wrapper"
            @close="$emit('update:modelValue', false)"
        >
            <TransitionChild
                as="template"
                enter="fade"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="fade"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="modal-backdrop" />
            </TransitionChild>

            <div class="modal d-block">
                <div class="modal-dialog modal-dialog-centered">
                    <TransitionChild
                        as="template"
                        enter="fade"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="fade"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel class="modal-content border-0 shadow">
                            <div class="modal-header border-bottom-0">
                                <DialogTitle
                                    as="h5"
                                    class="modal-title"
                                >
                                    Invite People to {{ group.name }}
                                </DialogTitle>
                                <button
                                    type="button"
                                    class="btn-close"
                                    @click="$emit('update:modelValue', false)"
                                >
                                    <span class="visually-hidden">Close</span>
                                </button>
                            </div>

                            <div class="modal-body pt-0">
                                <div class="d-flex align-items-center gap-2 bg-light rounded p-2 border">
                                    <code class="flex-grow-1 small text-dark">{{ inviteCode }}</code>
                                    <UseClipboard
                                        v-slot="{ copy, copied }"
                                        :source="inviteCode"
                                    >
                                        <b-button
                                            class="btn btn-primary btn-sm"
                                            toggle="toast"
                                            target="#liveToast"
                                            @click="copy()"
                                        >
                                            {{ copied ? 'Copied!' : 'Copy' }}
                                        </b-button>
                                    </UseClipboard>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
    <!-- Toast Notification -->
    <div
        class="toast-container position-fixed bottom-0 end-0 p-3"
    >
        <Toast
            id="liveToast"
            variant="success"
        >
            <ToastBody>
                Invitation code copied to clipboard!
            </ToastBody>
        </Toast>
    </div>
</template>

<script setup lang="ts">
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import type { Group } from '~/composables/useGroup'

const props = defineProps<{
    modelValue: boolean
    group: Group
}>()

defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const inviteCode = ref(props.group.invitationCode)
</script>

<style scoped>
.modal-wrapper {
    position: relative;
    z-index: 1050;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: scale(1);
}
</style>
