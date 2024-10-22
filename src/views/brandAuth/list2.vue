<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import {removeEmptyProps} from '@/utils/common';
import api from './api'

// import VConsole from 'vconsole';
// const vConsole = new VConsole();

const router = useRouter();

document.title = '授权店铺'

let listData = $ref([]);

let loading = $ref(false);
let finished = $ref(false);
let refreshing = $ref(false);

const onLoad = () => {
  console.log('onLoad...')
  queryParams.page++;
  getData();
}

const onRefresh = () => {
  console.log('onRefresh...')
  listData = [];
  queryParams.page = 1;
  getData();
}

const queryParams = reactive({
  page: 0,
  limit: 10
});

const goOrderDetail = (item) => {
  localStorage.setItem('projectDetail', JSON.stringify(item));
  router.push({ name: "myProjectDetail" });
};

onMounted(() => {
});

// 请求接口获取数据
const getData = async () => {
  loading = true;
  const params = removeEmptyProps(queryParams);
  const { status, data } = await api.getBrandAuth(params);
  if (status == 200) {
    // 计算finished
    finished = data.rows.length < queryParams.limit;
    // 合并数据
    listData = listData.concat(data.rows);
  } else {
    // 获取数据失败提示
    showToast("获取数据失败");
  }
  loading = false;
  refreshing = false;
  finished = true;
};


</script>

<template>
  <van-nav-bar title="授权店铺" fixed :border="false">
  </van-nav-bar>
  <main class="scrollMain">
    <van-empty description="暂无数据" v-show="!refreshing && !loading && listData.length === 0"></van-empty>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list v-model:loading="loading" :finished="finished" @load="onLoad" class="order-list">
      <van-cell-group class="order-list-item" v-for="item in listData" :key="item.Id" @click="goOrderDetail(item)" inset>
      <van-row>
        <van-col span="24">
          项目编号：{{ item.code }}
        </van-col>
        <van-col span="12">
          品牌：{{ item.brand }}
        </van-col>
        <van-col span="12">
          安排日期：{{ item.scheduleTime }}
        </van-col>
        <van-col span="12">
          订单类型：{{ item.category }}
        </van-col>
        <van-col span="12">
          阶段：{{ item.stage }}
        </van-col>
        <van-col span="24">
          订单款号：{{ item.styleNo }}
        </van-col>
        <van-col span="12">
          指派员工：{{ item.appointStaff }}
        </van-col>
        <van-col span="12">
          状态：{{ item.status == 1 ? '进行中' : '已完成' }}
        </van-col>
      </van-row>
      </van-cell-group>
    </van-list>
  </van-pull-refresh>
  </main>  
</template>

<style scoped>
.scrollMain {
  background-color: #f5f5f5;
}
.order-list {
}
.order-list-item {
  margin-top: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 12px;
  padding: 15px;
}
.btn-group {
  display: flex;
  margin: 16px;
  justify-content: center;
  align-items: center;
}
</style>
