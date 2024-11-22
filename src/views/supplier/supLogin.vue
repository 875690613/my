<script setup>
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { onMounted } from 'vue';
import api from '@/request/api'
// let username = $ref('13771202326');
// let password = $ref('zr123456');
let username = $ref('');
let password = $ref('');
let toast = $ref(null)

const router = useRouter();
document.title = '供应商地图'
const onSubmit = async (values) => {
  toast = showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  });
  console.log('submit', values);
  const { status, data, msg } = await api.workorderLogin(values);
  toast.close();
  if (status == 200) {
    // Toast登录成功提示
    showToast({
      message: '登录成功',
      className: 'custom-toast',
    })
    
    // 缓存token
    sessionStorage.setItem('token', data);
    // 路由跳转->订单列表
    router.push('spMap');

    
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
    <div class="login-title">供应商地图</div>
    <van-form @submit="onSubmit">
        <van-cell-group inset>
            <van-field
            v-model="username"
            name="username"
            label="用户名"
            placeholder="用户名"
            clearable
            :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
            v-model="password"
            type="password"
            name="password"
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