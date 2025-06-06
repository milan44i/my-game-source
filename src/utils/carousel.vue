<template>
  <div v-if="articleStore.getFeaturedArticles">
    <carousel :items-to-show="1" :wrap-around="true" class="p_top custom-carousel">
      <slide v-for="slide in articleStore.getFeaturedArticles" :key="slide.id">
        <div class="slider_bck" :style="{ background: `url(${slide.img})` }">
          <div class="slide_content">
            <div class="item">
              <div>{{ slide.title }}</div>
              <div>
                {{ slide.excerpt }}
              </div>
            </div>
          </div>
        </div>
      </slide>

      <template #addons>
        <Pagination />
      </template>
    </carousel>
  </div>
</template>

<script setup>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination } from 'vue3-carousel'
import { useArticleStore } from '@/stores/articles'

const articleStore = useArticleStore()
</script>

<style scoped>
.custom-carousel :deep(.carousel__pagination) {
  margin-top: 20px;
  position: relative;
  bottom: 10px;
}

.custom-carousel :deep(.carousel__pagination-button) {
  width: 20px;
  height: 4px;
  border-radius: 0;
  background-color: #ccc;
  margin: 4px;
}

.custom-carousel :deep(.carousel__pagination-button--active) {
  background-color: black;
}
</style>
