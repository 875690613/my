<template>
    <van-nav-bar title="系列款式订单" fixed :border="false" left-arrow left-text="返回" @click-left="onClickLeft">
    </van-nav-bar>
    <div class="se-main">
        <main class="scrollMain">
            <!-- <van-empty description="暂无数据" v-show="listData.length === 0"></van-empty> -->

            <van-list class="order-list">
                <van-row class="order-list-item">
                    <van-col span="24" class="or-col">
                        序号：1
                    </van-col>
                    <van-col span="24" class="or-col">
                        款号：1
                    </van-col>
                    <van-col span="12" class="or-col">
                        订单类型：1
                    </van-col>
                    <van-col span="12" class="or-col">
                        品牌：1
                    </van-col>
                    <van-col span="12" class="or-col">
                        离厂日期：6
                    </van-col>
                    <van-col span="12" class="or-col">
                        业务组：12
                    </van-col>
                    <van-col span="12" class="or-col">
                        颜色：6
                    </van-col>
                    <van-col span="12" class="or-col">
                        数量：12
                    </van-col>
                    <van-col span="24" class="or-col">
                        尺码：1
                    </van-col>
                    <van-col span="12" class="or-col">
                        生产片区：6
                    </van-col>
                    <van-col span="12" class="or-col">
                        工厂/车间：12
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
                time: '10j9adlq53ao0',
                page: 1,
                limit: 10,
                postName: '',
                id: route.query.id || ''
            },
            listData: [],
        });

        const go = str => {
            router.push(str);
        }

        // 请求接口获取数据
        const getList = async () => {
            const { code, rows } = await api.myStyleList({ id: route.query.id });
            if (code == 200) {
                pageData.listData = rows;

            } else {
                showToast("获取数据失败");
            }
        };
        if (route.query.id) {
            getList();
        }

        return {
            ...toRefs(pageData),
            go,
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
