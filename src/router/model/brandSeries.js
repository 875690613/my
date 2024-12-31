/**
 * 品牌系列
 */
export default {
    path: '/brandSeries',
    name: 'brandSeries',
    redirect: '/brandSeries/login',
    children: [
        {
            path: 'login',
            name: 'brandSeriesLogin',
            component: () => import('@/views/brandSeries/login.vue')
        },
        // 品牌系列列表
        {
            path: 'index',
            name: 'brandSeriesIndex',
            component: () => import('@/views/brandSeries/index.vue')
        },
        // 面料采购和入库列表
        {
            path: 'fabricList',
            name: 'fabricList',
            component: () => import('@/views/brandSeries/fabricList.vue')
        },
        // 品牌系列详情
        {
            path: 'brandSeriesDetail',
            name: 'brandSeriesDetail',
            component: () => import('@/views/brandSeries/brandSeriesDetail.vue')
        },
        // 订单、面料进度
        {
            path: 'orderProgress',
            name: 'brandSeriesOrderProgress',
            component: () => import('@/views/brandSeries/orderProgress.vue')
        },
        // 面料详情
        {
            path: 'fabricDetails',
            name: 'fabricDetails',
            component: () => import('@/views/brandSeries/fabricDetails.vue')
        }
    ]
}