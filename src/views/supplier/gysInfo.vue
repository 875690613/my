<script>
import api from '@/request/api.js';
import { ref } from 'vue';
import { showToast } from 'vant';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const value = ref('');
    const record = ref({});
    const active = ref(0);
    const loading = ref(false);
    const list = ref([]);
    const finished = ref(false);
    const refreshing = ref(false);
    const loading1 = ref(false);
    const list1 = ref([]);
    const finished1 = ref(false);
    const refreshing1 = ref(false);

    const onClickTab = ({ title }) => {
        if (title === '供应档案') {
            getClientRecord()
        }
        if (title === '供应商产品') {
            list.value = []
            onRefresh()
        }
        if (title === '供应商合同') {
            list1.value = []
            onRefresh1()
        }
    };

    const onRefresh = () => {
        // 清空列表数据
        finished.value = false;

        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        loading.value = true;
        onLoad();
    };

    const onLoad = () => {
        api.clientProduct(route.query.id).then(res => {
        // api.clientProduct(23).then(res => {
            if (refreshing.value) {
                list.value = [];
                refreshing.value = false;
            }

            list.value = list.value.concat(res.rows.rows)

            loading.value = false;

            // if (res.rows.rows.length === 0) {
                finished.value = true;
            // }
        })
    //   setTimeout(() => {
    //     if (refreshing.value) {
    //       list.value = [];
    //       refreshing.value = false;
    //     }

    //     for (let i = 0; i < 10; i++) {
    //       list.value.push(list.value.length + 1);
    //     }
    //     loading.value = false;

    //     if (list.value.length >= 40) {
    //       finished.value = true;
    //     }
    //   }, 1000);
    };

    const onLoad1 = () => {
        api.clientContract(route.query.id).then(res => {
            // api.clientContract(23).then(res => {
            if (refreshing1.value) {
                list1.value = [];
                refreshing1.value = false;
            }

            list1.value = list1.value.concat(res.rows.rows)

            loading1.value = false;

            // if (res.rows.rows.length === 0) {
                finished1.value = true;
            // }
        })
    //   setTimeout(() => {
    //     if (refreshing1.value) {
    //       list1.value = [];
    //       refreshing1.value = false;
    //     }

    //     for (let i = 0; i < 10; i++) {
    //       list1.value.push(list1.value.length + 1);
    //     }
    //     loading1.value = false;

    //     if (list1.value.length >= 40) {
    //       finished1.value = true;
    //     }
    //   }, 1000);
    };

    const onRefresh1 = () => {
      // 清空列表数据
      finished1.value = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      loading1.value = true;
      onLoad1();
    };

    const getClientRecord = async () => {
        const result = await api.clientRecord(route.query.id)
        record.value = result.rows
    }

    const goInfo = (id) => {
        router.push({ path: "gysOrderInfo", query: { contractId: id} });
    }

    getClientRecord()

    return {
        record,
        value,
        list,
        finished,
        refreshing,
        active,
        loading,
        list1,
        finished1,
        refreshing1,
        loading1,
        onRefresh,
        onRefresh1,
        onLoad,
        onLoad1,
        onClickTab,
        goInfo
    };
  },
};
</script>

<template>
    <div style="height: 100vh;">
        <van-tabs v-model:active="active" sticky class="selectTab" @click-tab="onClickTab">
            <van-tab title="供应档案">
                <div style="padding: 30px 20px;">
                    <img src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" style="display: block;width: 100%;">
                </div>
                <van-field label="供应商名称：" label-align="right" :model-value="record.shortName" readonly />
                <van-field label="供应商类型：" label-align="right" :model-value="record.supplierType" readonly />
                <van-field label="联系人：" label-align="right" :model-value="record.linkMan" readonly />
                <van-field label="联系方式：" label-align="right" :model-value="record.mobile" readonly />
                <van-field label="通讯地址：" label-align="right" :model-value="record.address" readonly />
            </van-tab>
            <van-tab title="供应商产品" >
                <van-sticky :offset-top="50">
                    <van-search v-model="value" placeholder="请输入搜索关键词" />
                </van-sticky>
                <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                    <van-list
                        v-model:loading="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="onLoad"
                    >
                        <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
                        <!-- <van-cell center v-for="item in list" :key="item" :title="item && item.Name" :value="item && item.FabricType" /> -->
                        <div style="display: flex;align-items: center;justify-content: space-between;height: 50px;border-bottom: 1px solid #E5E5E5;margin: 0 10px;padding: 0 10px;" v-for="(item, index) in list" :key="index">
                            <div style="color: #000;">{{ item.Name }}</div>
                            <div style="display: flex;align-items: center;">
                                <div style="color: #888888;margin-right: 5px;">{{ item.FabricType }}</div>
                                <van-icon name="arrow" color="#C7C7CC" />
                            </div>
                        </div>
                        <!-- <van-cell center v-for="item in list" :key="item" :title="item" value="123" /> -->
                        <!-- <div v-for="item in list" :key="item">sdfasdfasd{{ item }}</div> -->
                    </van-list>
                </van-pull-refresh>
            </van-tab>
            <van-tab title="供应商合同">
                <van-sticky :offset-top="50">
                    <van-search v-model="value" placeholder="请输入搜索关键词" />
                </van-sticky>
                <van-pull-refresh v-model="refreshing1" @refresh="onRefresh1">
                    <van-list
                        v-model:loading="loading1"
                        :finished="finished1"
                        finished-text="没有更多了"
                        @load="onLoad1"
                    >
                        <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
                        <div style="display: flex;align-items: center;justify-content: space-between;height: 70px;border-bottom: 1px solid #E5E5E5;margin: 0 10px;padding: 0 10px;" v-for="(item, index) in list1" :key="index" @click="goInfo(item.ContractId)">
                            <div style="color: #000;">{{ item.ContractNo }}</div>
                            <div style="display: flex;align-items: center;">
                                <div style="margin-right: 5px;">
                                    <div style="color: #888888;">{{ item.TotalPrice }}</div>
                                    <div style="color: #888888;">{{ item.CreaterTime }}</div>
                                </div>
                                <van-icon name="arrow" color="#C7C7CC" />
                            </div>
                        </div>
                        <!-- <div v-for="item in list" :key="item">sdfasdfasd{{ item }}</div> -->
                    </van-list>
                </van-pull-refresh>
            </van-tab>
            <!-- <van-tab title="标签 4">内容 4</van-tab> -->
        </van-tabs>
    </div>
</template>

<style scoped>
/* .selectTab {
  height: 100%;
} */
.selectTab /deep/ .van-tabs--line {
    height: 50px;
}
.selectTab /deep/ .van-tabs__wrap {
    height: 50px;
}
/* .selectTab /deep/ .van-tabs__content {
  height: calc(100% - 50px);
  background-color: skyblue;
}
.selectTab /deep/ .van-pull-refresh {
  min-height: calc(100vh - 90px);
  background-color: pink;
  overflow: auto !important;
} */
</style>