/**
 * 排行榜
 */
export default {
    path: '/theCharts',
    name: 'theCharts',
    redirect: '/theCharts/index',
    children: [
       
        {
            path: 'index',
            name: 'theChartsIndex',//排行榜页面
            component: () => import('@/views/theCharts/index.vue')
        },
        
    ]
}