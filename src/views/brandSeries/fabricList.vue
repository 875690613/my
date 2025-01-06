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
let title = ['面料采购', '面料入库', '']
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
  // getBrandOptions();
  // getRegionOptions();
});

// 请求接口获取数据
const getData = async () => {
  loading = true;
  const params = removeEmptyProps(queryParams);
  let url = '/api/myStyle/fabricPurchaseList';
  if (pageIndex == 0) {
    url = '/api/myStyle/fabricPurchaseList'
  }else if (pageIndex == 1) {
    url = '/api/myStyle/fabricInputList'
  }else{
    // url = '/api/myStyle/invoiceQuery'
  }

  params.sptStockId = id
  const { code, rows, total } = await request.post(url,params);
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
// 获取面料详情数据
const getDetailData = async () => {
  loading = true;
  // const params = {
  //   id: orderId,
  //   colorId
  // }
  const { code, rows, msg } = await request.get('/api/myStyle/fabricDetail?sptStockId='+ id);
  if (code === 200) {
    detailData = rows
    console.log("获取面料详情数据rows:",rows);
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
  <van-row class="top-info" v-if="detailData">
    <van-col span="24">
      面料编号：{{ detailData.StockNo || '--' }}
    </van-col>
    <van-col span="24">
      面料品名：{{ detailData.StockName || '--' }}
    </van-col>
    <van-col span="12">
      供应商：{{ detailData.Client || '--' }}
    </van-col>
    <van-col span="12">
      面料纱支：{{ detailData.TheYarn || '--' }}
    </van-col>
    <van-col span="12">
      规格：{{ detailData.TheConst || '--' }}
    </van-col>
    <van-col span="12">
      克重：{{ detailData.TheWeight || '--' }}
    </van-col>
    <van-col span="12">
      门幅：{{ detailData.TheWidth || '--' }}
    </van-col>
    <van-col span="12">
      计量单位：{{ detailData.Measure || '--' }}
    </van-col>
    <van-col span="24">
      仓库库位：{{ detailData.Location || '--' }}
    </van-col>
  </van-row>
  <!-- <van-divider /> -->
  <main class="page-main">
    <van-empty description="暂无数据" v-show="!refreshing && !loading && listData.length === 0"></van-empty>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <!-- 面料采购 -->
    <van-list v-if="pageIndex == 0" v-model:loading="loading" :finished="finished" @load="onLoad" class="order-list">
      <van-row class="order-list-item" v-for="item in listData" :key="item.Id">
        <van-col span="24" style="font-size: 14px;">
          采购公司：{{ item.Company || '--' }}
        </van-col>
        <van-col span="12">
          合同号：{{ item.ContractNo || '--' }}
        </van-col>
        <van-col span="12">
          面料供应商：{{ item.Client || '--' }}
        </van-col>
        <van-col span="12">
          订购面料：{{ item.PurchaseFabric || '--' }}
        </van-col>
        <van-col span="12">
          原有面料：{{ item.OldFabric || '--' }}
        </van-col>
        <van-col span="12">
          款号：{{ item.StyleNos || '--' }}
        </van-col>
        <van-col span="12">
          审核状态：<van-tag type="primary">{{ item.Checked || '--' }}</van-tag>
        </van-col>
      </van-row>
    </van-list>
    
    <!-- 面料入库 -->
    <van-list v-if="pageIndex == 1" v-model:loading="loading" :finished="finished" @load="onLoad" class="order-list">
      <van-row class="order-list-item" v-for="item in listData" :key="item.Id" @click="goFabricDetails(item)">
        <van-col span="24">
          入库面料：{{ item.StockNo || '--' }}
        </van-col>
        <van-col span="12">
          面料品名：{{ item.StockName || '--' }}
        </van-col>
        <van-col span="12">
          面料颜色：{{ item.Color || '--' }}
        </van-col>
        <van-col span="12">
          仓库库位：{{ item.Location || '--' }}
        </van-col>
        <van-col span="12">
          入库编号：{{ item.StorageRecordsNo || '--' }}
        </van-col>
        <van-col span="12">
          入库类型：{{ item.StorageType || '--' }}
        </van-col>
        <van-col span="12">
          入库单位：{{ item.Unit || '--' }}
        </van-col>
        <van-col span="12">
          入库门幅：{{ item.TheWidth || '--' }}
        </van-col>
        <van-col span="12">
          入库克重：{{ item.TheWeight || '--' }}
        </van-col>
        <van-col span="12">
          入库数量：{{ item.Numbers || '--' }}
        </van-col>
        <van-col span="12">
          不合格数：{{ item.UnqualifiedQty || '--' }}
        </van-col>
        <van-col span="12">
          入库人：{{ item.InputUser || '--' }}
        </van-col>
        <van-col span="12">
          到货日期：{{ item.ArriveDate || '--' }}
        </van-col>
        <van-col span="12">
          审核状态：<van-tag type="primary">{{ item.Checked || '--' }}</van-tag>
        </van-col>
        <van-col span="12">
          入库时间：{{ item.InputDate || '--' }}
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
.order-list {
  // padding: 10px 15px;
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
  top: 220px;
  width: 100%;
  background: #f0f0f0;
}
.van-tag {
  line-height: normal;
  height: 100%;
  vertical-align: middle;
}
</style>
