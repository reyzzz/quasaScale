import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/user',
        name: 'users',
        component: () => import('pages/UserPage.vue'),
      },
      {
        path: '/node',
        name: 'nodes',
        component: () => import('pages/NodePage.vue'),
      },
      {
        path: '/dns',
        name: 'dns',
        component: () => import('pages/DNSPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
