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
                        <DialogPanel class="modal-content">
                            <div class="modal-header">
                                <DialogTitle
                                    as="h5"
                                    class="modal-title"
                                >
                                    Join a Group
                                </DialogTitle>
                                <button
                                    type="button"
                                    class="btn-close"
                                    aria-label="Close"
                                    @click="$emit('update:modelValue', false)"
                                />
                            </div>

                            <div class="modal-body">
                                <form @submit.prevent="handleSubmit">
                                    <div class="mb-3">
                                        <label
                                            for="inviteCode"
                                            class="form-label"
                                        >Invite Code</label>
                                        <input
                                            id="inviteCode"
                                            v-model="inviteCode"
                                            type="text"
                                            placeholder="Enter the group invite code"
                                            class="form-control"
                                            required
                                        >
                                    </div>

                                    <div
                                        v-if="error"
                                        class="alert alert-danger"
                                    >
                                        {{ error }}
                                    </div>

                                    <div class="modal-footer px-0 pb-0">
                                        <button
                                            type="button"
                                            class="btn btn-secondary"
                                            @click="$emit('update:modelValue', false)"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            :disabled="loading"
                                            class="btn btn-primary"
                                        >
                                            <span v-if="loading">Joining...</span>
                                            <span v-else>Join Group</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'

defineProps<{
    modelValue: boolean
}>()

const inviteCode = ref('')
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const { loading, error, joinGroup } = useGroup()

const handleSubmit = async () => {
    const result = await joinGroup(inviteCode.value)
    if (result) {
        inviteCode.value = ''
        emit('update:modelValue', false)
    }
}
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
