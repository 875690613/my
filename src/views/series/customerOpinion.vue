<script setup>
import { onMounted, watchEffect } from "vue";
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

// 获取订单状态树
const getData = async () => {
  loading = true;
  const params = {
    id: orderId
  }
  const { code, rows, msg } = await request.get('/api/myStyle/OptionsQuery', params);
  if (code === 200) {
    listData = rows.filter(item => item.CustormDate || item.CustomerRemark)
    refreshing = false;
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
  <van-nav-bar title="客户意见" fixed :border="false" left-arrow left-text="返回" @click-left="router.back()" />
  <main class="scrollMain">
    <van-empty description="暂无数据" v-show="!loading && listData.length === 0"></van-empty>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" class="order-list">
        <van-cell-group v-for="item in listData" :key="item" inset>
          <van-cell title="收到意见日期" :value="item.CustormDate" />
          <van-cell title="客户意见内容" :label="item.CustomerRemark" />
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </main>
</template>

<style scoped>
.scrollMain {
  background: #f5f5f5;
}
.van-cell-group {
  margin-top: 15px;
}
</style>
