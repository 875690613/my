<script setup>
import { onMounted, reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import {removeEmptyProps} from '@/utils/common';
const {proxy } = getCurrentInstance();

// import VConsole from 'vconsole';
// const vConsole = new VConsole();

const router = useRouter();

document.title = '渠道网点'

let listData = $ref([]);

let loading = $ref(false);
let finished = $ref(false);
let refreshing = $ref(false);
let grantAuths = [
  '不授权',
  '授权'
]

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
  const { status, data } = await proxy.$API.chanelNetwork.getChannelList(params);
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
  <van-nav-bar title="渠道网点" fixed :border="false">
  </van-nav-bar>
  <main class="scrollMain">
    <van-empty description="暂无数据" v-show="!refreshing && !loading && listData.length === 0"></van-empty>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list v-model:loading="loading" :finished="finished" @load="onLoad" class="order-list">
      <van-cell-group class="order-list-item" v-for="item in listData" :key="item.Id" @click="goOrderDetail(item)" inset>
      <van-row>
        <van-col span="24">
          渠道名称：{{ item.channelName }}
        </van-col>
        <van-col span="24">
          渠道类型：{{ item.channelType }}
        </van-col>
        <van-col span="24">
          是否已授权：{{ grantAuths[item.grantAuth] }}
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
