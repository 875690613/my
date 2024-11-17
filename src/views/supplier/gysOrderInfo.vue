<script>
import api from '@/request/api.js';
import { ref } from 'vue';
import { showToast } from 'vant';

export default {
  setup() {
    const dzInfo = ref({});
    const dzList = ref([]);

    const getBalance = () => {
        api.balance(59016).then(res => {
            dzInfo.value = res.rows
        })
    };

    const getPurchaseDetail = () => {
        api.purchaseDetail(59016).then(res => {
            console.log(res)
            dzList.value = res.rows.rows
        })
    };

    getBalance()
    getPurchaseDetail()

    return {
        dzInfo,
        dzList
    };
  },
};
</script>

<template>
    <div style="padding: 10px;">
        <div style="height: 40px;line-height: 40px;text-align: center;border-top: 1px solid #E5E5E5;border-bottom: 1px solid #E5E5E5;margin-bottom: 30px;color: #6C6C6C;">合同号：3241111001</div>
        <div style="display: flex;align-items: center;margin-bottom: 30px;padding: 0 20px;">
            <div style="display: flex;align-items: center;width: 50%;">
                <div style="color: #6C6C6C;flex-shrink: 0;">对账状态：</div>
                <div style="color: #000000;">{{ dzInfo.isBalance }}</div>
            </div>
            <div style="display: flex;align-items: center;width: 50%;">
                <div style="color: #6C6C6C;flex-shrink: 0;">对账日期：</div>
                <div style="color: #000000;">{{ dzInfo.balanceDate }}</div>
            </div>
        </div>
        <div style="border: 1px solid #BBBBBB;margin-top: 10px;" v-for="(item, index) in dzList" :key="index">
            <div style="display: flex;padding: 10px;">
                <div style="display: flex;width: 50%;">
                    <div style="color: #6C6C6C;flex-shrink: 0;">采购订单号：</div>
                    <div style="color: #000000;word-break: break-all;">P20241111001</div>
                </div>
                <div style="display: flex;width: 50%;">
                    <div style="color: #6C6C6C;flex-shrink: 0;">采购类型：</div>
                    <div style="color: #000000;word-break: break-all;">普通面料采购</div>
                </div>
            </div>
            <div style="text-align: center;color: #BEBEBE;border-bottom: 1px solid #BBBBBB;">采购明细</div>
            <div style="padding: 10px 10px 10px 20px;">
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">物料编号：</div>
                    <div style="color: #000000;word-break: break-all;">米格纺织2631全曲</div>
                </div>
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">物料品名：</div>
                    <div style="color: #000000;word-break: break-all;">米格纺织2631全曲</div>
                </div>
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="display: flex;width: 50%;">
                        <div style="width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">颜色：</div>
                        <div style="color: #000000;word-break: break-all;">BLACK 8721#黑色</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">型号：</div>
                        <div style="color: #000000;word-break: break-all;">无</div>
                    </div>
                </div>
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="display: flex;width: 50%;">
                        <div style="width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">采购单价：</div>
                        <div style="color: #000000;word-break: break-all;">8.2</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">币别：</div>
                        <div style="color: #000000;word-break: break-all;">人民币</div>
                    </div>
                </div>
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="display: flex;width: 50%;">
                        <div style="width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">采购数量：</div>
                        <div style="color: #000000;word-break: break-all;">200</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">计量单位：</div>
                        <div style="color: #000000;word-break: break-all;">米</div>
                    </div>
                </div>
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="display: flex;width: 50%;">
                        <div style="width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">小缸费：</div>
                        <div style="color: #000000;word-break: break-all;">0</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">上机费：</div>
                        <div style="color: #000000;word-break: break-all;">0</div>
                    </div>
                </div>
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="display: flex;width: 50%;">
                        <div style="width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">网费：</div>
                        <div style="color: #000000;word-break: break-all;">0</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">印花费：</div>
                        <div style="color: #000000;word-break: break-all;">0</div>
                    </div>
                </div>
                <div style="display: flex;margin-bottom: 30px;">
                    <div style="display: flex;width: 50%;">
                        <div style="width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">其他费用：</div>
                        <div style="color: #000000;word-break: break-all;">0</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">总价：</div>
                        <div style="color: #000000;word-break: break-all;"></div>
                    </div>
                </div>
                <div style="display: flex;align-items: center;">
                    <div style="width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">订单款号：</div>
                    <div style="color: #000000;">
                        <div>米格纺织2631全曲</div>
                        <div>米格纺织2631全曲</div>
                        <div>米格纺织2631全曲</div>
                    </div>
                </div>
            </div>
            <div style="text-align: center;color: #BEBEBE;border-bottom: 1px solid #BBBBBB;padding-bottom: 10px;">物流进度</div>
            <div style="padding: 10px 0;">
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="display: flex;width: 50%;">
                        <div style="width: 105px;text-align: right;color: #6C6C6C;flex-shrink: 0;">计划发货日期：</div>
                        <div style="color: #000000;word-break: break-all;">9999-99-99</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="width: 105px;text-align: right;color: #6C6C6C;flex-shrink: 0;">实际发货日期：</div>
                        <div style="color: #000000;word-break: break-all;">9999-99-99</div>
                    </div>
                </div>
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="width: 105px;text-align: right;color: #6C6C6C;flex-shrink: 0;">收货日期：</div>
                    <div style="color: #000000;word-break: break-all;">9999-99-99</div>
                </div>
            </div>
            <div style="text-align: center;color: #BEBEBE;border-bottom: 1px solid #BBBBBB;padding-bottom: 5px;">测试报告</div>
            <div style="padding: 10px;">
                <div style="display: flex;">
                    <div style="display: flex;width: 50%;">
                        <div style="width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">门幅：</div>
                        <div style="color: #000000;word-break: break-all;">BLACK 8721#黑色</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">克重：</div>
                        <div style="color: #000000;word-break: break-all;">无</div>
                    </div>
                </div>
                <div style="display: flex;">
                    <div style="display: flex;width: 50%;">
                        <div style="width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">干磨等级：</div>
                        <div style="color: #000000;word-break: break-all;">BLACK 8721#黑色</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">湿磨等级：</div>
                        <div style="color: #000000;word-break: break-all;">无</div>
                    </div>
                </div>
                <div style="display: flex;">
                    <div style="display: flex;width: 50%;">
                        <div style="width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">涤沾色等级：</div>
                        <div style="color: #000000;word-break: break-all;">BLACK 8721#黑色</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">棉沾色等级：</div>
                        <div style="color: #000000;word-break: break-all;">无</div>
                    </div>
                </div>
                <div style="display: flex;">
                    <div style="display: flex;width: 50%;">
                        <div style="width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">经向缩率：</div>
                        <div style="color: #000000;word-break: break-all;">BLACK 8721#黑色</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">纬向缩率：</div>
                        <div style="color: #000000;word-break: break-all;">无</div>
                    </div>
                </div>
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">测试结果：</div>
                    <div style="color: #000000;word-break: break-all;">米格纺织2631全曲</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>