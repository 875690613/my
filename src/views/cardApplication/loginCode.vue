<!-- 我的集团 -->
<script setup>
import { useRouter } from 'vue-router';
import request from '@/utils/request';
import { showToast } from 'vant';
import { onMounted } from 'vue';
import myLogo from '@/assets/images/xinfutong/logo.png';
import mylogin_01 from '@/assets/images/xinfutong/login_01.png';
let phone = $ref(''); // 17501516805
let pwd = $ref(''); // 123456
let codes = $ref(''); // 9527
let toast = $ref(null)
let CountdownDisabled = $ref(true)
let countdown = $ref('发送验证码')
let second = $ref(0)//倒计时
document.title = '工资卡开卡申请';

const router = useRouter();

onMounted(() => {
  // sessionStorage.clear();
  if (phone !='') {
    CountdownDisabled = false
  }
  let myToken = sessionStorage.getItem('myToken')
  console.log("myToken:",myToken);
  if (myToken != null) {
    // 路由跳转->员工详情
    // router.push('/myGroup/index');
  }
})
//写一个blurPhone方法 控制CountdownDisabled
const blurPhone = () => {
  console.log("secondsecondsecond:",second);
  if (phone !='') {
    CountdownDisabled = false
  }else{
    CountdownDisabled = true
  }
}

//写一个60秒的倒计时方法
const startCountdown = async () => {
  second = 60
  const timer = setInterval(() => {
    second--;
    if (second) {
      countdown = `倒计时 ${second} 秒`;
    } else {
      clearInterval(timer);
      countdown = '发送验证码';
      second = 0
    }
  }, 1000);
}
//发送验证码
const sendCode = async () => {
  //发送验证码
  CountdownDisabled = true
  startCountdown()
  toast = showLoadingToast({
    message: '发送中...',
    forbidClick: true,
  });
  const { errno, errmsg } = await request.get('/wx/head/hunting/sendMsgCode/'+ phone);
  toast.close();
  if (errno == 0) {
    // Toast发送成功提示
    showToast({
      message: '发送'+ errmsg,
      className: 'custom-toast',
    })
    
    // 缓存token
    // sessionStorage.setItem('myToken', data.token);
    // 路由跳转->列表
    // router.push('/recruiter/index')

    
  } else {
    showToast({
      message: errmsg,
      className: 'custom-toast',
    })
  }
}
// 提交登录
const onSubmit = async (values) => {
  values.code = codes
  toast = showLoadingToast({
    message: '登录中...',
    forbidClick: true,
  });
  const { errno, data, errmsg } = await request.post('/wx/head/hunting/updateUser', values);
  toast.close();
  if (errno == 0) {
    // Toast登录成功提示
    showToast({
      message: '登录成功',
      className: 'custom-toast',
    })
    
    // 缓存token
    sessionStorage.setItem('myToken', data.token);
    sessionStorage.setItem('myPhone', data.userInfo.mobile);
    // 路由跳转->列表页面
    router.push('/cardApplication/index');

    
  } else {
    showToast({
      message: errmsg,
      className: 'custom-toast',
    })
  }
};
</script>

<template>
  <div class="mainContent">
    <!-- <van-nav-bar title="登录" @click-left="router.back()" left-text="" fixed :border="false" /> -->
    <main>
      <div class="login-title">
        <van-image class="myLogo" :src="myLogo" />
        <van-image class="mylogin_01" :src="mylogin_01" />

        <!-- <img src="@/assets/images/xinfutong/logo.png" alt=""> -->
        <!-- <img src="@/assets/images/xinfutong/login_01.png" alt=""> -->
      </div>
      <div class="login-form">

        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field
                v-model="phone"
                name="phone"
                label="手机号码"
                placeholder="手机号码"
                clearable
                @focus="blurPhone"
                :rules="[{ required: true, message: '请填写手机号码' }]"
                />
                <!-- <van-field
                v-model="pwd"
                type="password"
                name="pwd"
                label="密码"
                placeholder="密码"
                clearable
                :rules="[{ required: true, message: '请填写密码' }]"
                /> -->
                <van-field
                v-model="codes"
                center
                clearable
                label="短信验证码"
                placeholder="请输入短信验证码"
                :rules="[{ required: true, message: '请填写验证码' }]"
              >
                <template #button>
                  <van-button size="small" type="primary" :disabled="(phone == '' && second == 0) || (second >0 && second < 60)" @click="sendCode">
                    <span >{{ countdown }}</span>
                  </van-button>
                  <van-button size="small" type="primary" v-if="false" :disabled="CountdownDisabled" @click="startCountdown">
                    <span >{{ countdown }}</span>
                  </van-button>
                </template>
              </van-field>
            </van-cell-group>
            <div style="margin: 50px 40px 0px 40px;">
                <van-button round block type="primary" native-type="submit">
                登录
                </van-button>
            </div>
            <!-- <van-button round block type="primary" to="/myGroup/index">
              下一步
              </van-button> -->
        </van-form>
      </div>
    </main>
  </div>
</template>

<style scoped>
main {
  background: url('@/assets/images/xinfutong/bg_top.png') no-repeat top center / 100% auto;
  height: 100vh;
  overflow: hidden;
  
}
.login-title {
  font-size: 22px;
  color: #666666;
  text-align: center;
  margin: 0 16px;
  margin-top: 0px;
  padding: 40px 20px 60px 20px;
  
}
.login-form{
  height: 100%;
  background: url('@/assets/images/xinfutong/bg_bottom.png') no-repeat top center / 100% auto;

}
.myLogo{
  width: 100%;
  
  max-width:70px;
  max-height: 99px;
}
.mylogin_01{
  width: 100%;
  max-width: 237px;
  max-height: 37px;
}
.van-count-down {
  font-size: 24px;
  color: #333;
}
</style>