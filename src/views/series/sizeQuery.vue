<script setup>
import { onMounted, watchEffect, reactive } from "vue";
import { useRouter } from "vue-router";
import request from '@/utils/request';
import { showToast } from "vant";
const router = useRouter();

let orderId = $ref()
watchEffect(() => {
  orderId = router.currentRoute.value.query.id
})

const queryParams = reactive({
  limit: 10,
  page: 1,
  id: orderId,
  stageId: null
})

let stageName = $ref('');
let showSizePicker = $ref(false)

// 指令阶段数据
let stageList = $ref([])

// 尺寸表
let listData = $ref([])

let showPicker = $ref(false)

const fieldNames = {
  text: 'name2',
  value: 'id',
}

let sizeList = $ref([]);

// picker选择器确认
const onConfirm = ({selectedOptions}) => {
  const item = selectedOptions[0];
  stageName = item.name2;
  queryParams.stageId = item.id;
  showPicker = false;
}

// 选择尺寸确认
const onConfirmSize = ({selectedValues}) => {
  queryParams.size = selectedValues[0];
  showSizePicker = false;
}

// 获取指令阶段选项数据
const getOrderStage = async () => {
  const params = {
    id: orderId
  }
  const { code, rows, msg, success } = await request.get('/api/myStyle/getOrderStage', params);
  if (code === 200 || success === true) {
    stageList = rows
  } else {

  }
}

// 尺寸表查询
const getData = async () => {
  const { code, rows, msg } = await request.post('/api/myStyle/sizeQuery', queryParams)
  if (code === 200) {
    if (rows.length === 0) {
      showToast({
        message: '暂无数据',
        className: 'custom-toast',
      })
    } else {
      showToast({
        message: '查询成功',
        className: 'custom-toast',
      })
    }
    listData = rows;
  }
}

// 查询方法
const onSubmit = (values) => {
  console.log(values);
  // 发送请求
  getData()
}

onMounted(() => {
  getOrderStage()
  getSizeList()
})

// 获取尺寸表选项
const getSizeList = async () => {
  const params = {
    id: orderId
  }
  const res = await request.get('/api/myStyle/getSize', params);
  const { code, rows } = res;
  if (code == 200) {
    sizeList = rows.map(i => {
      return {
        text: i,
        value: i
      }
    });
  }
}

</script>

<template>
  <van-nav-bar title="尺寸表查询" fixed :border="false" left-arrow left-text="返回" @click-left="router.back()" />
  <main class="scrollMain">
    <!-- 查询 -->
    <div class="query-wrap">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="stageName"
            is-link
            readonly
            name="stageId"
            label="指令阶段"
            placeholder="点击选择指令阶段"
            @click="showPicker = true"
          />
          <van-popup v-model:show="showPicker" position="bottom">
            <van-picker
              :columns="stageList"
              :columns-field-names="fieldNames"
              @confirm="onConfirm"
              @cancel="showPicker = false"
            />
          </van-popup>
          <van-field
            v-model="queryParams.size"
            is-link
            readonly
            name="size"
            label="尺寸"
            placeholder="选择尺寸"
            @click="showSizePicker = true"
          />
          <van-popup v-model:show="showSizePicker" position="bottom">
            <van-picker
              :columns="sizeList"
              @confirm="onConfirmSize"
              @cancel="showSizePicker = false"
            />
          </van-popup>
        </van-cell-group>
        <div style="margin: 16px;" class="btn-wrap">
          <van-button round type="primary" native-type="submit" size="small">
            提交
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 查询结果 -->
     <!-- 模拟一个表格 -->
    <div v-if="listData.length > 0" class="table-wrap">
      <!-- 表头 -->
       <van-row class="table-header table-row bdb-n">
        <van-col class="table-col table-col-1 bdr-n" span="18">度量部位+度量手法</van-col>
        <van-col class="table-col table-col-2" span="6">TOL±</van-col>
      </van-row>
      <van-row v-for="item in listData" :key="item.id" class="table-content table-row">
        <van-col class="table-col table-col-1 bdr" span="18">{{ item.MeasureMethod }}</van-col>
        <van-col class="table-col table-col-2" span="6">
          <div class="table-col-2-sub bdb">
            {{item.TOL_L}}
          </div>
          <div class="table-col-2-sub">
            {{item.TOL_S}}
          </div>
        </van-col>
      </van-row>
    </div>
  </main>
</template>

<style scoped>
.scrollMain {
  background: #f5f5f5;
}
.query-wrap {
  padding-top: 30px;
}
.table-wrap,
.table-header,
.table-row,
.table-col-2-sub,
.table-col-1,
.table-col-2 {
  box-sizing: border-box;
}

.table-wrap {
  margin: 20px;
  background: white;
  padding: 10px;
  border-radius: 10px;
}
.table-header {
  background-color: #f5f5f5;
}
.table-content {
  border: 1px solid #eeeeee;
}
.table-header .table-row {}
.table-header .table-col {
  padding: 0 10px;
}
.table-row {
}
.table-col {
}
.table-content .table-col-1 {
  height: 80px;
  padding: 10px;
  line-height: 1.2;
}
.table-content .table-col-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  flex-direction: column;
}
.table-col-2-sub {
  padding: 10px;
  width: 100%;
  text-align: center;
  height: 40px;
}

/* 一个内部元素居中的容器 */
.btn-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
.btn-wrap .van-button {
  padding: 0 20px;
}

.bdl {
  border-left: 1px solid #eeeeee;
}
.bdr {
  border-right: 1px solid #eeeeee;
}
.bdt {
  border-top: 1px solid #eeeeee;
}
.bdb {
  border-bottom: 1px solid #eeeeee;
}
.bdl-n {
  border-left: none;
}
.bdr-n {
  border-right: none;
}
.bdt-n {
  border-top: none;
}
.bdb-n {
  border-bottom: none;
}
</style>
