<script>
// import { RouterView } from 'vue-router'
// document.title = '供应商地图';
// const active = $ref(0);
// const count = $ref(0);
// const loading = $ref(false);
// const onRefresh = () => {
//     setTimeout(() => {
//         console.log(count, loading)
//         showToast('刷新成功');
//         loading.value = false;
//         count.value++;
//         console.log(count, loading)
//     }, 1000);
// };
import { ref } from 'vue';
import { showToast } from 'vant';

export default {
  setup() {
    const value = ref('');
    const active = ref(0);
    const count = ref(0);
    const loading = ref(false);
    const list = ref([]);
    const finished = ref(false);
    const refreshing = ref(false);
    const onRefresh = () => {
      setTimeout(() => {
        showToast('刷新成功');
        loading.value = false;
        count.value++;
      }, 1000);
    };
    const onLoad = () => {
      setTimeout(() => {
        if (refreshing.value) {
          list.value = [];
          refreshing.value = false;
        }

        for (let i = 0; i < 10; i++) {
          list.value.push(list.value.length + 1);
        }
        loading.value = false;

        if (list.value.length >= 40) {
          finished.value = true;
        }
      }, 1000);
    };

    const onRefresh1 = () => {
      // 清空列表数据
      finished.value = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      loading.value = true;
      onLoad();
    };

    return {
        value,
        list,
        finished,
        refreshing,
        active,
        count,
        loading,
        onRefresh,
        onRefresh1,
        onLoad
    };
  },
};
</script>

<template>
    <div>
        <van-tabs v-model:active="active" sticky class="selectTab">
            <van-tab title="供应档案">
                <div style="padding: 30px 20px;">
                    <img src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" style="display: block;width: 100%;">
                </div>
                <van-field label="文本" label-align="right" model-value="输入框只读" readonly />
                <van-field label="文本" label-align="right" model-value="输入框只读" readonly />
                <van-field label="文本" label-align="right" model-value="输入框只读" readonly />
                <van-field label="文本" label-align="right" model-value="输入框只读" readonly />
                <van-field label="文本" label-align="right" model-value="输入框只读" readonly />
            </van-tab>
            <van-tab title="供应商产品" >
                <van-sticky :offset-top="52">
                    <van-search v-model="value" placeholder="请输入搜索关键词" />
                </van-sticky>
                <van-pull-refresh v-model="refreshing" @refresh="onRefresh1">
                    <van-list
                        v-model:loading="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="onLoad"
                    >
                        <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
                        <van-cell center v-for="item in list" :key="item" :title="item" value="内容" />
                        <!-- <div v-for="item in list" :key="item">sdfasdfasd{{ item }}</div> -->
                    </van-list>
                </van-pull-refresh>
            </van-tab>
            <van-tab title="供应商合同">
                <van-sticky :offset-top="52">
                    <van-search v-model="value" placeholder="请输入搜索关键词" />
                </van-sticky>
                <van-pull-refresh v-model="refreshing" @refresh="onRefresh1">
                    <van-list
                        v-model:loading="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="onLoad"
                    >
                        <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
                        <van-cell center v-for="item in list" :key="item" :title="item">
                            <template #value>
                                <div>
                                    <div>123</div>
                                    <div>123</div>
                                </div>
                            </template>
                        </van-cell>
                        <!-- <div v-for="item in list" :key="item">sdfasdfasd{{ item }}</div> -->
                    </van-list>
                </van-pull-refresh>
            </van-tab>
            <!-- <van-tab title="标签 4">内容 4</van-tab> -->
        </van-tabs>
    </div>
</template>

<style scoped>
.selectTab /deep/ .van-tabs--line {
    height: 50px;
}
.selectTab /deep/ .van-tabs__wrap {
    height: 50px;
}
</style>