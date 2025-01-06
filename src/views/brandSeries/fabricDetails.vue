<script setup>
import { onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router'
import request from '@/utils/request';
const router = useRouter()
document.title = '品牌系列';

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

// 获取对账单详情数据
const getData = async () => {
  loading = true;
  const params = {
    // id: orderId,
    id: 5395,
    colorId
  }
  const { code, rows, msg } = await request.get('/api/myStyle/fabricDetail?sptStockId='+ id);
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
  <van-nav-bar title="面料详情" fixed :border="false" left-arrow left-text="返回" @click-left="router.back()" />
  <main class="scrollMain">
    <div v-if="loading" class="loading-wrap">
      <van-loading>加载中...</van-loading>
    </div>
    <template v-else-if="detailData">
      <van-row class="order-info">
        <van-col span="24">
          面料编号：{{ detailData.StockNo || '--' }}
        </van-col>
        <van-col span="24">
          面料品名：{{ detailData.StockName || '--' }}
        </van-col>
        <van-col span="12">
          供应商：{{ detailData.Client || '--' }}
        </van-col>
        <van-col span="12">
          面料纱支：{{ detailData.TheYarn || '--' }}
        </van-col>
        <van-col span="12">
          规格：{{ detailData.TheConst || '--' }}
        </van-col>
        <van-col span="12">
          克重：{{ detailData.TheWeight || '--' }}
        </van-col>
        <van-col span="12">
          门幅：{{ detailData.TheWidth || '--' }}
        </van-col>
        <van-col span="12">
          计量单位：{{ detailData.Measure || '--' }}
        </van-col>
        <van-col span="24">
          仓库库位：{{ detailData.Location || '--' }}
        </van-col>
      </van-row>
      <van-row class="operators">
        <van-col span="24">
          <van-button plain hairline type="primary" :to="'fabricList?type=0&id=' + id">面料采购查询</van-button>
        </van-col>
        <van-col span="24">
          <van-button plain hairline type="primary" :to="'fabricList?type=1&id=' + id">面料入库查询</van-button>
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
