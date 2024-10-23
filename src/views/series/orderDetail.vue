<script setup>
import { onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router'
import request from '@/utils/request';
const router = useRouter()

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
  <van-nav-bar title="订单查询" fixed :border="false" left-arrow left-text="返回" @click-left="router.back()" />
  <main class="scrollMain">
    <div v-if="loading" class="loading-wrap">
      <van-loading>加载中...</van-loading>
    </div>
    <template v-else-if="detailData">
      <van-row class="order-info">
        <van-col span="24">
          款号：{{ detailData.StyleNo }}
        </van-col>
        <van-col span="12">
          订单类型：{{ detailData.StyleType }}
        </van-col>
        <van-col span="12">
          品牌：{{detailData.Brand}}
        </van-col>
        <van-col span="12">
          离厂日期：{{ detailData.OrderDeliveryDate }}
        </van-col>
        <van-col span="12">
          业务组：{{ detailData.BusinessGroup }}
        </van-col>
        <van-col span="12">
          颜色：{{ detailData.Color }}
        </van-col>
        <van-col span="12">
          数量：{{ detailData.Qty }}
        </van-col>
        <van-col span="24">
          尺码：{{ detailData.Size }}
        </van-col>
        <van-col span="12">
          生产片区：{{ detailData.Region }}
        </van-col>
        <van-col span="12">
          工厂/车间：{{ detailData.Factory }}
        </van-col>
      </van-row>
      <van-row class="operators">
        <van-col span="12">
          <van-button plain hairline type="primary" :to="'orderState?id=' + orderId">订单<br/>状态树</van-button>
        </van-col>
        <van-col span="12">
          <van-button plain hairline type="primary" :to="'fabric?id=' + orderId">里面料<br/>查询</van-button>
        </van-col>
        <van-col span="12">
          <van-button plain hairline type="primary" :to="'customerOpinion?id=' + orderId">意见变更<br/>查询</van-button>
        </van-col>
        <van-col span="12">
          <van-button plain hairline type="primary" :to="'sizeQuery?id=' + orderId">尺寸表<br/>查询</van-button>
        </van-col>
        <van-col span="12">
          <van-button plain hairline type="primary" :to="'areaInfo?regionId=' + regionId + '&id=' + orderId">片区信息<br/>查询</van-button>
        </van-col>
        <van-col span="12">
          <van-button plain hairline type="primary" :to="'inspectionReport?id=' + orderId">检品报告<br/>查询</van-button>
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
