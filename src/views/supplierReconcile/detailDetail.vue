<script setup>
import { onMounted, reactive, watchEffect } from "vue";
import { useRouter } from "vue-router";
import request from '@/utils/request';
import {removeEmptyProps} from '@/utils/common';

// import VConsole from 'vconsole';
// const vConsole = new VConsole();

const router = useRouter();
document.title = '供应商对账';
let pageIndex = $ref(0);
let title = ['对账单明细', '对账单凭证', '对账单发票']

watchEffect(() => {
  pageIndex = router.currentRoute.value.query.id;
})

let listData = $ref([]);
let showBrand = $ref(false);
let showRegion = $ref(false);
let brandOptions = $ref([]);
let regionOptions = $ref([]);
const brandFieldNames = {
  text: 'name',
  value: 'id',
}
const regionFieldNames = {
  text: 'regionName',
  value: 'id',
}

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

let brandName = $ref('');
let regionName = $ref('');
let showTopIcon = $ref(false);

const queryParams = reactive({
  page: 1,
  limit: 10,
  BrandId: null,
  regionId: null,
  beginDate: null,
  endDate: null,
  keyword: null
});

const onConfirmBrand = (item) => {
  console.log(item);
  const {selectedOptions} = item;
  const selectedItem = selectedOptions?.[0];
  queryParams.BrandId = selectedItem?.id;
  brandName = selectedItem?.name;
  showBrand = false;
};
const onConfirmRegion = (item) => {
  console.log(item);
  const {selectedOptions} = item;
  const selectedItem = selectedOptions?.[0];
  queryParams.regionId = selectedItem?.id;
  regionName = selectedItem?.regionName;
  showRegion = false;
};
const goOrderDetail = (item) => {
  router.push({ name: "supplierReconcileDetail", query: { id: item.Id, regionId: item.RegionId, colorId: item.ColorId } });
};

let showTop = $ref(false);
let showStartTimePicker = $ref(false);
let showEndTimePicker = $ref(false);

const onStartTimeConfirm = ({ selectedValues }) => {
  console.log('onStartTimeConfirm', selectedValues)
  queryParams.beginDate = selectedValues.join('/')
  showStartTimePicker = false;
};

const onEndTimeConfirm = ({ selectedValues }) => {
  console.log('onEndTimeConfirm', selectedValues)
  queryParams.endDate = selectedValues.join('/')
  showEndTimePicker = false;
};

// 提交搜索表单
const onSubmit = (values) => {
  console.log("onSubmit", values);
  queryParams.page = 1;

  // 清空数据
  listData = []
  getData();
  showTop = false;
};

onMounted(() => {
  getBrandOptions();
  getRegionOptions();
});

// 请求接口获取数据
const getData = async () => {
  loading = true;
  const params = removeEmptyProps(queryParams);
  const { code, rows, total } = await request.post('/api/myStyle/myStyleList', params);
  if (code == 200) {
    // 计算finished
    finished = rows.length < queryParams.limit;
    // 合并数据
    listData = listData.concat(rows);
  } else {
    // 获取数据失败提示
    showToast("获取数据失败");
  }
  loading = false;
  refreshing = false;
};

// 获取品牌选项数据
const getBrandOptions = async () => {
  const {code, rows} = await request.get('/api/sys/getClientLink');
  if (code == 200) {
    // 处理品牌选项数据
    // 处理完成后赋值给brandOptions
    // 赋值后，页面会自动更新
    brandOptions = rows;
    showTopIcon = true;
  } else {
    // 获取品牌选项数据失败提示
    showToast("获取品牌选项数据失败");
  }
};

// 获取片区选项数据
const getRegionOptions = async () => {
  const {code, rows} = await request.get('/api/sys/getRegion');
  if (code == 200) {
    // 处理片区选项数据
    // 处理完成后赋值给regionOptions
    // 赋值后，页面会自动更新
    regionOptions = rows;
    showTopIcon = true;
  } else {
    // 获取片区选项数据失败提示
    showToast("获取片区选项数据失败");
  }
};

// 搜索重置
const reset = () => {
  queryParams.page = 1;
  queryParams.orderNo = null;
  queryParams.BrandId = null;
  queryParams.regionId = null;
  queryParams.beginDate = null;
  queryParams.endDate = null;
  queryParams.keyword = null;
  brandName = '';
  regionName = '';
  listData = [];
  finished = false;
  getData();
  showTop = false;
};

</script>

<template>
  <van-nav-bar :title="title[pageIndex]" fixed :border="false" left-arrow left-text="返回" @click-left="router.back()">
  </van-nav-bar>
  <van-row class="top-info">
    <van-col span="24">
      对账单号：dzd20241200001
    </van-col>
    <van-col span="12">
      对账期间：2024/11
    </van-col>
    <van-col span="12">
      对账状态：对账中
    </van-col>
    <van-col span="12">
      对账金额：xxxxxx
    </van-col>
    <van-col span="12">
      对账人员：XXX
    </van-col>
    <van-col span="12">
      开始时间：2024/11/02
    </van-col>
    <van-col span="12">
      结束时间：2024/11/20
    </van-col>
  </van-row>
  <van-divider />
  <main class="page-main">
    <van-empty description="暂无数据" v-show="!refreshing && !loading && listData.length === 0"></van-empty>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list v-if="pageIndex == 0" v-model:loading="loading" :finished="finished" @load="onLoad" class="order-list">
      <van-row class="order-list-item" v-for="item in listData" :key="item.Id" @click="goOrderDetail(item)">
        <van-col span="24" style="font-size: 16px;">
          合同号：524110111
        </van-col>
        <van-col span="12">
          合同日期：2024/11/02
        </van-col>
        <van-col span="12">
          采购类型：面料
        </van-col>
        <van-col span="12">
          物料编号：sup1203-58
        </van-col>
        <van-col span="12">
          合同数量：100
        </van-col>
        <van-col span="12">
          结算数量：100
        </van-col>
        <van-col span="12">
          结算金额：500
        </van-col>
      </van-row>
    </van-list>
    <van-list v-if="pageIndex == 1" v-model:loading="loading" :finished="finished" @load="onLoad" class="order-list">
      <van-row class="order-list-item" v-for="item in listData" :key="item.Id" @click="goOrderDetail(item)">
        <van-col span="24" style="font-size: 16px;">
          凭证名称：采购订单
        </van-col>
        <van-col span="12">
          上传日期：2024/11/10
        </van-col>
        <van-col span="12">
          上传人：XXX
        </van-col>
      </van-row>
    </van-list>
    <van-list v-if="pageIndex == 2" v-model:loading="loading" :finished="finished" @load="onLoad" class="order-list">
      <van-row class="order-list-item" v-for="item in listData" :key="item.Id" @click="goOrderDetail(item)">
        <van-col span="24" style="font-size: 16px;">
          发票编号：2432123133432424
        </van-col>
        <van-col span="12">
          发票类型：增值税电子专票
        </van-col>
        <van-col span="12">
          开票日期：2024/11/25
        </van-col>
        <van-col span="12">
          开票金额：XXX
        </van-col>
      </van-row>
    </van-list>
  </van-pull-refresh>
  </main>
</template>

<style scoped lang="scss">
.order-list {
  padding: 10px 15px;
}
.order-list-item {
  margin-top: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
  font-size: 12px;
  background-color: white;
  border-radius: 5px;
}
.btn-group {
  display: flex;
  margin: 16px;
  justify-content: center;
  align-items: center;
}
.top-info {
  padding: 20px;
  position: fixed;
  top: 46px;
  background-color: #1989fa;
  z-index: 3;
  color: #cce5ff;
  font-size: 14px;
}
.page-main {
  position: absolute;
  top: 175px;
  width: 100%;
  background: #f0f0f0;
}
</style>
