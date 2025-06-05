<template>
  <div v-if="loading" class="text-center m-3">
    <v-progress-circular indeterminate color="primary" />
  </div>
  <div v-else>
    <Header />
    <router-view />
  </div>
</template>

<script setup>
import Header from '@/components/navigation/header.vue'
import { useUserStore } from '@/stores/user'
import { firstLoad } from '@/composables/auth'

const userStore = useUserStore()
const { loading } = firstLoad()
</script>
