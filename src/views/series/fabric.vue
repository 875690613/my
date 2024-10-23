<script setup>
import { onMounted, watchEffect } from "vue";
import { showToast } from "vant";
import { useRouter } from "vue-router";
import request from '@/utils/request'
const router = useRouter();

let loading = $ref(false);
let finished = $ref(false);
let refreshing = $ref(false);

let listData = $ref([])
let orderId = $ref()
watchEffect(() => {
  orderId = router.currentRoute.value.query.id
})

onMounted(() => {
  getData()
})

// 获取数据
const getData = async () => {
  loading = true;
  const params = {
    id: orderId
  }
  const { code, rows, msg } = await request.get('/api/myStyle/materialQuery', params);
  if (code == 200) {
    listData = rows
    refreshing = false;
  } else {
    showToast({
      message: '获取数据失败',
      className: 'custom-toast'
    })
  }
  loading = false;
  finished = true;
}

const onRefresh = () => {
  listData = [];
  getData();
}

</script>

<template>
  <van-nav-bar title="里面料信息" fixed :border="false" left-arrow left-text="返回" @click-left="router.back()" />
  <main class="scrollMain">
    <van-empty description="暂无数据" v-show="!loading && listData.length === 0"></van-empty>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" class="order-list">
        <van-row class="order-list-item" v-for="item in listData" :key="item">
          <van-col span="24">
            物料类型：{{ item.StockType }}
          </van-col>
          <van-col span="12">
            物料编号：{{ item.StockNo }}
          </van-col>
          <van-col span="12">
            物料品名：{{ item.StockName }}
          </van-col>
          <van-col span="12">
            物料颜色：{{ item.SptColor }}
          </van-col>
          <van-col span="12">
            应用部位：{{ item.Design }}
          </van-col>
          <van-col span="12">
            投料单耗：{{ item.FinalBudgetFeeding }}
          </van-col>
        </van-row>
      </van-list>
    </van-pull-refresh>
  </main>
</template>

<style scoped>
.order-list {
  padding: 0 15px;
}
.order-list-item {
  margin-bottom: 5px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 12px;
}
</style>
