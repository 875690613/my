/**
 * 我的集团
 */
export default {
    path: '/myGroup',
    name: 'myGroup',
    redirect: '/myGroup/loginCode',
    children: [
        {
            path: 'loginCode',
            name: 'myGroupLoginCode',//集团首页带验证码
            component: () => import('@/views/myGroup/loginCode.vue')
        },
        {
            path: 'login',
            name: 'myGroupLogin',//集团首页
            component: () => import('@/views/myGroup/login.vue')
        },
        {
            path: 'index',
            name: 'myGroupIndex',//提交申请页面
            component: () => import('@/views/myGroup/index.vue')
        },
        {
            path: 'detail',
            name: 'myGroupDetail',////集团详情
            component: () => import('@/views/myGroup/detail.vue')
        }
    ]
}