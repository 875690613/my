<script setup>
import { ref, computed, onUnmounted, watch, onMounted, watchEffect } from 'vue';
import request from '@/utils/request'
import { Html5Qrcode } from 'html5-qrcode';
import { showToast } from 'vant';
// import VConsole from 'vconsole';
// const vConsole = new VConsole();
const isShow = ref(false);
const isSend = ref(false);
const loginParams = ref({});
const salaryList = ref([]);
const salaryDetail = ref({})
const salaryDetailTitle = computed(() => {
  return `${salaryDetail.value.syear}年${salaryDetail.value.smonth}月 工资明细`
})

// watchEffect(() => {
//   salaryDetailTitle = `${salaryDetail.syear}年${salaryDetail.smonth}月 工资明细`
// })

let html5QrCode = $ref(null);
const authCode = ref(); // 230037, 240015, 240013

const step = ref(0);

// 计算属性headerTitle
const headerTitle = computed(() => {
  return {
  0: '工资查询',
  1: '身份验证',
  2: '工资查询',
  3: '工资明细',
}[step.value]
});

const showDatePicker = ref(false);
const currentDate = ref(['2024']);
const minDate = new Date(2012, 0, 1);
const maxDate = new Date();
const columnsType = ['year'];
const onSubmit = (values) => {
  salaryLogin();
};

const startScan = () => {
  getCameras();
}
const stopScan = () => {
  console.log('stopScan...')
    stop();
}

// 导航-返回
const onClickLeft = () => {
    if (step.value == 0) {
        history.back();
    } else {
        goBack();
    }
}

const goBack = () => {
  step.value = 0;
  // 清除数据
  localStorage.removeItem('Authorization');
}

const goList = () => {
  step.value = 2;
}

onMounted(() => {
  // 测试调试代码
  // localStorage.setItem('Authorization', '230069');
})

onUnmounted(() => {
    stop();
    goBack();
    localStorage.removeItem('Authorization');
    html5QrCode = null;
})

const getCameras = () => {
            Html5Qrcode.getCameras()
                .then((devices) => {
                    if (devices && devices.length) {
                        isShow.value = true;
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
                      // actInpVal.value = decodedText;
                      const text = decodedText.split('&')[0];
                      handleMCode(text);
                      isShow.value = false;
                      stop();
                      //hasScan.value = false;


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
        // if (devicesInfo.value) {
          if (!(html5QrCode && typeof(html5QrCode.stop) == 'function')) {
            isShow.value = false;
            return;
          }
          html5QrCode
              .stop()
              .then((ignore) => {
                  isShow.value = false;
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
          authCode.value = val;
          localStorage.setItem('Authorization', val);
          const data = await getStaffInfo(val);
          console.log('handleMCode data: ', data)
          loginParams.value = {
            name: data.userName,
            phone: data.phone
          }
          if (data && data.code) {
            step.value = 1;
          }
        }

        // 请求接口
        // 根据员工码获取个人信息
        const getStaffInfo = () => {
          return new Promise((resolve, reject) => {
            request.get('/api/machine/user', {})
              .then((res) => {
                console.log('getStaffInfo res:', res)
                const { code, data, message } = res;
                if (code == 0) {
                    resolve(data.data)
                } else {
                    console.log(message);
                    reject()
                }
              });
          })
        }

        // handleMCode('230037')

        // 发送手机验证码
        const sendCode = async () => {
          isSend.value = true;
          request.post('/api/verCode/add', {
            phone: loginParams.value.phone
          })
              .then((res) => {
                const { code } = res;
                if (code == 0) {
                  showToast('发送成功！')
                }
              });

              setTimeout(() => {
                isSend.value = false;
              }, 30000)
          }

          // 工资查询-人员认证
          const salaryLogin = () => {
            request.get('/api/machine/user/salary/login', {
              ...loginParams.value}).then((res) => {
                const { code, message } = res;
                if (code == 0) {
                  showToast(message)
                  // 保存token
                  sessionStorage.setItem('token', res.data.data.token);
                  step.value = 2;
                  const params = {
                    staffNo: authCode.value,
                    year: '2024'
                  }
                  getSalaryList(params)
                }
              });
          }

          // 日期改变
          const dateChange = (val) => {
            console.log('dateChange val: ', val)
            showDatePicker.value = false;
            const year = val.selectedValues[0]
            const params = {
              staffNo: authCode.value,
              year
            }
            getSalaryList(params)
          }

          // 查询工资
          const getSalaryList = (params) => {
            request.get('/api/machine/user/salary/byUserStaffNo', params).then((res) => {
                  const { code, message, data } = res;
                  if (code == 0) {
                    step.value = 2;
                    if (data?.data?.length > 0) {
                      salaryList.value = data.data;
                    } else {
                      salaryList.value = []
                    }
                    showToast(message)
                  }
                });
          }

          // 查询工资明细
          const getSalaryDetail = (id) => {
            request.get(`/api/machine/user/salary/byId/${id}`, {
                  staffNo: authCode.value,
                }).then((res) => {
                  const { code, message, data } = res;
                  if (code == 0) {
                    salaryDetail.value = data.data || {};
                    step.value = 3;
                    showToast(message)
                  }
                });
          }

let clickCount = $ref(0);

const clickWelcome = () => {
  clickCount++;
  // 点击5次后触发
  if (clickCount >= 5) {
    handleMCode('230069');//wang230037  xia230069   chen240039
    clickCount = 0;
    //如果存在缓存token，则跳转登录页
    if (sessionStorage.getItem('token')) {
      step.value = 2;
      const params = {
        staffNo: authCode.value,
        year: '2024'
      }
      getSalaryList(params)
    }
  }
  
  setTimeout(() => {
    clickCount = 0;
  }, 10000);
}
</script>

<template>
  <van-nav-bar :title="headerTitle" fixed :border="false" left-arrow left-text="返回" @click-left="onClickLeft" />
  <main class="scrollMain">
    <!-- 扫码查询工资条 -->
    <div v-if="step === 0" class="scan-salary-wrapper">
        <div style="margin-bottom: 50px;">
          <p @click="clickWelcome">欢迎使用逐日企信通工资查询系统，请扫描员工码进行工资查询！</p>
        </div>
        <van-button @click="startScan">开始查询</van-button>
    </div>
    <div v-else-if="step === 1" class="phone-wrapper">
      <div style="margin-bottom: 30px;">
        <div style="text-align: center;">
          <img src="@/assets/images/icon-success.png" alt="" style="width: 50%;">
        </div>
        <div style="text-align: center; font-size: 20px;">身份验证成功</div>
      </div>
      <van-form @submit="onSubmit" label-width="60px">
        <van-cell-group inset>
          <van-field
            v-model="loginParams.name"
            name="姓名"
            label="姓名"
            disabled
          />
          <van-field
            v-model="loginParams.phone"
            name="手机号"
            label="手机号"
            disabled
          />
          <van-field
            v-model="loginParams.verCode"
            name="验证码"
            label="验证码"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '请填写验证码' }]"
          >
            <template #button>
              <van-button size="mini" @click="sendCode">{{ isSend ? '已发送' : '发送验证码' }}</van-button>
            </template>
          </van-field>
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block color="#0C273F" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
    <div v-else-if="step === 2" class="salary-list-wrapper">
      <div>
        <van-cell title="选择年份" is-link @click="showDatePicker = true" :value="currentDate[0]" />
        <template v-if="salaryList?.length > 0">
          <template v-for="item in salaryList" :key="item.id">
            <van-cell :title="`${item.syear}-${item.smonth} 工资薪金`" is-link value="工资明细" @click="getSalaryDetail(item.id)">
              <template #label>
                <div>
                  <div>应发工资：{{ item.n5 }}</div>
                  <div>实发工资：{{ item.n13 }}</div>
                </div>
              </template>
              <template #value>
                <div style="color: #1890FE;">
                  工资明细
                </div>
              </template>
            </van-cell>
          </template>
        </template>
        <template v-else>
          <van-cell title="工资薪金">
              <template #label>
                <div style="text-align: center;">暂无数据</div>
              </template>
            </van-cell>
        </template>
      </div>
      <!-- 选择年度/月份 -->
      <van-popup v-model:show="showDatePicker" position="bottom">
        <van-date-picker
          v-model="currentDate"
          :columns-type="columnsType"
          title="选择日期"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="dateChange"
          @cancel="showDatePicker = false"
        />
      </van-popup>
    </div>
    <template v-else-if="step === 3">
    <div class="salary-detail-wrapper">
      <!-- 工资明细 -->
       <div>
        <van-cell-group :title="salaryDetailTitle">
          <van-cell title="应发工资" :value="salaryDetail.n17" />
          <van-cell title="实发工资" :value="salaryDetail.n28" />
        </van-cell-group>
        <div>
          <van-cell-group title="基本信息">
            <van-cell title="姓名" :value="salaryDetail.staff" />
            <van-cell title="部门名称" :value="salaryDetail.deptName" />
            <van-cell title="岗位/职务" :value="salaryDetail.jobName || '--'" />
            <!-- <van-cell title="身份证号" :value="salaryDetail.idNumber" /> -->
            <van-cell title="工号" :value="salaryDetail.employeeNumber" />
          </van-cell-group>
          <van-cell-group title="工资明细" v-if="salaryDetail.accountName == '江阴逐日信息科技有限公司'">
            <van-cell title="应出勤" :value="salaryDetail.n1 || 0" />
            <van-cell title="事假" :value="salaryDetail.n2 || 0" />
            <van-cell title="病假" :value="salaryDetail.n3 || 0" />
            <van-cell title="年假" :value="salaryDetail.n4 || 0" />
            <van-cell title="婚假" :value="salaryDetail.n5 || 0" />
            <van-cell title="产假" :value="salaryDetail.n6 || 0" />
            <van-cell title="丧假" :value="salaryDetail.n7 || 0" />
            <van-cell title="调休" :value="salaryDetail.n8 || 0" />
            <van-cell title="加班" :value="salaryDetail.n9 || 0" />
            <van-cell title="未出勤" :value="salaryDetail.n10 || 0" />
            <van-cell title="实出勤" :value="salaryDetail.n11 || 0" />
            <van-cell title="基本工资" :value="salaryDetail.n12 || 0" />
            <van-cell title="绩效及加班工资" :value="salaryDetail.n13 || 0" />
            <van-cell title="考核部分" :value="salaryDetail.n14 || 0" />
            <van-cell title="其它补贴" :value="salaryDetail.n15 || 0" />
            <van-cell title="扣未出勤工资" :value="salaryDetail.n16 || 0" />
            <van-cell title="应发" :value="salaryDetail.n17 || 0" />
            <van-cell title="个人借款" :value="salaryDetail.n18 || 0" />
            <van-cell title="应扣社保" :value="salaryDetail.n19 || 0" />
            <van-cell title="实扣社保" :value="salaryDetail.n20 || 0" />
            <van-cell title="应扣个税" :value="salaryDetail.n21 || 0" />
            <van-cell title="实扣个税" :value="salaryDetail.n22 || 0" />
            <van-cell title="应扣公积金" :value="salaryDetail.n23 || 0" />
            <van-cell title="实扣公积金" :value="salaryDetail.n24 || 0" />
            <van-cell title="事假扣除" :value="salaryDetail.n25 || 0" />
            <van-cell title="病假扣除" :value="salaryDetail.n26 || 0" />
            <van-cell title="其他扣除" :value="salaryDetail.n27 || 0" />
            <van-cell title="实发" :value="salaryDetail.n28 || 0" />
          </van-cell-group>
          <van-cell-group title="工资明细" v-if="salaryDetail.accountName == '靖江极客时装有限公司'">
            <van-cell title="实出天数" :value="salaryDetail.n29 || 0" />
            <van-cell title="实出工时" :value="salaryDetail.n30 || 0" />
            <van-cell title="正常出勤-工时" :value="salaryDetail.n32 || 0" />
            <van-cell title="正常出勤-金额" :value="salaryDetail.n33 || 0" />
            <van-cell title="日常加班-工时" :value="salaryDetail.n35 || 0" />
            <van-cell title="日常加班-金额 1.5x" :value="salaryDetail.n36 || 0" />
            <van-cell title="休息日加班-工时" :value="salaryDetail.n38 || 0" />
            <van-cell title="休息日加班-金额 2x" :value="salaryDetail.n39 || 0" />
            <van-cell title="法定节日加班-工时" :value="salaryDetail.n41 || 0" />
            <van-cell title="法定节日加班-金额 3x" :value="salaryDetail.n42 || 0" />
            <van-cell title="应发加班工资" :value="salaryDetail.n43 || 0" />
            <van-cell title="基本工资" :value="salaryDetail.n44 || 0" />
            <van-cell title="加班工资" :value="salaryDetail.n45 || 0" />
            <van-cell title="绩效/补贴" :value="salaryDetail.n46 || 0" />
            <van-cell title="应发工资" :value="salaryDetail.n47 || 0" />
            <van-cell title="应扣保险" :value="salaryDetail.n48 || 0" />
            <van-cell title="实扣保险" :value="salaryDetail.n49 || 0" />
            <van-cell title="应扣所得税" :value="salaryDetail.n50 || 0" />
            <van-cell title="实扣所得税" :value="salaryDetail.n51 || 0" />
            <van-cell title="餐补扣除" :value="salaryDetail.n52 || 0" />
            <van-cell title="交通补贴扣除" :value="salaryDetail.n53 || 0" />
            <van-cell title="产量考核扣除" :value="salaryDetail.n54 || 0" />
            <van-cell title="其他扣除" :value="salaryDetail.n55 || 0" />
            <van-cell title="实发工资" :value="salaryDetail.n56 || 0" />
            
          </van-cell-group>
        </div>
       </div>
    </div>
      <div style="display: flex; justify-content: center; margin-top: 10px;">
          <van-button @click="goList" round size="small" style="width: 120px; margin-right: 20px;">返回上一页</van-button>
          <van-button @click="goBack" round size="small" style="width: 120px;">退出</van-button>
      </div>
    </template>
  </main>
  <div class="scan-box" v-show="isShow">
      <div id="reader"></div>
      <div class="back-li">
          <van-button @click="stopScan">返回</van-button>
      </div>
  </div>
</template>

<style scoped lang="scss">
.scrollMain {
  background-color: #073936;
}
header.header {
  text-align: center;
  height: 22px;
  padding: 20px;
  color: white;
  line-height: 1;
  margin-bottom: 20px;
}

.scan-salary-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  height: calc(100vh - 400px);
  margin-top: 100px;
  p {
    color: white;
  }
}

.phone-wrapper {
  width: 88%;
  margin: 20px auto;
  height: calc(100vh - 100px);
  padding: 30px 0;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0px 3px 31px 0px rgba(0,0,0,0.06);
  border-radius: 16px;
  filter: blur(0px);
}
.salary-list-wrapper {
  padding: 20px;
}
.salary-list-wrapper .van-cell {
  margin-bottom: 20px;
  border-radius: 6px;
}

.salary-detail-wrapper {
  width: 88%;
  margin: 0 auto;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0px 3px 31px 0px rgba(0,0,0,0.06);
  border-radius: 16px;
  opacity: 0.95;
  filter: blur(0px);
  overflow-y: auto;
  height: calc(100vh - 130px);
}

// :deep(.van-cell-group),
// :deep(.van-cell) {
//   background: white!important;
// }
:deep(.van-field__label) {
  color: #333;
}
// :deep(.van-cell:after) {
//   border-bottom-color: #eeeeee;
// }
:deep(.van-field__control) {
  color: #333;
}
:deep(.van-field__control:disabled) {
  -webkit-text-fill-color: #333;
}
// :deep(input.van-field__control::placeholder) {
//   color: #CCCCCC;
// }
// :deep(.van-cell__title) {
//   color: #333;
// }

</style>
