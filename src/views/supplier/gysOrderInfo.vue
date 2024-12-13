<script>
import api from '@/request/api.js';
import { ref } from 'vue';
import { showToast } from 'vant';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const dzInfo = ref({});
    const dzList = ref([]);

    const getBalance = () => {
        api.balance(route.query.contractId).then(res => {
            dzInfo.value = res.rows
        })
    };

    const getPurchaseDetail = () => {
        api.purchaseDetail(route.query.contractId).then(res => {
            dzList.value = res.rows
        })
    };

    const onClickLeft = () => {
        router.back();
    }

    getBalance()
    getPurchaseDetail()

    return {
        onClickLeft,
        dzInfo,
        dzList
    };
  },
};
</script>

<template>
    <div style="padding: 10px;">
        <van-nav-bar
            title=""
            left-text=""
            fixed
            placeholder
            left-arrow
            @click-left="onClickLeft"
        />
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
                <div style="display: flex;width: 100%;">
                    <div style="color: #6C6C6C;flex-shrink: 0;">采购订单号：</div>
                    <div style="color: #000000;word-break: break-all;">{{ item.PurchaseNo }}</div>
                </div>
            </div>
            <div style="display: flex;padding: 10px;">
                <div style="display: flex;width: 100%;">
                    <div style="color: #6C6C6C;flex-shrink: 0;">采购类型：</div>
                    <div style="color: #000000;word-break: break-all;">{{ item.PurchaseType }}</div>
                </div>
            </div>
            <div style="text-align: center;color: #BEBEBE;border-bottom: 1px solid #BBBBBB;">采购明细</div>
            <div style="padding: 10px 10px 10px 20px;">
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="min-width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">物料编号：</div>
                    <div style="color: #000000;word-break: break-all;">{{ item.StockNo }}</div>
                </div>
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="min-width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">物料品名：</div>
                    <div style="color: #000000;word-break: break-all;">{{ item.StockName }}</div>
                </div>
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">颜色：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.Color }}</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">型号：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.Specification }}</div>
                    </div>
                </div>
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">采购单价：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.UnitPrice }}</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">币别：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.Currencies }}</div>
                    </div>
                </div>
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">采购数量：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.PlanNumber }}</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">计量单位：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.Measure }}</div>
                    </div>
                </div>
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">小缸费：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.Vat }}</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">上机费：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.Machine }}</div>
                    </div>
                </div>
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">网费：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.Net }}</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">印花费：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.Printing }}</div>
                    </div>
                </div>
                <div style="display: flex;margin-bottom: 30px;">
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">其他费用：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.OtherFee }}</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">总价：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.TotalPrice }}</div>
                    </div>
                </div>
                <div style="display: flex;align-items: center;">
                    <div style="min-width: 78px;text-align: right;color: #6C6C6C;flex-shrink: 0;">订单款号：</div>
                    <div style="color: #000000;">
                        <div>{{ item.StyleNos }}</div>
                    </div>
                </div>
            </div>
            <div style="text-align: center;color: #BEBEBE;border-bottom: 1px solid #BBBBBB;padding-bottom: 10px;">物流进度</div>
            <div style="padding: 10px 0 10px 10px;">
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="display: flex;width: 100%;">
                        <div style="min-width: 105px;text-align: right;color: #6C6C6C;flex-shrink: 0;">计划到货日期：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.EstimatedArriveDate }}</div>
                    </div>
                </div>
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="display: flex;width: 100%;">
                        <div style="min-width: 105px;text-align: right;color: #6C6C6C;flex-shrink: 0;">实际到货日期：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.ArriveDate }}</div>
                    </div>
                </div>
                <!-- <div style="display: flex;margin-bottom: 10px;">
                    <div style="width: 105px;text-align: right;color: #6C6C6C;flex-shrink: 0;">收货日期：</div>
                    <div style="color: #000000;word-break: break-all;">{{ item.TotalPrice }}</div>
                </div> -->
            </div>
            <div style="text-align: center;color: #BEBEBE;border-bottom: 1px solid #BBBBBB;padding-bottom: 5px;">测试报告</div>
            <div style="padding: 10px;">
                <div style="display: flex;">
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">门幅：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.TheWidth }}</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">克重：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.TheWeight }}</div>
                    </div>
                </div>
                <div style="display: flex;">
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">干磨等级：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.DryLevle }}</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">湿磨等级：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.WetLevel }}</div>
                    </div>
                </div>
                <div style="display: flex;">
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">涤沾色等级：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.PolyColorLevel }}</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">棉沾色等级：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.CottonColorLevle }}</div>
                    </div>
                </div>
                <div style="display: flex;">
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">经向缩率：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.TwistWarp }}</div>
                    </div>
                    <div style="display: flex;width: 50%;">
                        <div style="min-width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">纬向缩率：</div>
                        <div style="color: #000000;word-break: break-all;">{{ item.TwistWeft }}</div>
                    </div>
                </div>
                <div style="display: flex;margin-bottom: 10px;">
                    <div style="min-width: 90px;text-align: right;color: #6C6C6C;flex-shrink: 0;">测试结果：</div>
                    <div style="color: #000000;word-break: break-all;">{{ item.TestResult }}</div>
                </div>
            </div>
        </div>
        <van-back-top />
    </div>
</template>

<style scoped>
</style>