<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" @close="$emit('update:modelValue', false)" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                Join a Group
              </DialogTitle>

              <form @submit.prevent="handleSubmit" class="mt-4">
                <div>
                  <label for="inviteCode" class="block text-sm font-medium text-gray-700">Invite Code</label>
                  <input
                    type="text"
                    id="inviteCode"
                    v-model="inviteCode"
                    placeholder="Enter the group invite code"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                  />
                </div>

                <div v-if="error" class="mt-4 text-sm text-red-600">
                  {{ error }}
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="$emit('update:modelValue', false)"
                    class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
                  >
                    <span v-if="loading">Joining...</span>
                    <span v-else>Join Group</span>
                  </button>
                </div>
              </form>
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

const props = defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const inviteCode = ref('')
const { currentGroup, loading, error, joinGroup } = useGroup()

const handleSubmit = async () => {
  await joinGroup(inviteCode.value)
}
</script> 