<script setup>
</script>

<template>
  <main class="container">
    <van-cell title="工资查询" icon="gold-coin-o" is-link to="/welfare/salary"></van-cell>
    <van-cell title="节日礼品领取记录" icon="gift-o" is-link to="/welfare/gifts"></van-cell>
    <van-cell title="我的店铺" icon="shop-o" is-link to="/welfare/myShopLogin"></van-cell>
    <van-cell title="优秀员工体检" icon="flower-o" is-link to="/welfare/staffPhysicalExam"></van-cell>
  </main>
</template>

<style scoped>
  .container {
    padding: 0 15px;
  }
</style>
