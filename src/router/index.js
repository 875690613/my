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
      ]
    },
   
    ...extendRoutes
  ]
})
const hasRedirected = localStorage.getItem('hasRedirected');

router.beforeEach((to, from, next) => {
  if (to.path === '/' && !hasRedirected) {
    localStorage.setItem('hasRedirected', true);
    next('/HomeView');
  } else {
    next();
  }
});
export default router
