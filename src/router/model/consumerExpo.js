/**
 * 消博会
 */
export default {
    path: '/consumerExpo',
    name: 'consumerExpo',
    redirect: '/consumerExpo/loginCode',
    children: [
        {
            path: 'loginCode',
            name: 'consumerExpoLogin',
            component: () => import('@/views/consumerExpo/loginCode.vue')
        },
        // 签到客户列表
        {
            path: 'index',
            name: 'consumerExpoIndex',
            component: () => import('@/views/consumerExpo/index.vue')
        },
        // 客户信息提交
        {
            path: 'signForm',
            name: 'signForm',
            component: () => import('@/views/consumerExpo/signForm.vue')
        },
        // 客户信息提交
        {
            path: 'bcForm',
            name: 'bcForm',
            component: () => import('@/views/consumerExpo/bcForm.vue')
        },
    ]
}