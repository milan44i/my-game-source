import { AUTH } from '@/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'

export const firstLoad = () => {
  const userStore = useUserStore()
  const loading = ref(true)

  onAuthStateChanged(AUTH, async user => {
    if (user) {
      try {
        userStore.user = await userStore.fetchUser(user.uid)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    loading.value = false
  })

  return { loading }
}

export const isAuthenticated = () => {
  const user = AUTH.currentUser
  if (!user) return '/signin'
  return true
}

export const isLoggedIn = () => {
  const user = AUTH.currentUser
  return user ? '/' : true
}
