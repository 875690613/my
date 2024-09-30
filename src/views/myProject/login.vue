<script setup>
import { useRouter } from 'vue-router';
import request from '@/utils/request';
import { showToast } from 'vant';
import { onMounted } from 'vue';
let phone = $ref('');
let pwd = $ref('');
let toast = $ref(null)

const router = useRouter();
const onSubmit = async (values) => {
  toast = showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  });
  console.log('submit', values);
  const { code, rows, msg } = await request.get('/api/sys/loginIn', values);
  toast.close();
  if (code == 200) {
    // Toast登录成功提示
    showToast({
      message: msg,
      className: 'custom-toast',
    })
    
    // 缓存token
    sessionStorage.setItem('userId', rows);
    // 路由跳转->订单列表
    router.push('/orderList');

    
  } else {
    showToast({
      message: msg,
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
    <div class="login-title">我的订单查询工具</div>
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