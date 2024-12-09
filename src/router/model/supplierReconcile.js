export default {
    path: '/supplierReconcile',
    name: 'supplierReconcile',
    redirect: '/supplierReconcile/login',
    children: [
        {
            path: 'login',
            name: 'supplierReconcileLogin',
            component: () => import('@/views/supplierReconcile/login.vue')
        },
        {
            path: 'index',
            name: 'supplierReconcileIndex',
            component: () => import('@/views/supplierReconcile/index.vue')
        },
        {
            path: 'list',
            name: 'supplierReconcileList',
            component: () => import('@/views/supplierReconcile/list.vue')
        },
        {
            path: 'detail',
            name: 'supplierReconcileDetail',
            component: () => import('@/views/supplierReconcile/detail.vue')
        },
        {
            path: 'detailDetail',
            name: 'supplierReconcileDetailDetail',
            component: () => import('@/views/supplierReconcile/detailDetail.vue')
        }
    ]
}