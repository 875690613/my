<script setup>
import { onMounted, reactive, watchEffect } from "vue";
import { useRouter } from "vue-router";
import request from '@/utils/request';
import {removeEmptyProps} from '@/utils/common';
import dayjs from 'dayjs';

// import VConsole from 'vconsole';
// const vConsole = new VConsole();

const router = useRouter();
document.title = '品牌系列';
let pageIndex = $ref(0);
let title = ['订单进度', '面料进度', '对账单发票']
let id = $ref()
id = router.currentRoute.value.query.id
console.log("id:",id);
let detailData = $ref(null)
watchEffect(() => {
  pageIndex = router.currentRoute.value.query.type;
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

// const onLoad = () => {
//   console.log('onLoad...')
//   queryParams.page++;
//   getDetailData()
//   getData();
// }
onMounted(() => {
  getDetailData()
  getData();
})
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
const goFabricDetails = (item) => {
  console.log("item:",item);
  item.id = 5395
  // 面料详情
  router.push({ name: "fabricDetails", query: { id: item.id, regionId: item.RegionId, colorId: item.ColorId } });
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
  let url = '/api/myStyle/clientBalanceDetail?clientId=5395';
  if (pageIndex == 0) {
    url = '/api/myStyle/clientBalanceDetail?clientId=5395'
  }else if (pageIndex == 1) {
    url = '/api/myStyle/clientBalanceDetail?clientId=5395'
  }else{
    url = '/api/myStyle/invoiceQuery'
  }

  params.accountStatementId = 5395//id
  const { code, rows, total } = await request.get(url);
  if (code == 200) {
    // 计算finished
    finished = rows.length < queryParams.limit;
    // 合并数据
    listData = listData.concat(rows);
    listData = listData.map(item => {
      return {
        ...item,
        ContractDate:dayjs(item.ContractDate).format('YYYY-MM-DD')
      }
    })
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
// 获取对账单详情数据
const getDetailData = async () => {
  loading = true;
  // const params = {
  //   id: orderId,
  //   colorId
  // }
  const { code, rows, msg } = await request.get('/api/myStyle/balanceInfo?accountStatementId='+ id);
  if (code === 200) {
    detailData = rows
    console.log("获取对账单详情数据rows:",rows);
  }
  loading = false;
}

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
  <van-row class="top-info" v-if="!detailData">
    <van-col span="24">
      系列编码：SAP-2024-Q4(OND)-SMS Drop01-销样
      <!-- 对账单号：{{ detailData.accountStatementNo }} -->
    </van-col>
    <van-col span="24">
      系列名称：SPAW25
    </van-col>
    <van-col span="24">
      责任人：何湘云
    </van-col>
    <van-col span="12">
      开始日期：2024-10-31
    </van-col>
    <van-col span="12">
      <!-- 结束时间：{{ detailData.endDate || '--' }} -->
      结束日期：2024-12-31
    </van-col>
    <van-col span="12">
      运行状态：<van-tag type="success">运行</van-tag>
    </van-col>
  </van-row>
  <!-- <van-divider /> -->
  <main class="page-main">
    <van-empty description="暂无数据" v-show="!refreshing && !loading && listData.length === 0"></van-empty>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <!-- 订单进度 -->
    <van-list v-if="pageIndex == 0" v-model:loading="loading" :finished="finished" @load="onLoad" class="order-list">
      <van-row class="order-list-item" v-for="item in listData" :key="item.Id">
        <van-col span="24" style="font-size: 16px;">
          款号：8306(SPAW25)
        </van-col>
        <van-col span="12">
          款号状态：正常
        </van-col>
        <van-col span="12">
          项目类型：销样
        </van-col>
        <van-col span="12">
          订单数量：7
        </van-col>
        <van-col span="12">
          FOB单价：0.00
        </van-col>
        <van-col span="12">
          样衣需求：可以直接生产
        </van-col>
        <van-col span="12">
          拉款日期：2024-10-31
        </van-col>
      </van-row>
    </van-list>
    
    <!-- 面料进度 -->
    <van-list v-if="pageIndex == 1" v-model:loading="loading" :finished="finished" @load="onLoad" class="order-list">
      <div class="top-data-group">
        <div class="top-data-group__top">
          <van-row class="group_row">
            <van-col span="12">
              <div class="top-data completed">
                <div class="top-data__label">本周延误</div>
                <div class="top-data__value color-red">34</div>
              </div>
            </van-col>
            <van-col span="12">
              <div class="top-data uncompleted">
                <div class="top-data__label">本周按计划</div>
                <div class="top-data__value color-green">44</div>
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
      <van-row class="order-list-item" v-for="item in listData" :key="item.Id" @click="goFabricDetails(item)">
        <van-col span="12">
          面料编号：M1PC2410035
        </van-col>
        <van-col span="12">
          面料品名：
        </van-col>
        <van-col span="12">
          颜色：焦糖色
        </van-col>
        <van-col span="12">
          合同号：524110210
        </van-col>
        <van-col span="12">
          预计船样日期：2024-11-28
        </van-col>
        <van-col span="12">
          船样供应日期：2024-11-22
        </van-col>
        <van-col span="12">
          预计到货日期：2024-11-30
        </van-col>
        <van-col span="12">
          实际到货日期：2024-12-05
        </van-col>
      </van-row>
    </van-list>
    <van-list v-if="pageIndex == 2" v-model:loading="loading" :finished="finished" @load="onLoad" class="order-list">
      <van-row class="order-list-item" v-for="item in listData" :key="item.Id" @click="goFabricDetails(item)">
        <van-col span="24" style="font-size: 16px;">
          发票编号：{{ item.InvoiceNo }}
        </van-col>
        <van-col span="12">
          发票类型：{{ item.InvoiceType }}
        </van-col>
        <van-col span="12">
          开票日期：{{ item.InvoiceDate }}
        </van-col>
        <van-col span="12">
          开票金额：{{ item.TotalAmount }}
        </van-col>
      </van-row>
    </van-list>
  </van-pull-refresh>
  </main>
</template>

<style scoped lang="scss">
.top-data-group {
  .top-data-group__top {
    // background-color: #0b7beb1f;
    padding: 10px 15px;
    .group_row{
      justify-content: space-between;
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
      .top-data__label{
        color: #333;
        font-weight: 600;
      }
    }
  }
}
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
  top: 190px;
  width: 100%;
  background: #f0f0f0;
}
.van-tag {
  line-height: normal;
  height: 100%;
  vertical-align: middle;
}
</style>
