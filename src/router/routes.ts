import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/users',
        name: 'users',
        component: () => import('pages/UsersPage.vue'),
      },
      {
        path: '/nodes',
        name: 'nodes',
        alias: '/',
        component: () => import('pages/NodesPage.vue'),
      },
      {
        path: '/dns',
        name: 'dns',
        component: () => import('pages/DnsPage.vue'),
      },
      {
        path: '/acl',
        name: 'acl',
        component: () => import('pages/AclsPage.vue'),
      },
      {
        path: '/headscale-instances',
        name: 'headscale-instances',
        component: () => import('pages/HeadscaleInstancesPage.vue'),
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
