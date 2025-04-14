/**
 * 计算器模块路由配置

 */
export default {
    path: '/gpCalculator',
    name: 'gpCalculator',
    redirect: '/gpCalculator/index',
    children: [
        // 持仓列表
        {
            path: 'index',
            name: 'Index',
            component: () => import('@/views/gpCalculator/index.vue')
        },
        // 补仓提交
        {
            path: 'bcForm',
            name: 'bcForm',
            component: () => import('@/views/gpCalculator/bcForm.vue')
        },
    ]
}