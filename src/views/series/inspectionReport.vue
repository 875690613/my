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
  const { code, rows, msg } = await request.get('/api/myStyle/checkReportQuery', params)
  if (code == 200) {
    rows.forEach(item => {
      if (item.CheckType == '首查') {
        listData[0] = item;
      } else if (item.CheckType == '中查') {
        listData[1] = item;
      } else if (item.CheckType == '尾查') {
        listData[2] = item;
      } else if (item.CheckType == '件查') {
        listData[3] = item;
      }
    })
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

const downReport = () => {
  showToast({
    message: '暂无报告文件',
    className: 'custom-toast'
  })
}
</script>

<template>
  <van-nav-bar title="检品报告" fixed :border="false" left-arrow left-text="返回" @click-left="router.back()" />
  <main class="scrollMain">
    <van-empty description="暂无数据" v-show="!loading && listData.length === 0"></van-empty>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" class="order-list">
        <van-cell-group v-for="item in listData" :key="item" inset>
          <van-cell title="查货类型">
            <div class="cell-content">
              <span class="cell-text">{{ item.CheckType }}</span>
              <a href="javascript:;" class="van-button van-button--primary van-button--mini" @click="downReport">报告下载</a>
            </div>
          </van-cell>
          <van-cell title="查货时间" :value="item.CheckDate" />
          <van-cell title="查货人员" :value="item.CheckName" />
          <van-cell title="查货结果" :label="item.CheckDesc" />
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </main>
</template>

<style scoped>
.scrollMain {
  background: #f5f5f5;
}
.cell-content {
  display: flex;
  justify-content: flex-end;
  align-items: center
}
.cell-content .cell-text {
  margin-right: 10px;
}
.cell-content a {
  line-height: 2;
}
.van-cell-group {
  margin-top: 15px;
}
</style>
