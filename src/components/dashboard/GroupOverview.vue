<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-medium text-gray-900">{{ group.name }}</h2>
      <span class="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
        {{ group.members.length }} members
      </span>
    </div>
    <div class="mt-6 flow-root">
      <ul role="list" class="-my-5 divide-y divide-gray-200">
        <li v-for="member in group.members" :key="member.id" class="py-4">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <img class="h-8 w-8 rounded-full" :src="member.avatar_url" :alt="member.name">
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-gray-900">{{ member.name }}</p>
              <p class="truncate text-sm text-gray-500">{{ member.points }} points</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  group: {
    name: string
    members: Array<{
      id: string
      name: string
      avatar_url: string
      points: number
    }>
  }
}>()
</script>