<template>
    <van-nav-bar title="系列生产信息" fixed :border="false" left-arrow left-text="返回" @click-left="onClickLeft">
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
                        生产合同编号：{{ item.contractNo }}
                    </van-col>
                    <van-col span="12" class="or-col">
                        片区名称：{{ item.regionName }}
                    </van-col>
                    <van-col span="12" class="or-col">
                        片区负责人：{{ item.regionStaff }}
                    </van-col>
                    <van-col span="24" class="or-col">
                        工厂名称：{{ item.factory }}
                    </van-col>
                    <van-col span="24" class="or-col">
                        创建日期：{{ item.createrDate }}
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
            const { code, rows } = await api.conllectionProductList(pageData.params);
            if (code == 200) {

                let rows2 = [
                    {
                        "contractId": 204713,
                        "contractNo": "324090022",
                        "regionName": "靖江西区（孙）",
                        "regionStaff": "孙国平",
                        "factory": "靖江市森奕服装有限公司",
                        "createrDate": "2024-09-19"
                    },
                    {
                        "contractId": 204725,
                        "contractNo": "324090025",
                        "regionName": "靖江东区（周）",
                        "regionStaff": "周继红",
                        "factory": "靖江市锦欣服装加工厂",
                        "createrDate": "2024-09-19"
                    },
                    {
                        "contractId": 204573,
                        "contractNo": "324090018",
                        "regionName": "泰兴一区（孙）",
                        "regionStaff": "孙国平",
                        "factory": "泰兴市缘吉服饰有限公司",
                        "createrDate": "2024-09-13"
                    }
                ]
                pageData.listData = rows2;

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
