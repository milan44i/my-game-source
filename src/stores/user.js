import { defineStore } from 'pinia'
import router from '@/router'
import { AUTH, DB } from '@/utils/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import errorCodes from '@/utils/fbcodes'

// const defaultUser = {
//   uid: null,
//   email: null,
//   firstName: null,
//   lastName: null,
//   isAdmin: null,
// }

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
    // error: null,
    // auth: false,
  }),
  getters: {
    isAuthenticated: state => !!state.user,
    getUserEmail: state => (state.user ? state.user.email : null),
    getUserData: state => {
      return state.user
    },
  },
  actions: {
    async register(email, password) {
      this.loading = true
      try {
        const userCredential = await createUserWithEmailAndPassword(AUTH, email, password)
        const newUser = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          isAdmin: false,
        }
        this.user = newUser
        // this.auth = true
        await setDoc(doc(DB, 'users', this.user.uid), newUser)
        router.push({ name: 'dashboard' })
      } catch (error) {
        this.error = error.message
        throw new Error(`${errorCodes(error.code)}`)
      } finally {
        this.loading = false
      }
    },

    async login(email, password) {
      this.loading = true
      try {
        const userCredential = await signInWithEmailAndPassword(AUTH, email, password)
        this.user = await this.fetchUser(userCredential.user.uid)
        // this.auth = true
        router.push({ name: 'dashboard' })
      } catch (error) {
        this.error = error.message
        console.log(error.code)

        throw new Error(`${errorCodes(error.code)}`)
      } finally {
        this.loading = false
      }
    },

    async logout() {
      await signOut(AUTH)
      this.user = null
      router.push({ name: 'home' })
    },

    async fetchUser(uid) {
      if (!uid) return
      try {
        const docRef = doc(DB, 'users', uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          return docSnap.data()
        } else {
          throw new Error('Could not find user!')
        }
      } catch (error) {
        throw new Error(`${errorCodes(error.code)}`)
      }
    },
  },
})
