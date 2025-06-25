<script setup>
import { RouterView } from 'vue-router'
document.title = '项目列表';
// 项目列表
let listData = $ref([
  {
    title: 'DCP变现计算器',
    icon: 'gold-coin-o',
    path: '/gpCalculator/bcForm'
  },
  // {
  //   title: '节日礼品领取记录',
  //   icon: 'gift-o',
  //   path: '/welfare/gifts'
  // },
  // {
  //   title: '我的店铺',
  //   icon: 'shop-o',
  //   path: '/welfare/myShopLogin'
  // },
  // {
  //   title: '优秀员工体检',
    
  //   icon: 'flower-o',
  //   path: '/welfare/staffPhysicalExam'
  // },
])
</script>

<template>
  <van-nav-bar title="工具箱" fixed :border="false"  />
  <main class="container" v-if="true">
    <van-cell v-for="(item,index) in listData" :title="item.title" :key="index" :icon="item.icon" is-link :to="item.path" ></van-cell>
    <!-- <van-cell title="节日礼品领取记录" icon="gift-o" is-link to="/welfare/gifts"></van-cell>
    <van-cell title="我的店铺" icon="shop-o" is-link to="/welfare/myShopLogin"></van-cell>
    <van-cell title="优秀员工体检" icon="flower-o" is-link to="/welfare/staffPhysicalExam"></van-cell> -->
  </main>

</template>

<style scoped>
.container {
  padding: 46px 0 20px;
  min-height: 100vh;
  background: #f7f8fa;
}
</style>
