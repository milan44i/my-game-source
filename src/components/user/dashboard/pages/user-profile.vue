<template>
  <h1>User Profile</h1>
  <hr />

  <Form class="mb-5 col-md-5" @submit="onSubmit" :validation-schema="formSchema">
    <div class="mb-4">
      <Field name="firstname" v-model="firstName" v-slot="{ field, errors, errorMessage }">
        <input
          type="text"
          class="form-control"
          placeholder="Enter your first name"
          v-bind="field"
          :class="{ 'is-invalid': errors.length !== 0 }"
        />
        <div class="input_alert" v-if="errors.length !== 0">
          {{ errorMessage }}
        </div>
      </Field>
    </div>

    <div class="mb-4">
      <Field name="lastname" v-model="lastName" v-slot="{ field, errors, errorMessage }">
        <input
          type="text"
          class="form-control"
          placeholder="Enter your last name"
          v-bind="field"
          :class="{ 'is-invalid': errors.length !== 0 }"
        />
        <div class="input_alert" v-if="errors.length !== 0">
          {{ errorMessage }}
        </div>
      </Field>
    </div>

    <v-btn type="submit" variant="outlined" :disabled="userStore.loading" :loading="userStore.loading">
      Update profile
    </v-btn>
  </Form>
</template>

<script setup>
import { Field, Form } from 'vee-validate'
import { updateProfile } from '@/composables/user'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const { formSchema, onSubmit, firstName, lastName } = updateProfile()
</script>
