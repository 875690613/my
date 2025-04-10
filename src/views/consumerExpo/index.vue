<script setup>
import { onMounted, reactive, onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import { showToast,showImagePreview,Button,Popup } from 'vant';
import request from '@/utils/request';
import axios from 'axios';
//导入stylesheet.css
import 'animate.css';
import {removeEmptyProps,generatehashcode} from '@/utils/common';
import { v4 as uuidv4 } from 'uuid';
const uuid = uuidv4();
document.title = '消博会签到者列表';

const router = useRouter();
let loading = $ref(false)
let qrcode = $ref('');//二维码
let awardMessage = $ref('');//获奖寄语
let show = $ref(false);
let djsShow = $ref(true);//倒计时
let activeList = $ref([]);//活动获奖名单
let imagesList = $ref([
  '@/assets/images/jp01.jpg',
  '@/assets/images/jp01.jpg',
]);//活动获奖名单
let count = $ref(15)

const onLoad = () => {
  console.log('onLoad...')
  
  // getBalanceOrOverdue()
}

const onRefresh = () => {
  console.log('onRefresh...')
}

const queryParams = reactive({
});

const goOrderDetail = (orgId) => {
  router.push({ name: "myGroupDetail", query: { id: orgId, } });
};
const ws = ref(null)
const status = ref('未连接')
onMounted(() => {
  console.log("是否全屏：",isFull());
  // if (isFull() == false) {
  //   enter()
  // }
  djsShow = false;//倒计时隐藏
  getData()
  setInterval(() => {
    count = count > 0 ? count - 1 : 15
    console.log("倒计时：",count);
    if (count == 0) {
      getData()
    } else {
    }
  }, 1000)
  
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
  axios.get('https://welfare.zhuritec.com/api/system/AiClothesApplication/listTwo', params, {
    headers: {
      authorization: sessionStorage.getItem('token')
    }
  }).then(res => {
    console.log("排行榜：",res.data);
    if (res.data.code == 200) {
      activeList = res.data.rows
    } else {
      showToast('获取数据失败，请稍后再试！')
    }
  })
};

const showPopup = (item,index) => {
  console.log("item:",item,index);
  show = true
  qrcode = item.url
  
};
// 实时通讯
// 响应式数据
let dataList = $ref([])
let connectionStatus = $ref('未连接')
// let ws = $ref(null)

// WebSocket 配置
// let WS_URL = 'ws://172.16.182.102:8094/websocket'
let WS_URL = 'ws://172.16.182.101/:8094/websocket'
let RECONNECT_INTERVAL = 5000 // 5秒重连间隔
let reconnectTimer = null

// 版本1
// 处理接收到的消息
const handleMessage = (event) => {
  try {
    const newData = JSON.parse(event.data)
    
    // 更新数据列表（最新数据放前面）
    dataList.value = [newData, ...dataList.value].slice(0, 50) // 保持最多50条
    
  } catch (error) {
    console.error('消息解析失败:', error)
  }
}

// 初始化 WebSocket 连接
const initWebSocket = () => {
  console.log("初始化");
  connectionStatus = '连接中...'
  
  ws.value = new WebSocket(WS_URL)
  console.log("ws.value:",ws.value);
  // 连接成功
  ws.value.onopen = () => {
    console.log("链接上了吗");
    connectionStatus = '已连接'
    clearTimeout(reconnectTimer)
  }

  // 接收消息
  ws.value.onmessage = handleMessage

  // 错误处理
  ws.value.onerror = (error) => {
    console.error('WebSocket 错误:', error)
    connectionStatus = '连接错误'
    attemptReconnect()
  }

  // 连接关闭
  ws.value.onclose = (event) => {
    if (event.wasClean) {
      console.log(`连接正常关闭 Code=${event.code}`)
    } else {
      console.warn('连接意外中断')
      attemptReconnect()
    }
  }
}

// 尝试重连
const attemptReconnect = () => {
  connectionStatus = '正在重连...'
  clearTimeout(reconnectTimer)
  reconnectTimer = setTimeout(() => {
    initWebSocket()
  }, RECONNECT_INTERVAL)
}



// 组件卸载前清理
onBeforeUnmount(() => {
  if (ws) {
    ws.close()
    clearTimeout(reconnectTimer)
  }
})


</script>
<template>
    <div class="bg">
      <p style="position: absolute; top:0; left: 0;color: #fff;z-index: 99;" v-if="false">连接状态：{{ connectionStatus }}</p>
      <div class="content" v-if="false">
        <!-- <button @click="toggle">切换全屏</button> -->
        <div class="title animate__animated animate__zoomInDown" @click="toggle" style="text-align: center;">消博会</div>
        
        <!-- 列表 -->
        <van-row class="list-row">
          <van-col span="24" class="tableName">
            <van-row>
              <van-col span="3" class="titleName" style="">排名</van-col>
              <van-col span="5" class="titleName">姓名</van-col>
              <van-col span="5" class="titleName">手机号</van-col>
              <van-col span="5" class="titleName">图片路径</van-col>
              <van-col span="6" class="titleName">签到时间</van-col>
            </van-row>
          </van-col>
          <!-- 获奖列表 -->
           <template v-if="activeList.length > 0">
              <van-col span="24" v-for="(item,index) in activeList" :key="index"  class=" animate__animated animate__fadeInUp">
                <van-row>
                  <!-- 排名 -->
                  <van-col span="3" style="text-align: center;">
                    <div class="num">
                      <img class="ranking_icon animate__animated animate__bounceInDown" src="@/assets/images/phb_1.png" v-if="index == 0" alt="">
                      <img class="ranking_icon animate__animated animate__rotateIn" src="@/assets/images/phb_2.png" v-if="index == 1" alt="">
                      <img class="ranking_icon animate__animated animate__rotateIn" src="@/assets/images/phb_3.png" v-if="index == 2" alt="">
                      <span class="ranking" style="">{{ index + 1 }}</span>
                    </div>
                  </van-col>
                  <!-- 签到者姓名 -->
                  <van-col span="5" class="name">{{ item.name }}</van-col>
                  <!-- 手机号 -->
                  <van-col span="5" class="name">
                    <span class="zanColor">{{item.phoneNumber}}</span>
                    <!-- <span class="time">截止:18:33:45</span> -->
                  </van-col>
                  <!-- 签到图片 -->
                  <van-col span="5" style="text-align: center; display: flex; align-items: center; justify-content: center; ">
                      <div class="jpImg" @click="showPopup(item,index)">
                        <img class="works animate__animated animate__zoomInUp" :src="item.url" alt="">
                      </div>
                  </van-col>
                  <!-- 签到时间 -->
                  <van-col span="6" class="name">{{item.createTime}}</van-col>
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
        </van-row>
      </div>
      <van-swipe :autoplay="10000" :nitial-swipe="3" :show-indicators="false">
        <van-swipe-item>
          <div class="itemList">
            <img src="@/assets/images/xbh03.jpg" width="100%" height="100%"/>
            <!-- 列表 -->
            <van-row class="list-row swipeList">
              <van-col span="24" class="tableName">
                <van-row>
                  <van-col span="7" class="titleName">手机号</van-col>
                  <van-col span="11" class="titleName">签到时间</van-col>
                  <van-col span="6" class="titleName">备注</van-col>
                </van-row>
              </van-col>
              <!-- 获奖列表 -->
              <template v-if="activeList.length > 0">
                  <van-col span="24" v-for="(item,index) in activeList.slice(0, 10)" :key="index"  class=" animate__animated animate__fadeInUp">
                    <van-row>
                      
                      <!-- 手机号 -->
                      <van-col span="7" class="name">
                        <span class="zanColor">{{item.phoneNumber}}</span>
                        <!-- <span class="time">截止:18:33:45</span> -->
                      </van-col>
                      <!-- 签到时间 -->
                      <van-col span="11" class="name">{{item.createTime}}</van-col>
                      <!-- 签到者姓名 -->
                      <van-col span="6" class="name">已获取礼品一份</van-col>
                    </van-row>
                  </van-col>
              </template>
              <template v-else>
                  <van-col span="24" class=" animate__animated animate__fadeInUp">
                    <van-row>
                      <!-- 排名 -->
                      <van-col span="24" style="text-align: center; margin-top: 100px;">
                        正在签到中,请耐心等待！
                      </van-col>
                    </van-row>
                  </van-col>
              </template>
            </van-row>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <img src="@/assets/images/xbh01.jpg" width="100%" height="100%"/>
        </van-swipe-item>
        <van-swipe-item>
          <img src="@/assets/images/xbh02.jpg" width="100%" height="100%"/>
        </van-swipe-item>
        <!-- <van-swipe-item v-for="image in imagesList" :key="image">
          <img :src="image" width="100%" height="100%" />
        </van-swipe-item> -->
      </van-swipe>

    </div>
</template>

<style scoped lang="scss">
//引入外部样式

.bg{
  width: 100%;
  height: 100%;
  overflow: hidden;
  // background: #eee;
  // background-image: url('../../assets/images/bg3.png');
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
  // background-position: center center;
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
  .itemList{
    position: relative;
    .swipeList{
      position: absolute;
      top: 8.5%;
      right: 5.2%;
      // background:#eee;
      max-width: 52.2%;
      padding: 10px;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box; /* Safari 3.0~5.0 */
      border-radius: 8px;
      .titleName{
        // text-align: center;
        font-size: 6px;
      }
      .name{
        // text-align: center;
        font-size: 6px;
        display: flex;
        align-items: center;
        margin-bottom: 5px;



      }
      .tableName{
        margin-bottom: 6px;
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
