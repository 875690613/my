/**
 * 毕业生招聘官
 */
export default {
    path: '/recruiter',
    name: 'recruiter',
    redirect: '/recruiter/login',
    children: [
        {
            path: 'loginCode',
            name: 'recruiterLogin',
            component: () => import('@/views/recruiter/loginCode.vue')
        },
        // 招聘官列表
        {
            path: 'index',
            name: 'recruiterIndex',
            component: () => import('@/views/recruiter/index.vue')
        },
        // 招聘官申请介绍
        {
            path: 'applyFor',
            name: 'applyFor',
            component: () => import('@/views/recruiter/applyFor.vue')
        },
        // 认证申请
        {
            path: 'certificationForm',
            name: 'certificationForm',
            component: () => import('@/views/recruiter/certificationForm.vue')
        },
    ]
}