import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import SiteList from '../views/SiteList.vue'
import Quizzes from '../views/Quizzes.vue'
import Settings from '../views/Settings.vue'

const routes = [
  { path: '/', component: SiteList },
  { path: '/quizzes', component: Quizzes },
  { path: '/settings', component: Settings },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: SiteList },
    { path: '/quizzes', component: Quizzes },
    { path: '/settings', component: Settings },
  ],
})

export default router
