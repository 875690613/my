<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import {removeEmptyProps} from '@/utils/common';
import api from '@/request/api'

// import VConsole from 'vconsole';
// const vConsole = new VConsole();

const router = useRouter();

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
  router.push({ name: "orderDetail", query: { id: item.Id, regionId: item.RegionId, colorId: item.ColorId } });
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
});

// 请求接口获取数据
const getData = async () => {
  loading = true;
  const params = removeEmptyProps(queryParams);
  const { code, rows } = await api.workorderPatternList(params);
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
  finished = true;
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
  <van-nav-bar title="我的项目查询" fixed :border="false">
    <template #right>
      <van-icon v-if="showTopIcon" name="bars" size="24" @click="showTop = true" />
    </template>
  </van-nav-bar>
  <main class="scrollMain">
    <van-empty description="暂无数据" v-show="!refreshing && !loading && listData.length === 0"></van-empty>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list v-model:loading="loading" :finished="finished" @load="onLoad" class="order-list">
      <van-row class="order-list-item" v-for="(item, index) in listData" :key="item.Id" @click="goOrderDetail(item)">
        <van-col span="24">
          序号：{{ index + 1 }}
        </van-col>
        <van-col span="24">
          款号：{{ item.StyleNo }}
        </van-col>
        <van-col span="12">
          订单类型：{{ item.StyleType }}
        </van-col>
        <van-col span="12">
          品牌：{{ item.Brand }}
        </van-col>
        <van-col span="12">
          离厂日期：{{ item.OrderDeliveryDate }}
        </van-col>
        <van-col span="12">
          业务组：{{ item.BusinessGroup }}
        </van-col>
        <van-col span="12">
          颜色：{{ item.Color }}
        </van-col>
        <van-col span="12">
          数量：{{ item.Qty }}
        </van-col>
        <van-col span="24">
          尺码：{{ item.Size }}
        </van-col>
        <van-col span="12">
          生产片区：{{ item.Region }}
        </van-col>
        <van-col span="12">
          工厂/车间：{{ item.Factory }}
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

<style scoped>
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
</style>
