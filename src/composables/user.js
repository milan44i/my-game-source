import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import * as yup from 'yup'

export const updateProfile = () => {
  const userStore = useUserStore()
  const firstName = ref(userStore.user?.firstName || '')
  const lastName = ref(userStore.user?.lastName || '')

  const formSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
  })

  function onSubmit(values) {
    console.log(values)
    userStore.updateProfile(values)
  }

  return {
    firstName,
    lastName,
    formSchema,
    onSubmit,
  }
}
