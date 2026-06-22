import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomeView.vue'),
    },
    {
      path: '/pontos',
      name: 'pontos',
      component: () => import('../pages/PontosListView.vue'),
    },
    {
      path: '/pontos/:id',
      name: 'ponto-details',
      component: () => import('../pages/PontoDetailsView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../pages/AdminView.vue'),
    },
    {
      path: '/admin/novo',
      name: 'admin-novo',
      component: () => import('../pages/PontoFormView.vue'),
    },
    {
      path: '/admin/editar/:id',
      name: 'admin-editar',
      component: () => import('../pages/PontoFormView.vue'),
    },
  ],
})

export default router
