<script setup>
import { onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router'
import request from '@/utils/request';
const router = useRouter()
document.title = '供应商对账';

let loading = $ref(false)

let orderId = $ref()
let regionId = $ref()
let colorId = $ref()

let pageIndex = $ref(0);
let title = ['对账单明细', '对账单凭证', '对账单发票']

let detailData = $ref(null)

watchEffect(() => {
  orderId = router.currentRoute.value.query.id
  regionId = router.currentRoute.value.query.regionId || 0
  colorId = router.currentRoute.value.query.colorId

  pageIndex = router.currentRoute.value.query.id;
})

// 获取订单详情数据
const getData = async () => {
  loading = true;
  const params = {
    id: orderId,
    colorId
  }
  const { code, rows, msg } = await request.get('/api/myStyle/myStyleDetail', params);
  if (code === 200) {
    detailData = rows
  }
  loading = false;
}

onMounted(() => {
  getData();
})
</script>

<template>
  <van-nav-bar :title="title[pageIndex]" fixed :border="false" left-arrow left-text="返回" @click-left="router.back()" />
  <main class="scrollMain">
    <div v-if="loading" class="loading-wrap">
      <van-loading>加载中...</van-loading>
    </div>
    <template v-else-if="detailData">
      <van-row class="order-info">
        <van-col span="24">
          对账单号：dzd20241200001
        </van-col>
        <van-col span="12">
          对账期间：2024/11
        </van-col>
        <van-col span="12">
          对账状态：对账中
        </van-col>
        <van-col span="12">
          对账金额：xxxxxx
        </van-col>
        <van-col span="12">
          对账人员：XXX
        </van-col>
        <van-col span="12">
          开始时间：2024/11/02
        </van-col>
        <van-col span="12">
          结束时间：2024/11/20
        </van-col>
      </van-row>
    </template>
  </main>
</template>

<style scoped>
.order-info {
  margin-bottom: 5px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.order-info .van-col {
  font-size: 12px;
}
.operators .van-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
}
.operators .van-col .van-button {
  margin: 20px;
}
</style>
