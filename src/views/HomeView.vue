<script setup>
import { RouterView } from 'vue-router'
document.title = '项目列表';
// 项目列表
let listData = $ref([
  {
    title: '工资查询',
    icon: 'gold-coin-o',
    path: '/welfare/salary'
  },
  {
    title: '节日礼品领取记录',
    icon: 'gift-o',
    path: '/welfare/gifts'
  },
  {
    title: '我的店铺',
    icon: 'shop-o',
    path: '/welfare/myShopLogin'
  },
  {
    title: '优秀员工体检',
    
    icon: 'flower-o',
    path: '/welfare/staffPhysicalExam'
  },
])
</script>

<template>
    <main class="container" v-if="false">
        <van-cell v-for="(item,index) in listData" :title="item.title" :icon="item.icon" is-link :to="item.path" ></van-cell>
        <!-- <van-cell title="节日礼品领取记录" icon="gift-o" is-link to="/welfare/gifts"></van-cell>
        <van-cell title="我的店铺" icon="shop-o" is-link to="/welfare/myShopLogin"></van-cell>
        <van-cell title="优秀员工体检" icon="flower-o" is-link to="/welfare/staffPhysicalExam"></van-cell> -->
    </main>
    <div>
        <!-- 跳转到试衣工招聘页面fitWorkerHire -->
        <!-- <router-view name="fitWorkerHire">试衣工招聘</router-view> -->
        
        <!-- 品牌列表--brandAuth -->
        <!-- https://welfare.zhuritec.com/brandAuth/brandAuthIndex -->
        <!-- 系列周计划--brandSeries -->
        <!-- https://welfare.zhuritec.com/brandSeries/index -->
        <!-- 薪福通--cardApplication 暂停开发 -->
        <!-- https://welfare.zhuritec.com/cardApplication/loginCode -->
        <!-- 渠道网点--channelNetwork -->
        <!-- https://welfare.zhuritec.com/channelNetwork -->
        <!-- 试衣工招聘--fitWorkerHire -->
        <!-- https://welfare.zhuritec.com/fitWorkerHire/index -->
        <!-- 我的集团-申请员工证-入职员工信息-myGroup -->
        <!-- https://welfare.zhuritec.com/myGroup/loginCode -->
        <!-- 我的项目查询--myProject -->
        <!-- https://welfare.zhuritec.com/myProject -->
        <!-- 店铺列表--myShop -->
        <!-- https://welfare.zhuritec.com/welfare/myShop -->
        <!-- 招聘--recruit -->
        <!-- https://welfare.zhuritec.com/recruit/rlist -->
        <!-- 毕业生招聘官--recruiter -->
        <!-- https://welfare.zhuritec.com/recruiter/loginCode -->
        <!-- 系列查询工具--series -->
        <!-- https://welfare.zhuritec.com/series/slogin -->
        <!-- 优秀员工体检--staffPhysicalExam -->
        <!-- https://welfare.zhuritec.com/welfare/staffPhysicalExam -->
        <!-- 摊位列表--stall -->
        <!-- https://welfare.zhuritec.com/stall/stallList -->
        <!-- 供应商地图--supplier -->
        <!-- https://welfare.zhuritec.com/supplier/login -->
        <!-- 供应商对账--supplierReconcile -->
        <!-- https://welfare.zhuritec.com/supplierReconcile/login -->
        <!-- 年会照片排行榜--theCharts -->
        <!-- https://welfare.zhuritec.com/theCharts/index -->
        <!-- 我的福利--welfare -->
        <!-- https://welfare.zhuritec.com/welfare/welfareMenu -->
        
    </div>

</template>

<style scoped>
</style>
