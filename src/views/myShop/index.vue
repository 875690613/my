<template>
  <van-nav-bar left-arrow left-text="返回" @click-left="onClickLeft" title="店铺列表" fixed :border="false">
  </van-nav-bar>
  <main class="scrollMain">
    <van-empty description="暂无数据" v-show="pageData.listData.length === 0"></van-empty>
    
      <van-list class="order-list">
        <van-row class="order-list-item" v-for="(item, index) in pageData.listData" :key="item.Id">
          <van-col span="24">
            店铺名称：{{ item.branchName }}
          </van-col>
          <van-col span="24">
            店铺电话：{{ item.phone }}
          </van-col>
          <van-col span="24">
            店 长：{{ item.shopOwner }}
          </van-col>
          <van-col span="24">
            店长电话：{{ item.ownerPhone }}
          </van-col>
          <van-col span="24">
            营业时间：{{ item.businessStart }} ~ {{ item.businessEnd }}
          </van-col>
          <van-col span="24">
            经营状态：{{ pageData.stateWord[item.state] }}
          </van-col>
          <van-col span="24">
            店铺地址：{{ item.address }}
          </van-col>
          <van-col span="24">
            经营范围：{{ item.businessScope }}
          </van-col>
        </van-row>
      </van-list>

  </main>
  <!-- <van-popup v-model:show="showTop" position="top" :style="{ height: '45%' }">
    <van-form v-if="showTopIcon" @submit="onSubmit">
      <van-cell-group inset>
        <van-field v-model="queryParams.keyword" name="keyword" label="订单款号" placeholder="请输入" />
        <van-field v-model="brandName" is-link readonly name="BrandId" label="品牌" placeholder="点击选择品牌"
          @click="showBrand = true" />
        <van-field v-model="regionName" is-link readonly name="regionId" label="片区" placeholder="点击选择片区"
          @click="showRegion = true" />
        <van-field v-model="queryParams.beginDate" name="beginDate" label="开始时间" placeholder="请选择" is-link readonly
          @click="showStartTimePicker = true" />
        <van-field v-model="queryParams.endDate" name="endDate" label="结束时间" placeholder="请选择" is-link readonly
          @click="showEndTimePicker = true" />
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
  </van-popup> -->

  <!-- <van-popup v-model:show="showBrand" position="bottom">
    <van-picker :columns="brandOptions" :columns-field-names="brandFieldNames" @confirm="onConfirmBrand"
      @cancel="showBrand = false" />
  </van-popup>
  <van-popup v-model:show="showRegion" position="bottom">
    <van-picker :columns="regionOptions" :columns-field-names="regionFieldNames" @confirm="onConfirmRegion"
      @cancel="showRegion = false" />
  </van-popup>
  <van-popup v-model:show="showStartTimePicker" position="bottom">
    <van-date-picker @confirm="onStartTimeConfirm" @cancel="showStartTimePicker = false" />
  </van-popup>
  <van-popup v-model:show="showEndTimePicker" position="bottom">
    <van-date-picker @confirm="onEndTimeConfirm" @cancel="showEndTimePicker = false" />
  </van-popup> -->
</template>
<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { removeEmptyProps } from '@/utils/common';
import api from '@/request/api.js';

const router = useRouter();

const listData = reactive([]);
const pageData = reactive({
  params: {
    time: 'vqmsmmdtog00',
    page: 1,
    limit: 20,
  },
  info: [],
  listData: [],
  stateWord: {
    0: '未营业',
    1: '营业中',
  }
});
// 请求接口获取数据
const getData = async () => {
  const { status, data } = await api.shopList(pageData.params);
  if (status == 200) {
    pageData.listData = data.rows;

  } else {
    // 获取数据失败提示
    showToast("获取数据失败");
  }
};
getData();
const onClickLeft = () => {
  router.go(-1);
}
</script>
<style scoped>
.order-list {
  padding: 0 20px;
}

.order-list-item {
  margin-top: 10px;
  margin-bottom: 5px;
  padding: 10px 0 10px 10px;
  border-bottom: 1px solid #eee;
  font-size: 12px;
  background: #e8f1f3;
  border-radius: 16px;
}

.btn-group {
  display: flex;
  margin: 16px;
  justify-content: center;
  align-items: center;
}
</style>
