<template>
    <van-nav-bar title="采购合同详情" fixed :border="false" left-arrow left-text="返回" @click-left="onClickLeft">
    </van-nav-bar>
    <div class="se-main">
        <main class="scrollMain">
            <!-- <van-empty description="暂无数据" v-show="listData.length === 0"></van-empty> -->

            <van-list class="order-list">
                <van-row class="order-list-item">
                    <van-col span="24" class="or-col">
                        生产合同编号：{{ listData.contractNo }}
                    </van-col>
                    <van-col span="12" class="or-col">
                        合同类型：{{ listData.contractType }}
                    </van-col>
                    <van-col span="12" class="or-col">
                        供应商：{{ listData.supplier }}
                    </van-col>
                    <van-col span="24" class="or-col">
                        采购公司：{{ listData.company }}
                    </van-col>
                    <van-col span="24" class="or-col">
                        采购日期：{{ listData.purchaseDate }}
                    </van-col>
                </van-row>

            </van-list>
            <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
                采购物料明细
            </van-divider>
            <van-list class="order-list">
                <van-row class="order-list-item" v-for="(item, index) in stoData" :key="index">
                    <van-col span="24" class="or-col">
                        序号：{{ (index + 1) }}
                    </van-col>
                    <van-col span="12" class="or-col">
                        物料编号：{{ item.StockNo }}
                    </van-col>
                    <van-col span="12" class="or-col">
                        物料品名：{{ item.StockName }}
                    </van-col>
                    <van-col span="24" class="or-col">
                        物料颜色：{{ item.Color }}
                    </van-col>
                    <van-col span="24" class="or-col">
                        规格型号：{{ item.Specification }}
                    </van-col>
                    <van-col span="12" class="or-col">
                        采购数量：{{ item.Qty }}
                    </van-col>
                    <van-col span="12" class="or-col">
                        单位：{{ item.Unit }}
                    </van-col>
                    <van-col span="24" class="or-col">
                        订单款号：{{ item.StyleNo }}
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
            listData: {},
            stoData: [],
            stoParms: {
                page: 1,
                limit: 30,
                contractId: route.query.contractId
            }
        });

        const go = str => {
            router.push(str);
        }

        // 请求接口获取数据
        const getDetData = async () => {
            const { code, rows } = await api.conllectionPurchaseDetail({ contractId: route.query.contractId });
            if (code == 200) {
                pageData.listData = rows;
            } else {
                // 获取数据失败提示
                showToast("获取数据失败");
            }
        };

        if (route.query.contractId) {
            getDetData();
        }

        const getStockData = async () => {
            const { code, rows } = await api.purchaseStockList(pageData.stoParms);
            if (code == 200) {
                pageData.stoData = rows;
            } else {
                // 获取数据失败提示
                showToast("获取数据失败");
            }
        };

        if (route.query.contractId) {
            getStockData();
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
        font-size: 12px;
        border-radius: 8px;
        background: #fff;
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
    .badge-list {
        display: flex;
        justify-content: space-around;
        margin-top: 20px;
        .badge-it {
            padding: 20px;
            font-size: 14px;
            text-align: center;
            background-color: #fff;
            border-radius: 12px;
            p {
                line-height: 38px;
            }
        }
    }
}
</style>
<style lang="scss"></style>
