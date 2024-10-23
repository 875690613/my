<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

// import VConsole from 'vconsole';
// const vConsole = new VConsole();

const router = useRouter();

document.title = '授权店铺'

let listData = $ref([]);

onMounted(() => {
  listData = JSON.parse(localStorage.getItem('shopBranchList'));
});

const onClickLeft = () => {
  localStorage.removeItem('shopBranchList');

  router.push('/brandAuth/brandAuthList');
}

</script>

<template>
  <van-nav-bar title="授权店铺" fixed :border="false" left-arrow left-text="返回" @click-left="onClickLeft">
  </van-nav-bar>
  <main class="scrollMain">
    <van-empty description="暂无数据" v-show="listData.length === 0"></van-empty>
    <van-list class="order-list">
      <van-cell-group class="order-list-item" v-for="item in listData" :key="item.id" inset>
        <van-row>
          <van-col span="24">
            店铺名称：{{ item.shopName }}
          </van-col>
          <van-col span="24">
            店长：{{ item.shopOwner }}
          </van-col>
          <van-col span="24">
            店长电话：{{ item.ownerPhone }}
          </van-col>
          <van-col span="24">
            地址：{{ item.address }}
          </van-col>
          <van-col span="24">
            经营描述：{{ item.businessDescription }}
          </van-col>
          <van-col span="24">
            经营范围：{{ item.businessScope }}
          </van-col>
          <van-col span="24">
            负责人：{{ item.commander }}
          </van-col>
          <van-col span="24">
            负责人联系电话：{{ item.commanderPhone }}
          </van-col>
        </van-row>
      </van-cell-group>
    </van-list>
  </main>  
</template>

<style scoped>
.scrollMain {
  background-color: #f5f5f5;
}
.order-list {
}
.order-list-item {
  margin-top: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 12px;
  padding: 15px;
}
.btn-group {
  display: flex;
  margin: 16px;
  justify-content: center;
  align-items: center;
}
</style>
