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
            path: 'nav',
            name: 'myGroupNav',//集团导航

            component: () => import('@/views/myGroup/nav.vue')
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
            path: 'employeeInfo',
            name: 'myGroupEmployeeInfo',//入职员工信息页面
            component: () => import('@/views/myGroup/employeeInfo.vue')
        },
        {
            path: 'detail',
            name: 'myGroupDetail',////集团详情
            component: () => import('@/views/myGroup/detail.vue')
        }
    ]
}