<!-- 品牌系列周计划 -->
<script setup>
import { useRouter } from 'vue-router';
import request from '@/utils/request';
import { showToast } from 'vant';
import { onMounted } from 'vue';
let phone = $ref(''); // 17501516805
let pwd = $ref(''); // 123456
let toast = $ref(null)

document.title = '品牌系列';

const router = useRouter();
const onSubmit = async (values) => {
  toast = showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  });
  const { code, rows, message } = await request.get('/api/sys/loginIn', values);
  toast.close();
  if (code == 200) {
    // Toast登录成功提示
    showToast({
      message: message,
      className: 'custom-toast',
    })
    
    // 缓存token
    sessionStorage.setItem('userId', rows);
    // 路由跳转->品牌系列列表
    router.push('/brandSeries/index');

    
  } else {
    showToast({
      message: message,
      className: 'custom-toast',
    })
  }
};

onMounted(() => {
  sessionStorage.clear();
})
</script>

<template>
  <van-nav-bar title="登录" fixed :border="false" />
  <main>
    <div class="login-title">品牌系列</div>
    <van-form @submit="onSubmit">
        <van-cell-group inset>
            <van-field
            v-model="phone"
            name="phone"
            label="手机号码"
            placeholder="手机号码"
            clearable
            :rules="[{ required: true, message: '请填写手机号码' }]"
            />
            <van-field
            v-model="pwd"
            type="password"
            name="pwd"
            label="密码"
            placeholder="密码"
            clearable
            :rules="[{ required: true, message: '请填写密码' }]"
            />
        </van-cell-group>
        <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
            提交
            </van-button>
        </div>
    </van-form>
  </main>
</template>

<style scoped>
.login-title {
  font-size: 22px;
  color: #666666;
  text-align: center;
  margin: 16px;
  padding: 120px 20px 50px 20px;

}
</style>