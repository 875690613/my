<script setup>
import { onMounted, onUnmounted, computed, watchEffect, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import request from '@/request/api.js';
import {useExcellentStore}   from '@/stores/excellent.js';
// import VConsole from 'vconsole';
// const vConsole = new VConsole();

const route = useRoute()
const router = useRouter()
let excellentStore = useExcellentStore();


// 申请参数
const applyParams = reactive({
  userId: '',
  userName: '',
  selectYear: '',
  userAge: '',
  benefitItems: '免费体检',
  medicalExaminationPackageName: '',
  selectCity: '',
  estimatedTime: ''
});


// 自动监听路由变化
watchEffect(() => {
  console.log('路由变化监听', route.name);
  if (route.name ==='staffPhysicalExamApply') {
    // 从缓存中获取优秀员工数据
    const excellentInfo = excellentStore.excellentInfo;
    if (excellentInfo) {
      applyParams.userName = excellentInfo.userName;
      applyParams.userAge = excellentInfo.userAge;
      applyParams.selectYear = excellentInfo.selectYears?.[0];
      applyParams.userId = excellentInfo.userId;
    }
  }
})


// 显示体检套餐picker
let showPackPicker = $ref(false);

// 体检套餐
const packColumns = [
      { text: '职工体检', value: '职工体检' },
      { text: '女性体检', value: '女性体检' },
      { text: '普通体检', value: '普通体检' },
];

// 选择体检套餐
const onPackConfirm = ({ selectedOptions }) => {
  applyParams.medicalExaminationPackageName = selectedOptions[0].value;
  showPackPicker = false;
}

// 显示体检城市picker
let showCityPicker = $ref(false);

// 体检城市
const cityColumns = [
      { text: '北京', value: '北京' },
      { text: '上海', value: '上海' },
      { text: '无锡', value: '无锡' },
      { text: '江阴', value: '江阴' },
      { text: '泰州', value: '泰州' },
      { text: '靖江', value: '靖江' }
];

// 选择城市
const onCityConfirm = ({ selectedOptions }) => {
      applyParams.selectCity = selectedOptions[0].value;
      showCityPicker = false;
  }

// 显示日期picker
let showDatePicker = $ref(false);

// 选择日期
const onDateConfirm = ({ selectedValues }) => {
  applyParams.estimatedTime = selectedValues.join('-');
  showDatePicker = false;
}

// 导航-返回
const onClickLeft = () => {
  back();
}

const back = () => {
    router.replace({
      name: 'staffPhysicalExam',
      params: {
        userId: applyParams.userId
      }
    });
}

// 提交申请
const onSubmit = async () => {
  console.log('提交申请', applyParams);
  const res = await request.applyExcellentPeople({...applyParams});
  if (res.status == 200) {
    alert('申请成功');
    back();
  } else {
    alert('申请失败，请重试');
  }
}

</script>

<template>
  <van-nav-bar title="优秀员工体检申请" fixed :border="false" left-arrow left-text="返回" @click-left="onClickLeft" />
  <main class="scrollMain">
    <van-form @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model="applyParams.userName"
          name="员工姓名"
          label="员工姓名"
          :readonly="true"
        />
        <van-field
          v-model="applyParams.userAge"
          name="员工年龄"
          label="员工年龄"
          :readonly="true"
        />
        <van-field
          v-model="applyParams.selectYear"
          name="优秀员工年度"
          label="优秀员工年度"
          :readonly="true"
        />
        <van-field
          v-model="applyParams.medicalExaminationPackageName"
          is-link
          readonly
          label="体检套餐"
          placeholder="选择体检套餐"
          @click="showPackPicker = true"
        />
        <van-popup v-model:show="showPackPicker" round position="bottom">
          <van-picker
            :columns="packColumns"
            @cancel="showPackPicker = false"
            @confirm="onPackConfirm"
          />
        </van-popup>
        <van-field
          v-model="applyParams.selectCity"
          is-link
          readonly
          label="体检城市"
          placeholder="选择体检城市"
          @click="showCityPicker = true"
        />
        <van-popup v-model:show="showCityPicker" round position="bottom">
          <van-picker
            :columns="cityColumns"
            @cancel="showCityPicker = false"
            @confirm="onCityConfirm"
          />
        </van-popup>
        <van-field
          v-model="applyParams.estimatedTime"
          is-link
          readonly
          name="预计体检时间"
          label="预计体检时间"
          placeholder="点击预计体检时间"
          @click="showDatePicker = true"
        />
        <van-popup v-model:show="showDatePicker" position="bottom">
          <van-date-picker @confirm="onDateConfirm" @cancel="showDatePicker = false"  :min-date="new Date()" />
        </van-popup>
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
</style>