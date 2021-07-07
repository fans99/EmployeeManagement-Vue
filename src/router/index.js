import { createRouter, createWebHistory } from 'vue-router'

const EmptyPage = () => import('../components/EmptyPage.vue')
const DepartmentPage = () => import('../components/system/DepartmentPage.vue')
const RolePage = () => import('../components/system/RolePage.vue')
const UserPage = () => import('../components/system/UserPage.vue')
const ActionLogPage = () => import('../components/system/log/ActionLogPage.vue')
const ExceptionLogPage = () => import('../components/system/log/ExceptionLogPage.vue')

const routes = [
  {
    path: '',
    component: EmptyPage
  },

  {
    path: '/system',
    component: EmptyPage,
  },

  {
    path: '/log',
    component: EmptyPage,
    alias: '/system/log'
  },

  {
    path: '/department',
    component: DepartmentPage,
    alias: '/system/department'
  },

  {
    path: '/role',
    component: RolePage,
    alias: '/system/role'
  },

  {
    path: '/user',
    component: UserPage,
    alias: '/system/user'
  },

  {
    path: '/action',
    component: ActionLogPage,
    alias: ['/system/log/action', '/system/action']
  },

  {
    path: '/exception',
    component: ExceptionLogPage,
    alias: ['/system/log/exception', '/system/exception']
  },

  {
    path: '/test',
    component: EmptyPage
  },

  {
    path: '/login',
    beforeEnter(to, from) {
      window.location = '/login.html'
      return false
    }
  },

  {
    path: '/space',
    beforeEnter(to, from) {
      window.location = '/space.html'
      return false
    }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router