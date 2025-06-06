<template>
  <div class="container">
    <AppCarousel />
    <Featured />
  </div>
</template>

<script setup>
import AppCarousel from '@/utils/carousel.vue'

/// ARTICLE STORE
import { useArticleStore } from '@/stores/articles'
import Featured from './featured.vue'

const articleStore = useArticleStore()

if (!articleStore.homeArticles) {
  articleStore.getArticles(8)
}
</script>
