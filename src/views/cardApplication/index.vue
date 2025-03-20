<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import request from '@/utils/request';
import {removeEmptyProps} from '@/utils/common';
import { showLoadingToast, closeToast,Overlay,DatePicker  } from 'vant';
import axios from 'axios';
import TextAvatar from '@/components/TextAvatar.vue';
import dayjs from 'dayjs';
import myxft from '@/assets/images/xinfutong/xft.png';
import myzrkj from '@/assets/images/xinfutong/zrkj.png';
import myimg from '@/assets/images/xinfutong/img.png';
document.title = '工资卡开卡申请表单';

const router = useRouter();
const show = $ref(false);
let CountdownDisabled = $ref(true)
let toast = $ref(null)
let myPhone = $ref('');//登录后获取当前账号手机号
let update = $ref(false);//登录后获取当前账号手机号
let countdown = $ref('发送验证码')
let second = $ref(0)//倒计时
let headHuntingName = $ref('');
let headHuntingPhone = $ref(''); // 17501516805
let headHuntingPhonejm = $ref(''); // 17501516805
let headHuntingMail = $ref('');
let headHuntingMailjm = $ref('');
let biographicalNotesIds = $ref('');//简历
let biographicalNotesUrl = $ref('');//简历
let academicCertificateIds = $ref('');//学历
let professionalCertificateIds = $ref('');//职业资格证书
let proofOfWorkSuccessIds = $ref('');//工作成功证明
let headHuntingSex = $ref(); // 性别 1男2女
let headHuntingBirth = $ref(); // 生日
let selfIntroduction = $ref(); // 自我介绍
let workUnit = $ref(); // 工作单位
let beginTime = $ref();
let endTime = $ref();
let jobName = $ref();
let jobDuty = $ref();
let jobAchievements = $ref();
let status = $ref(0);
const fileList = $ref([
  // { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg' },
  // Uploader 根据文件后缀来判断是否为图片文件
  // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
  // { url: 'https://cloud-image', isImage: true },
]);
const academicCertificateIdsList = $ref([]);
const professionalCertificateList = $ref([]);
const proofOfWorkSuccessList = $ref([]);
let id = $ref()
id = router.currentRoute.value.query.id;
let isCard = $ref(1); // 1有招商卡，2无招商卡


let listData = $ref([]);
let showClient = $ref(false);
let showBrand = $ref(false);
let brandName = $ref('逐日信息科技');
let statusTxt = $ref('开卡申请');
let brandOptions = $ref([
  {
      name: '逐日信息科技',
      id: 1
    },
    {
      name: '上海衣步科技',

      id: 2
    },
    {
      name: '江阴巨匠贸易',

      id: 3
    },
    {
      name: '江阴极客时装',

      id: 4
    }
]);//公司列表
let clientName = $ref('无招商I类卡');
let state = $ref('appliedFor');//add编辑、show展示,appliedFor申请中

let clientOptions = $ref([
  {
    name: '无招商I类卡',
    id: 1
  },
  {
    name: '已有招商I类卡',
    id: 2
  }
]);
let minDate = $ref(new Date(1940, 0, 1));
let maxDate = $ref(new Date(2099, 0, 1));
let loading = $ref(false);
let finished = $ref(false);
let refreshing = $ref(false);

const onLoad = () => {
  console.log('onLoad...')
  queryParams.page++;
}

onMounted(() => {
  // login()
  console.log("详情页id:", id);
  myPhone = sessionStorage.getItem('myPhone');
  headHuntingPhone = myPhone;
  console.log("headHuntingPhone:",headHuntingPhone);
  console.log("myPhone:",myPhone);


 
});

const queryParams = reactive({
  page: 0,
  limit: 10,
  keyword: null
});
// 选择所属公司
const onConfirmBrand = (item) => {
  console.log(item);
  const {selectedOptions} = item;
  const selectedItem = selectedOptions?.[0];
  queryParams.BrandId = selectedItem?.id;
  brandName = selectedItem?.name;
  showBrand = false;
};
// 选择是否有卡
const onConfirmshowClient = (item) => {
  console.log('选择是否有卡',item);
  const {selectedOptions} = item;
  const selectedItem = selectedOptions?.[0];
  console.log("已选择selectedItem：",selectedItem.id);
  isCard = selectedItem?.id;
  
  headHuntingSex = selectedItem?.id;
  clientName = selectedItem?.name;
  showClient = false;
};


let showBirth = $ref(false);
let showStartTimePicker = $ref(false);
let showEndTimePicker = $ref(false);

const onBirthConfirm = ({ selectedValues }) => {
  console.log('onBirthConfirm', selectedValues)
  headHuntingBirth = selectedValues.join('-')
  showBirth = false;
};
const onStartTimeConfirm = ({ selectedValues }) => {
  console.log('onStartTimeConfirm', selectedValues)
  beginTime = selectedValues.join('-')
  showStartTimePicker = false;
};

const onEndTimeConfirm = ({ selectedValues }) => {
  console.log('onEndTimeConfirm', selectedValues)
  endTime = selectedValues.join('-')
  showEndTimePicker = false;
};




// 请求接口获取列表数据
const getData = async () => {
  loading = true;
  const params = removeEmptyProps(queryParams);
  queryParams.page = 1;
  queryParams.status = 1;
  const { code, rows, total } = await request.get('/wx/head/hunting/list', params);
  if (code == 200) {
    // 计算finished
    finished = rows.length < queryParams.limit;
    // 合并数据
    listData = listData.concat(rows);
  } else {
    // 获取数据失败提示
    showToast("获取数据失败");
  }
  loading = false;
  refreshing = false;
};
// 获取附件
const getFile = async (name,key) => {
  const headers = {
      "Qeeker-Fashion-Token": sessionStorage.getItem('myToken'),
      responseType: 'blob' // 指定响应类型为 blob
    }
    axios.interceptors.response.use(
      response => {
        //获取地址栏域名

        // 学历
        biographicalNotesUrl = window.location.protocol + window.location.host + response.config.url;
        console.log('请求 URL:',biographicalNotesUrl); // 获取完整的请求 URL
        return response;
      },
      error => {
        console.error('请求失败:', error);
        return Promise.reject(error);
      }
    );
    axios.get('/wx/storage/download/'+ key,{
      headers,
      responseType: 'blob' // 指定响应类型为 blob
    })
    .then(response => {
      // 创建一个 URL 对象，指向图片内容
      const imageUrl = URL.createObjectURL(response.data);
      if (name == 'jl') {
        const blob = new Blob([response.data], { type: 'application/octet-binary' });
        const fileUrl = URL.createObjectURL(blob); // 创建临时文件地址
        console.log('简历文件地址:', fileUrl);
        console.log('简历地址:', imageUrl);
        // biographicalNotesUrl = fileUrl
        fileList.push({
          url: biographicalNotesUrl,
          // isImage: true
        });
        

        // 释放对象 URL
        URL.revokeObjectURL(fileUrl);
      }
      if (name == 'xl') {
        console.log('学历地址:', imageUrl);
        academicCertificateIdsList.push({
          url: imageUrl,
          isImage: true
        });
      }
      if (name == 'zyzs') {
        console.log('职业证书:', imageUrl);
        professionalCertificateList.push({
          url: imageUrl,
          isImage: true
        });
      }
      if (name == 'gzzm') {
        console.log('工作证明:', imageUrl);
        proofOfWorkSuccessList.push({
          url: imageUrl,
          isImage: true
        });
      }
    })
    .catch(error => {
      console.error('请求失败:', error);
    });

};
// 获取详情数据
const getDetailData = async () => {
  loading = true;
  const headers = {
      "Qeeker-Fashion-Token": sessionStorage.getItem('myToken'),
    }
  const params = {}
  const { errno, data, errmsg } = await request.get('/wx/head/hunting/getById/'+ id
  // , {headers}
  );
  if (errno == 0) {
    detailData = data
    status = data.status
    headHuntingName = data.headHuntingName
    headHuntingPhone = data.headHuntingPhone
    headHuntingPhonejm = data.headHuntingPhone
    if(myPhone == data.headHuntingPhone){
      update = true
    }
    headHuntingPhonejm = data.headHuntingPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    let reg = /^(.{3}).*(.{9})$/;
    headHuntingMail = data.headHuntingMail
    headHuntingMailjm = data.headHuntingMail.replace(reg, "$1****$2");
    console.log("hiddenEmail11111:",headHuntingMail);
    if (data.headHuntingSex == 1) {
      clientName = '男'
    }else{
      clientName = '女'
    }
    headHuntingBirth = data.headHuntingBirth
    selfIntroduction = data.selfIntroduction
    if (data.biographicalNotesFiles && data.biographicalNotesFiles.length > 0){
      getFile('jl',data.biographicalNotesFiles[0].key)
    }
    if (data.academicCertificateFiles && data.academicCertificateFiles.length > 0) {
      getFile('xl',data.academicCertificateFiles[0].key)
    }
    if (data.professionalCertificateFiles && data.professionalCertificateFiles.length > 0) {
      getFile('zyzs',data.professionalCertificateFiles[0].key)
    }
    if (data.proofOfWorkSuccessFiles && data.proofOfWorkSuccessFiles.length > 0) {
      getFile('gzzm',data.proofOfWorkSuccessFiles[0].key)
    }
    if (data.workExperienceList && data.workExperienceList.length > 0) {
      workUnit = data.workExperienceList[0].workUnit
      beginTime = data.workExperienceList[0].beginTime
      endTime = data.workExperienceList[0].endTime
      jobName = data.workExperienceList[0].jobName
      jobDuty = data.workExperienceList[0].jobDuty
      jobAchievements = data.workExperienceList[0].jobAchievements
    }

  }else{
    showToast({
      message: errmsg,
      className: 'custom-toast',
    })
    router.push('/recruiter/loginCode');
  }
  loading = false;
}
//写一个blurPhone方法 控制CountdownDisabled
const blurPhone = () => {
  console.log("secondsecondsecond:",second);
  if (headHuntingPhone !='') {
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
  const { errno, errmsg } = await request.get('/wx/head/hunting/sendMsgCode/'+ headHuntingPhone);
  toast.close();
  if (errno == 0) {
    // Toast登录成功提示
    showToast({
      message: '发送' + errmsg,
      className: 'custom-toast',
    })
    
    // 缓存token
    // sessionStorage.setItem('userId', rows);
    // 路由跳转->订单列表
    // router.push('/myGroup/index');

    
  } else {
    showToast({
      message: message,
      className: 'custom-toast',
    })
  }
}
const login = async () => {
  let values = {
    username: "uploader",
    password: "uploader"
  }
  console.log("登录啊");
  const { errno, data, errmsg } = await request.post('/wx/auth/login', values);
  if (errno == 0) {
    // Toast登录成功提示
    // showToast({
    //   message: '登录' + errmsg,
    //   className: 'custom-toast',
    // })
    
    // 缓存token
    sessionStorage.setItem('myToken', data.token);

    
  } else {
    showToast({
      message: errmsg,
      className: 'custom-toast',
    })
  }
};

// 简历上传
const afterReadFile = (file,detail) => {
  // 此时可以自行将文件上传至服务器
  console.log('简历上传：',file,detail);
  let biographicalNotes = file.file;
  let name = detail.name
  console.log("biographicalNotes:",biographicalNotes,detail.name);
  uploadFile(name,biographicalNotes)
};
// 上传接口
const uploadFile = async (name,file) => {
 console.log("name&&file:",name,file);
  const formdata = new FormData();
  formdata.append('file', file);
  // formdata.append('fileName', file.name);
  let params = {fileName:file.name}
  //截取file.name.前面的字
  let fileName = file.name
  console.log("fileName:",fileName);
  const { errno, errmsg,data } = await request.post('/wx/storage/upload?fileName=' + fileName,formdata
  , {
    headers: {
      "Qeeker-Fashion-Token": sessionStorage.getItem('myToken'),
      'Content-Type': 'multipart/form-data'
    }
  }
);
  if (errno == '0') {
    showToast('上传' + errmsg);
    if(name == 'jl'){
      biographicalNotesIds = data.id
      console.log("简历biographicalNotesIds:",biographicalNotesIds);
    }else if(name == 'xl'){
      // 将data.id用|和academicCertificateIds拼接在一起
      if(academicCertificateIds == ''){
        academicCertificateIds = data.id.toString()
      }else{
        academicCertificateIds = academicCertificateIds + '|' + data.id
      }
      console.log("学历academicCertificateIds:",academicCertificateIds);
    }else if(name == 'zyzs'){
      if(professionalCertificateIds == ''){
        professionalCertificateIds = data.id
      }else{
        professionalCertificateIds = professionalCertificateIds + '|' + data.id
      }
      console.log("职业证书professionalCertificateIds:",professionalCertificateIds);

    } else {
      if(proofOfWorkSuccessIds == ''){
        proofOfWorkSuccessIds = data.id
      }else{
        proofOfWorkSuccessIds = proofOfWorkSuccessIds + '|' + data.id
      }
      console.log("工作证明proofOfWorkSuccessIds:",proofOfWorkSuccessIds);
    }
  }else{
    // 获取数据失败提示
    showToast(errmsg);
  }
  loading = false;
};

// 表单提交
const onSubmit = async (values) => {

  console.log("onSubmit", values);
  if(values.headHuntingSex == '男'){
    values.headHuntingSex = 1
  }else if(values.headHuntingSex == '女'){
    values.headHuntingSex = 2
  }
  values.headHuntingPhone = headHuntingPhone
  values.headHuntingMail = headHuntingMail
  values.workExperienceList = []
  let workExperienceObj = {
    workUnit:values.workUnit,
    beginTime:values.beginTime,
    endTime:values.endTime,
    jobName:values.jobName,
    jobDuty:values.jobDuty,
    jobAchievements:values.jobAchievements
  }
  values.workExperienceList.push(workExperienceObj)
  delete values.workUnit
  delete values.beginTime
  delete values.endTime
  delete values.jobName
  delete values.jobDuty
  delete values.jobAchievements
  delete values.uploader
  delete values.headHuntingPhonejm
  delete values.headHuntingMailjm
  values.biographicalNotesIds = biographicalNotesIds
  values.academicCertificateIds = academicCertificateIds
  values.professionalCertificateIds = professionalCertificateIds
  values.proofOfWorkSuccessIds = proofOfWorkSuccessIds
  values = removeEmptyProps(values);
  console.log("处理后的onSubmit", values);



  const {errno, errmsg} = await request.post('/wx/head/hunting/add',values
  , {
    headers: {
      "Qeeker-Fashion-Token": sessionStorage.getItem('myToken'),
    }
  }
  );
  if (errno == 0) {
    // 处理完成后赋值给regionOptions
    // showToast("提交成功");
    // showSuccessToast('提交成功');
    const toast1 = showLoadingToast({
      duration: 0,
      forbidClick: true,
      message: `提交成功\n3 秒`,
    });
    let second = 3;
    const timer = setInterval(() => {
      second--;
      if (second) {
        toast1.message = `提交成功\n ${second} 秒`;
      } else {
        clearInterval(timer);
        closeToast();
        router.push('/recruiter/index')
      }
    }, 1000);
    // 跳转到招聘官列表页

  }else{
    // 提交失败提示
    showToast(errmsg);
  };
};

</script>

<template>
  <!-- <van-nav-bar title="" z-index="2" @click-left="router.back()" left-text="" fixed :border="false">
  </van-nav-bar> -->
  <div class="bg">
    <div class="top-data-group">
      <div class="top-data-group__top">
        <van-row>
          <van-col span="24" class="statusTxt">{{state == 'add' ? '开卡申请' : state == 'show' ? '我的申请' : '开通状态'}}</van-col>
          <van-col span="10" style="display: flex; align-items: center;">
            <div>
              <div class="title">
                <van-image class="myxft" :src="myxft" />
              </div>
            <div class="title">
                <van-image class="myzrkj" :src="myzrkj" />
            </div>
            </div>
          </van-col>
          <van-col span="14">
            <van-image class="myimg" :src="myimg" />
  
          </van-col>
  
        </van-row>
      </div>
  
    </div>
    
    <main class="scrollMain">
      <div class="top-data-group__top" v-if="state =='appliedFor'">
        <van-row class="order-list-item title-group">
          <van-col span="6">
            <div class="list-left">
              <TextAvatar name="王小明" :size="56" :cut-num="2"></TextAvatar>
          </div>
          </van-col>
          <van-col span="18">
            <div>
              <div class="list-userName">您好！王小明</div>
              <div class="list-introduce">您已提交申请，<span> 正在审核中。</span>  </div>
              <p class="check" @click="state = 'add'">查看我的申请<van-icon name="arrow" /></p>
            </div>
          </van-col>
        </van-row>
      </div>
      <div class="top-data-group__top" v-if="state =='appliedFor'">
        <van-row class="order-list-item title-group">
          <van-col span="6">
            <div class="list-left">
              <TextAvatar name="王小明" :size="56" :cut-num="2"></TextAvatar>
          </div>
          </van-col>
          <van-col span="18">
            <div>
              <div class="list-userName">您好！王小明</div>
              <div class="list-introduce">提交的信息有误，<span> 请修改后再次申请。</span>  </div>
              <p class="check" @click="state = 'add'">修改我的申请<van-icon name="arrow" /></p>
            </div>
          </van-col>
        </van-row>
      </div>
      <van-form @submit="onSubmit" @load="loading" label-align="left" v-if=" state != 'appliedFor'">
        <van-cell-group inset class="title-group">
          <van-field v-model="headHuntingName" name="headHuntingName" :readonly="state == 'show'" label="姓名" placeholder="请输入姓名" :rules="[{ required: true, message: '请填写姓名' }]"/>
          <van-field
            v-model="brandName"
            is-link
            readonly
            name="brandName"
            v-if="state == 'add'"
            label="所属公司"
            placeholder="点击选择公司"
            :rules="[{ required: true, message: '请选择公司' }]"
            @click="showBrand = false"
          />
          <van-field
          v-model="headHuntingPhone"
          name="headHuntingPhone"
          readonly
          label="手机号码"
          placeholder="手机号码"
          />
          
          <van-field
          v-model="clientName"
          is-link
          name="headHuntingSex"
           v-if="state == 'add'"
          label="招商I类卡"
          placeholder="点击选择"
          :rules="[{ required: true, message: '请选择' }]"
          @click="showClient = true"
        />
          <van-field v-model="headHuntingMail" name="headHuntingMail" v-if="state == 'add'" :readonly="state == 'show'" label="银行卡号" placeholder="请输入卡号" :rules="[{ required: true, message: '请填写招商银行卡号' }]"/>
          <van-field v-model="headHuntingMail" name="headHuntingMail" v-if="state == 'add'" :readonly="state == 'show'" label="预留手机号" placeholder="请输入银行预留手机号" :rules="[{ required: true, message: '请填写银行预留手机号' }]"/>
          <van-field
            v-model="headHuntingBirth"
            name="headHuntingBirth"
            v-if="state == 'add' && isCard == '1'"
            label="出生日期"
            placeholder="点击选择"
            is-link
            readonly
            @click="showBirth = true"
          />
          <van-field v-model="biographicalNotes" name="biographicalNotes" v-if="state == 'add' && isCard == '1'" :readonly="state == 'show'" label="身份证号码" placeholder="请输入身份证号码" :rules="[{ required: true, message: '请填写身份证号码' }]"/>
  
        </van-cell-group>
        
        <!-- 身份证正反面上传 -->
        <van-cell-group inset class="title-group" v-if="state == 'add' && isCard == '1'">
            <van-field name="uploader" label="身份证正面" label-align="top" v-if="(state == 'show' && fileList.length > 0) || state == 'add'" :rules="[{ required: true, message: '请上传身份证正面照片' }]">
              <template #input>
                <van-uploader v-model="fileList" :deletable="state == 'add'" :preview-size="[200, 95]" accept="" :max-count="state == 'add' ? 1 : fileList.length" name="jl" :after-read="afterReadFile">
                  <div class="van-uploader__file">
                    <van-icon name="plus" />
                    <span>上传身份证人像面</span>
                  </div>
                </van-uploader>
              </template>
            </van-field>
            <van-field name="uploader" label="身份证反面" label-align="top" v-if="(state == 'show' && academicCertificateIdsList.length > 0) || state == 'add'" :rules="[{ required: true, message: '请上传身份证反面照片' }]">
              <template #input>
                <van-uploader v-model="academicCertificateIdsList" :deletable="state == 'add'" :preview-size="[200, 95]" accept="" :max-count="state == 'add' ? 1 : academicCertificateIdsList.length" name="xl" :after-read="afterReadFile">
                <div class="van-uploader__file">
                    <van-icon name="plus" />
                    <span>上传身份证国徽面</span>
                  </div>
                </van-uploader>
              </template>
            </van-field>
        </van-cell-group>
        <div style="margin: 16px; padding-bottom: 50px;" v-if="(state == 'add' || update == true) && status == 0">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
  
    
    </main>
    <footer v-if="state == 'show' && update == false">
      <!-- <van-cell-group inset class="title-group">
        <p>想获取该招聘官完整信息请加入我们</p>
        <p><van-icon name="envelop-o" />：hr@supertexinternational.com</p>
      </van-cell-group> -->
    </footer>
  </div>

  <!-- 选择是否有卡 -->
  <van-popup v-model:show="showClient" position="bottom">
      <van-picker title="请选择" 
          :columns="clientOptions" 
          @confirm="onConfirmshowClient" 
          @cancel="showClient = false"
          :columns-field-names="{text: 'name', value: 'id'}"
      />
  </van-popup>
  <!-- 所属公司下拉框 -->
  <van-popup v-model:show="showBrand" position="bottom">
    <van-picker title="请选择公司" 
      :columns="brandOptions"
      :columns-field-names="{ text: 'name', value: 'id', }"
      @confirm="onConfirmBrand"
      @cancel="showBrand = false"
    />
  </van-popup>
  <!-- 生日 -->
  <van-popup v-model:show="showBirth" position="bottom">
    <van-date-picker @confirm="onBirthConfirm" @cancel="showBirth = false" :min-date="minDate"
    :max-date="maxDate"/>
  </van-popup>
  <!-- 开始时间 -->
  <van-popup v-model:show="showStartTimePicker" position="bottom">
    <van-date-picker @confirm="onStartTimeConfirm" @cancel="showStartTimePicker = false" :min-date="minDate"
    :max-date="maxDate"/>
  </van-popup>
  <!-- 结束时间 -->
  <van-popup v-model:show="showEndTimePicker" position="bottom">
    <van-date-picker @confirm="onEndTimeConfirm" @cancel="showEndTimePicker = false" :min-date="minDate"
    :max-date="maxDate"/>
  </van-popup>
</template>

<style scoped lang="scss">
.bg{
  background: url('@/assets/images/xinfutong/bg.png') no-repeat top center / 100% auto;
  height: 100%;
  overflow-y: auto;
  .statusTxt{
    font-family: 苹方-简;
    font-size: 20px;
    font-weight: bold;
    font-variation-settings: "opsz" auto;
    color: #000000;
      
  }
}
.top-data-group {
  // 固定在顶部，距离顶部100px
  // position: fixed;
  margin-top: 10px;
  // left: 0;
  // right: 0;
  .top-data-group__top {
    border-radius: 4px;
    margin: 0px 0px;
    text-align: center;
    padding: 5px 15px 10px 15px;
    .title{
      padding-left: 10px;
      text-align: left;
      .myxft{
        width: 100%;
        max-width: 72px;
      }
      .myzrkj{
        width: 100%;
        max-width: 109px;
      }
      .myimg{
        width: 100%;
        max-width: 203px;
      }
    }
    p{
      font-size: 16px;
    }
    .goAuthentication{
      display: flex;
      align-items: center;
      justify-content: right;
      .text{
        text-align: right;

      }
    }
    
  }
  &.bgImg{
    margin-bottom: 15px;
    background-image: url('@/assets/images/zpg_bg.png'); /* 使用相对路径 */
    background-size: cover; /* 背景图片覆盖整个元素 */
    background-position: top; /* 背景图片居中 */
    background-repeat: no-repeat; /* 背景图片不重复 */

  }
}
.order-list-item {
  padding-top: 40px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;

  // margin-bottom: 5px;
  margin: 0 20px;
  // border-bottom: 1px solid #eee;
  background: fixed #fff;

  font-size: 12px;
  .list-left{
    position: relative;
    display: flex;
    justify-content: center;
    text-align: center;
    .profileIcon{
      position: absolute;
      bottom: 8px;
      right: 23px;
    }
  }
  .list-right{
    text-align: left;
    display: flex;
    align-items: center;


  }
  .list-userName{
    font-size: 18px;
    font-weight: 600;
  }
  .list-introduce{
    font-size: 14px;
    span{
      color: #FF5C1B;

    }
  }
  .check{
    margin: 20px auto;
    font-size: 14px;
    color: #0074FF;
  }
}
.scrollMain {
  // height: calc(100vh - 210px);
  height: auto;
  overflow-y: inherit;
  position: inherit;
  // top: 145px;
  width: 100%;
  padding-bottom: 15px;
  .title-group{
    position: relative;
    margin-bottom: 20px;

    .van-uploader__preview-cover{
      // position: absolute;
      .preview-cover{
        position: absolute;
        bottom:-5px;
        text-align :  center;
        width: 100%;
        margin-top:5px;
        background-color: rgba(0, 0, 0, .3);
        font-size: 12px;
        a{
          color: #1989fa;
        }


      }
    }
    .van-uploader__file{
      width: 100%!important;
      padding: 50px;
      border: 1px dashed #ddd;
      span{
        font-size: 12px;
      }

    }
    
  }
  .title{
    font-size: 18px;
    color: #333;
    font-weight: 600;
  }
}
.van-uploader__wrapper{ 
  width: 100%!important;
  display: inline-block;
}
.van-field__body{
  width: 100%!important;
  display: inline-block;
}
.btn-group {
  display: flex;
  margin: 16px;
  justify-content: center;
  align-items: center;
}
footer{
  padding-bottom: 20px;
  .title-group{
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #eee;
    background: #eee;

    p{
      text-align: center;
    }
  }
}
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .block {
    width: 120px;
    height: 120px;
    background-color: #fff;
  }
  .van-overlay{
    position: absolute;
    top: 30px;
    backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, .3);

  }
  .overlay{
    padding: 10px;
  }
</style>