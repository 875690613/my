<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
let detailData = $ref({});
const router = useRouter();

onMounted(() => {
    document.title = '品牌授权'
    detailData = JSON.parse(localStorage.getItem('projectDetail'));
});

const onClickLeft = () => {
    router.push('/myProject');
}
</script>

<template>
    <div style="padding: 10px 12px; background-color: #f5f5f5; height: 100vh; box-sizing: border-box;">
        <van-nav-bar title="品牌授权-详情" fixed :border="false" left-arrow left-text="返回" @click-left="onClickLeft" />
        <van-row style="margin-bottom: 10px; margin-top: 60px;">
            <van-col span="24">
            <span style="font-size: 16px;">项目编号：{{ detailData.code }}</span>
            </van-col>
        </van-row>
        <van-row style="background-color: white; padding: 10px;">
        <van-col span="24">
          品牌：{{ detailData.brand }}
        </van-col>
        <van-col span="24">
          安排日期：{{ detailData.scheduleTime }}
        </van-col>
        <van-col span="24">
          订单类型：{{ detailData.category }}
        </van-col>
        <van-col span="24">
          阶段：{{ detailData.stage }}
        </van-col>
        <van-col span="24">
          指派员工：{{ detailData.appointStaff }}
        </van-col>
        <van-col span="24">
          状态：{{ detailData.status == 1 ? '进行中' : '已完成' }}
        </van-col>
      </van-row>
    </div>
</template>
<style scoped>
.van-col {
    font-size: 12px;
}
</style>