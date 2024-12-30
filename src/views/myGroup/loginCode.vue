<!-- 我的集团 -->
<script setup>
import { useRouter } from 'vue-router';
import request from '@/utils/request';
import { showToast } from 'vant';
import { onMounted } from 'vue';
let phone = $ref(''); // 17501516805
let pwd = $ref(''); // 123456
let codes = $ref(''); // 9527
let toast = $ref(null)
let CountdownDisabled = $ref(true)
let countdown = $ref('发送验证码')
let second = $ref(0)//倒计时
document.title = '我的集团';

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
    message: '加载中...',
    forbidClick: true,
  });
  const { code, rows, message } = await request.post('/api/admin/user/reg/sendMessageToEmail/v2', {phone:phone});
  toast.close();
  if (code == 200) {
    // Toast登录成功提示
    showToast({
      message: message,
      className: 'custom-toast',
    })
    
    // 缓存token
    sessionStorage.setItem('userId', rows);
    // 路由跳转->订单列表
    // router.push('/myGroup/index');

    
  } else {
    showToast({
      message: message,
      className: 'custom-toast',
    })
  }
}
// 提交登录
const onSubmit = async (values) => {
  values.code = codes
  toast = showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  });
  const { status, data, message } = await request.post('/api/auth/jwt/phone/byCode/token', values);
  toast.close();
  if (status == 200) {
    // Toast登录成功提示
    showToast({
      message: '登录成功',
      className: 'custom-toast',
    })
    router.push('/myGroup/index');
    
    // 缓存token
    sessionStorage.setItem('myToken', data);
    sessionStorage.setItem('userPhone', phone);
    // 路由跳转->员工信息页面

    
  } else {
    showToast({
      message: message,
      className: 'custom-toast',
    })
  }
};
</script>

<template>
  <div class="mainContent">
    <van-nav-bar title="登录" fixed :border="false" />
    <main>
      <div class="login-title"></div>
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
          <div style="margin: 16px;">
              <van-button round block type="primary" native-type="submit">
              登录
              </van-button>
          </div>
          <!-- <van-button round block type="primary" to="/myGroup/index">
            下一步
            </van-button> -->
      </van-form>
    </main>
  </div>
</template>

<style scoped>

.login-title {
  font-size: 22px;
  color: #666666;
  text-align: center;
  margin: 16px;
  padding: 40px 20px 60px 20px;

}
.van-count-down {
  font-size: 24px;
  color: #333;
}
</style>