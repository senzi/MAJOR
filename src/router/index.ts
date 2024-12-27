import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ChatView from '@/views/ChatView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/chat/:sceneId',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      props: true
    },
    {
      path: '/template/:id',
      name: 'template-editor',
      component: () => import('../views/TemplateEditor.vue')
    }
  ]
})

export default router