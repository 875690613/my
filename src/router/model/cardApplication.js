/**
 * 毕业生招聘官
 */
export default {
    path: '/cardApplication',
    name: 'cardApplication',
    redirect: '/cardApplication/login',
    children: [
        {
            path: 'loginCode',
            name: 'cardApplicationLogin',
            component: () => import('@/views/cardApplication/loginCode.vue')
        },
        // 招聘官列表
        {
            path: 'index',
            name: 'cardApplicationIndex',
            component: () => import('@/views/cardApplication/index.vue')
        },
        
    ]
}