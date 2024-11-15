import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const modules = import.meta.glob('./model/*.js', { eager: true })

const extendRoutes = Object.keys(modules).map((path) => {
  return modules[path].default
})

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
          name: 'gifts',
          component: () => import('../views/welfare/gifts.vue')
        },
        {
          path: 'myShop',
          name: 'myShop',
          component: () => import('../views/myShop/index.vue')
        },
        {
          path: 'myShopLogin',
          name: 'myShopLogin',
          component: () => import('../views/myShop/login.vue')
        }
      ]
    },
    {
      path: '/recruit',
      name: 'recruit',
      component: () => import('../views/recruit/reIndex.vue'),
      children: [
        {
          path: 'rlist',
          name: 'rlist',
          component: () => import('../views/recruit/list.vue')
        }, {
          path: 'detail',
          name: 'detail',
          component: () => import('../views/recruit/detail.vue')
        }
      ]
    },
    {
      path: '/myProject',
      name: 'myProject',
      component: () => import('../views/myProject/index.vue')
    },
    {
      path: '/myProjectLogin',
      name: 'myProjectLogin',
      component: () => import('../views/myProject/login.vue')
    },
    {
      path: '/myProjectDetail',
      name: 'myProjectDetail',
      component: () => import('../views/myProject/detail.vue')
    },
    {
      path: '/series',
      name: 'series',
      component: () => import('../views/series/seIndex.vue'),
      redirect: '/series/slogin',
      children: [
        {
          path: 'slogin',
          name: 'slogin',
          component: () => import('../views/series/login.vue')
        },
        {
          path: 'list',
          name: 'list',
          component: () => import('../views/series/seList.vue')
        },
        {
          path: 'seDetail',
          name: 'seDetail',
          component: () => import('../views/series/seDetail.vue')
        },
        {
          path: 'styleOrder',
          name: 'styleOrder',
          component: () => import('../views/series/styleOrder.vue')
        },
        {
          path: 'orderDetail',
          name: 'orderDetail',
          component: () => import('../views/series/orderDetail.vue')
        },
        {
          path: 'orderState',
          name: 'orderState',
          component: () => import('../views/series/orderState.vue')
        },
        {
          path: 'fabric',
          name: 'fabric',
          component: () => import('../views/series/fabric.vue')
        },
        {
          path: 'customerOpinion',
          name: 'customerOpinion',
          component: () => import('../views/series/customerOpinion.vue')
        },
        {
          path: 'areaInfo',
          name: 'areaInfo',
          component: () => import('../views/series/areaInfo.vue')
        },
        {
          path: 'inspectionReport',
          name: 'inspectionReport',
          component: () => import('../views/series/inspectionReport.vue')
        },
        {
          path: 'sizeQuery',
          name: 'sizeQuery',
          component: () => import('../views/series/sizeQuery.vue')
        },
        {
          path: 'purchaseList',
          name: 'purchaseList',
          component: () => import('../views/series/purchaseList.vue')
        },
        {
          path: 'purchaseDetail',
          name: 'purchaseDetail',
          component: () => import('../views/series/purchaseDetail.vue')
        },
        {
          path: 'seProductList',
          name: 'seProductList',
          component: () => import('../views/series/seProductList.vue')
        },
        {
          path: 'seProductDetail',
          name: 'seProductDetail',
          component: () => import('../views/series/seProductDetail.vue')
        },
        {
          path: 'seStyleList',
          name: 'seStyleList',
          component: () => import('../views/series/seStyleList.vue')
        },
      ]
    },
    {
      path: '/stall',
      name: 'stall',
      component: () => import('../views/stall/stIndex.vue'),
      redirect: '/stall/login',
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/stall/login.vue')
        },
        {
          path: 'stallList',
          name: 'stallList',
          component: () => import('../views/stall/stallList.vue')
        },
      ]
    },
    {
      path: '/supplier',
      name: 'supplier',
      component: () => import('../views/supplier/spIndex.vue'),
      redirect: '/supplier/login',
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/supplier/supLogin.vue')
        },
        {
          path: 'spMap',
          name: 'spMap',
          component: () => import('../views/supplier/spMap.vue')
        },
        {
          path: 'gysInfo',
          name: 'gysInfo',
          component: () => import('../views/supplier/gysInfo.vue')
        },
        {
          path: 'gysOrderInfo',
          name: 'gysOrderInfo',
          component: () => import('../views/supplier/gysOrderInfo.vue')
        },
      ]
    },
    ...extendRoutes
  ]
})

export default router
