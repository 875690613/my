<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import request from '@/utils/request';
import {removeEmptyProps,generatehashcode} from '@/utils/common';
import { v4 as uuidv4 } from 'uuid';
const uuid = uuidv4();
document.title = '申请员工证';

const router = useRouter();
let loading = $ref(false)
let statusType = $ref()
let userInfo = $ref({});
let photoFile = $ref('');
let qrcode = $ref('');//二维码
let upLoadPhoto = $ref('');
let orgId = $ref('');
const fileList = $ref([]);
const photos = $ref([]);
const files = $ref();
const phone = $ref(sessionStorage.getItem('userPhone') || '',);
const uploadfileData = $ref(
  {
    hashcode: [] // 文件生成的hashcode
  }
);
let show = $ref(false);


const onLoad = () => {
  console.log('onLoad...')
  getData();
  getBalanceOrOverdue()
}

const onRefresh = () => {
  console.log('onRefresh...')
  userInfo = {};
  getData();
}

const queryParams = reactive({
  phone: phone
});

const goOrderDetail = (orgId) => {
  router.push({ name: "myGroupDetail", query: { id: orgId, } });
};

onMounted(() => {
  getData();
 
});

// 请求接口获取员工信息数据
const getData = async () => {
  loading = true;
  const params = removeEmptyProps(queryParams);
  const { status, data, message} = await request.get('/api/oa/user/apply/card/getUserInfoByPhone', params, {
    headers: {
      Authorization: sessionStorage.getItem('myToken')
    }
  });
  if (status == 200) {
    // 计算finished
    // finished = rows.length < queryParams.limit;
    // 合并数据
    orgId = data.orgId
    userInfo = data
    //如果有照片id就获取照片，说明申请通过了
    if (userInfo.photoId) {
        // 如果员工证申请通过则清除缓存头像
        localStorage.removeItem('photoFile')
        localStorage.removeItem('ids')
        getPhotoFile()//获取头像
    }else{
      let localPhotoFile = localStorage.getItem('photoFile')
      // 如果有缓存头像就显示缓存头像
      if(localPhotoFile){
        photoFile = localPhotoFile
        // console.log("缓存中获取photoFile:",photoFile);
      }
    }
  } else {
    // 获取数据失败提示
    showToast(message);
    sessionStorage.clear();
    router.push('/myGroup/nav');
  }
  loading = false;
};

// 获取员工头像
const getPhotoFile = async () => {
  // const params = removeEmptyProps(userInfo);
  const params = {
    // photoFileId: userInfo.photoId
  }
  const res = await request.get('/api/admin/baseFile/showPic/'+ userInfo.photoId,params, {
    headers: {
      Authorization: sessionStorage.getItem('myToken')
    }
  });
  photoFile ='data:image/jpeg;base64,'+ res;
};
const showPopup = () => {
  show = true;
};
// 获取员工二维码
const getQrcode = async () => {
  // const params = removeEmptyProps(userInfo);
  const params = {
    // photoFileId: userInfo.photoId
  }
  const data = await request.get('/api/oa/personnelArchives/qrcode',params, {
    headers: {
      Authorization: sessionStorage.getItem('myToken')
    }
  });
  // qrcode ='data:image/jpeg;base64,'+ res;
  qrcode = data.data;
  show = true;
};
// 上传头像前处理
const beforeRead = (file) => {
  console.log("上传头像前处理:",file);
  if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
    showToast('请上传 jpg、jpeg、png 格式图片');
    return false;
  }
  return true;
};
const afterRead = async (file) => {
  console.log("上传file:",file,file.content);
  //将file.content 放在缓存photoFile中
  localStorage.setItem('photoFile', file.content)
  uploadfileData.files = files
  fileList.forEach(v=> {
    let o = {
        base64Str: v.content,
        filename: v.file.name
    }
    photos.push(o)
})
  console.log("photos:",photos);
  // 把file.content转成binary
  const binary = await base64ImgtoFile(file.content, file.name)
  uploadPhone(binary)
}
// 上传接口
const uploadPhone = async (file) => {
  const params = removeEmptyProps(queryParams);
  // const hashcode = await generatehashcode(file);
  // 把uploadfileData包装成FormData
  const formdata = new FormData();
  formdata.append('files', file);
  formdata.append('hashcode', uuid)
  
  const { result, fileNames,msg,ids } = await request.post('/api/admin/baseFile/upload', formdata, {
    headers: {
      Authorization: sessionStorage.getItem('myToken'),
      'Content-Type': 'multipart/form-data'
    }
  });
  if (result == 'success') {
    upLoadPhoto = fileNames[0]
    localStorage.setItem('ids', ids[0])
    console.log("上传成功:",upLoadPhoto);
    // 获取员工信息
    // getData();
  } else {
    // 获取数据失败提示
    showToast(msg);
  }
  loading = false;
};

// base64转文件
const base64ImgtoFile = async (dataurl, filename = 'file') => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const suffix = mime.split('/')[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
}
// 申请员工证
const applyCard = async () => {
  // if(userInfo.photoId == null || userInfo.photoId == '' || userInfo.photoId == undefined){
  if(userInfo.photoId == undefined){
    if(upLoadPhoto == '' ){
      showToast("请上传员工照片");
      return false;
    }
  }
  userInfo.photoId = localStorage.getItem('ids')
  const params = removeEmptyProps(userInfo);
  const {status, message,rows} = await request.post('/api/oa/user/apply/card/add',params, {
    headers: {
      Authorization: sessionStorage.getItem('myToken')
    }
  });
  if (status == 200) {
    // 处理完成后赋值给regionOptions
    showToast("申请成功");
    statusType = true
    getData()
  } else {
    // 申请失败提示
    showToast(message);
  }
};

const onClickLeft = () => {
  let token = sessionStorage.getItem('myToken')
  console.log("token:",token);
  if(token){
    console.log('1111111111');
    // 跳转到nav页面
    router.push('/myGroup/nav');
  }else{
    console.log('2222222222');
    router.back()
  }
};
</script>

<template>
  <div class="bg">
    <van-nav-bar left-arrow left-text="返回"  @click-left="onClickLeft" title="入职查询" fixed :border="false"></van-nav-bar>
    <div class="top-data-group">
      <van-row  class="top-data-group__top">
        <van-col span="19" class="statusTxt">
          <div>
            <div class="userName">{{ userInfo.userName }}</div>
            <p>入职2年8个月</p> 
            <p>2次入职逐日集团</p>
          </div>
        </van-col>
        <van-col span="5" style="display: flex; align-items: center;">
          <van-image class="myLogo" :src="photoFile" />
        </van-col>
          
      </van-row>
      <van-row class="list-row">
        <van-col span="24" class="list-row__item"><div class="title">员工信息</div></van-col>
        <van-col span="24">
          <van-row>
            <van-col span="6">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</van-col>
            <van-col span="18">{{ userInfo.userName }}</van-col>
          </van-row>
        </van-col>
        <van-col span="24">
          <van-row>
            <van-col span="6">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</van-col>
            <van-col span="18">{{ userInfo.deptName }}</van-col>
          </van-row>
        </van-col>
        <van-col span="24">
          <van-row>
            <van-col span="6">手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机：</van-col>
            <van-col span="18">{{ userInfo.phone }}</van-col>
          </van-row>
        </van-col>
        <van-col span="24">
          <van-row>
            <van-col span="6">民&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;族：</van-col>
            <van-col span="18">{{ userInfo.deptName }}</van-col>
          </van-row>
        </van-col>
        <van-col span="24">
          <van-row>
            <van-col span="6">籍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贯：</van-col>
            <van-col span="18">{{ userInfo.deptName }}</van-col>
          </van-row>
        </van-col>
        <van-col span="24">
          <van-row>
            <van-col span="6">学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;历：</van-col>
            <van-col span="18">{{ userInfo.deptName }}</van-col>
          </van-row>
        </van-col>
        <van-col span="24">
          <van-row>
            <van-col span="6">邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱：</van-col>
            <van-col span="18">{{ userInfo.deptName }}</van-col>
          </van-row>
        </van-col>
        <van-col span="24">
          <van-row>
            <van-col span="6">部&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;门：</van-col>
            <van-col span="18">{{ userInfo.deptName }}</van-col>
          </van-row>
        </van-col>
        <van-col span="24">
          <van-row>
            <van-col span="6">职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位：</van-col>
            <van-col span="18">{{ userInfo.jobName }}</van-col>
          </van-row>
        </van-col>
        <van-col span="24">
          <van-row>
            <van-col span="6">享有年假：</van-col>
            <van-col span="18">{{ userInfo.userName }}</van-col>
          </van-row>
        </van-col>
        <!-- <van-col span="24">
          <van-row>
            <van-col span="6">合同描述：</van-col>
            <van-col span="18">君子食无求饱,居无求安,敏于事而
              慎于言,就有道而正焉,可谓好学也已。</van-col>
          </van-row>
        </van-col> -->
        <!-- <van-col span="24">
          <van-row>
            <van-col span="6">办&nbsp;&nbsp;公&nbsp;&nbsp;地：</van-col>
            <van-col span="18">{{ userInfo.workspace }}</van-col>
          </van-row>
        </van-col>
        <van-col span="24">
          <van-row>
            <van-col span="6">工&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</van-col>
            <van-col span="18">{{ userInfo.staffNo }}</van-col>
          </van-row>
        </van-col> -->
       
      </van-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
.van-nav-bar{
  background: #ffffff00;
}
.bg{
  background-color: #EDF6FF;
  background-image: url('@/assets/images/myGroup/bg_top.png'),url('@/assets/images/myGroup/loginBg.png');// no-repeat top center / 100% auto
  background-position: top, bottom; /* 每张图片的位置 */
  background-repeat: no-repeat, no-repeat; /* 每张图片的重复方式 */
  background-size: contain, contain; /* 每张图片的大小 */
  height: 100%;
  overflow-y: auto;
  padding-top: 46px;
}
.top-data-group {
  padding-top: 28px;
  .top-data-group__top {
    margin: 0px 16px 15px 16px;
    padding: 20px;
    text-align: center;
    font-size: 16px;
    color: #333;
    border-radius: 10px;
    background: linear-gradient(180deg, #E6F4FF 0%, #FFFFFF 99%);
    box-sizing: border-box;
    border: 3px solid #FFFFFF;
    box-shadow: 0px 10px 30px 0px rgba(198, 211, 226, 0.6);
    display: flex;
    justify-content: space-around;


    div{
      // font-weight: bold;
      font-family: 苹方-简;
    }
    .statusTxt{
      display: flex;
      align-content: center;
      text-align: left;
      justify-content: center;
      flex-direction: column;

      .userName{
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 5px;
      }
      p{
        font-size: 14px;
      }
    }
    .myLogo{
      width: 100%;
      max-width: 66px;
      max-height: 82px;
      overflow: hidden;
      border-radius: 4px;
      // margin-right: 12.5px;
    }
  }
}


.btn-group {
  display: flex;
  margin: 16px;
  justify-content: center;
  align-items: center;
}
.list-row{
  background: #fff;
  box-shadow: 0px 10px 30px 0px rgba(198, 211, 226, 0.6);
  border-radius: 10px;
  height: 100%;
  margin: 0px 16px 15px 16px;
  padding: 20px;
  .title{
    font-family: 苹方-简;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  //文字两端对齐
  text-align: justify;
  .van-col{
    margin-bottom: 2px;
  }
}
.van-image{
  height: 120px!important;
}
.van-uploader__upload{
  height: 140px!important;

}
</style>
