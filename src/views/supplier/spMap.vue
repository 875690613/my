<template>
    <van-nav-bar title="供应商地图" fixed :border="false">
        <template #right>
            <van-icon name="list-switch" @click="showCenter = true" size="18" />
        </template>
    </van-nav-bar>
    <div class="se-main">
        <van-popup v-model:show="showCenter" round :style="{ padding: '12px' }">
            <van-field v-model="params.stockType" is-link readonly name="picker" label="类型" placeholder="请选择"
                @click="showPicker = true" />
            <van-field v-model="params.address" is-link readonly name="picker" label="地区" placeholder="请选择"
                @click="showBra = true" />

            <van-button type="primary" class="btn-requ" @click="requestData()" block>查询</van-button>
            <van-button plain type="primary" class="btn-requ" @click="resetData()" block>重置</van-button>
        </van-popup>
        <van-popup v-model:show="showPicker" position="bottom">
            <van-picker title="选择类型" :columns="typeArr" @confirm="onConfirm" @cancel="showPicker = false" />
        </van-popup>
        <van-popup v-model:show="showBra" position="bottom">
            <van-area title="地区" :area-list="areaList" @confirm="areaConfirm" @cancel="showBra = false" />
        </van-popup>
        <main class="scrollMain">
            <div class="search-inp">
                <input type="text" v-model="params.keyword" @keyup="seaData" placeholder="请输入">
            </div>
            <div class="map-sec">
                <baidu-map class="map" @ready="mapReady" ak="9gESWUQzODCzaVsK3oo6CohG8RGI91xo" v="3.0" type="API"
                    :center="center" :scroll-wheel-zoom="true" :double-click-zoom="true" :pinch-to-zoom="true"
                    :zoom="15">
                </baidu-map>
            </div>
            <!-- <van-empty description="暂无数据" v-show="listData.length === 0"></van-empty> -->
            <div class="address-list">
                <!-- <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                    <van-cell v-for="item in list" :key="item" :title="item" />
                </van-list> -->
                <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="getData">
                    <ul>
                        <li v-for="(item, index) in listData" :key="item" :class="{'active': item.Id == currentId}" @click="positionShow(item)">
                            <div>
                                <p class="com-name">{{ item.ShortName }}</p>
                                <p class="address-name">{{ item.Address }}</p>
                            </div>
                            <div class="plain-detail">
                                <van-button plain type="primary" @click.stop="go({path: 'gysInfo', query: {id: item.Id}})" size="mini">详情</van-button>
                            </div>
                        </li>
                    </ul>
                </van-list>

            </div>

        </main>
    </div>
</template>
<script>
import api from '@/request/api.js';
import { reactive, toRefs, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { BaiduMap } from 'vue-baidu-map-3x';
import { getImageUrl } from '@/utils/common';
import { areaList } from '@vant/area-data';

const acUrl = getImageUrl('position2.png');

export default {
    components: {
        BaiduMap
    },
    setup() {
        const router = useRouter();

        const pageData = reactive({
            params: {
                page: 0,
                limit: 10,
                keyword: '',
                address: '',
                stockType: '',
            },
            clientParams: {
                keyword: null
            },
            typeArr: [
                { text: '面料', value: '面料' },
                { text: '辅料', value: '辅料' },
            ],
            listData: [],
            showCenter: false,
            showPicker: false,
            result: '',
            brandArr: [],
            yearVal: '',
            showBra: false,
            finished: false,
            loading: false,
            konked: false,
            currentId: '',
            
        });
        const mapObj = ref(null);

        const go = str => {
            router.push(str);
        }

        // 请求接口获取数据
        const getData = async () => {

            pageData.params.page++;
            const { code, rows, total } = await api.clientAddresses(pageData.params);

            if (code == 200) {
                for(let i = 0; i < rows.length; i++) {
                    pageData.listData.push(rows[i]);
                }
                // pageData.listData = rows;
                // pageData.showCenter = false;
                pageData.loading = false;
                pageData.showPicker = false;
                if (pageData.listData.length >= total) {
                    pageData.finished = true;
                }
            } else {
                // 获取数据失败提示
                showToast("获取数据失败");
            }
        };
        getData();


        const onConfirm = ({ selectedOptions }) => {
            pageData.params.stockType = selectedOptions[0]['value'];

            pageData.showPicker = false;
        };

        const areaConfirm = ({ selectedOptions }) => {
            console.log(selectedOptions);
            pageData.params.address = selectedOptions[0]['text'] + selectedOptions[1]['text'] + selectedOptions[2]['text'];
            pageData.showBra = false;
        };

        const checkDetail = item => {
            router.push({ path: 'seDetail', query: { id: item.id } });
        }
        const center = reactive(
            { lng: 116.404, lat: 39.915 }
        )
        const mapReady = ({ BMap, map }) => {
            mapObj.value = map;
            setTimeout(() => {
                // 获取自动定位方法
                var geolocation = new BMap.Geolocation()
                // 获取逆解析方法实例
                new BMap.Geocoder()
                // 获取自动定位获取的坐标信息
                // geolocation.enableSDKlocation();
                geolocation.getCurrentPosition(
                    function (r) {
                        let arr = [];
                        if (r) {
                            arr.push(r.point.lng);
                            arr.push(r.point.lat);
                            console.log(r.point.lng, r.point.lat);
                            
                            center.lng = r.point.lng;
                            center.lat = r.point.lat;
                            var point = new BMap.Point(center.lng, center.lat);
                            map.centerAndZoom(point, 15);
                            var myIcon = new BMap.Icon(acUrl.href, new BMap.Size(70, 80), {
                                // 指定定位位置。   
                                // 当标注显示在地图上时，其所指向的地理位置距离图标左上    
                                // 角各偏移10像素和25像素。您可以看到在本例中该位置即是   
                                // 图标中央下端的尖角位置。    
                                anchor: new BMap.Size(0, 5),
                                // 设置图片偏移。   
                                // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您   
                                // 需要指定大图的偏移位置，此做法与css sprites技术类似。    
                                imageOffset: new BMap.Size(0, 0)   // 设置图片偏移    
                            });
                            var marker = new BMap.Marker(point, { icon: myIcon });

                            // 创建标注    
                            map.addOverlay(marker);
                            // var local = new BMap.LocalSearch(map, {
                            //     renderOptions: { map: map }
                            // });
                            // local.search("江阴市南外环路660");
                        } else {
                            // getStoreAddress([], {});
                        }
                        // getStoreAddress([], {});
                    },
                    { enableHighAccuracy: true }
                )
            }, 200);
        }
        console.log(areaList);

        const onRefresh = () => {
            // 清空列表数据
            pageData.finished = false;

            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            pageData.loading = true;
            getData();
        };

        const requestData = () => {
            pageData.finished = false;
            pageData.params.page = 0;
            pageData.listData.length = 0;
            pageData.showCenter = false;
            getData();
        }

        const resetData = () => {
            pageData.finished = false;
            pageData.params.stockType = null;
            pageData.params.address = null;
            pageData.params.keyword = '';
            requestData();
        }

        const positionShow = item => {
            var local = new BMap.LocalSearch(mapObj.value, {
                renderOptions:{map: mapObj.value}
            });
            pageData.currentId = item.Id;
            local.search(item.Address);
        }

        const seaData = event => {
            if (event.keyCode === 13 || event.key === 'Enter') {
                requestData();
            }
        }
        return {
            ...toRefs(pageData),
            go,
            onConfirm,
            areaConfirm,
            getData,
            checkDetail,
            mapReady,
            center,
            areaList,
            onRefresh,
            requestData,
            resetData,
            positionShow,
            seaData
        }
    }
}
</script>
<style lang="scss" scoped>
.se-main {
    background-color: #fff;
    min-height: 100vh;

    .scrollMain {
        padding: 0 10px;

        .search-inp {
            padding-top: 2px;
            width: 100%;

            input {
                width: 100%;
                height: 30px;
                border: 1px solid #bbbbbb;
                font-size: 12px;
                text-indent: 10px;
            }
        }

        .map-sec {
            padding-top: 10px;

            .map {
                height: 280px;
            }
        }
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

    .address-list {
        margin-top: 10px;
        margin-bottom: 5px;
        height: 400px;
        overflow-y: auto;
        overflow-x: hidden;

        ul {
            li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                padding: 8px;
                min-height: 40px;
                font-size: 12px;
                background: #fff;
                border: 1px solid #bbbbbb;

                .address-name {
                    color: #9a9a9a;
                }
                .plain-detail {
                    padding-left: 10px;
                    width: 70px;
                    button {
                        width: 60px;
                    }
                }
            }
            .active {
                border: 1px solid #1989fa;
            }
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
