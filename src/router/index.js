import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/welfare',
      name: 'welfare',
      component: () => import('../views/welfare/welfareIndex.vue'),
      redirect: '/welfare/welfareMenu',
      children: [
        {
          path: 'welfareMenu',
          name: 'welfareMenu',
          component: () => import('../views/welfare/welfareMenu.vue')
        },
        {
          path: 'salary',
          name: 'salary',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/welfare/salary.vue')
        },
        {
          path: 'gifts',
          name:'gifts',
          component: () => import('../views/welfare/gifts.vue')
        },
        {
          path: 'myShop',
          name:'myShop',
          component: () => import('../views/myShop/index.vue')
        }
      ]
    },
    {
      path: '/recruit',
      name: 'recruit',
      component: () => import('../views/recruit/reIndex.vue'),
      children: [
        {
          path: 'list',
          name:'list',
          component: () => import('../views/recruit/list.vue')
        },{
          path: 'detail',
          name:'detail',
          component: () => import('../views/recruit/detail.vue')
        }
      ]
    },
    {
      path: '/myProject',
      name:'myProject',
      component: () => import('../views/myProject/index.vue')
    },
    {
      path: '/myProjectLogin',
      name:'myProjectLogin',
      component: () => import('../views/myProject/login.vue')
    },
    {
      path: '/myProjectDetail',
      name:'myProjectDetail',
      component: () => import('../views/myProject/detail.vue')
    },
  ]
})

export default router
