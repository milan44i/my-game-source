<template>
  <div class="text-center m-3" v-show="articleStore.loading">
    <v-progress-circular indeterminate color="primary" />
  </div>
  <div v-show="!articleStore.loading">
    <v-table theme="dark">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Owner</th>
          <th class="text-left">Rating</th>
          <th class="text-left">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in articleStore.adminArticles">
          <td>{{ article.game }}</td>
          <td>{{ article.owner.firstname }} {{ article.owner.lastname }}</td>
          <td>{{ article.rating }}</td>
          <td>{{ article.timestamp.toDate().toDateString() }}</td>
          <td>
            <v-btn
              variant="outlined"
              color="red"
              size="small"
              @click="articleStore.deleteArticle(article.id)"
            >
              Remove
            </v-btn>
          </td>
          <td>
            <v-btn
              variant="outlined"
              color="yellow"
              size="small"
              @click="router.push({ name: 'admin-articles-edit', params: { id: article.id } })"
            >
              Edit
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <div class="text-center m-3" v-if="btnLoad">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <v-btn v-else variant="outlined" @click="handleLoadMore" class="mt-3">Load More</v-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useArticleStore } from '@/stores/articles'
import { useRoute, useRouter } from 'vue-router'

const articleStore = useArticleStore()
const router = useRouter()
const route = useRoute()

const btnLoad = ref(false)

const handleLoadMore = () => {
  btnLoad.value = true
  articleStore.getMoreArticles(3).finally(() => {
    btnLoad.value = false
  })
}

if (!articleStore.adminArticles || route.query.reload) {
  articleStore.getArticles(3, true)
}
</script>
