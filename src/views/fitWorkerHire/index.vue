<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import request from '@/utils/request';
import myImage from '@/assets/images/avatar_1.png';
import {removeEmptyProps} from '@/utils/common';

document.title = '试衣工招聘';

const router = useRouter();

let listData = $ref([
  {
    jobId :  0,
    jobName: '试穿模特（接受小白）',
    provideSalaryString: '4K-6K/月',
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
    provideSalaryString: '6K-9K/月',
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
    provideSalaryString: '15K-25K/月',
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
let loading = $ref(false);
let finished = $ref(false);
let refreshing = $ref(false);

const onLoad = () => {
  console.log('onLoad...')
  queryParams.page++;
  // getData();
}

const onRefresh = () => {
  console.log('onRefresh...')
  listData = [];
  queryParams.page = 1;
  getData();
}

const queryParams = reactive({
  page: 0,
  limit: 10,
  keyword: null
});

const goBrandSeriesDetail = (item) => {
  console.log("item:",item);
  router.push({ name: "hireDetail", query: { id: item.jobId} });
};

onMounted(() => {
});

// 请求接口获取列表数据
const getData = async () => {
  // loading = true;
  const params = removeEmptyProps(queryParams);
  const { code, rows, total } = await request.post('/api/myStyle/brandSeriesList', params);
  if (code == 200) {
    // 计算finished
    // finished = rows.length < queryParams.limit;
    // 合并数据
    // listData = listData.concat(rows);
  } else {
    // 获取数据失败提示
    showToast("获取数据失败");
  }
  loading = false;
  refreshing = false;
};
// 获取客户选项列表
const getClientList = async () => {
    const { code, rows } = await request.get('/api/sys/getClient');
    
    if (code == 200) {
      clientOptions = rows;
        
    } else {
        showToast("获取客户列表失败");
    }
};


</script>

<template>
  <van-nav-bar left-arrow @click-left="router.back()" title="招聘" fixed :border="false"></van-nav-bar>
  <main class="scrollMain">
    <div class="hot">热招职位</div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list @load="onLoad" class="order-list">
        <van-row class="order-list-item" v-for="(item, index) in listData" :key="item.Id" @click="goBrandSeriesDetail(item)">
          <van-col span="18">
            <h3 class="jobName"> {{item.jobName}} </h3>
          </van-col>
          <van-col span="6">
            <h3 class="provideSalaryString">{{ item.provideSalaryString }}</h3>
          </van-col>
          <van-col span="24"> <p class="brandName"> {{item.brandName}} </p></van-col>
          <van-col span="24">
            <p>
              <van-tag :type="index == 0 ? 'primary' : index == 1 ? 'success' : index == 2 ? 'warning' :'danger'" v-for="(item1, index) in item.jobLabels" :key="item.jobId">{{ item1 }}</van-tag>
            </p>
          </van-col>
          <van-col span="24">
            <van-row>
              <van-col span="24">
                <div><van-text-ellipsis rows="3" :content="item.jobDescribe" /></div>
              </van-col>
              <van-col span="18">
                 <p class="hrName">
                  <van-image
                    round
                    width=".5rem"
                    height=".5rem"
                    :src="myImage"
                  />
                  <span class="hrNameTxt">{{ item.hrName }}·{{ item.bossTitle }}</span>
                 </p>
              </van-col>
              <van-col span="6">
                 <p class="cityName">
                  {{ item.cityName }}
                 </p>
              </van-col>
            </van-row>
          </van-col>
          
        </van-row>
      </van-list>
    </van-pull-refresh>
  </main>
</template>

<style scoped lang="scss">
.scrollMain {
  height: calc(100vh - 80px);
  overflow-y: auto;
  position: absolute;
  // top: 155px;
  width: 100%;
  .hot{
    font-size: 16px;
    padding: 0 20px;
  }
  .order-list {
    padding: 0 20px;
    .order-list-item {
      margin-bottom: 5px;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      font-size: 12px;
      h3{
        font-weight: bold;
        &.jobName{
          font-size: 16px;
        }
        &.provideSalaryString{
          text-align: right;
          color: #00bebd;
        }
      }
      p{
        width: 100%;
        margin: 3px 0px;
        color: #999;
        &.brandName{
          font-size: 14px;
          // color: #999;
        }
        &.hrName{
          font-size: 14px;
          display: flex;
          align-items: center;
          margin-top: 10px;
          
        }
        .hrNameTxt{
          margin-left: 5px!important;
          display: inline-block!important;
        }
        &.cityName{
          margin-top: 10px;
          font-size: 14px;
          text-align: right;
          // display: flex;
          align-items: right;

        }
        .van-tag{
          display: inline-block;
          margin: 0 5px 0 0;
        }
      }
    }
  }
}

</style>
