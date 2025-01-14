<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { showToast } from 'vant';
import { Button } from 'vant';
import request from '@/utils/request';
import axios from 'axios';
//导入stylesheet.css
import 'animate.css';
import {removeEmptyProps,generatehashcode} from '@/utils/common';
import { v4 as uuidv4 } from 'uuid';
const uuid = uuidv4();
document.title = '排行榜';

const router = useRouter();
let loading = $ref(false)
let statusType = $ref()
let userInfo = $ref({});
let photoFile = $ref('');
let qrcode = $ref('');//二维码
let show = $ref(false);
let djsShow = $ref(false);//倒计时
let phbShow = $ref(false);//排行榜
let activeShow = $ref(true);//活动详情
let activeList = $ref([]);//活动获奖名单
let title = $ref('2025年会照片评选活动');//2025年会照片评选结果


const onLoad = () => {
  console.log('onLoad...')
  // getData();
  // getBalanceOrOverdue()
}

const onRefresh = () => {
  console.log('onRefresh...')
  userInfo = {};
  // getData();
}

const queryParams = reactive({
});

const goOrderDetail = (orgId) => {
  router.push({ name: "myGroupDetail", query: { id: orgId, } });
};

onMounted(() => {
  // getData();
 
});

// 请求接口获取员工信息数据
const getData = async () => {
  loading = true;
  const params = removeEmptyProps(queryParams);
  axios.get('https://businessbbs.zhuritec.com/erp_api/most_like/69/3', params, {
    headers: {
      authorization: sessionStorage.getItem('token')
    }
  }).then(res => {
    console.log("排行榜：",res.data);
    activeList = res.data;
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
  title = '2025年会照片评选结果';
  activeShow = false;
  countDown.start();

};
const pause = () => {
  countDown.pause();
};
const reset = () => {
  countDown.reset();
};
const onFinish = () => {
  getData()
  phbShow = true;//显示排行榜
  djsShow = false;//倒计时隐藏
  // showToast('倒计时结束');
}




</script>

<template>
  <!-- <van-nav-bar left-arrow left-text="返回"  @click-left="router.back()" title="申请员工证" fixed :border="false"></van-nav-bar> -->
    <div class="bg">
      <div class="content">
        <div class="title animate__animated animate__zoomInDown" style="text-align: center;">{{ title }}</div>
        <!-- 活动介绍 -->
        <div class="activities" v-if="activeShow">
          <van-row class="list-row">
            <van-col span="12">
              <div class="list-item">
                  <h3 class=" animate__animated animate__slideInLeft">活动介绍</h3>
                  <p class=" animate__animated animate__slideInUp">员工拍摄年会现场照片，附文字说明或感受，发布到企信通平台圈子，集赞赢好礼。</p>
                  <h3 class=" animate__animated animate__jackInTheBox">活动规则</h3>
                  <div class=" animate__animated animate__zoomInUp">
                    <p>1、确保企信通圈子用户名真实有效。</p>
                    <p>2、企信通圈子内照片根据集赞数,选出前三位。</p>
                    <p>3、集赞数相同,根据发布时间先后进行排名。</p>
                  </div>
              </div>
            </van-col>
            <van-col span="12">
              <div class="list-item">
                <h3 style="text-align: center; margin-bottom: 10px;" class=" animate__animated animate__rubberBand">企信通</h3>
                <img src="@/assets/images/qxt-nh.png" alt="" class=" animate__animated animate__rotateIn" style="width: 50%; border-radius: 50%; padding: 20px; background: #fff;">
                <p style="text-align: center;" class=" animate__animated animate__slideInRight">扫码进入年会圈子</p>
              </div>
            </van-col>
          </van-row>
          <div class=" animate__animated animate__slideInUp">
            <!-- <span @click="start">倒计时</span> -->
            <van-button type="success" size="mini" color="linear-gradient(to right, #59b6d7, #008eff)" @click="start"><span>倒计时 </span></van-button>
          </div>
        </div>
        <!-- 排行榜列表 -->
        <van-row class="list-row" v-if="phbShow">
          <van-col span="24">
            <van-row>
              <van-col span="4" class="titleName" style="">排名</van-col>
              <van-col span="10" class="titleName">获奖者</van-col>
              <van-col span="4" class="titleName">获赞数</van-col>
              <van-col span="6" class="titleName">作品</van-col>
            </van-row>
          </van-col>
          <!-- 获奖列表 -->
           <template v-if="activeList.length > 0">
              <van-col span="24" v-for="(item,index) in activeList" :key="index">
                <van-row>
                  <van-col span="4" style="text-align: center;">
                    <div class="num">
                      <img src="@/assets/images/phb01.png" v-if="index == 0" alt="" style="width: 50%;">
                      <img src="@/assets/images/phb02.png" v-else style="width: 50%;">
                      <span style="margin-top: -6px;">{{ index + 1 }}</span>
                    </div>
                  </van-col>
                  <van-col span="10" class="name" v-if="item.creator.realName">{{ item.creator.deptName }}{{ item.creator.realName }}</van-col>
                  <van-col span="10" class="name" v-else>{{ item.creator.name }}</van-col>
                  <van-col span="4" class="zan">
                    <span class="zanColor">{{item.like_count}}</span>
                    <!-- <span class="time">截止:18:33:45</span> -->
                  </van-col>
                  <van-col span="6" style="text-align: center;">
                      <div class="jpImg">
                        <img src="@/assets/images/jp01.jpg" v-if="index == 0" width="150" height="100" alt="" >
                        <img src="@/assets/images/jp02.jpg" v-if="index == 1" width="150" height="100" alt="" >
                        <img src="@/assets/images/jp03.jpg" v-if="index == 2" width="150" height="100" alt="" >
                      </div>
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
      <van-popup v-model:show="show" :style="{ padding: '0px' }">
        <div style="display: flex; justify-content: space-around;">
          <van-image
          v-if="qrcode"
          width="300"
          height="300px!important"
          :src="qrcode"
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
    width: 230px;
    margin: 5px auto;
    padding-left: 20px;
    .title{
      margin-top: 10px;
      font-size: 12px;
      font-weight: bold;
      // margin-bottom: 5px;
    }
    // 活动介绍
    .activities{
      text-align: center;
      .list-item{
        h3{
          font-size: 8px;
          margin-top: 10px;
          text-align: left;
        }
        p{
          font-size: 5px;
          text-align: left;
        }
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
        box-shadow: 0 2px #c0ba6c;
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
          background-color: #7e867e;
          box-shadow: 0 1px #666;
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
      .titleName{
        text-align: center;
        font-weight: bold;
        font-size: 6px;
      }
      .van-col--24{
        margin-bottom: 4px;
      }
      .num{
        position: relative;
        >span{
          color: #c72915;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
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
          font-size: 10px;;
        }
        .time{
          font-size: 8px;
          text-align: center;
          // display: flex;
          // align-items: center;
        }
      }
      .jpImg{
        display: flex;
        align-items: center;
        justify-content: center;
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



</style>
