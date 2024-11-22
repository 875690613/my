<script>
import api from '@/request/api.js';
import { ref } from 'vue';
import { showToast } from 'vant';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const keyword = ref('');
    const keyword1 = ref('');
    const record = ref({});
    const active = ref(0);
    const loading = ref(false);
    const list = ref([]);
    const finished = ref(false);
    const refreshing = ref(false);
    const page = ref(0);
    const page1 = ref(0);
    const loading1 = ref(false);
    const list1 = ref([]);
    const finished1 = ref(false);
    const refreshing1 = ref(false);

    const onClickTab = ({ title }) => {
        if (title === '供应档案') {
            getClientRecord()
        }
        if (title === '供应商产品') {
            page.value = 0
            list.value = []
            onRefresh()
        }
        if (title === '供应商合同') {
            page1.value = 0
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
        page.value = 0
        list.value = []
        onLoad();
    };

    const onLoad = () => {
        page.value++
        api.clientProduct({
            keyword: keyword.value,
            id: route.query.id,
            page: page.value,
            limit: 20
        }).then(res => {
            console.log(res.rows.length)
            if (refreshing.value) {
                list.value = [];
                refreshing.value = false;
            }

            list.value = list.value.concat(res.rows)

            loading.value = false;
            if (list.value.length >= res.total) {
                finished.value = true;
            }
        })
    };

    const onLoad1 = () => {
        page1.value++
        api.clientContract({
            keyword: keyword1.value,
            id: route.query.id,
            page: page1.value,
            limit: 20
        }).then(res => {
            if (refreshing1.value) {
                list1.value = [];
                refreshing1.value = false;
            }

            list1.value = list1.value.concat(res.rows)

            loading1.value = false;

            if (list1.value.length >= res.total) {
                finished1.value = true;
            }
        })
    };

    const onRefresh1 = () => {
      // 清空列表数据
      finished1.value = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      loading1.value = true;
      page1.value = 0
      list1.value = []
      onLoad1();
    };

    const getClientRecord = async () => {
        const result = await api.clientRecord(route.query.id)
        record.value = result.rows
    }

    const goInfo = (id) => {
        router.push({ path: "gysOrderInfo", query: { contractId: id} });
    }

    const onClickLeft = () => {
        router.back();
    }

    getClientRecord()

    const onSearch = () => {
        page.value = 0
        list.value = []
        onRefresh()
    }

    const onSearch1 = () => {
        page1.value = 0
        list1.value = []
        onRefresh1()
    }

    return {
        record,
        keyword,
        keyword1,
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
        onClickLeft,
        onSearch,
        onSearch1,
        goInfo
    };
  },
};
</script>

<template>
    <div>
        <van-nav-bar
            title=""
            left-text=""
            fixed
            placeholder
            z-index="999999"
            left-arrow
            @click-left="onClickLeft"
        />
        <van-tabs v-model:active="active" class="selectTab" @click-tab="onClickTab">
            <van-tab title="供应档案">
                <div style="padding: 30px 20px;">
                    <img :src="record.businessLicense" style="display: block;width: 100%;">
                </div>
                <van-field label="供应商名称：" label-align="right" :model-value="record.shortName" readonly />
                <van-field label="供应商类型：" label-align="right" :model-value="record.supplierType" readonly />
                <van-field label="联系人：" label-align="right" :model-value="record.linkMan" readonly />
                <van-field label="联系方式：" label-align="right" :model-value="record.mobile" readonly />
                <van-field label="通讯地址：" label-align="right" :model-value="record.address" readonly />
            </van-tab>
            <van-tab title="供应商产品" >
                <van-sticky :offset-top="46">
                    <van-search v-model="keyword" placeholder="请输入搜索关键词" @search="onSearch" />
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
                <van-sticky :offset-top="46">
                    <van-search v-model="keyword1" placeholder="请输入搜索关键词" @search="onSearch1" />
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
            
            <van-back-top />
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