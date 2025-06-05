import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/components/home/index.vue'
import Signin from '@/components/user/signin.vue'

import Dashboard from '@/components/user/dashboard/index.vue'
import DashboardMain from '@/components/user/dashboard/main.vue'
import UserProfile from '@/components/user/dashboard/pages/user-profile.vue'
import AdminArticles from '@/components/user/dashboard/admin/articles.vue'
import AdminAddArticle from '@/components/user/dashboard/admin/add.vue'
import AdminEditArticle from '@/components/user/dashboard/admin/edit.vue'
import NotFound from '@/components/404.vue'
import { isAuthenticated, isLoggedIn } from '@/composables/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/signin', name: 'signin', beforeEnter: isLoggedIn, component: Signin },
    {
      path: '/user/dashboard',
      component: Dashboard,
      beforeEnter: isAuthenticated,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardMain,
        },
        {
          path: 'profile',
          name: 'user-profile',
          component: UserProfile,
        },
        {
          path: 'articles',
          name: 'admin-articles',
          component: AdminArticles,
        },
        {
          path: 'articles/add',
          name: 'admin-articles-add',
          component: AdminAddArticle,
        },
        {
          path: 'articles/edit/:id',
          name: 'admin-articles-edit',
          component: AdminEditArticle,
        },
      ],
    },
    { path: '/:notFound(.*)*', component: NotFound, name: 'not-found' },
  ],
})

export default router
