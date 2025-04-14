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
      我
        
    </div>

</template>

<style scoped>
</style>
