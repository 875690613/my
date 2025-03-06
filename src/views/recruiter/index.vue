<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import request from '@/utils/request';
import {removeEmptyProps} from '@/utils/common';
import TextAvatar from '@/components/TextAvatar.vue';
import { PullRefresh } from 'vant';
document.title = '毕业生招聘官';
const router = useRouter();
let myData = $ref(null)
let listData = $ref([]);
let applyForTxt = $ref('');
let myPhone = $ref('');//登录后获取当前账号手机号

let loading = $ref(false);
let finished = $ref(false);
let refreshing = $ref(false);
let total = $ref(0);

const onLoad = () => {
  console.log('onLoad...')
  if (refreshing) {
    listData = [];
    queryParams.page = 0;
  }
  queryParams.page++;
  getData();
}
onMounted(() => {
  // getData();
  // getApplyFor();
 
});
// const onRefresh = () => {
//   console.log('onRefresh...')
//   listData = [];
//   queryParams.page = 1;
//   getData();
// }

const queryParams = reactive({
  page: 0,
  limit: 10,
});
// 去认证
const goApplyFor = () => {
  // goQuery();
  router.push({ name: "applyFor" });
};

const goBrandSeriesDetail = (item) => {
  // router.push({ name: "supplierReconcileList", query: { id: item.Id, regionId: item.RegionId, colorId: item.ColorId } });
  console.log("item:",item);
  router.push({ name: "certificationForm", query: { id: item.headHuntingId,state:'show' } });
};

// 请求接口获取列表数据
const getData = async () => {
  loading = true;
  const params = removeEmptyProps(queryParams);
  queryParams.status = 1;
  console.log("object params:", params);
  const { errno, data, errmsg } = await request.get('/wx/head/hunting/list', params);
  if (errno == 0) {
    // 计算total
    total = data.total;
    console.log("total:", total);

    listData = listData.concat(data.list);
    // 计算finished
    finished = data.list.length < queryParams.limit || listData.length >= total;
    console.log("finished:",finished);
    // 合并数据
  } else {
    // 获取数据失败提示
    showToast(errmsg);

    // router.push('/recruiter/loginCode')
  }
  loading = false;
  refreshing = false;
};

// 去查询我的认证
const goQuery = (type) => {
  let myToken = sessionStorage.getItem('myToken');
  if (myToken == null || myToken == '' || myToken == undefined) {
    router.push('/recruiter/loginCode')
  } else {
    getApplyFor(type)
    // let myHeadHuntingId = sessionStorage.getItem('myHeadHuntingId');
    // router.push({ name: "certificationForm", query: { id: myHeadHuntingId,state:'show'} });//查看自己的认证表单
  }
}
// 获取我的认证表单信息判断是否认证
const getApplyFor = async (type) => {
  console.log("你是谁啊222");
  myPhone = sessionStorage.getItem('myPhone');
  if (myPhone != null || myPhone != '' || myPhone != undefined) {
 
    const headers = {
        "Qeeker-Fashion-Token": sessionStorage.getItem('myToken'),
      }
    const params = {}
    const { errno, data, errmsg } = await request.get('/wx/head/hunting/getByPhone/'+ myPhone,params
    , {headers}
    );
    if (errno == 0) {
      console.log("你是谁啊333",data);
      myData = data;
      myData.headHuntingId
      sessionStorage.setItem('myHeadHuntingId', myData.headHuntingId);
      if (myData.status == 0) {
        applyForTxt = '待审核';
      }else if (myData.status == 1) {
        applyForTxt = '已通过';
      }
      else if (myData.status == 2) {
        applyForTxt = '未通过';
      }
      if(type == 'my') {
        // 如果申请了就跳转到查询页面
        let myHeadHuntingId = sessionStorage.getItem('myHeadHuntingId');
        router.push({ name: "certificationForm", query: { id: myHeadHuntingId,state:'show'} });//查看自己的认证表单
      }else{
        // 已登录状态下，未查到认证信息，去申请认证介绍页面
        router.push({ name: "applyFor" });
        // goApplyFor();
      }
    }else{
      //去登录
      if(errno == 521) {
        router.push('/recruiter/loginCode')
      }else if(errno == -1) {
        if(type == 'my') {//个人中心进入
          showToast("暂未认证,先去认证");
        }else{
          // 已登录状态下，未查到认证信息，去申请认证介绍页面
          router.push({ name: "applyFor" });
          // goApplyFor();
        }
      }else{
        
        
      }
    }
  }
}
const onRefresh = () => {
      setTimeout(() => {
        showToast('刷新成功');
      }, 1000);
    };
</script>

<template>
  <van-nav-bar title="毕业生招聘官" @click-left="router.back()" fixed :border="false">
    <template #right>
        <van-icon name="user" color="#666" @click="goQuery('my')" size="22" />
    </template>
  </van-nav-bar>
  
  <div class="top-data-group">
    <div class="top-data-group__top">
      <van-row>
        <van-col span="18">
            <div class="title">毕业生招聘官</div>
            <p>成为认证招聘官，开启职业新高度！</p>
        </van-col>
        <van-col span="6" class="goAuthentication">
            <div class="text" @click="goApplyFor">去认证<van-icon name="arrow" /></div>
        </van-col>
      </van-row>
    </div>

  </div>
  <div>
  </div>
  <main class="scrollMain">
    <van-empty description="暂无数据" v-show="!refreshing && !loading && listData.length === 0"></van-empty>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
      <van-list v-model:loading="loading" :finished="finished" @load="onLoad" class="order-list">
        <van-row class="order-list-item" v-for="(item, index) in listData" :key="item.Id" @click="goBrandSeriesDetail(item)">
          <van-col span="6">
            <div class="list-left">
              <van-image
              v-if="false"
              round
              width="1rem"
              height="1rem"
              src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
              />
              <TextAvatar :name="item.headHuntingName" :size="56" :cut-num="2"></TextAvatar>
          </div>
        </van-col>
        <van-col span="18">
          <div>
            <div class="list-userName">{{ item.headHuntingName }}</div>
            <div class="list-tag" v-if="item.jobName">
              <van-tag type="primary">{{item.jobName}}</van-tag>
            </div>
            <div class="list-introduce"><van-text-ellipsis :content="item.selfIntroduction" />
            </div>
          </div>
        </van-col>
        
      </van-row>
    </van-list>
  </van-pull-refresh>
  </main>
  
</template>

<style scoped lang="scss">
.top-data-group {
  // 固定在顶部，距离顶部100px
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  .top-data-group__top {
    // background-color: #0b7beb1f;
    border: #ddd solid 1px;
    border-radius: 4px;
    margin: 0px 20px;

    padding: 5px 15px 10px 15px;
    .top-data__label{
      color: #333;
      font-weight: 600;
    }
    .title{
      font-size: 30px;
    }
    p{
      font-size: 12px;
    }
    .goAuthentication{
      display: flex;
      align-items: center;
      justify-content: right;
      .text{
        text-align: right;

      }
    }
  }
}
.top-filter {
  background-color: #f5f5f5;
  padding: 5px;
  .field-select {
    padding: 3px;
  }
  .name-field {
    padding: 3px;
    height: 30px;
    line-height: 1;
  }
}
.scrollMain {
  height: calc(100vh - 180px);
  overflow-y: auto;
  position: absolute;
  top: 145px;
  width: 100%;
}
.order-list {
  padding: 0 20px;
}
.order-list-item {
  margin-bottom: 5px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 12px;
  .list-left{
    position: relative;
    // display: flex;
    // justify-content: right;
    text-align: center;
    .profileIcon{
      position: absolute;
      bottom: 5px;
      right: 15px;
    }
  }
  .list-userName{
    font-size: 18px;
    font-weight: 600;
  }
}
.btn-group {
  display: flex;
  margin: 16px;
  justify-content: center;
  align-items: center;
}
.top-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px;
  margin-bottom: 0;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: white;
  &__label {
    font-size: 14px;
    color: #999;
  }
  &__value {
    font-size: 24px;
    font-weight: bold;
  }
}
</style>
