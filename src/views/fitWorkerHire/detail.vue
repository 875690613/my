<script setup>
import { onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router'
import myImage from '@/assets/images/avatar_1.png';
import request from '@/utils/request';
const router = useRouter()
document.title = '招聘详情';

let loading = $ref(false)

let orderId = $ref()
let regionId = $ref()
let colorId = $ref()
let listData = $ref([
  {
    jobId :  0,
    jobName: '试穿模特（接受小白）',
    provideSalaryString: '350元/天',
    brandName: "江阴逐日信息科技有限公司",
    jobDegree :  "高中",
    jobExperience :  "经验不限",
    jobLabels:["经验不限", "高中"],
    jobTags:"无需经验,兼职,居家,日结,时间自由,多劳多得,弹性工作,在家办公,工作简单,绩效奖金,专业培训,零食下午茶",
    jobDescribe:[
      "1. 展示服装及配饰，为观众提供时尚搭配灵感",
      "2. 参与时尚活动，提升品牌形象",
    ],
    termStr :  "兼职",
    hrName :  "徐女士",
    bossTitle: "人事经理",
    bossAvatar :  myImage,
    bossName :  "闫先生",
    status: '招聘中',
    cityName :  "江阴市",
    skills :  ["包住", "抖音", "模特", "弹性工作制", "普通话流利", "服装鞋履"],
    jobRequirements:  [
      "1.喜欢女装，会搭配，五官端正，气质好，身高160到175cm，体重85到120斤，穿版好看", 
      "2.镜头感强，口齿清晰，配合主播穿版，有模特或者舞蹈基础优先", 
      "3.协助直播间衣物搭配，做好开播前准备工作，以及下播后整理工作", 
      "4.可接受小白 应届毕业生", 
      "5.免费培训，通过后可作为主播职位培养", 
    ],
    welfareList :  ["保底工资", "有无线网", "零食下午茶", "绩效奖金", "带薪年假", "底薪加提成", "团建聚餐", "工龄奖"],
    updateDateTime: "2025-01-20 11:48:45",
  },
  {
    jobId :  1,
    jobName: '试衣模特',
    brandName: "江阴逐日信息科技有限公司",
    provideSalaryString: '500元/天',
    jobDegree :  "本科",
    jobExperience :  "经验不限",
    jobLabels:["1-2年", "大专"],
    jobTags:"无需经验,兼职,居家,日结,时间自由,多劳多得,弹性工作,在家办公,工作简单,绩效奖金,专业培训,零食下午茶",
    jobDescribe:[
      "1、根据开发进度需求，配合设计师、版师进行穿衣、过版工作;",
      "2、有较高的鉴赏水平，能能准确表述出新版上身后的问题及提出合理的建议;",
      "3、服从安排，责任心强，善于沟通，有良好的职业操守和团队精神。",
    ],
    termStr :  "兼职",
    hrName :  "徐女士",
    bossAvatar :  myImage,
    bossTitle: "人事经理",
    bossName :  "闫先生",
    status: '招聘中',
    cityName :  "江阴市",
    skills :  ["包住", "抖音", "模特", "弹性工作制", "普通话流利", "服装鞋履"],
    jobRequirements:  [
      "1、性格活泼、融入度高", 
      "2、对服装有较强兴趣，配合度高", 
      "3、身高168cm-172cm，体型良好", 
      "4、体重55-57.5kq，肩宽39-40、胸围82-86、腰围70-72、臀围92-94,腿围52-54，臂长62-63（虎口）臂围30-31",  
    ],
    welfareList :  ["保底工资", "有无线网", "零食下午茶", "绩效奖金", "带薪年假", "底薪加提成", "团建聚餐", "工龄奖"],
    updateDateTime: "2025-01-20 11:48:45",
  },
  {
    jobId :  2,
    jobName: '服装试衣模特',
    brandName: "江阴逐日信息科技有限公司",
    provideSalaryString: '680元/天',
    jobDegree :  "研究生",
    jobExperience :  "经验不限",
    jobLabels:["1-3年", "本科", "模特", "服装"],
    jobTags:[
      "1.为公司开发的样衣、大货产前版衣及搭配过程中的试穿，对穿着体验、舒适度等提出个人意见。",
      "2. 跟进设计师头版和复版的样衣跟进，样衣整理和完成资料的登记。",
      "3.根据设计部提供的版单资料按要求拍照留底存档。",
      "4.设计版单的跟进、服装归还，搭配衣物整理，领导交代的其他文职工作。",
    ],
    jobDescribe:[
      "1.为公司开发的样衣、大货产前版衣及搭配过程中的试穿，对穿着体验、舒适度等提出个人意见。",
      "2. 跟进设计师头版和复版的样衣跟进，样衣整理和完成资料的登记。",
      "3.根据设计部提供的版单资料按要求拍照留底存档。",
      "4.设计版单的跟进、服装归还，搭配衣物整理，领导交代的其他文职工作。",
    ],
    termStr :  "兼职",
    hrName :  "徐女士",
    bossTitle: "人事经理",
    bossAvatar :  "@/assets/images/avatar_1.png",
    bossName :  "闫先生",
    status: '招聘中',
    cityName :  "江阴市",
    skills :  ["包住", "抖音", "模特", "弹性工作制", "普通话流利", "服装鞋履"],
    jobRequirements:  [
      "1.有基础文职或服装穿版经验，有设计跟单工作优先", 
      "2.身高162-164，体重92-96", 
      "3.体态匀称，气质佳，对样衣存在问题，能真诚大胆提出自己看法", 
      "4.能熟悉使用办公应用软件 Word、Excel、PPT 等", 
      "5.热爱服装行业；工作认真、踏实，有责任心，服从工作安排", 
    ],
    welfareList :  ["保底工资", "有无线网", "零食下午茶", "绩效奖金", "带薪年假", "底薪加提成", "团建聚餐", "工龄奖"],
    updateDateTime: "2025-01-20 11:48:45",
  },
]);

let detailData = $ref(null)
let id = $ref()
id = router.currentRoute.value.query.id
watchEffect(() => {
  orderId = router.currentRoute.value.query.id
  regionId = router.currentRoute.value.query.regionId || 0
  colorId = router.currentRoute.value.query.colorId
})

// 获取详情数据
const getData = async () => {
  //过滤出listData中的id与当前路由的id相同的数据
  detailData = listData.find(item => item.jobId == id)
  console.log("detailData:",detailData);
}

onMounted(() => {
  getData();
})
</script>

<template>
  <van-nav-bar title="招聘详情" fixed :border="false" left-arrow left-text="返回" @click-left="router.back()" />
  <main class="scrollMain">
    <div v-if="loading" class="loading-wrap">
      <van-loading>加载中...</van-loading>
    </div>
    <template v-else-if="detailData">
      <van-row class="order-info">
        <van-col span="24">
          <van-row class="jobName-wrap">
            <van-col span="18">
                <h3 class="jobName">{{ detailData.jobName }}</h3>
            </van-col>
            <van-col span="6">
              <h3 class="provideSalaryString">{{ detailData.provideSalaryString }}</h3>
            </van-col>

          </van-row>
        </van-col>
        <van-col span="24">
          <p>
            <van-icon name="location-o" />{{ detailData.cityName }}
            <van-tag v-for="(item,index) in detailData.jobLabels" :key="item.jobId" :type="index == 0 ? 'primary' : index == 1 ? 'success' : index == 2 ? 'warning' :'danger'">{{ item }}</van-tag>
          </p>
        </van-col>
        <van-col span="24">
          <van-row>
            <van-col span="6" class="myImage">
              <p class="hrName">
                <van-image
                  round
                  width="1rem"
                  height="1rem"
                  :src="myImage"
                />
              </p>
            </van-col>
            <van-col span="18">
              <p class="cityName">
                <span class="hrNameTxt">{{ detailData.hrName }}·{{ detailData.bossTitle }}</span>
                <!-- {{ detailData.cityName }} -->
              </p>
              <p class="cityName">
                {{ detailData.brandName }}
              </p>
            </van-col>
          </van-row>
        </van-col>
        <van-col span="24">
          <h3 class="detail">职位详情</h3>
        </van-col>
        <van-col span="24">
          岗位要求：
          <div class="jobDescribe">
            <div v-for="item in detailData.jobDescribe" :key="item.jobId">{{ item }}</div>
          </div>
          <div class="jobDescribe">
            职位描述：<div v-for="item in detailData.jobRequirements" :key="item.jobId">{{ item }}</div>
          </div>
        </van-col>
        
      </van-row>
      <div class="email-wrap">
        <p class="email">有报名意向者可发送模卡及作品至邮箱<br><van-icon name="envelop-o" />：hr@supertexinternational.com</p>
      </div>
    </template>
  </main>
</template>

<style scoped lang="scss">
.loading-wrap{
  text-align: center;
}
.jobName-wrap{
  display: flex;
  align-items: end;
}
.order-info {
  margin-bottom: 5px;
  padding: 25px;
  border-bottom: 1px solid #eee;
  h3{
    font-weight: bold;
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;
    &.provideSalaryString{
      color: #00bebd;
    }
    &.detail{
      margin: 15px 0px;
    }
  }
  .myImage{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  p{
    margin: 5px 0px;
    // color: #999;
    &.hrName{
      font-size: 1px;
      display: flex;
      align-items: center;
      // margin-top: 10px;
      
    }
    .hrNameTxt{
      margin-left: 5px!important;
      display: inline-block!important;
    }
    &.cityName{
      // margin-top: 10px;
      font-size: 16px;
      text-align: left;
      // display: flex;
      // align-items: right;

    }
    .van-tag{
      display: inline-block;
      margin: 0 5px;
    }
  }
  .jobDescribe{
    margin-bottom: 15px;
  }
}
.order-info .van-col {
  font-size: 14px;
}
.van-action-bar{
  background: #eee;
}
.email{
  text-align: center;
  padding: 10px 20px;
}
.van-col--24{
  margin-bottom: 5px;
}
</style>
