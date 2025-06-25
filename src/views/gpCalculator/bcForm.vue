<template>
  <div class="container">
    <!-- 头部 -->
    <van-nav-bar title="计算器" fixed left-arrow left-text="返回" @click-left="onClickLeft">
      <template #right>
        <van-dropdown-menu>
          <van-dropdown-item v-model="value1" :options="option1" @change="value1 = $event"/>
        </van-dropdown-menu>

      </template>
    </van-nav-bar>
    <!-- <van-nav-bar :title="headerTitle" fixed :border="false" left-arrow left-text="返回" @click-left="onClickLeft" /> -->
    <!-- 主体内容 -->
    <div class="content">
      <div v-if="value1 === 0">

        <van-cell-group inset class="section">
          <van-field
            v-model.number="dividend"
            label="产量"
            type="number"
            placeholder="请输入产量"
          />
          <!-- <van-field
            v-model="divisor"
            label="产出天数"
            type="number"
            placeholder="产出天数"
          /> -->
          产出天数：<van-stepper v-model="divisor" />
        </van-cell-group>
        <div class="result">
          <h3 v-if="divisor !== 0">
            计算结果：{{ dividend }} ÷ {{ divisor }} = {{ result }}
          </h3>
          <h3 v-else class="error">
            {{ result }}
          </h3>
        </div>
      </div>
      <!-- 补仓计算器 -->
      <div v-if="value1 === 1">

        <!-- 持仓股票 -->
        <van-cell-group inset class="section">
          <div class="section-title">持仓信息</div>
          <van-field
            v-model.number="state.initial.name"
            required
            label="持仓名称"
            type="text"
            placeholder="请输入名称"
            clearable
          />
          <van-field
            v-model="state.initial.code"
            required
            label="持仓代码"
            type="text"
            placeholder="请输入代码"
            clearable
          />
        </van-cell-group>
        <!-- 初始持仓 -->
        <van-cell-group inset class="section">
          <div class="section-title">初始持仓</div>
          <van-field
            v-model.number="state.initial.shares"
            label="持仓数量"
            type="number"
            placeholder="请输入数量"
            suffix="股"
            clearable
          />
          <van-field
            v-model.number="state.initial.price"
            label="成本价"
            type="number"
            placeholder="请输入价格"
            suffix="元"
            clearable
          />
        </van-cell-group>
  
        <!-- 补仓操作 -->
        <van-cell-group inset class="section">
          <div class="section-title">补仓操作</div>
          <van-field
            v-model.number="newPosition.shares"
            required
            label="补仓数量"
            type="number"
            placeholder="请输入数量"
            suffix="股"
            clearable
          />
          <van-field
            v-model.number="newPosition.price"
            required
            label="补仓价格"
            type="number"
            placeholder="请输入价格"
            suffix="元"
            clearable
          />
          <van-button 
            block 
            type="primary" 
            @click="addPosition"
            :disabled="!isPositionValid"
            class="add-btn"
          >
            + 添加
          </van-button>
        </van-cell-group>
  
        <!-- 补仓记录 -->
        <van-cell-group inset class="section">
          <div class="section-title">添加记录</div>
          <div v-if="state.positionsList.length === 0" class="empty">暂无补仓记录</div>
          <van-cell 
            v-else
            v-for="(item, index) in state.positionsList"
            :key="index"
            :title="`【${index+1}】 - ${item.shares}股 @ ${item.price}元`"
            :value="`总投入：${(item.shares * item.price).toFixed(2)}元`"
          >
            <template #right-icon>
              <van-button 
                size="small" 
                icon="delete" 
                @click="removePosition(index)"
                style="margin-left: 8px;"
              />
            </template>
          </van-cell>
        </van-cell-group>
  
        <!-- 计算结果 -->
        <van-cell-group inset class="section result-section">
          <van-field
            v-model.number="state.currentPrice"
            required
            label="当前价格"
            type="number"
            placeholder="请输入当前价"
            suffix="元"
            clearable
          />
          
          <van-divider>计算结果</van-divider>
          
          <van-cell title="总持仓量" :value="`${totalShares.toFixed(2)} 股`" />
          <van-cell title="平均成本价" title-style="red" :value="`${averageCost.toFixed(2)} 元`" />
          <van-cell 
            title="需上涨" 
            :value="`${requiredIncrease}%`"
            :value-class="valueStyle"
          />
          <van-divider />
          <van-cell :title="resultMessage" :title-style="titleStyle" style="margin-bottom: 40px;" />
        </van-cell-group>
      </div>
      <!-- dcp变现 -->
      <div v-if="value1 === 2">
        <van-cell-group inset class="section">
          <div class="section-title">DCP计算</div>
          <van-field
            v-model.number="dcp.quantity"
            label="信用分数量"
            type="number"
            placeholder="请输入数量"
            suffix="股"
            clearable
            @input="dcpCount"
          />
          <van-field name="stepper" label="市场价">
            <template #input>
              <van-stepper v-model="dcp.price" step="0.01" :decimal-length="2" label="市场价"
                type="number"
                placeholder="请输入价格"
                suffix="元" clearable />
            </template>
          </van-field>
          <van-field
            v-model.number="dcp.currentPrice"
            label="总价"
            type="number"
            placeholder="请输入当前价"
            suffix="元"
            clearable
            @change="dcpCount" @input="dcpCount" @plus="dcpCount" @minus="dcpCount"

          />
        </van-cell-group>
        <van-button 
            block 
            type="primary" 
            @click="dcpCount"
            class="add-btn"
          >计算</van-button>
      </div>
    </div>

    <!-- 底部动作栏 -->
    <van-action-bar v-if="value1 == 0" class="action-bar">
      <van-action-bar-icon icon="chat-o" text="客服" />
      <van-action-bar-icon icon="shop-o" text="店铺" />
      <van-action-bar-button @click="rest" color="#1989faad" type="warning" text="重置" />
      <van-action-bar-button @click="save" color="#1989fa" type="danger" text="保存" />
    </van-action-bar>

  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { showToast } from 'vant';

const state = reactive({
  initial: {
    shares: 0,
    price: 0,
    name: '',
    code: ''//保留开通为0
  },
  positionsList: [],
  currentPrice: 0,// 当前价格

  localStorageObj: {
  positionsList: []
  }

});
// 持仓列表
const ccList = reactive([]);
// dcp
const dcp = reactive({
  quantity: 3000,
  price: 1.81,
  currentPrice: 0,

});
const newPosition = reactive({
  shares: 0,
  price: 0,
  currentPrice: 0,

});
const rest = () => {
  state.initial = {
    shares: 0,
    price: 0,
    name: '',
    code: ''//保留开通为0
  }
  state.positionsList = []
  state.currentPrice = 0
}
const value1 = $ref(2); // 计算器选择
// 计算器选项
const option1 = [
  { text: '计算器0', value: 0 },
  { text: '计算器1', value: 1 },
  { text: '计算器2', value: 2 },
  { text: '计算器3', value: 3 },
];
const checked = $ref([]);
const dividend = $ref(0)  // 被除数
const divisor = $ref(1)   // 除数

// 计算dcp
const dcpCount = () => {
  if (dcp.quantity > 0 && dcp.price > 0) {
    // 1、信用分数量划到流动池中，信用分数量打75折
    const ltxyf = (dcp.quantity * 0.75)
    console.log("↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ");
    console.log("1、划到流动池需扣除25%手续费，获得信用分：", ltxyf);
    // 2、流动池中信用分数量*市场价后打95折，兑换后5%进入流动池
    const dcpPrice = (ltxyf * dcp.price * 0.95).toFixed(4)
    console.log("2、流动池中信用分数量*市场价后打95折后，5%进入流动池：", dcpPrice);
    // 3、兑成成dcp打95折
    const dcpPrice95 = (dcpPrice * 0.95).toFixed(4)
    console.log("3、兑成成dcp打95折：", dcpPrice95);
    // 4、dcp兑成后，卖给服务商，服务商打95折
    const dcpSellPrice = dcpPrice95 * 0.95
    dcp.currentPrice = dcpSellPrice.toFixed(4);
    console.log("4、dcp兑成后，卖给服务商收取5%服务费，服务商打95折：", dcpSellPrice);
    console.log("↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ");
    showToast(`DCP变现为：${dcpSellPrice.toFixed(4)}`)
  } else {
    showToast('请填写完整信息')
  }
}
// 计算属性处理相除逻辑
const result = computed(() => {
  if (divisor === 0) return '除数不能为零'
  return (dividend / divisor).toFixed(2)
})

// 从缓存中恢复数据
if (localStorage.getItem('localStorageObj')) {
  state.localStorageObj = JSON.parse(localStorage.getItem('localStorageObj'));
  if (state.localStorageObj.positionsList.length > 0) {
    state.positionsList = state.localStorageObj.positionsList;
  }

  state.initial.shares = state.localStorageObj.shares
  state.initial.price = state.localStorageObj.price
  state.initial.name = state.localStorageObj.name
  state.initial.code = state.localStorageObj.code
  state.currentPrice = state.localStorageObj.currentPrice
}

// 计算属性（检测必填项）
const isPositionValid = computed(() => 
  newPosition.shares > 0 && newPosition.price > 0 && state.currentPrice > 0 && state.initial.code != '' && state.initial.name != ''
);

const totalShares = computed(() => 
  state.positionsList.reduce((sum, pos) => sum + pos.shares, state.initial.shares)
);

const totalCost = computed(() => {
  const initialCost = state.initial.shares * state.initial.price;
  const addedCost = state.positionsList.reduce((sum, pos) => sum + (pos.shares * pos.price), 0);
  return initialCost + addedCost;
});

const averageCost = computed(() => 
  totalShares.value > 0 ? (totalCost.value / totalShares.value) : 0
);

const requiredIncrease = computed(() => {
  if (state.currentPrice <= 0 || averageCost.value <= state.currentPrice) return '0.00';
  return (((averageCost.value - state.currentPrice) / state.currentPrice) * 100).toFixed(2);
});

const resultMessage = computed(() => {
  if (state.currentPrice === 0) return '请输入当前价格查看结果';
  if (state.currentPrice > averageCost.value) return '💰 当前处于盈利状态';
  if (state.currentPrice < averageCost.value) return '📉 当前处于亏损状态';
  return '⚖️ 当前处于保本状态';
});

const valueStyle = computed(() => ({
  color: state.currentPrice < averageCost.value ? '#07c160' : '#ee0a24'
}));

const titleStyle = computed(() => ({
  fontWeight: 'bold',
  color: valueStyle.value.color
}));

// 方法
const addPosition = () => {
  if (!isPositionValid.value) {
    showToast('请输入必填项数据');
    return;
  }
  
  state.positionsList.push({ 
    shares: Number(newPosition.shares),
    price: Number(newPosition.price),
    name: state.initial.name,
    code: state.initial.code
  });
  
  // 重置输入
  newPosition.shares = 0;
  newPosition.price = 0;
  
  showToast('添加成功', { position: 'top' });
  // state.localStorageObj.positionsList = state.positionsList;
  // // 将初始持仓数据添加到缓存localStorageObj中
  // state.localStorageObj.shares = state.initial.shares
  // state.localStorageObj.price = state.initial.price
  // state.localStorageObj.name = state.initial.name
  // state.localStorageObj.code = state.initial.code
  // state.localStorageObj.currentPrice = state.currentPrice
  // localStorage.setItem('localStorageObj', JSON.stringify(state.localStorageObj));
  // ccList.push(state.positionsList);
};
// 保存save
const save = () => {
  if (state.positionsList.length == 0) {
    showToast('请先添加补仓记录');
    return;
  }
  console.log("state.localStorageObj11111:",state.localStorageObj, "positionsList:",state.positionsList);
  if (state.localStorageObj.positionsList.length > 0 && state.localStorageObj.positionsList[0].name == state.initial.name) {
    // 将state.localStorageObj.positionsList数组和state.positionsList数组合并为一个数组
    


    state.localStorageObj.positionsList = [...state.localStorageObj.positionsList, ...state.positionsList];
    console.log("state.localStorageObj.positionsList", state.localStorageObj.positionsList);

  }else{
    state.localStorageObj.positionsList = state.positionsList;
  }
  // 将初始持仓数据添加到缓存localStorageObj中
  state.localStorageObj.shares = state.initial.shares
  state.localStorageObj.price = state.initial.price
  state.localStorageObj.name = state.initial.name
  state.localStorageObj.code = state.initial.code
  state.localStorageObj.currentPrice = state.currentPrice
  // state.localStorageObj中的positionsList数据去重
  state.localStorageObj.positionsList = [...new Map(state.localStorageObj.positionsList.map(item =>
    [JSON.stringify(item), item])).values()]
  // 将初始持仓数据添加到缓存localStorageObj中
  localStorage.setItem('localStorageObj', JSON.stringify(state.localStorageObj));
  // 找到ccList中name为state.initial.name的持仓记录，并覆盖其持仓记录。
  if (ccList.length > 0) {
    for (let i = 0; i < ccList.length; i++) {
      if (ccList[i].name === state.initial.name) {
        ccList[i] = state.localStorageObj;
      }else{
        ccList.push(state.localStorageObj);
      }
    }
  }else{
    ccList.push(state.localStorageObj);//持仓列表添加到缓存localStorageObj中
  }


  localStorage.setItem('localStorageCcList', JSON.stringify(ccList));
  
};
const removePosition = (index) => {
  state.positionsList.splice(index, 1);
  showToast('删除成功', { position: 'top' });
  // 将state.positions添加到缓存localStorageObj中
  state.localStorageObj.positionsList = state.positionsList;
  // localStorage.setItem('localStorageObj', JSON.stringify(state.localStorageObj));
};
// 导航-返回
const onClickLeft = () => {
    // if (step.value == 0) {
    //     history.back();
    // } else {
    //     goBack();
    // }
    history.back();
}
</script>

<style scoped>
.container {
  padding: 46px 0 20px;
  min-height: 100vh;
  background: #f7f8fa;
}

.content {
  padding: 0 12px;
}

.section {
  margin-bottom: 16px;
}

.section-title {
  padding: 12px 16px;
  font-size: 16px;
  color: #333;
  font-weight: 500;
  background: linear-gradient(90deg, #f5f5f5, transparent);
}

.add-btn {
  margin: 12px 16px;
  width: calc(100% - 32px);
}

.empty {
  padding: 20px;
  text-align: center;
  color: #969799;
  font-size: 14px;
}

.result-section {
  margin-top: 20px;
}

:deep(.van-cell__value) {
  flex: 2;
  text-align: right;
}
>>>.van-stepper__input {
  background: #fff;
}
</style>