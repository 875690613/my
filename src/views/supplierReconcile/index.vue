<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import request from '@/utils/request';
import {removeEmptyProps} from '@/utils/common';

// import VConsole from 'vconsole';
// const vConsole = new VConsole();

document.title = '供应商对账';

const router = useRouter();

let listData = $ref([]);
let showSupplierType = $ref(false);
let showRegion = $ref(false);
let supplierTypeOptions = $ref([
  {
    name: '面料商',
    id: 1
  },
  {
    name: '辅料商',
    id: 2
  },
  {
    name: '服装工厂',
    id: 3
  }
]);
let regionOptions = $ref([]);
let balanceOrOverdue = $ref(
{
        balanced: 0,
        unbalanced: 0,
        overdued: 0
      }
);
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
let stockType = $ref('面料商');

const onLoad = () => {
  console.log('onLoad...')
  queryParams.page++;
  getData();
  getBalanceOrOverdue()
}

const onRefresh = () => {
  console.log('onRefresh...')
  listData = [];
  queryParams.page = 1;
  getData();
}

const queryParams = reactive({
  page: 1,
  limit: 10,
  stockType: '面料商',
  keyword: null
});

const onConfirmBrand = (item) => {
  console.log('选中的值：',item);
  const {selectedOptions} = item;
  const selectedItem = selectedOptions?.[0];
  queryParams.stockType = selectedItem?.name;
  stockType = selectedItem?.name;
  queryParams.page = 1;

  // 清空数据
  listData = []
  getData();
  showSupplierType = false;
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
  router.push({ name: "supplierReconcileList", query: { id: item.Id, regionId: item.RegionId, colorId: item.ColorId } });
};

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
};

onMounted(() => {
  getRegionOptions();
 
});

// 请求接口获取数据
const getData = async () => {
  loading = true;
  const params = removeEmptyProps(queryParams);
  const { code, rows, total } = await request.post('/api/myStyle/clientBalanceList', params);
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

// 获取片区选项数据
const getRegionOptions = async () => {
  const {code, rows} = await request.get('/api/sys/getRegion');
  if (code == 200) {
    // 处理片区选项数据
    // 处理完成后赋值给regionOptions
    // 赋值后，页面会自动更新
    regionOptions = rows;
    // showTopIcon = true;
  } else {
    // 获取片区选项数据失败提示
    showToast("获取片区选项数据失败");
  }
};
// 获取本期已对账、未对账、已逾期数据
const getBalanceOrOverdue = async () => {
  const {code, rows} = await request.get('/api/MyStyle/balanceOrOverdue',{});
  if (code == 200) {
    // 处理完成后赋值给regionOptions
    // 赋值后，页面会自动更新
    
    balanceOrOverdue = rows;
    console.log("balanceOrOverdue:",balanceOrOverdue);
  } else {
    // 获取片区选项数据失败提示
    showToast("获取本期对账数据失败");
  }
};


</script>

<template>
  <van-nav-bar left-arrow left-text="返回"  @click-left="router.back()" title="供应商对账" fixed :border="false"></van-nav-bar>
  <div class="top-data-group">
    <div class="top-data-group__top">
      <van-row v-if="balanceOrOverdue">
        <van-col span="8">
          <div class="top-data completed">
            <div class="top-data__label">本期已对账</div>
            <div class="top-data__value color-green">{{ balanceOrOverdue.balanced }}</div>
          </div>
        </van-col>
        <van-col span="8">
          <div class="top-data uncompleted">
            <div class="top-data__label">本期未对账</div>
            <div class="top-data__value color-orange">{{ balanceOrOverdue.unbalanced }}</div>
          </div>
        </van-col>
        <van-col span="8">
          <div class="top-data overdue">
            <div class="top-data__label">已逾期</div>
            <div class="top-data__value color-red">{{ balanceOrOverdue.overdued }}</div>
          </div>
        </van-col>
      </van-row>
    </div>
    <van-row class="top-filter">
      <van-col span="8" style="padding-right: 3px;">
        <van-field
  v-model="stockType"
  class="field-select"
  is-link
  readonly
  name="name"
  placeholder="点击选择供应商类型"
  @click="showSupplierType = true"
/>
      </van-col>
      <van-col span="16">
        <van-field
          v-model="queryParams.keyword"
          name="keyword"
          placeholder="请输入"
          class="name-field"
        >
        <template #button>
          <van-button size="mini" type="primary" icon="search" @click="onSubmit()">查询</van-button>
        </template>
      </van-field>
      </van-col>
    </van-row>

  </div>
  <main class="scrollMain">
    <van-empty description="暂无数据" v-show="!refreshing && !loading && listData.length === 0"></van-empty>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list v-model:loading="loading" :finished="finished" @load="onLoad" class="order-list">
      <van-row class="order-list-item" v-for="(item, index) in listData" :key="item.Id" @click="goOrderDetail(item)">
        <van-col span="12" style="font-size: 16px;">
          {{ item.Name }}
        </van-col>
        <van-col span="12" style="text-align: right; color: #999;">
          {{ item.City }}
        </van-col>
        <van-col span="12">
          余额：{{ item.BalanceAmount }}
        </van-col>
        <van-col span="12" style="text-align: right;">
          计划对账日期：{{ item.PlanBalanceDate }}
        </van-col>
      </van-row>
    </van-list>
  </van-pull-refresh>
  </main>
  
<van-popup v-model:show="showSupplierType" position="bottom">
  <van-picker
    :columns="supplierTypeOptions"
    :columns-field-names="brandFieldNames"
    @confirm="onConfirmBrand"
    @cancel="showSupplierType = false"
  />
</van-popup>
</template>

<style scoped lang="scss">
.top-data-group {
  // 固定在顶部，距离顶部100px
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  .top-data-group__top {
    background-color: #1989fa;
    padding: 10px 15px 15px 15px;
  }
}
.top-filter {
  background-color: #f5f5f5;
  padding: 5px;
  .field-select {
    padding: 3px;
  }
  .name-field {
    padding: 3px;
    height: 30px;
    line-height: 1;
  }
}
.scrollMain {
  height: calc(100vh - 210px);
  overflow-y: auto;
  position: absolute;
  top: 200px;
  width: 100%;
}
.order-list {
  padding: 0 20px;
}
.order-list-item {
  margin-bottom: 5px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 12px;
}
.btn-group {
  display: flex;
  margin: 16px;
  justify-content: center;
  align-items: center;
}
.top-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px;
  margin-bottom: 0;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: white;
  &__label {
    font-size: 14px;
    color: #999;
  }
  &__value {
    font-size: 24px;
    font-weight: bold;
  }
}
</style>
