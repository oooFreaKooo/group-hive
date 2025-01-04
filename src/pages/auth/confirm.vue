<template>
  <div class="flex min-h-[calc(100vh-4rem)] flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <div class="text-center">
          <h2 class="text-2xl font-bold mb-4">Confirming your authentication...</h2>
          <p class="text-gray-600">You will be redirected automatically.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This page handles OAuth callbacks and email confirmations
// The @nuxtjs/supabase module handles the redirect automatically
</script>