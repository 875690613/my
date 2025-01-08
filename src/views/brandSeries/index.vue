<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import request from '@/utils/request';
import {removeEmptyProps} from '@/utils/common';

document.title = '系列周计划';

const router = useRouter();

let listData = $ref([]);
let showSupplierType = $ref(false);
let showTopIcon = $ref(false);
let showBrand = $ref(false);
let showClient = $ref(false);
let brandName = $ref('');
let clientName = $ref('');
let brandOptions = $ref([]);//品牌列表
let clientOptions = $ref([]);//客户列表
let showRight = $ref(false);
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

let loading = $ref(false);
let finished = $ref(false);
let refreshing = $ref(false);

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
  page: 0,
  limit: 10,
  keyword: null
});
// 展开搜索弹窗
const showPopup = () => {
  getClientList();//获取客户列表
  // getBrandOptions();//获取品牌列表
  showRight = true;
};
// 选择品牌
const onConfirmBrand = (item) => {
  console.log(item);
  const {selectedOptions} = item;
  const selectedItem = selectedOptions?.[0];
  queryParams.BrandId = selectedItem?.id;
  brandName = selectedItem?.name;
  showBrand = false;
};
// 选择客户
const onConfirmshowClient = (item) => {
  console.log('选择客户',item);
  const {selectedOptions} = item;
  const selectedItem = selectedOptions?.[0];
  queryParams.clientId = selectedItem?.id;
  clientName = selectedItem?.name;
  showClient = false;
  brandName = '';
  getBrandOptions()
};
const goBrandSeriesDetail = (item) => {
  // router.push({ name: "supplierReconcileList", query: { id: item.Id, regionId: item.RegionId, colorId: item.ColorId } });
  console.log("item:",item);
  router.push({ name: "brandSeriesDetail", query: { id: item.id, regionId: item.RegionId, colorId: item.ColorId } });
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
  showRight = false;

  // 清空数据
  listData = []
  getData();
};
// 搜索重置
const reset = () => {
  queryParams.page = 1;
  queryParams.orderNo = null;
  queryParams.BrandId = null;
  queryParams.clientId = null;
  queryParams.regionId = null;
  queryParams.beginDate = null;
  queryParams.endDate = null;
  queryParams.keyword = null;
  queryParams.userName = null;
  brandName = '';
  clientName = '';
  brandOptions = [];
  listData = [];
  finished = false;
  getData();
  // showRight = false;
};

onMounted(() => {
  // getRegionOptions();
});

// 请求接口获取列表数据
const getData = async () => {
  loading = true;
  const params = removeEmptyProps(queryParams);
  const { code, rows, total } = await request.post('/api/myStyle/brandSeriesList', params);
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
// 获取今日提前、今日延迟、今日按计划数据
const getBalanceOrOverdue = async () => {
  const {code, rows} = await request.get('/api/myStyle/seriesPlanSituation');
  if (code == 200) {
    // 处理完成后赋值给regionOptions
    balanceOrOverdue = rows;
    console.log("balanceOrOverdue:",balanceOrOverdue);
  } else {
    // 获取片区选项数据失败提示
    showToast("获取本期对账数据失败");
  }
};
// 获取品牌选项数据
const getBrandOptions = async () => {
  const {code, rows} = await request.get('/api/sys/getClientLinkByClient?clientId='+ queryParams.clientId);
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
// 获取客户选项列表
const getClientList = async () => {
    const { code, rows } = await request.get('/api/sys/getClient');
    
    if (code == 200) {
      clientOptions = rows;
        
    } else {
        showToast("获取客户列表失败");
    }
};


</script>

<template>
  <van-nav-bar left-arrow @click-left="router.back()" title="" fixed :border="false">
    <template #right>
        <van-icon name="bars" @click="showPopup()" size="22" />
    </template>
  </van-nav-bar>
  
  <div class="top-data-group">
    <div class="top-data-group__top">
      <van-row v-if="balanceOrOverdue">
        <van-col span="8">
          <div class="top-data completed">
            <div class="top-data__label">今日提前</div>
            <div class="top-data__value color-green">{{ balanceOrOverdue.beforeHanded || 0}}</div>
          </div>
        </van-col>
        <van-col span="8">
          <div class="top-data uncompleted">
            <div class="top-data__label">今日延迟</div>
            <div class="top-data__value color-orange">{{ balanceOrOverdue.delayed || 0 }}</div>
          </div>
        </van-col>
        <van-col span="8">
          <div class="top-data overdue">
            <div class="top-data__label">今日按计划</div>
            <div class="top-data__value color-red">{{ balanceOrOverdue.asPlaned || 0 }}</div>
          </div>
        </van-col>
      </van-row>
    </div>

  </div>
  <main class="scrollMain">
    <van-empty description="暂无数据" v-show="!refreshing && !loading && listData.length === 0"></van-empty>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list v-model:loading="loading" :finished="finished" @load="onLoad" class="order-list">
      <van-row class="order-list-item" v-for="(item, index) in listData" :key="item.Id" @click="goBrandSeriesDetail(item)">
        <van-col span="24">
          系列编码：{{ item.brandCollectionNO }}
        </van-col>
        <van-col span="24">
          系列名称：{{ item.seriesName }}
        </van-col>
        <van-col span="12">
          责任人：{{ item.staff}}
        </van-col>
        <van-col span="12" style="text-align: right;">
          系列状态：{{ item.status }}
        </van-col>
        <van-col span="12">
          开始时间：{{ item.startDate }}
        </van-col>
        <van-col span="12" style="text-align: right;">
          结束时间：{{ item.endDate }}
        </van-col>
      </van-row>
    </van-list>
  </van-pull-refresh>
  </main>
  <!-- 查询 -->
  <van-popup v-model:show="showRight" position="right" :style="{ width: '80%', height: '100%',padding: '40px 0px 0px 0px' }">
    <!-- 搜索表单 -->
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <!-- <van-field
          v-model="queryParams.userName"
          name="userName"
          label="用户名称"
          placeholder="请输入"
        /> -->
        <!-- <van-popup v-model:show="showPicker" position="bottom">
            <van-picker title="选择客户" 
                :columns="clientArr" 
                @confirm="onConfirm" 
                @cancel="showPicker = false"
                :columns-field-names="{text: 'name', value: 'id'}"
            />
        </van-popup> -->
        <van-field
        v-model="clientName"
        is-link
        readonly
        name="clientId"
        label="客户"
        placeholder="点击选择客户"
        @click="showClient = true"
      />
        <van-field
        v-model="brandName"
        is-link
        readonly
        name="BrandId"
        label="品牌"
        placeholder="点击选择品牌"
        :disabled="!clientName"
        @click="showBrand = true"
      />
        <van-field
        v-if="false"
          v-model="queryParams.beginDate"
          name="beginDate"
          label="开始时间"
          placeholder="请选择"
          is-link
          readonly
          @click="showStartTimePicker = true"
        />
        <van-field
        v-if="false"
          v-model="queryParams.endDate"
          name="endDate"
          label="结束时间"
          placeholder="请选择"
          is-link
          readonly
          @click="showEndTimePicker = true"
        />
        <van-field
          v-model="queryParams.keyword"
          name="keyword"
          label="关键字"
          placeholder="请输入"
          :border="true"
        />
      </van-cell-group>
      <div class="btn-group">
        <van-button round size='small' block @click="reset" style="margin-right: 10px;">
          重置
        </van-button>
        <van-button round size='small' block type="primary" native-type="submit">
          查询
        </van-button>
      </div>
    </van-form>
  </van-popup>
  <!-- 品牌下拉框 -->
  <van-popup v-model:show="showBrand" position="bottom">
    <van-picker title="选择品牌" 
      :columns="brandOptions"
      :columns-field-names="brandFieldNames"
      @confirm="onConfirmBrand"
      @cancel="showBrand = false"
    />
  </van-popup>
  <!-- 客户下拉 -->
  <van-popup v-model:show="showClient" position="bottom">
      <van-picker title="选择客户" 
          :columns="clientOptions" 
          @confirm="onConfirmshowClient" 
          @cancel="showClient = false"
          :columns-field-names="{text: 'name', value: 'id'}"
      />
  </van-popup>
  <!-- 开始时间 -->
  <van-popup v-model:show="showStartTimePicker" position="bottom">
    <van-date-picker @confirm="onStartTimeConfirm" @cancel="showStartTimePicker = false" />
  </van-popup>
  <!-- 结束时间 -->
  <van-popup v-model:show="showEndTimePicker" position="bottom">
    <van-date-picker @confirm="onEndTimeConfirm" @cancel="showEndTimePicker = false" />
  </van-popup>
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
    background-color: #0b7beb1f;
    padding: 10px 15px 15px 15px;
    .top-data__label{
      color: #333;
      font-weight: 600;
    }
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
  top: 155px;
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
