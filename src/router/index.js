import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import SiteList from '../views/SiteList.vue'
import QuizList from '../views/QuizList.vue'
import Settings from '../views/Settings.vue'

const routes = [
  { path: '/', component: SiteList },
  { path: '/quizzes', component: QuizList },
  { path: '/settings', component: Settings },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: SiteList },
    { path: '/quizzes', component: QuizList },
    { path: '/settings', component: Settings },
  ],
})

export default router
