<script setup>
import { watchEffect } from "vue";
import { useRouter } from "vue-router";
import request from '@/utils/request'
import { onMounted } from "vue";
const router = useRouter();
let listData = $ref([])
let orderId = $ref()
watchEffect(() => {
  orderId = router.currentRoute.value.query.id
})

onMounted(() => {
  getOrderStateTree()
})

// 获取订单状态树
const getOrderStateTree = async () => {
  const params = {
    id: orderId
  }
  const { code, rows, msg } = await request.get('/api/myStyle/styleStatusTree', params)
  if (code === 200) {
    listData = rows
  }
}
</script>

<template>
  <van-nav-bar title="订单状态树" fixed :border="false" left-arrow left-text="返回" @click-left="router.back()" />
  <main class="scrollMain">
    <div style="padding: 15px;">
      <div>订单状态</div>
      <van-steps direction="vertical" :active="listData.length - 1">
        <van-step v-for="item in listData" :key="item">
          <h3>{{ item.Status }}</h3>
          <p>操作人：{{ item.Operator }}</p>
          <p>完成时间：{{ item.OperateTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </main>
</template>

<style scoped>
</style>
