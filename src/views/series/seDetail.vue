<template>
    <van-nav-bar title="系列详情" fixed :border="false" left-arrow left-text="返回" @click-left="onClickLeft">
    </van-nav-bar>
    <div class="se-main">
        <main class="scrollMain">
            <!-- <van-empty description="暂无数据" v-show="listData.length === 0"></van-empty> -->

            <van-list class="order-list">
                <van-row class="order-list-item">
                    <van-col span="12" class="or-col">
                        系列：{{ listData.collectionNO }}
                    </van-col>
                    <van-col span="12" class="or-col">
                        客户：{{ listData.client }}
                    </van-col>
                    <van-col span="12" class="or-col">
                        品牌：{{ listData.brand }}
                    </van-col>
                    
                    <van-col span="12" class="or-col">
                        年份：{{ listData.year }}
                    </van-col>
                </van-row>

            </van-list>
            <van-divider />
            <div class="badge-list">
                <div class="badge-it" @click="go({ path: 'styleOrder', query: {} })">
                    <div class="badge">
                        <van-icon name="column" size="38" />
                    </div>
                    <p>系列款式订单</p>
                </div>
                <div class="badge-it" @click="go({ path: 'purchaseList', query: {id: listData.id} })">
                    <div class="badge">
                        <van-icon name="shopping-cart" size="38" />
                    </div>
                    <p>系列采购信息</p>
                </div>
            </div>
            <div class="badge-list">
                <div class="badge-it" @click="go({ path: 'seProductList', query: {id: listData.id} })">
                    <div class="badge">
                        <van-icon name="setting" size="38" />
                    </div>
                    <p>系列生产信息</p>
                </div>
                <div class="badge-it">
                    <div class="badge">
                        <van-icon name="bag" size="38" />
                    </div>
                    <p>系列配款状态</p>
                </div>
            </div>

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
                time: '10j9adlq53ao0',
                page: 1,
                limit: 10,
                postName: '',
                id: route.query.id || ''
            },
            listData: {},
            stateWord: {
                0: '未营业',
                1: '营业中',
            },
            showCenter: false,
            showPicker: false,
            columns: [
                { text: '杭州', value: 'Hangzhou' },
                { text: '宁波', value: 'Ningbo' },
                { text: '温州', value: 'Wenzhou' },
                { text: '绍兴', value: 'Shaoxing' },
                { text: '湖州', value: 'Huzhou' },
            ],
            result: '',
        });

        const go = str => {
            router.push(str);
        }

        // 请求接口获取数据
        const getDetData = async () => {
            const { code, rows } = await api.brandConllectionDetail({ id: route.query.id });
            if (code == 200) {
                pageData.listData = rows;
            } else {
                // 获取数据失败提示
                showToast("获取数据失败");
            }
        };

        if (route.query.id) {
            getDetData();
        }
        

        const onConfirm = ({ selectedValues }) => {
            pageData.showPicker = false;
            
        };
        const onChange = ({ selectedValues }) => {
            pageData.showPicker = false;
        };
        const onCancel = () => showToast('取消');

        const onClickLeft = () => {
            router.go(-1);
        }
        return {
            ...toRefs(pageData),
            go,
            onConfirm,
            onChange,
            onCancel,
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
