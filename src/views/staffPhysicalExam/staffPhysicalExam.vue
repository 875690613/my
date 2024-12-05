<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'
import { Html5Qrcode } from 'html5-qrcode';
import request from '@/request/api.js';
import {useExcellentStore}   from '@/stores/excellent.js';
// import VConsole from 'vconsole';
// const vConsole = new VConsole();
const router = useRouter()
let step = $ref(0);

let excellentStore = useExcellentStore();

let isShow = $ref(false);
let html5QrCode = $ref(null);

// 申请记录
let hasRecord = $ref(false);
// 体检记录信息
let recordInfo = $ref(null);


// 是否是优秀员工
let isExcellent = $ref(false);
// 优秀员工信息
let excellentInfo = $ref(null);

// 页面实例卸载
onUnmounted(() => {
  stop();
  // localStorage.removeItem('Authorization');
  html5QrCode = null;
})

// 导航-返回
const onClickLeft = () => {
  if (step == 1){
    // 清空数据，并回到上一步
    excellentStore.staffNo = '';
    excellentStore.token = '';
    excellentStore.hasRecord = false;
    excellentStore.recordInfo = null;
    hasRecord = false;
    recordInfo = null;
    step = 0;
  } else {
    history.back();
  }
}

// 开始扫描
const startScan = () => {
            getCameras();
        }

// 停止扫描
const stopScan = () => {
  console.log('stopScan...')
    stop();
}

const getCameras = () => {
            Html5Qrcode.getCameras()
                .then((devices) => {
                    if (devices && devices.length) {
                        isShow = true;
                        html5QrCode = new Html5Qrcode('reader')
                        // start开始扫描
                        start()
                    }
                })
                .catch((err) => {
                    // handle err
                    alert(`获取设备信息失败${err}`) // 获取设备信息失败
                    // showToast('获取设备信息失败')
                })
        }

        
        const start = () => {
          html5QrCode
              .start(
                  { facingMode: "environment" },
                  {
                      fps: 20, // 设置每秒多少帧
                      qrbox: { width: 250, height: 250 } // 设置取景范围
                      // scannable, rest shaded.
                  },
                  (decodedText, decodedResult) => {
                      console.log('decodedText: ', decodedText);
                      console.log('decodedResult: ', decodedResult);
                      const text = decodedText.split('&')[0];
                      excellentStore.staffNo = text;
                      handleMCode(text);
                      isShow = false;
                      stop();


                      // alert('扫码结果' + decodedText)
                  },
                  (errorMessage) => {
                      // parse error, ideally ignore it. For example:
                      // console.log(`QR Code no longer in front of camera.`);
                      console.log('暂无扫描结果', errorMessage)
                  }
              )
              .catch((err) => {
                  // Start failed, handle it. For example,
                  console.log(`Unable to start scanning, error: ${err}`)
              })
          }
        const stop = () => {
          if (!(html5QrCode && typeof(html5QrCode.stop) == 'function')) {
            isShow = false;
            return;
          }
          html5QrCode
              .stop()
              .then((ignore) => {
                  isShow = false;
                  // QR Code scanning is stopped.
                  console.log('QR Code scanning stopped.', ignore)
              })
              .catch((err) => {
                  // Stop failed, handle it.
                  console.log('Unable to stop scanning.', err)
              })
          // }
          }

        const handleMCode = async (val) => {
          if (val) {
            // 调用工号登录接口
            const res = await request.staffCodeLogin({staffNo: val})
            // 获取接口返回的token
            if (res.status == 200) {
              const token = res.data;
              // 获取员工code
              localStorage.setItem('Authorization', token);
              // pinia 存储员工信息
              excellentStore.token = token;
              step = 1;
              showToast('身份验证成功');

              // 验证当前人员是否是优秀员工
              checkIsExcellent();
            } else {
              // 验证失败提示
              showToast('身份验证失败')
            }
          } else {
            // 验证失败提示
            showToast('身份验证失败')
          }
        }

        // 验证当前人员是否是优秀员工
        const checkIsExcellent = async () => {
          // 调用接口
          const res = await request.checkIsExcellent();
          if (res.status == 200) {
            if (res.data && res.data.excellent == true) {
              isExcellent = true;
              excellentInfo = res.data;
              // pinia存储优秀员工数据
              excellentStore.excellentInfo = excellentInfo;

              // 查询申请记录
              getApplyRecord();
            } else {
              isExcellent = false;
              excellentInfo = null;
              excellentStore.excellentInfo = null;
            }
          }
        }

const doApply = () => {
  // if (hasRecord) {
  //   // 提示已申请
  //   showToast('已申请，请勿重复申请');
  //   return;
  // }
  // 体检申请
  console.log('体检申请')
  // 跳转到申请页面
  router.push('/staffPhysicalExam/apply');
}


onMounted(() => {
  const token = excellentStore.token;
  if (token) {
    console.log('第一条路')
    localStorage.setItem('Authorization', token);
    hasRecord = excellentStore.hasRecord;
    if (hasRecord) {
      // 申请记录掏出来
      recordInfo = excellentStore.recordInfo;
    }

    step = 1;
  } else {
    console.log('第二条路')
    step = 0;
    // handleMCode(230037);
  }
})

// 申请记录查询
const getApplyRecord = async () => {
  const res = await request.excellentPeopleList({userId: excellentInfo.userId});
  if (res.status == 200 && res.data) {
    const {rows} = res.data;
    if (rows && rows.length > 0) {
      recordInfo = rows[0];
      excellentStore.recordInfo = recordInfo;
      excellentStore.hasRecord = true;
      hasRecord = true;
    } else {
      hasRecord = false;
      excellentStore.hasRecord = false;
    }
  }
}


let clickCount = $ref(0);

const clickWelcome = () => {
  clickCount++;
  // 点击5次后触发
  if (clickCount >= 5) {
    handleMCode('230037');
    clickCount = 0;
  }

  setTimeout(() => {
    clickCount = 0;
  }, 10000);
}

</script>

<template>
  <van-nav-bar title="优秀员工体检" fixed :border="false" left-arrow left-text="返回" @click-left="onClickLeft" />
  <main class="scrollMain">
  
    <!-- 扫码验证员工身份 -->
    <div v-if="step === 0" class="scan-salary-wrapper">
        <div style="margin-bottom: 50px; text-align: center;">
          <p @click="clickWelcome">请扫描员工码！</p>
        </div>
        <van-button type="success" @click="startScan">开始扫描</van-button>
    </div>

    <div v-if="step == 1" class="step1-wrapper">
      <!-- 体检申请  -->
       <div class="apply-wrapper">
        <van-button type="success" @click="doApply" :disabled="!isExcellent">体检申请 &#62;</van-button>
       </div>
       <!-- 体检申请记录查询 -->
        <div v-if="!isExcellent" class="record-wrapper">
          <p>很遗憾，您还不是优秀员工，暂无此福利！<br>加油哟~</p>
        </div>
        <div v-else class="record-wrapper">
          <div class="record-title">申请记录</div>
          <div v-if="hasRecord">
            <p>福利项目：{{ recordInfo?.benefitItems }}</p>
            <p>员工姓名：{{ recordInfo?.userName }}</p>
            <p>员工年龄：{{ recordInfo?.userAge }}</p>
            <p>优秀员工年度：{{ recordInfo?.selectYear }}</p>
            <p>体检套餐：{{ recordInfo?.medicalExaminationPackageName }}</p>
            <p>体检城市：{{ recordInfo?.selectCity }}</p>
            <p>预计体检时间：{{ recordInfo?.estimatedTime }}</p>
          </div>
          <div v-else>暂无记录</div>
        </div>
    </div>
  </main>
  <div class="scan-box" v-show="isShow">
      <div id="reader"></div>
      <div class="back-li">
          <van-button @click="stopScan">返回</van-button>
      </div>
  </div>
</template>

<style scoped>

.list .item {
  border-bottom: 1px solid #53585c;
}

.scan-salary-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  height: calc(100vh - 400px);
  margin-top: 100px;
}
.step1-wrapper {
}
.apply-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40vh;
  background-color: rgba(7, 193, 96, 0.2);
}
.record-wrapper {
  font-size: 14px;
  padding: 30px;
}
.record-wrapper p {
  margin-bottom: 6px;
}
.record-title {
  font-size: 16px;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.5);
}
</style>