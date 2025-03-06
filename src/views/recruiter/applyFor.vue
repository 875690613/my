<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import request from '@/utils/request';
document.title = '申请认证介绍';

const router = useRouter();
import { createApp } from 'vue';
import { Image as VanImage } from 'vant';

const app = createApp();
app.use(VanImage);
let myPhone = $ref('');//登录后获取当前账号手机号
let applyForTxt = $ref('立即申请');//登录后获取当前账号手机号
let myData = $ref(null)
let id = $ref()
let view = $ref(false)
let islogin = $ref(false)
let isrz = $ref(false)//是否认证
const onLoad = () => {
}
onMounted(() => {
  getApplyFor();
});
// 获取详情数据
const getApplyFor = async () => {
  myPhone = sessionStorage.getItem('myPhone');
  const headers = {
      "Qeeker-Fashion-Token": sessionStorage.getItem('myToken'),
    }
  const params = {}
  const { errno, data, errmsg } = await request.get('/wx/head/hunting/getByPhone/'+ myPhone,params
  , {headers}
  );
  if (errno == 0) {
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
    view = true;

  }else if(errno == 521) {
    view = false;
    islogin = false;
    // showToast({
    //   message: errmsg,
    //   className: 'custom-toast',
    // })
    // router.push('/recruiter/loginCode');
  }else if(errno == -1) {
    view = false;
    isrz = false;
    islogin = true;
  }else{
    view = false;
  }
}
// 去查询我的认证
const goQuery = () => {
  console.log("myData:",myData);
  router.push({ name: "certificationForm", query: { id: myData.headHuntingId,state:'show'} });//查看自己的认证表单
}
//去申请
// const applyFor = () => {
//   router.push('/recruiter/certificationForm')
// }
const applyFor = (type) => {
  // 是否登录
  console.log("islogin:",islogin,isrz);
  if(islogin == true) {
    // let myHeadHuntingId = sessionStorage.getItem('myHeadHuntingId');
    if(isrz == false) {
      router.push({ name: "certificationForm",});//新增认证表单
    }
  }else {
    router.push('/recruiter/loginCode')
  }
}
</script>

<template>
  <van-nav-bar title="申请认证介绍" left-arrow @click-left="router.back()" left-text="返回" fixed :border="false">
  </van-nav-bar>
  
  <div class="top-data-group">
    <div class="top-data-group__top">
      <van-row>
        <van-col span="24">
            <div class="title">
              <!-- 毕业生招聘官 -->
              <!-- <van-image
                class="title-img"
                fit="contain"
                src="@/assets/images/zpg_title.png"
              /> -->
              <img class="title-img" src="@/assets/images/zpg_title.png" alt="" >
            </div>
            <p>成为认证招聘官，开启职业新高度！</p>
        </van-col>
      </van-row>
    </div>
    <div class="main">
      <div class="order-list">
        <div class="title">毕业生招聘官认证助您：</div>
        <p><img src="@/assets/images/icon.png" width="13" style="margin-right: 3px;">解锁更多招聘权限，获取优质毕业生资源；</p>
        <p><img src="@/assets/images/icon.png" width="13" style="margin-right: 3px;">提升专业形象，获得行业认可；</p>
        <p><img src="@/assets/images/icon.png" width="13" style="margin-right: 3px;">拓展职业发展，迈向更高目标。</p>
      </div>
      <div class="order-list">
        <div class="title">认证流程：</div>
        <p><span>1</span>填写个人信息、工作经历；</p>
        <p><span>2</span>上传学历证书、职业资格证书、工作成果证明；</p>
        <p><span>3</span>提交审核，等待结果。</p>
      </div>
      <div class="order-list">立即申请，成就招聘精英！</div>
    </div>
    <div class="footer">
      <div class="btn-group">
        <van-button type="primary" @click="applyFor" round block :disabled="myData != null">{{ applyForTxt }}</van-button>
      </div>
      <p @click="goQuery" v-if="view == true">已申请，去查询>></p>
    </div>

  </div>

</template>

<style scoped lang="scss">
#app {
  background-color: #999!important;

}
.top-data-group {
  box-sizing :  content-box;
  // 固定在顶部，距离顶部100px
  padding-top: 46px;
  // height: 100%;
  // position: fixed;
  // left: 0;
  // right: 0;
  background-image: url('@/assets/images/zpg_bg.png'); /* 使用相对路径 */
  background-size: cover; /* 背景图片覆盖整个元素 */
  background-position: top; /* 背景图片居中 */
  background-repeat: no-repeat; /* 背景图片不重复 */
  height: calc(100vh - 46px);; /* 设置高度为视口高度 */
  .top-data-group__top {
    // background-color: #0b7beb1f;
    border-radius: 4px;
    margin: 0px 20px 20px 20px;
    text-align: center;
    padding: 5px 15px 120px 31px;
    .title{
      margin-top: 10px;
      font-size: 30px;
      text-align: left;
      .title-img{
        max-width: 188.5px;
        width: 100%;

      }
    }
    p{
      text-align: left;
      font-size: 16px;
    }
  }
}

.main {
  width: 100%;
}
.order-list {
  padding: 0 20px;
  margin-bottom: 20px;
  .title{
    font-size: 18px;
    margin-bottom: 5px;
  }
  p{
    span{
      display: inline-block;
      margin-right: 3px;
      font-size: 12px;
      border-radius: 2px;
      // padding:3px;
      width: 13px;
      height: 13px;
      text-align: center;
      line-height: 13px;
      color: #fff;
      background: #1989fa;

    }
  }
}
.footer{
  .btn-group {
    display: flex;
    margin: 16px;
    justify-content: center;
    align-items: center;
  }
  p{
    font-size: 12px;
    text-align: center;
    color: #0b7beb;
  }
}

</style>
