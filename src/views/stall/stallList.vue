<template>
    <van-nav-bar title="摊位列表" fixed :border="false" left-arrow left-text="返回" @click-left="onClickLeft">
    </van-nav-bar>
    <div class="se-main">
        <main class="scrollMain">
            <van-empty description="暂无数据" v-show="listData.length === 0"></van-empty>

            <van-list class="order-list">
                <van-row class="order-list-item" v-for="(item, index) in listData" :key="index"
                    @click="go({ path: 'seProductDetail', query: { contractId: item.contractId } })">
                    <van-col span="24" class="or-col">
                        序号：{{ (index + 1) }}
                    </van-col>
                    <van-col span="24" class="or-col">
                        配款袋编号：{{ item.contractNo }}
                    </van-col>
                    <van-col span="24" class="or-col">
                        订单编号：{{ item.regionName }}
                    </van-col>
                    <van-col span="12" class="or-col">
                        订单类型：{{ item.regionStaff }}
                    </van-col>
                    <van-col span="12" class="or-col">
                        指令类型：{{ item.factory }}
                    </van-col>
                    <van-col span="24" class="or-col">
                        配款状态：{{ item.createrDate }}
                    </van-col>
                    <van-col span="24" class="or-col">
                        配款开始日期：{{ item.createrDate }}
                    </van-col>
                    <van-col span="24" class="or-col">
                        配款结束日期：{{ item.createrDate }}
                    </van-col>

                </van-row>

            </van-list>

        </main>
    </div>
</template>
<script>
import api from '@/request/api.js';
import { reactive, toRefs } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const route = useRoute();

        const pageData = reactive({
            params: {
                page: 1,
                limit: 20,
                id: route.query.id
            },
            listData: [],
        });

        const go = str => {
            router.push(str);
        }

        // 请求接口获取数据
        const getList = async () => {
            const { code, rows } = await api.conllectionAllocationList(pageData.params);
            if (code == 200) {
                pageData.listData = rows;

            } else {
                showToast("获取数据失败");
            }
        };
        if (route.query.id) {
            getList();
        }

        const onClickLeft = () => {
            router.go(-1);
        }
        return {
            ...toRefs(pageData),
            go,
            onClickLeft
        }
    }
}
</script>
<style lang="scss" scoped>
.se-main {
    background-color: #f7f7f7;
    min-height: 100vh;

    .order-list {
        padding: 0 10px;
    }

    .btn-requ {
        margin: 15px 0 15px;
    }

    .order-list-item {
        margin-top: 10px;
        margin-bottom: 5px;
        padding: 10px 0 10px 10px;
        border-bottom: 1px solid #eee;
        font-size: 12px;
        background: #fff;
        border-radius: 8px;

        .or-col {
            padding: 5px 0;
        }
    }

    .btn-group {
        display: flex;
        margin: 16px;
        justify-content: center;
        align-items: center;
    }
}
</style>
<style lang="scss"></style>
