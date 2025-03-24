<script setup>
import { onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router'
import request from '@/utils/request';
const router = useRouter()
document.title = '公司详情';

let loading = $ref(false)

let orderId = $ref()
let regionId = $ref()
let colorId = $ref()

let detailData = $ref(null)
let id = $ref()
id = router.currentRoute.value.query.id
watchEffect(() => {
  orderId = router.currentRoute.value.query.id
  regionId = router.currentRoute.value.query.regionId || 0
  colorId = router.currentRoute.value.query.colorId
})

// 获取对账单详情数据
const getData = async () => {
  loading = true;
  const params = {}
  const { code, data, msg } = await request.get('/api/oa/sysExternalOrg/read/infoByOrgId/'+ id,params,
  {
    headers: {
      Authorization: sessionStorage.getItem('myToken')
    }
  }
);
  if (code == 200) {
    detailData = data
    console.log("detailData:",detailData);
  }
  loading = false;
}

onMounted(() => {
  getData();
})
</script>

<template>
  <div class="bg">
    <van-nav-bar title="公司详情" fixed :border="false" left-arrow left-text="返回" @click-left="router.back()" />
    <main class="main">
      <div v-if="loading" class="loading-wrap">
        <van-loading>加载中...</van-loading>
      </div>
      <template v-else-if="detailData">
        <div class="top-data-group__top">
          {{ detailData.companyName }}
        </div>
        <van-row class="order-info">
          <van-col span="24">
            公司类型：
            <!-- 如果detailData.companyType等于1 表示无限责任公司，等于2 表示有限责任公司，等于3 表示两合公司，等于4 表示股份有限公司，等于5 表示股份两合公司 -->
             {{ detailData.companyType == 1 ? '无限责任公司' : detailData.companyType == 2 ? '有限责任公司' : detailData.companyType == 3 ? '两合公司' : detailData.companyType == 4 ? '股份有限公司' : detailData.companyType == 5 ? '股份两合公司' : '--' }}
          </van-col>
          <van-col span="24">
            经营范围：{{ detailData.businessScope || '--' }}
          </van-col>
          <van-col span="24">
            成立日期：{{ detailData.establishedDate || '--' }}
          </van-col>
          <van-col span="24">
            公司地址：{{ detailData.companyAddress || '--' }}
          </van-col>
        </van-row>
        
      </template>
    </main>
  </div>
</template>

<style scoped lang="scss">
.van-nav-bar{
  background: #ffffff00;
}
.bg{
  background-color: #EDF6FF;
  background-image: url('@/assets/images/myGroup/bg_top.png'),url('@/assets/images/myGroup/loginBg.png');// no-repeat top center / 100% auto
  background-position: top, bottom; /* 每张图片的位置 */
  background-repeat: no-repeat, no-repeat; /* 每张图片的重复方式 */
  background-size: contain, contain; /* 每张图片的大小 */
  height: 100%;
  padding-top: 46px;
  .main{
    height: 100%;
    margin: 0px 16px 15px 16px;
    padding: 20px;
    font-size: 16px;
    color: #333;
    // border-radius: 10px;
    background: linear-gradient(180deg, #E6F4FF 0%, #FFFFFF 99%);
    box-sizing: border-box;
    border: 3px solid #FFFFFF;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    box-shadow: 0px 10px 30px 0px rgba(198, 211, 226, 0.6);
  }
}
  .top-data-group__top {
    // background-color: #1989fa;
    padding: 10px 15px 15px 15px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
.order-info {
  margin-bottom: 5px;
  padding: 20px;
  // border-bottom: 1px solid #eee;
  // background-color: #1989fa;
  // color: #cce5ff;
}
.order-info .van-col {
  font-size: 14px;
}
.operators {
  padding-top: 30px;
}
.operators .van-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
}
.operators .van-col .van-button {
  margin: 10px 30px;
}
</style>
