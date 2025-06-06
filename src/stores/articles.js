import { defineStore } from 'pinia'
import router from '@/router'
import { DB } from '@/utils/firebase'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
} from 'firebase/firestore'
import { useUserStore } from './user'
import { useToast } from 'vue-toast-notification'

let articlesCol = collection(DB, 'articles')
const toast = useToast()

export const useArticleStore = defineStore('articles', {
  state: () => ({
    homeArticles: '',
    adminArticles: '',
    adminLastVisible: '',
    loading: false,
    error: null,
  }),

  getters: {
    getFeaturedArticles: state => {
      return state.homeArticles.slice(0, 2)
    },
  },

  actions: {
    async getArticles(docLimit = 10, admin = false) {
      this.loading = true
      try {
        const q = query(articlesCol, orderBy('timestamp', 'desc'), limit(docLimit))
        const articlesSnapshot = await getDocs(q)
        const lastVisible = articlesSnapshot.docs[articlesSnapshot.docs.length - 1]
        const articles =
          articlesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) || []
        if (admin) {
          this.adminArticles = articles
          this.adminLastVisible = lastVisible
        } else {
          this.homeArticles = articles
        }
      } catch (error) {
        this.error = error.message
        toast.error(`Error fetching articles: ${error.message}`)
        throw new Error(`Error fetching articles: ${error.message}`)
      } finally {
        this.loading = false
      }
    },
    async getMoreArticles(docLimit = 10) {
      this.loading = true
      try {
        if (this.adminLastVisible) {
          let oldArticles = this.adminArticles
          const q = query(
            articlesCol,
            orderBy('timestamp', 'desc'),
            startAfter(this.adminLastVisible),
            limit(docLimit),
          )
          const articlesSnapshot = await getDocs(q)
          const lastVisible = articlesSnapshot.docs[articlesSnapshot.docs.length - 1]
          const newArticles = articlesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          this.adminArticles = [...oldArticles, ...newArticles]
          this.adminLastVisible = lastVisible
        }
      } catch (error) {
        this.error = error.message
        toast.error(`Error fetching articles: ${error.message}`)
        throw new Error(`Error fetching articles: ${error.message}`)
      } finally {
        this.loading = false
      }
    },

    async getArticle(id) {
      this.loading = true
      try {
        const articleRef = doc(DB, 'articles', id)
        const articleSnapshot = await getDoc(articleRef)
        if (articleSnapshot.exists()) return articleSnapshot.data()
        throw new Error('Article not found')
      } catch (error) {
        this.error = error.message
        console.error('Error fetching article:', error)
        router.push({ name: 'not-found' })
      } finally {
        this.loading = false
      }
    },
    async addArticle(article) {
      this.loading = true
      try {
        const userStore = useUserStore()
        const user = userStore.getUserData
        if (!userStore.isAuthenticated) throw new Error('User not authenticated')

        // const newArticleRef = doc(DB, 'articles', article.id)
        const newArticleRef = doc(articlesCol)
        // await setDoc(newArticleRef, article)
        await setDoc(newArticleRef, {
          timestamp: serverTimestamp(),
          owner: {
            uid: user.uid,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          ...article,
        })
        toast.success('Article added successfully!')
        // this.articles.push(article)
        router.push({ name: 'admin-articles', query: { reload: true } })
        return true
      } catch (error) {
        this.error = error.message
        toast.error(`Error adding article: ${error.message}`)
        console.error('Error adding article:', error)
      } finally {
        this.loading = false
      }
    },

    async updateArticle(article) {
      this.loading = true
      try {
        // Get current article data to ensure we have complete data
        const articleRef = doc(DB, 'articles', article.id)
        const currentArticleSnapshot = await getDoc(articleRef)

        // Only update if article exists
        if (currentArticleSnapshot.exists()) {
          const currentArticle = currentArticleSnapshot.data()

          // Merge current data with updates, ensuring all required fields
          const updateData = {
            ...currentArticle,
            ...article,
            // Ensure editor content is preserved if not changed
            editor: article.editor || currentArticle.editor,
          }

          await updateDoc(articleRef, updateData)
          toast.success('Article updated successfully!')
          router.push({ name: 'admin-articles', query: { reload: true } })
          return updateData
        } else {
          throw new Error('Article not found')
        }
      } catch (error) {
        this.error = error.message
        toast.error(`Error updating article: ${error.message}`)
        console.error('Error updating article:', error)
      } finally {
        this.loading = false
      }
    },
    async deleteArticle(id) {
      this.loading = true
      try {
        await deleteDoc(doc(DB, 'articles', id))
        const newList = this.adminArticles.filter(article => article.id !== id)
        this.adminArticles = newList
        toast.success('Article deleted successfully!')
      } catch (error) {
        this.error = error.message
        toast.error(`Error deleting article: ${error.message}`)
        console.error('Error deleting article:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
