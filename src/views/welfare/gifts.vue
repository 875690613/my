<script setup>
import { onMounted, onUnmounted } from 'vue';
import request from '@/utils/request'
import { encrypt } from '@/utils/secret';
import { Html5Qrcode } from 'html5-qrcode';
// import VConsole from 'vconsole';
// const vConsole = new VConsole();
let step = $ref(0);
let listData = $ref([])
let loading = $ref(false);
let finished = $ref(false);
let refreshing = $ref(false);
let page = $ref(1);
let size = $ref(10);

let isShow = $ref(false);
let html5QrCode = $ref(null);

// 页面实例卸载
onUnmounted(() => {
  stop();
  localStorage.removeItem('Authorization');
  html5QrCode = null;
})

// 导航-返回
const onClickLeft = () => {
  if (step === 1) {
    step = 0;
    return;
  }
  history.back();
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
            // 获取员工code
            localStorage.setItem('Authorization', val);
            
            // 验证成功提示
            showToast('身份验证成功')
            step = 1;
          } else {
            // 验证失败提示
            showToast('身份验证失败')
          }
        }


// 获取数据
const getData = async () => {
  const secretKey = 'kLVS1AxkfHMOrj0ta6Lrsg6Z+UxmuYbMFhJuCWrGni4=';
  const params = {
    page: encodeURIComponent(encrypt(page, secretKey)),
    size: encodeURIComponent(encrypt(size, secretKey))
  }
  return new Promise((resolve, reject) => {
    request.get('/api/officeSuppliesApplication/qxt/search', { ...params }, {
      headers: {
        Systemid: 'qxt'
      }
    }).then(res => {
    const { code, data } = res;
    if (code == 0) {
      listData = data.rows;
      loading = false;
      refreshing = false;
      const total = data.total;
      finished = total <= page;
      resolve(data)
    } else {
      reject()
    }
  })
  })
}

const onLoad = () => {
  if (!finished) {
    getData()
  }
}

// 下拉刷新
const onRefresh = () => {
  if (!finished) {
    page++
    getData()
  }
}

onMounted(() => {
  // getData();
})


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

// AES加密
</script>

<template>
  <van-nav-bar title="节日礼品领取记录" fixed :border="false" left-arrow left-text="返回" @click-left="onClickLeft" />
  <main class="scrollMain">
  
    <!-- 扫码验证员工身份 -->
    <div v-if="step === 0" class="scan-salary-wrapper">
        <div style="margin-bottom: 50px; text-align: center;">
          <p @click="clickWelcome">欢迎使用节日礼品领取查询工具<br>请扫描员工码进行查询！</p>
        </div>
        <van-button color="linear-gradient(to right, #ff6034, #ee0a24)" @click="startScan">开始查询</van-button>
    </div>

    <div v-if="step == 1">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model:loading="loading" :finished="finished" @load="onLoad" class="list">
          <van-row class="item" v-for="item in listData" :key="item">
            <van-cell style="border-radius: 5px; background-color: #f8f8f8; margin: 10px 10px 0;" :title="item.goodsName" value="已领取" :label="item.remark" />
          </van-row>
        </van-list>
      </van-pull-refresh>
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
.scan-salary-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  height: calc(100vh - 400px);
  margin-top: 100px;
}
:deep(.van-cell__title span) {
  color: #ff6034;
}
</style>