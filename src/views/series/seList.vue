<template>
    <van-nav-bar title="系列列表" fixed :border="false">
        <template #right>
            <van-icon name="list-switch" @click="showCenter = true" size="18" />
        </template>
    </van-nav-bar>
    <div class="se-main">
        <van-popup v-model:show="showCenter" round :style="{ padding: '12px' }">
            <van-field v-model="clientName" is-link readonly name="picker" label="客户" placeholder="请选择"
                @click="showPicker = true" />
            <van-field v-model="braName" is-link readonly name="picker" label="品牌" placeholder="请选择"
            @click="braEvent" />
            <van-field v-model="yearVal" is-link readonly name="picker" label="上市年份" placeholder="请选择"
                @click="showYears = true" />
            <van-button type="primary" class="btn-requ" @click="getData()" block>查询</van-button>
        </van-popup>
        <van-popup v-model:show="showPicker" position="bottom">
            <van-picker title="选择客户" 
                :columns="clientArr" 
                @confirm="onConfirm" 
                @cancel="showPicker = false"
                :columns-field-names="{text: 'name', value: 'id'}"
            />
        </van-popup>
        <van-popup v-model:show="showBra" position="bottom">
            <van-picker title="选择品牌" 
                :columns="brandArr" 
                @confirm="brandConfirm" 
                @cancel="showBra = false"
                :columns-field-names="{text: 'name', value: 'id'}"
            />
        </van-popup>
        <van-popup v-model:show="showYears" position="bottom">
            <van-picker title="选择年份" 
                :columns="years" 
                @confirm="yearConfirm" 
                @cancel="showYears = false"
            />
        </van-popup>
        <main class="scrollMain">
            <van-empty description="暂无数据" v-show="listData.length === 0"></van-empty>

            <van-list class="order-list">
                <van-row class="order-list-item" 
                    v-for="(item, index) in listData" 
                    :key="index"
                    @click="checkDetail(item)"
                >
                    <van-col span="24" class="or-col">
                        序号：{{ (index + 1) }}
                    </van-col>
                    <van-col span="12" class="or-col">
                        客户：{{ item.client }}
                    </van-col>
                    <van-col span="12" class="or-col">
                        品牌：{{ item.brand }}
                    </van-col>
                    <van-col span="12" class="or-col">
                        系列：{{ item.collectionNO }}
                    </van-col>
                    <van-col span="12" class="or-col">
                        年份：{{ item.year }}
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
                brandId: null,
                clientId: null,
                year: null,
            },
            clientParams: {
                keyword: null
            },
            clientName: '',
            clientArr: [],
            listData: [],
            stateWord: {
                0: '未营业',
                1: '营业中',
            },
            showCenter: true,
            showPicker: false,
            columns: [
                { text: '杭州', value: 'Hangzhou' },
                { text: '宁波', value: 'Ningbo' },
                { text: '温州', value: 'Wenzhou' },
                { text: '绍兴', value: 'Shaoxing' },
                { text: '湖州', value: 'Huzhou' },
            ],
            result: '',
            brandArr: [],
            braName: '',
            yearVal: '',
            showBra: false,
            showYears: false,
            years: [
                { text: '2020', value: '2020' },
                { text: '2021', value: '2021' },
                { text: '2022', value: '2022' },
                { text: '2023', value: '2023' },
                { text: '2024', value: '2024' },
                { text: '2025', value: '2025' },
                { text: '2026', value: '2026' },
                { text: '2027', value: '2027' },
                { text: '2028', value: '2028' },
                { text: '2029', value: '2029' },
            ]
        });

        const go = str => {
            router.push(str);
        }

        // 请求接口获取数据
        const getData = async () => {
            const { code, rows } = await api.brandList(pageData.params);
            
            if (code == 200) {
                pageData.listData = rows;
                pageData.showCenter = false;
            } else {
                // 获取数据失败提示
                showToast("获取数据失败");
            }
        };
        getData();

        // 获取客户列表
        const getClientList = async () => {
            const { code, rows } = await api.clientList(pageData.params);
            
            if (code == 200) {
                pageData.clientArr = rows;
                
            } else {
                showToast("获取客户列表失败");
            }
        };
        getClientList();

        const onConfirm = ({selectedOptions}) => {
            pageData.clientName = selectedOptions[0]['name'];
            pageData.params.clientId = selectedOptions[0]['id'];
            pageData.showPicker = false;

            getBrandByClient(pageData.params.clientId);
        };

        // 根据客户获取品牌
        const getBrandByClient = async (id) => {
            const { code, rows } = await api.queryBrand({clientId: id});
            
            if (code == 200) {
                pageData.brandArr = rows;

            } else {
                showToast("获取品牌失败");
            }
        };

        const brandConfirm = ({selectedOptions}) => {
            pageData.braName = selectedOptions[0]['name'];
            pageData.params.brandId = selectedOptions[0]['id'];
            pageData.showBra = false;
        };

        const yearConfirm = ({selectedOptions}) => {
            pageData.yearVal = selectedOptions[0]['value'];
            pageData.params.year = selectedOptions[0]['value'];
            pageData.showYears = false;
        };

        const braEvent = () => {
            if (pageData.brandArr.length == 0) {
                showToast('请先选择客户');
            } else {
                pageData.showBra = true;
            }
            
        }

        const checkDetail = item => {
            router.push({ path: 'seDetail', query: { id: item.id} });
        }
        return {
            ...toRefs(pageData),
            go,
            onConfirm,
            brandConfirm,
            yearConfirm,
            braEvent,
            getData,
            checkDetail,
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
