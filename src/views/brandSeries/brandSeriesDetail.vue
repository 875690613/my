<script setup>
import { onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router'
import request from '@/utils/request';
const router = useRouter()
document.title = '系列周计划';

let loading = $ref(false)

let orderId = $ref()
let regionId = $ref()
let colorId = $ref()

let detailData = $ref(null)
let id = $ref()
id = router.currentRoute.value.query.id
watchEffect(() => {
  orderId = router.currentRoute.value.query.id
  regionId = router.currentRoute.value.query.regionId || 0
  colorId = router.currentRoute.value.query.colorId
})

// 获取品牌系列详情数据
const getData = async () => {
  loading = true;
  const params = {
    // id: orderId,
    id: 5395,
    colorId
  }
  const { code, rows, msg } = await request.get('/api/myStyle/brandSeriesDetail?id='+ id);
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
  <van-nav-bar title="品牌系列详情" fixed :border="false" left-arrow left-text="返回" @click-left="router.back()" />
  <main class="scrollMain">
    <div v-if="loading" class="loading-wrap">
      <van-loading>加载中...</van-loading>
    </div>
    <template v-else-if="detailData">
      <van-row class="order-info">
        <van-col span="24">
          系列编码：{{ detailData.brandCollectionNO || '--' }}
        </van-col>
        <van-col span="24">
          系列名称：{{ detailData.seriesName || '--' }}
        </van-col>
        <van-col span="12">
          责任人：{{ detailData.staff || '--' }}
        </van-col>
        <van-col span="12">
          运行状态：<van-tag type="success">{{ detailData.status }}</van-tag>
        </van-col>
        <van-col span="12">
          开始日期：{{ detailData.startDate || '--' }}
        </van-col>
        <van-col span="12">
          结束日期：{{ detailData.endDate || '--' }}
        </van-col>
      </van-row>
      <van-row class="operators">
        <van-col span="24">
          <van-button plain hairline type="primary" :to="'orderProgress?type=0&id=' + id">订单进度</van-button>
        </van-col>
        <van-col span="24">
          <van-button plain hairline type="primary" :to="'orderProgress?type=1&id=' + id">面料进度</van-button>
        </van-col>
        <van-col span="24" v-if="false">
          <van-button plain hairline type="primary" :to="'detailDetail?type=2&id=' + id">发票查询</van-button>
        </van-col>
      </van-row>
    </template>
  </main>
</template>

<style scoped lang="scss">
.loading-wrap{
  text-align: center;
}
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
.van-tag {
  line-height: normal;
  height: 100%;
  vertical-align: middle;
}
</style>
