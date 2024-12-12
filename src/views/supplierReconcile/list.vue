<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import request from '@/utils/request';
import {removeEmptyProps} from '@/utils/common';

// import VConsole from 'vconsole';
// const vConsole = new VConsole();

const router = useRouter();
document.title = '供应商对账';

let listData = $ref([]);
let showBrand = $ref(false);
let showRegion = $ref(false);
let brandOptions = $ref([]);
let regionOptions = $ref([]);
let balanceDetail = $ref({});//供应商详情
let id = $ref()
id = router.currentRoute.value.query.id

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
  // queryParams.page++;
  getBalanceDetails()
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
  console.log("对账单明细：",item);
  router.push({ name: "supplierReconcileDetail", query: { id: item.id} });
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
  params.clientId = id
  const { code, rows, total } = await request.post('/api/myStyle/balanceList', params);
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
// 获取详情数据
const getBalanceDetails = async () => {
  const {code, rows} = await request.get('/api/myStyle/clientBalanceDetail?clientId='+id );
  if (code == 200) {
    // 处理片区选项数据
    // 处理完成后赋值给regionOptions
    // 赋值后，页面会自动更新
    balanceDetail = rows;
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
  <van-nav-bar title="对账单列表" fixed :border="false" left-arrow left-text="返回" @click-left="router.back()">
  </van-nav-bar>
  <van-row class="top-info">
    <van-col span="24">
      供应商名称：{{ balanceDetail.name }}
    </van-col>
    <van-col span="24">
      供应商类型：{{ balanceDetail.supplierType }}
    </van-col>
    <van-col span="24">
      通讯地址：{{ balanceDetail.address }}
    </van-col>
    <van-col span="12">
      供应商账期：{{ balanceDetail.accountDay || '--' }}
    </van-col>
    <van-col span="12">
      上期余额：{{ balanceDetail.lastBalance }}
    </van-col>
  </van-row>
  <van-divider />
  <main class="page-main">
    <van-empty description="暂无数据" v-show="!refreshing && !loading && listData.length === 0"></van-empty>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list v-model:loading="loading" :finished="finished" @load="onLoad" class="order-list">
      <van-row class="order-list-item" v-for="item in listData" :key="item.Id" @click="goOrderDetail(item)">
        <van-col span="24" style="font-size: 16px;">
          对账单号：{{item.accountStatementNo}}
        </van-col>
        <van-col span="12">
          对账期间：{{item.accountPeriod}}
        </van-col>
        <van-col span="12">
          对账状态：{{item.status}}
        </van-col>
        <van-col span="12">
          对账金额：{{item.balanceAmount}}
        </van-col>
        <van-col span="12">
          对账人员：{{item.balanceUser}}
        </van-col>
      </van-row>
    </van-list>
  </van-pull-refresh>
  </main>
  <van-popup v-model:show="showTop" position="top" :style="{ height: '45%' }">
    <!-- 搜索表单 -->
    <van-form v-if="showTopIcon" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="queryParams.keyword"
          name="keyword"
          label="订单款号"
          placeholder="请输入"
        />
        <van-field
  v-model="brandName"
  is-link
  readonly
  name="BrandId"
  label="品牌"
  placeholder="点击选择品牌"
  @click="showBrand = true"
/>
<van-field
  v-model="regionName"
  is-link
  readonly
  name="regionId"
  label="片区"
  placeholder="点击选择片区"
  @click="showRegion = true"
/>
        <van-field
          v-model="queryParams.beginDate"
          name="beginDate"
          label="开始时间"
          placeholder="请选择"
          is-link
          readonly
          @click="showStartTimePicker = true"
        />
        <van-field
          v-model="queryParams.endDate"
          name="endDate"
          label="结束时间"
          placeholder="请选择"
          is-link
          readonly
          @click="showEndTimePicker = true"
        />
      </van-cell-group>
      <div class="btn-group">
        <van-button round block @click="reset" style="margin-right: 10px;">
          重置
        </van-button>
        <van-button round block type="primary" native-type="submit">
          查询
        </van-button>
      </div>
    </van-form>
  </van-popup>
  
<van-popup v-model:show="showBrand" position="bottom">
  <van-picker
    :columns="brandOptions"
    :columns-field-names="brandFieldNames"
    @confirm="onConfirmBrand"
    @cancel="showBrand = false"
  />
</van-popup>
<van-popup v-model:show="showRegion" position="bottom">
  <van-picker
    :columns="regionOptions"
    :columns-field-names="regionFieldNames"
    @confirm="onConfirmRegion"
    @cancel="showRegion = false"
  />
  </van-popup>
  <van-popup v-model:show="showStartTimePicker" position="bottom">
    <van-date-picker @confirm="onStartTimeConfirm" @cancel="showStartTimePicker = false" />
  </van-popup>
  <van-popup v-model:show="showEndTimePicker" position="bottom">
    <van-date-picker @confirm="onEndTimeConfirm" @cancel="showEndTimePicker = false" />
  </van-popup>
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
}
.page-main {
  position: absolute;
  top: 205px;
  width: 100%;
  background: #f0f0f0;
}
</style>
