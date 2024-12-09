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

let detailData = $ref(null)

watchEffect(() => {
  orderId = router.currentRoute.value.query.id
  regionId = router.currentRoute.value.query.regionId || 0
  colorId = router.currentRoute.value.query.colorId
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
  <van-nav-bar title="对账单明细" fixed :border="false" left-arrow left-text="返回" @click-left="router.back()" />
  <main class="scrollMain">
    <div v-if="loading" class="loading-wrap">
      <van-loading>加载中...</van-loading>
    </div>
    <template v-else-if="detailData">
      <van-row class="order-info">
        <van-col span="24">
          对账单号：xxxx
        </van-col>
        <van-col span="12">
          对账期间：2024/11
        </van-col>
        <van-col span="12">
          对账状态：对账中
        </van-col>
        <van-col span="12">
          对账金额：xxxxx
        </van-col>
        <van-col span="12">
          对账人员：xxxx
        </van-col>
        <van-col span="12">
          开始时间：xxx
        </van-col>
        <van-col span="12">
          结束时间：xxx
        </van-col>
      </van-row>
      <van-row class="operators">
        <van-col span="24">
          <van-button plain hairline type="primary" :to="'detailDetail?id=0'">对账明细</van-button>
        </van-col>
        <van-col span="24">
          <van-button plain hairline type="primary" :to="'detailDetail?id=1'">对账凭证</van-button>
        </van-col>
        <van-col span="24">
          <van-button plain hairline type="primary" :to="'detailDetail?id=2'">发票查询</van-button>
        </van-col>
      </van-row>
    </template>
  </main>
</template>

<style scoped lang="scss">
.order-info {
  margin-bottom: 5px;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background-color: #1989fa;
  color: #cce5ff;
}
.order-info .van-col {
  font-size: 14px;
}
.operators {
  padding-top: 30px;
}
.operators .van-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
}
.operators .van-col .van-button {
  margin: 10px 30px;
}
</style>
