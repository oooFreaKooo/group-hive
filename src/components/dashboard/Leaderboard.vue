<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h2 class="text-lg font-medium text-gray-900">Leaderboard</h2>
    <div class="mt-6">
      <div class="flow-root">
        <ul role="list" class="-my-5 divide-y divide-gray-200">
          <li v-for="(member, index) in sortedMembers" :key="member.id" class="py-4">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0 text-sm font-medium" :class="getPositionClass(index)">
                #{{ index + 1 }}
              </div>
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
  </div>
</template>

<script setup lang="ts">
// Mock data - replace with actual data from Supabase
const members = ref([
  {
    id: 1,
    name: 'John Doe',
    avatar_url: "https://api.dicebear.com/9.x/avataaars-neutral/svg",
    points: 100
  }
])

const sortedMembers = computed(() => {
  return [...members.value].sort((a, b) => b.points - a.points)
})

const getPositionClass = (index: number) => {
  switch (index) {
    case 0:
      return 'text-yellow-500'
    case 1:
      return 'text-gray-400'
    case 2:
      return 'text-amber-600'
    default:
      return 'text-gray-500'
  }
}
</script>