export default {
  path: '/brandAuth',
  name: 'brandAuth',
  redirect: '/brandAuth/brandAuthIndex',
  children: [
    {
      path: 'brandAuthIndex',
      name:'brandAuthIndex',
      component: () => import('@/views/brandAuth/index.vue')
    },
    {
      path: 'brandAuthList',
      name:'brandAuthList',
      component: () => import('@/views/brandAuth/list.vue')
    },
    {
      path: 'brandAuthList2',
      name:'brandAuthList2',
      component: () => import('@/views/brandAuth/list2.vue')
    }
    ]
}