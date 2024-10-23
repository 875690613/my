<script setup>
import { onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router'
import request from '@/utils/request';
import { showToast } from 'vant';
const router = useRouter()

let orderId = $ref(null)
let regionId = $ref(null)
let info = $ref(null)
let loading = $ref(false);

onMounted(() => {
  getData()
})

watchEffect(() => {
  orderId = router.currentRoute.value.query.id
  regionId = router.currentRoute.value.query.regionId
})

// 获取片区信息
const getData = async () => {
  loading = true;
  const params = {
    id: orderId,
    regionId
  }
  const {code, rows, msg} = await request.get('/api/myStyle/regionQuery', params);
  if (code === 200) {
      info = rows;
      loading = false;
  } else {
    showToast({
      message: '数据查询失败',
      className: 'custom-toast'
    })
    loading = false;
  }
}
</script>

<template>
  <van-nav-bar title="片区信息" fixed :border="false" left-arrow left-text="返回" @click-left="router.back()" />
  <main class="scrollMain">
    <div v-if="loading" class="loading-wrap">
      <van-loading>加载中...</van-loading>
    </div>
    <van-cell-group v-if="!loading && info" class="pd20" style="width: 100%;">
      <van-cell title="加工片区" :value="info.RegionName" />
      <van-cell title="加工工厂" :value="info.Factory" />
      <van-cell title="片区负责人" :value="info.RegionStaff" />
      <van-cell title="跟单QC" :value="info.QCStaff" />
      <van-cell title="生产排单日期" :value="info.ProductDate" />
      <van-cell title="要求交期" :value="info.Claim" />
      <van-cell title="生产合同号" :value="info.ContractNo" />
    </van-cell-group>
    <van-empty description="暂无数据" v-show="!loading && !info"></van-empty>
  </main>
</template>

<style scoped>
</style>
