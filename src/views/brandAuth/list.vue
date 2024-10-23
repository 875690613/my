<script setup>
import { onMounted, reactive, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
import {removeEmptyProps} from '@/utils/common';
const {proxy } = getCurrentInstance();

// import VConsole from 'vconsole';
// const vConsole = new VConsole();

const router = useRouter();
const route = useRoute();

document.title = '品牌授权'

let listData = $ref([]);

let loading = $ref(false);
let finished = $ref(false);
let refreshing = $ref(false);

const onLoad = () => {
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

const goList = (item) => {
  localStorage.setItem('shopBranchList', JSON.stringify(item.shopBranchList));
  router.push({ name: "brandAuthList2" });
};

onMounted(() => {
  queryParams.brandId = route.query.brandId;
});

// 请求接口获取数据
const getData = async () => {
  loading = true;
  const params = removeEmptyProps(queryParams);
  const { status, data } = await proxy.$API.brandAuth.getBrandAuth(params);
  if (status == 200) {
    if (data?.rows) {
      // 计算finished
      finished = data?.rows?.length < queryParams.limit;
      // 合并数据
      listData = listData.concat(data.rows);
    }
  } else {
    // 获取数据失败提示
    showToast("获取数据失败");
  }
  loading = false;
  refreshing = false;
  finished = true;
};

const onClickLeft = () => {
    router.push('/brandAuth/brandAuthIndex');
}

</script>

<template>
  <van-nav-bar title="品牌授权" fixed :border="false" left-arrow left-text="返回" @click-left="onClickLeft">
  </van-nav-bar>
  <main class="scrollMain">
    <van-empty description="暂无数据" v-show="!refreshing && !loading && listData.length === 0"></van-empty>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list v-model:loading="loading" :finished="finished" @load="onLoad" class="order-list">
      <van-cell-group class="order-list-item" v-for="item in listData" :key="item.id" @click="goList(item)" inset>
      <van-row>
        <van-col span="24">
          品牌名称：{{ item.brand.brandName }}
        </van-col>
        <van-col span="24">
          创立时间：{{ item.brand.brandEstablishTime }}
        </van-col>
        <van-col span="24">
          所属公司：{{ item.brand.companyName }}
        </van-col>
        <van-col span="24">
          授权日期：
        </van-col>
        <van-col span="24">
          授权周期：
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
