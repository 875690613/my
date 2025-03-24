<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import request from '@/utils/request';
import {removeEmptyProps} from '@/utils/common';
import myLogo from '@/assets/images/myGroup/logo.png';
import myGroup_icon01 from '@/assets/images/myGroup/myGroup_icon01.png';
import myGroup_icon02 from '@/assets/images/myGroup/myGroup_icon02.png';
document.title = '我的集团';

const router = useRouter();
let userInfo = $ref({});
const phone = $ref(sessionStorage.getItem('userPhone') || '',);


const onLoad = () => {
  console.log('onLoad...')
  getData();
}


const queryParams = reactive({
  phone: phone
});

const goQuery = (type) => {
  let token = sessionStorage.getItem('myToken')
  console.log("导航token:",token)
  if(token){
    if(type == '1') {
      router.push({ name: "myGroupEmployeeInfo", query: { type: type, } });
    }else if(type == '2'){
      router.push({ name: "myGroupIndex", query: { type: type, } });
    }
  }else{
    router.push({ name: "myGroupLoginCode", query: { type: type, } });
  }
};


onMounted(() => {
  // getData();
 
});

// 请求接口获取员工信息数据
const getData = async () => {
  loading = true;
  const params = removeEmptyProps(queryParams);
  const { status, data, message} = await request.get('/api/oa/user/apply/card/getUserInfoByPhone', params, {
    headers: {
      Authorization: sessionStorage.getItem('myToken')
    }
  });
  if (status == 200) {
    // 计算finished
    // finished = rows.length < queryParams.limit;
    // 合并数据
    orgId = data.orgId
    userInfo = data
    //如果有照片id就获取照片，说明申请通过了
    if (userInfo.photoId) {
        // 如果员工证申请通过则清除缓存头像
        localStorage.removeItem('photoFile')
        localStorage.removeItem('ids')
        getPhotoFile()//获取头像
    }else{
      let localPhotoFile = localStorage.getItem('photoFile')
      // 如果有缓存头像就显示缓存头像
      if(localPhotoFile){
        photoFile = localPhotoFile
        // console.log("缓存中获取photoFile:",photoFile);
      }
    }
  } else {
    // 获取数据失败提示
    showToast(message);
    sessionStorage.clear();
    // router.push('/myGroup/loginCode');
  }
  loading = false;
};

</script>

<template>
  <div class="bg">
    <van-nav-bar left-text=""  @click-left="router.back()" title="我的集团"  fixed :border="false"></van-nav-bar>
    <div class="logo">
      <van-image class="myLogo" :src="myLogo" />
      <span>逐日集团</span>
    </div>
    <div class="top-data-group">
      <van-row  class="top-data-group__top" @click="goQuery(1)">
        <van-col span="16" class="statusTxt">
          <div>
            <div>入职查询<van-icon name="arrow" style="margin-left: 10px;" /></div> 
            <p>员工入职信息查询</p>
          </div>
        </van-col>
        <van-col span="8" style="display: flex; align-items: center;">
          <van-image class="myLogo" :src="myGroup_icon01" />
        </van-col>
          
      </van-row>
      <van-row  class="top-data-group__top" @click="goQuery(2)">
        <van-col span="16" class="statusTxt">
          <div>
            <div>员工证件<van-icon name="arrow" style="margin-left: 10px;" /></div> 
            <p>员工证件申请、查看</p>
          </div>
        </van-col>
        <van-col span="8" style="display: flex; align-items: center;">
          <van-image class="myLogo" :src="myGroup_icon02" />
        </van-col>
          
      </van-row>
      
      
    </div>
  </div>
</template>

<style scoped lang="scss">
.van-nav-bar{
  background: #ffffff00;
}
.bg{
  background-color: #EDF6FF;
  background-image: url('@/assets/images/myGroup/bg_top.png'),url('@/assets/images/myGroup/bg_bottom.png');// no-repeat top center / 100% auto
  background-position: top, bottom; /* 每张图片的位置 */
  background-repeat: no-repeat, no-repeat; /* 每张图片的重复方式 */
  background-size: contain, contain; /* 每张图片的大小 */
  height: 100%;
  overflow-y: auto;
  padding-top: 46px;
  .logo{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 46px;
    .myLogo{
      max-width: 52.5px;
      max-height: 75px;
      overflow: hidden;
      margin-right: 12.5px;
    }
    span{
      font-family: FZLanTingHei-B-GBK;
      font-size: 40px;
      font-variation-settings: "opsz" auto;
      color: #000000;
        
    }
  }
}
.top-data-group {
  padding-top: 58px;
  .top-data-group__top {
    margin: 0px 21px 30px 21px;
    padding: 5px 15px 0px 25px;
    text-align: center;
    font-size: 16px;
    color: #333;
    border-radius: 10px;
    background: linear-gradient(180deg, #E6F4FF 0%, #FFFFFF 99%);
    box-sizing: border-box;
    border: 3px solid #FFFFFF;
    box-shadow: 0px 10px 30px 0px rgba(198, 211, 226, 0.6);
    div{
      // font-weight: bold;
      font-family: 苹方-简;
    }
    .statusTxt{
      display: flex;
      align-content: center;
      text-align: left;
      justify-content: center;
      flex-direction: column;

      div{
        font-size: 22px;
      }
      p{
        font-size: 16px;
      }
      .myLogo{
        max-width: 112px;
        max-height: 112px;
        overflow: hidden;
        // margin-right: 12.5px;
      }

    }

  }
}


.btn-group {
  display: flex;
  margin: 16px;
  justify-content: center;
  align-items: center;
}
.list-row{
  padding: 20px 20px;
  //文字两端对齐
  text-align: justify;
  .van-col{
    margin-bottom: 2px;
  }
}
.van-image{
  height: 120px!important;
}
.van-uploader__upload{
  height: 140px!important;

}
</style>
