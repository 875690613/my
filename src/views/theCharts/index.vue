<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { showToast,showImagePreview,Button,Popup } from 'vant';
import request from '@/utils/request';
import axios from 'axios';
//导入stylesheet.css
import 'animate.css';
import {removeEmptyProps,generatehashcode} from '@/utils/common';
import { v4 as uuidv4 } from 'uuid';
const uuid = uuidv4();
document.title = '年会照片排行榜';

const router = useRouter();
let loading = $ref(false)
let statusType = $ref()
let userInfo = $ref({});
let photoFile = $ref('');
let qrcode = $ref('');//二维码
let awardMessage = $ref('');//获奖寄语
let show = $ref(false);
let djsShow = $ref(false);//倒计时
let phbShow = $ref(false);//排行榜
let activeShow = $ref(true);//活动详情
let activeList = $ref([]);//活动获奖名单
let title = $ref(true);//2025年会照片评选结果
let title2 = $ref(false);//2025年会照片评选结果


const onLoad = () => {
  console.log('onLoad...')
  
  // getBalanceOrOverdue()
}

const onRefresh = () => {
  console.log('onRefresh...')
  userInfo = {};
}

const queryParams = reactive({
});

const goOrderDetail = (orgId) => {
  router.push({ name: "myGroupDetail", query: { id: orgId, } });
};

onMounted(() => {
  console.log("是否全屏：",isFull());
  if (isFull() == false) {
    enter()
  }
 
});
// 检测浏览器是否全屏
const enter = () => {
  const element = document.documentElement
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  }
}
const exit = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}
// 当前处于全屏的元素
const fullEle = () => {
  return document.fullscreenElement || document.mozFullScreenElement || document.msFullScreenElement || document.webkitFullScreenElement || null
}
const isFull = () => {
  return !!fullEle()
}
const toggle = () => {
  isFull() ? exit() : enter()
  // isFull() ? enter() : enter()
}


// 请求接口获取员工信息数据
const getData = async () => {
  loading = true;
  const params = removeEmptyProps(queryParams);
  axios.get('https://businessbbs.zhuritec.com/erp_api/most_like/69/20', params, {
    headers: {
      authorization: sessionStorage.getItem('token')
    }
  }).then(res => {
    console.log("排行榜：",res.data);
    activeList = res.data
  //比较activeList中的数据，如果user_id 相同，则比较like_count的值，留下likecount值大的数据
  const filteredData = activeList.reduce((maxItem, currentItem) => {
  if (currentItem.user_id === maxItem.user_id && currentItem.like_count > maxItem.like_count) {
      return currentItem;
    }
    return maxItem;
  }, activeList[0]);
  //将filteredData 添加到activeList中
  activeList.push(filteredData)
  // activeList中如果user_id相同去重
  activeList = activeList.filter((item, index, self) => {
    return self.findIndex(i => i.user_id === item.user_id) === index;
  });
  console.log("activeList:",activeList);
})
  // const { data} = await request.get('/erp_api/most_like/69/3', params, {
  //   headers: {
  //     Authorization: sessionStorage.getItem('myToken')
  //   }
  // });
  // console.log("排行榜：",data);
 
};

const countDown = $ref(null);

const start = () => {
  djsShow = true;
  
  activeShow = false;
  // countDown.start();

};
const pause = () => {
  countDown.pause();
};
const reset = () => {
  countDown.reset();
};
const onFinish = () => {
  title = false;
  title2 = true;
  getData()
  phbShow = true;//显示排行榜
  djsShow = false;//倒计时隐藏
  // showToast('倒计时结束');
}
const showPopup = (item,index) => {
  console.log("item:",item,index);
  if (index == 0) {
    awardMessage = '冠军之路从不平坦，你们的努力和坚持值得所有的赞誉。'
  }
  if (index == 1) {
    awardMessage = '亚军同样闪耀，你们的努力和进步值得赞扬。。'
  }
  if (index == 2) {
    awardMessage = '季军也是荣誉的象征，你们的贡献值得尊敬和认可。'
  }
  show = true
  qrcode = item.images[0].url
  
};


</script>
<!-- <van-popup v-model:show="show" :style="{ padding: '64px' }">内容</van-popup> -->
<template>
  <!-- <van-nav-bar left-arrow left-text="返回"  @click-left="router.back()" title="申请员工证" fixed :border="false"></van-nav-bar> -->
    <div class="bg">
      <div class="content">
        <!-- <button @click="toggle">切换全屏</button> -->
        <div class="title animate__animated animate__zoomInDown" @click="toggle" v-if="title" style="text-align: center;">2025年会照片评选活动</div>
        <div class="title animate__animated animate__fadeInDown" @click="toggle" v-if="title2" style="text-align: center;">2025年会照片评选结果</div>
        <!-- 活动介绍 -->
        <div class="activities" v-if="activeShow">
          <van-row class="list-row">
            <van-col span="12">
              <div class="list-item">
                  <h3 class=" animate__animated animate__slideInLeft">活动介绍</h3>
                  <p class=" animate__animated animate__slideInUp">员工拍摄年会现场照片，附文字说明或感受，发布到企信通平台圈子，集赞赢好礼。</p>
                  <h3 class=" animate__animated animate__fadeInRightBig">活动规则</h3>
                  <div class=" animate__animated animate__zoomInUp">
                    <p>1、确保企信通圈子用户名真实有效。</p>
                    <p>2、企信通圈子内照片根据集赞数,选出前三位。</p>
                    <p>3、集赞数相同,根据发布时间先后进行排名。</p>
                    <p>4、每位用户仅限一个作品参与评选。</p>
                  </div>
              </div>
            </van-col>
            <van-col span="12">
              <div class="list-item">
                <h3 style="text-align: center; margin-bottom: 10px;" class=" animate__animated animate__rotateInDownLeft">企信通</h3>
                <img src="@/assets/images/qxt-nh.png" alt="" class=" animate__animated animate__rotateIn" style="width: 50%; border-radius: 50%; padding: 20px; background: #fff;">
                <p style="text-align: center;" class=" animate__animated animate__slideInRight">扫码进入年会圈子</p>
              </div>
            </van-col>
          </van-row>
          <div class="timeBtn animate__animated animate__slideInUp">
            <!-- <span @click="start">倒计时</span> -->
            <van-button type="success" size="mini" color="linear-gradient(to right, #fa6e19, #c72614)" @click="start"><span>倒计时 </span></van-button>
          </div>
        </div>
        <!-- 排行榜列表 -->
        <van-row class="list-row" v-if="phbShow">
          <van-col span="24" class="tableName">
            <van-row>
              <van-col span="3" class="titleName" style="">排名</van-col>
              <van-col span="7" class="titleName">获奖者</van-col>
              <van-col span="5" class="titleName">作品</van-col>
              <van-col span="3" class="titleName">获赞数</van-col>
              <van-col span="6" class="titleName">奖品</van-col>
            </van-row>
          </van-col>
          <!-- 获奖列表 -->
           <template v-if="activeList.length > 0">
              <van-col span="24" v-for="(item,index) in activeList.slice(0, 3)" :key="index"  class=" animate__animated animate__fadeInUp">
                <van-row>
                  <!-- 排名 -->
                  <van-col span="3" style="text-align: center;">
                    <div class="num">
                      <img class="ranking_icon animate__animated animate__bounceInDown" src="@/assets/images/phb_1.png" v-if="index == 0" alt="">
                      <img class="ranking_icon animate__animated animate__rotateIn" src="@/assets/images/phb_2.png" v-if="index == 1" alt="">
                      <img class="ranking_icon animate__animated animate__rotateIn" src="@/assets/images/phb_3.png" v-if="index == 2" alt="">
                      <!-- <img class="animate__animated animate__rotateIn" src="@/assets/images/phb_2.png" v-else style="width: 50%;"> -->
                      <span class="ranking" style="">{{ index + 1 }}</span>
                    </div>
                  </van-col>
                  <!-- 获奖者 -->
                  <van-col span="7" class="name" v-if="item.creator.realName">{{ item.creator.deptName }}{{ item.creator.realName }}</van-col>
                  <van-col span="7" class="name" v-else>{{ item.creator.name }}</van-col>
                  <!-- 作品 -->
                  <van-col span="5" style="text-align: center; display: flex; align-items: center; justify-content: center; ">
                      <div class="jpImg" @click="showPopup(item,index)">
                        <img class="works animate__animated animate__zoomInUp" :src="item.images[0].url" alt="">
                        <!-- <van-image
                          width="auto"
                          height="100"
                          fit="fill"
                          :src="item.images[0].url"
                        /> -->
                        <!-- <img src="@/assets/images/jp02.jpg" v-if="index == 1" width="150" height="100" alt="" >
                        <img src="@/assets/images/jp03.jpg" v-if="index == 2" width="150" height="100" alt="" > -->
                      </div>
                  </van-col>
                  <!-- 点赞数 -->
                  <van-col span="3" class="zan">
                    <span class="zanColor">{{item.like_count}}</span>
                    <!-- <span class="time">截止:18:33:45</span> -->
                  </van-col>
                  <van-col span="6" class="name" v-if="index == 0">公牛插座台灯</van-col>
                  <van-col span="6" class="name" v-if="index == 1">防护型耐热玻璃水杯</van-col>
                  <van-col span="6" class="name" v-if="index == 2">定制地毯</van-col>
                </van-row>
              </van-col>
           </template>
           <template v-else>
              <van-col span="24" class=" animate__animated animate__fadeInUp">
                <van-row>
                  <!-- 排名 -->
                  <van-col span="24" style="text-align: center;">
                    正在评选中,请耐心等待！
                  </van-col>
                </van-row>
              </van-col>
           </template>
          <van-col span="24" v-if="false">
            <van-row>
              <van-col span="4" style="text-align: center;">
                <div class="num">
                  <img src="@/assets/images/phb01.png" alt="" style="width: 50%;">
                  <span style="margin-top: -6px;">1</span>
                </div>
              </van-col>
              <van-col span="10" class="name">产品四部--陈明</van-col>
              <van-col span="4" class="zan">
                <span class="zanColor">300</span>
                <!-- <span class="time">截止:18:33:45</span> -->
              </van-col>
              <van-col span="6" style="text-align: center;">
                  <div class="jpImg">
                    <img src="@/assets/images/jp01.jpg" width="150" height="100" alt="" >
                  </div>
              </van-col>
            </van-row>
          </van-col>
          
          <van-col span="24" v-if="false">
            <van-row>
              <van-col span="4" style="text-align: center;">
                <div class="num">
                  <img src="@/assets/images/phb02.png" alt="" style="width: 60%;">
                  <span style="margin-top: -8px;">2</span>
                </div>
              </van-col>
              <van-col span="10" class="name">打样中心仓库陆中华</van-col>
              <van-col span="4" class="zan">
                <span class="zanColor">300</span>
                <!-- <span class="time">截止:18:33:45</span> -->
              </van-col>
              <van-col span="6" style="text-align: center;">
                  <div class="jpImg">
                    <img src="@/assets/images/jp02.jpg" width="150" height="100" alt="" >
                  </div>
              </van-col>
            </van-row>
          </van-col>
          <van-col span="24" v-if="false">
            <van-row>
              <van-col span="4" style="text-align: center;">
                <div class="num">
                  <img src="@/assets/images/phb02.png" alt="" style="width: 60%;">
                  <span style="margin-top: -8px;">3</span>
                </div>
              </van-col>
              <van-col span="10" class="name">打样中心销样组孙连娟</van-col>
              <van-col span="4" class="zan">
                <span class="zanColor">300</span>
                <!-- <span class="time">截止:18:33:45</span> -->
              </van-col>
              <van-col span="6" style="text-align: center;">
                  <div class="jpImg">
                    <img src="@/assets/images/jp03.jpg" width="150" height="100" alt="" >
                  </div>
              </van-col>
            </van-row>
          </van-col>
        </van-row>
        <!-- 倒计时 -->
        <div class="countdown" v-if="djsShow">
          <div class="countdown-box">
            <van-count-down
              ref="countDown"
              millisecond
              :time="11000"
              :auto-start="true"
              format="ss"
              @finish="onFinish"
            />
            <img src="@/assets/images/xz.png" class="xzImg" alt="">
          </div>
           <!-- <div style="font-size: 26px; text-align: center;">即将截止</div> -->
         </div>
        <div style="display: none;">
          <span text="开始" icon="play-circle-o" @click="start" >开始</span>
          <span text="暂停" icon="pause-circle-o" @click="pause">暂停</span>
          <span text="重置" icon="replay" @click="reset">结束</span>
        </div>

      </div>
      
      
      
      <!-- 弹出层员工二维码 -->
      <van-popup v-model:show="show"   close-icon-position="top-right" :style="{ padding: '0px',background:'#eee'}">
        <p class="bgText" style="" v-if="false">{{ awardMessage }}</p>
        <div style="display: flex; justify-content: space-around;">
          <img
          v-if="qrcode"
          class="popupImg"
          :src="qrcode"
          style="z-index: 1;"
          @click="getQrcode"
          />
        </div>
      </van-popup>
    </div>
</template>

<style scoped lang="scss">
//引入外部样式

.bg{
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #eee;
  background-image: url('../../assets/images/bg3.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
  font-size: 10px;
  color: #fff;
  font-family: '微软雅黑', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  .content{
    width: 250px;
    margin: 5px auto;
    padding-left: 20px;
    .title{
      margin-left: -20px;
      margin-top: 20px;
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 5px;
      text-shadow: 0px 1.5px 1px #d1af65; /* 水平阴影，模糊半径为 4px，透明度为 50% */
    }
    // 活动介绍
    .activities{
      text-align: center;
      .list-item{
        h3{
          font-size: 8px;
          margin-top: 7px;
          text-align: left;
          margin-bottom: 1px;
        }
        p{
          font-size: 5px;
          text-align: left;
        }
      }
      .timeBtn{
        margin-left: -20px;
      }
      .van-button--mini{
        position: relative;
        transform-style: preserve-3d;
        // animation: rotate 10s infinite linear;
        margin-left: -30px;
        height: 10px;
        font-size: 6px;
        text-align: center;   
        text-decoration: none;
        outline: none;
        color: #fff;
        // background-color: #4CAF50;
        border: none;
        border-radius: 15px;
        box-shadow: 0 2px #f5941b96;
        &:hover {
          background-color: #a87b1a
        }
        &:hover span{
          padding-right: 4px;
        }
        &:hover span:after {
          opacity: 1;
          right: 0;
        }
        &:active {
          background-color: #f5941b96;
          box-shadow: 0 1px #f5941b96;
          transform: translateY(3px);
        }
        span {
          cursor: pointer;
          display: inline-block;
          position: relative;
          transition: 0.5s;
          &:after {
            content: '»';
            position: absolute;
            opacity: 0;
            top: 0;
            right: -5px;
            transition: 0.5s;
          }
        }
      }
    }
    // 排行榜
    .list-row{
      .tableName{
        margin-bottom: 10px!important;
      }
      .titleName{
        text-align: center;
        font-weight: bold;
        font-size: 6px;
      }
      .van-col--24{
        margin-bottom: 8px;
      }
      .num{
        position: relative;
        .ranking_icon{
          width: 60%;
          max-width: 15px;
        }
        >span{
          color: #c72915;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          font-weight: bold;
          font-size: 8px;
          margin-top: -1px;
        }
      }
      .zan,.name{
        font-size: 6px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .zan{
        display: flex;
        span{
          width: 100%;
          display: block;
        }
        .zanColor{
          // color: #01f82a;
          font-weight: bold;
          font-size: 10px;
        }
        .time{
          font-size: 8px;
          text-align: center;
          // display: flex;
          // align-items: center;
        }
      }
      .jpImg{
        width: 70%;
        // max-width: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        .works{
          // transition: transform 1s ease;
          width: 100%;
          max-width: 100%;
          height: 22px;
          cursor: pointer;
        }
        &:hover{
          transition: transform 1s ease;
          transform: scale(1.2);
          //旋转360度
            // transform: rotate(360deg);
        }
      }
    }
    // 倒计时
    .countdown{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      box-sizing: border-box;
      .countdown-box{
        width: 30px;
        height: 30px;
        margin-bottom: 20px;
        // border: 3px solid #fff;
        border-radius: 50%;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        
        .van-count-down{
          color: #fff;
          font-weight: bold;
          font-size: 20px;
          margin: 0 auto;
          text-shadow: 0px 1.5px 1px #d1af65; /* 水平阴影，模糊半径为 4px，透明度为 50% */
          // animation: scaleUpAndDown 2s infinite; /* 持续时间为10秒，无限次循环 */
  
        }
        .xzImg{
          width: 200%;
          position: absolute;
          animation: rotate 2s linear infinite; /* 2秒完成一次旋转，线性速度，无限次循环 */
        }
      }
    }
  }
}
//弹窗
.popupImg{
  width: 100%;
  height: 100px!important;
}
.van-popup__close-icon--top-right{
  top: 0!important;
  right: 0!important;
  font-size: 0.8rem!important;
}
.van-icon-close:before,.van-icon:before{
  font-size: 40!important;
  color: #fff!important;
}
.bgText{
  width: 100%;
  font-weight: bold;
  color: #c72915;
  position: absolute;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  text-shadow: 0px 1.2px 1px #d1af65; /* 水平阴影，模糊半径为 4px，透明度为 50% */

}
// 宽度小于 1024px
@media screen and (max-width: 1024px) {
  
}
// 宽度小于 1280px
@media screen and (max-width: 1280px) {
  .bg{
    .content{
      .title{
        margin-top: 8%;
        margin-bottom: 2%;
      }
      // 活动介绍
      .activities{
        .list-item{
          h3{
            font-size: 30px;
          }
          p{
            font-size: 18px;
            margin-bottom: 5px;
            
          }
        }
      }
      // 排行榜
      .list-row{
        .tableName{
          margin-bottom: 10px!important;
        }
        .titleName{
          font-size: 24px;
          margin-bottom: 5%;
        }
        .van-col--24{
          margin-bottom: 5%;
        }
      }
    }
  }
}

/* 定义旋转动画的关键帧 */
@keyframes rotate {
  from {
    transform: rotate(0deg); /* 起始角度 */
  }
  to {
    transform: rotate(-360deg); /* 结束角度，完成一圈旋转 */
  }
}

/* 应用动画到元素上 */
.rotating-element {
  animation: rotate 2s linear infinite; /* 2秒完成一次旋转，线性速度，无限次循环 */
}
// 放大缩小的动画
@keyframes scaleUpAndDown {
  0% {
    transform: scale(1); /* 原始大小 */
  }
  10% {
    transform: scale(1.3); /* 放大到150% */
  }
  20% {
    transform: scale(1); /* 缩小回原始大小 */
  }
  30% {
    transform: scale(1.3); /* 放大到150% */
  }
  40% {
    transform: scale(1); /* 缩小回原始大小 */
  }
  50% {
    transform: scale(1.3); /* 放大到150% */
  }
  60% {
    transform: scale(1); /* 缩小回原始大小 */
  }
  70% {
    transform: scale(1.3); /* 放大到150% */
  }
  80% {
    transform: scale(1); /* 缩小回原始大小 */
  }
  90% {
    transform: scale(1.3); /* 放大到150% */
  }
  100% {
    transform: scale(1); /* 缩小回原始大小 */
  }
}

.animated-element {
  animation: scaleUpAndDown 10s infinite; /* 持续时间为10秒，无限次循环 */
}
// 旋转
@keyframes spin {
  from {
  transform: rotate(0deg);
}
  to {
  transform: rotate(360deg);
}
}

.rotate {
  animation: spin 2s infinite linear;
}
</style>
