// 试衣工招聘
export default {
    path: '/fitWorkerHire',
    name: 'fitWorkerHire',
    redirect: '/fitWorkerHire/index',
    children: [
        {
            path: 'index',
            name: 'hireIndex',
            component: () => import('@/views/fitWorkerHire/index.vue')
        },
        {
            path: 'detail',
            name: 'hireDetail',
            component: () => import('@/views/fitWorkerHire/detail.vue')
        },
    ]
}