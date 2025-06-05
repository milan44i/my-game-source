import { defineStore } from 'pinia'
import router from '@/router'
import { AUTH, DB } from '@/utils/firebase'
import { collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { useUserStore } from './user'
import { useToast } from 'vue-toast-notification'

let articlesCol = collection(DB, 'articles')
const toast = useToast()

export const useArticleStore = defineStore('articles', {
  state: () => ({
    homeArticles: [],
    adminArticles: [],
    adminLastVisible: '',
    loading: false,
    error: null,
  }),

  getters: {},

  actions: {
    async getArticles() {
      this.loading = true
      try {
        const articlesSnapshot = await getDoc(doc(DB, 'articles'))
        this.articles = articlesSnapshot.data() || []
      } catch (error) {
        this.error = error.message
        console.error('Error fetching articles:', error)
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
          router.push({ name: 'admin-articles' })
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
  },
})
