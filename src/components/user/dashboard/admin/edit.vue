<template>
  <h1>Edit article</h1>
  <hr />

  <div v-if="articleStore.loading" class="text-center m-3">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <Form v-else class="mb-5" @submit="onSubmit" :validation-schema="formSchema">
    <div class="mb-4">
      <Field name="game" v-model="article.game" v-slot="{ field, errors, errorMessage }">
        <input
          type="text"
          placeholder="Enter game title"
          v-bind="field"
          class="form-control"
          :class="{ 'is-invalid': errors.length !== 0 }"
        />
        <div class="input_alert" v-if="errors.length !== 0">
          {{ errorMessage }}
        </div>
      </Field>
    </div>

    <div class="mb-4">
      <Field name="title" v-model="article.title" v-slot="{ field, errors, errorMessage }">
        <input
          type="text"
          placeholder="Title of the article"
          v-bind="field"
          class="form-control"
          :class="{ 'is-invalid': errors.length !== 0 }"
        />
        <div class="input_alert" v-if="errors.length !== 0">
          {{ errorMessage }}
        </div>
      </Field>
    </div>

    <div class="mb-4">
      <Field name="excerpt" v-model="article.excerpt" v-slot="{ field, errors, errorMessage }">
        <textarea
          rows="3"
          maxlength="200"
          placeholder="Add an excerpt"
          v-bind="field"
          class="form-control"
          :class="{ 'is-invalid': errors.length !== 0 }"
        />
        <div class="input_alert" v-if="errors.length !== 0">
          {{ errorMessage }}
        </div>
      </Field>
    </div>

    <div class="mb-4">
      <RichTextEditor @update="updateEditor" :content="article.editor" />
      <Field name="editor" v-model="veditor" v-slot="{ field, errors, errorMessage }">
        <input type="hidden" id="veditor" v-bind="field" />
        <div class="input_alert" v-if="errors.length !== 0">
          {{ errorMessage }}
        </div>
      </Field>
    </div>

    <div class="mb-4">
      <Field
        name="rating"
        v-model="article.rating"
        value="Select a rating"
        v-slot="{ field, errors, errorMessage }"
      >
        <select
          name="rating"
          id="rating"
          v-bind="field"
          class="form-select"
          :class="{ 'is-invalid': errors.length !== 0 }"
        >
          <option value="Select a rating" disabled>Select a rating</option>
          <option v-for="rating in ratingArray" :key="rating" :value="rating">{{ rating }}</option>
        </select>
        <div class="input_alert" v-if="errors.length !== 0">
          {{ errorMessage }}
        </div>
      </Field>
    </div>

    <div class="mb-4">
      <Field name="img" v-model="article.img" v-slot="{ field, errors, errorMessage }">
        <input
          type="text"
          placeholder="Add the source of the image"
          v-bind="field"
          class="form-control"
          :class="{ 'is-invalid': errors.length !== 0 }"
        />
        <div class="input_alert" v-if="errors.length !== 0">
          {{ errorMessage }}
        </div>
      </Field>
    </div>

    <v-btn type="submit" variant="outlined" :disabled="articleStore.loading" :loading="articleStore.loading">
      Edit article
    </v-btn>
  </Form>
</template>

<script setup>
import { Field, Form } from 'vee-validate'
import { formSchema } from './schema'
import RichTextEditor from '@/utils/rich-text-editor.vue'
import { ref } from 'vue'
import { useArticleStore } from '@/stores/articles'
import { useRoute } from 'vue-router'

const route = useRoute()
const articleStore = useArticleStore()
const ratingArray = [0, 1, 2, 3, 4, 5]
const veditor = ref(null)
const article = ref({})

function onSubmit(values, { resetForm }) {
  if (!veditor.value && article.value.editor) {
    values.editor = article.value.editor
  }
  articleStore.updateArticle({ id: route.params.id, ...values })
}

function updateEditor(value) {
  veditor.value = value
}

articleStore
  .getArticle(route.params.id)
  .then(response => {
    article.value = { ...response }
    veditor.value = response.editor
  })
  .catch(error => {
    console.error('Error fetching article:', error)
    toast.error('Failed to load article data.', error.message)
  })
</script>
