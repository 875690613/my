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
    router.push('/myGroup/loginCode');
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


</script>

<template>
  <van-nav-bar left-arrow left-text="返回"  @click-left="router.back()" title="申请员工证" fixed :border="false"></van-nav-bar>
    <div class="top-data-group">
      <div class="top-data-group__top" @click="goOrderDetail(orgId)">
        {{ userInfo.orgName }}<span style="color: #1989fa; margin-left: 3px;"><van-icon name="arrow-double-right" /></span>
      </div>
      <div style="display: flex; justify-content: space-around;">

        <!-- <van-image
        v-if="userInfo.photoId !=null && userInfo.photoId != '' && userInfo.photoId != undefined"
        width="100"
        height="150"
        :src="photoFile"
        /> -->
        <van-image
        v-if="photoFile"
        width="100"
        height="150"
        :src="photoFile"
        />
        <van-uploader v-if="photoFile == null || photoFile == '' || photoFile == undefined" v-model="fileList" preview-size="100px" reupload="true" max-count="1" :after-read="afterRead" :before-read="beforeRead"/>
      </div>
      <van-row class="list-row">
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
            <van-col span="6">员工名称：</van-col>
            <van-col span="18">{{ userInfo.userName }}</van-col>
          </van-row>
        </van-col>
        <van-col span="24">
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
        </van-col>
       
      </van-row>
      <div style="margin: 16px;">
            <van-button round block type="primary" :disabled="statusType == true || userInfo.status != undefined" v-if="userInfo.hasCard == false" @click="applyCard">
            <span v-if="userInfo.status == undefined">申请员工证</span>
            <span v-if="userInfo.hasCard == false && userInfo.status == 0">待审核{{ statusType }}</span>
            <span v-if="userInfo.hasCard == false && userInfo.status == 1">审核通过</span>
            <span v-if="userInfo.hasCard == false && userInfo.status == 2">审核拒绝</span>
            <span v-if="userInfo.hasCard == false && userInfo.status == 3">审核中</span>

            </van-button>
            <van-button round block disabled type="primary" v-if="userInfo.hasCard == true">
            已申请过了
            </van-button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.top-data-group {
  // 固定在顶部，距离顶部100px
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  .top-data-group__top {
    // background-color: #1989fa;
    padding: 10px 15px 15px 15px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
}


.btn-group {
  display: flex;
  margin: 16px;
  justify-content: center;
  align-items: center;
}
.list-row{
  padding: 20px 20px;
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
