<template>
    <div class="detail-box-r">
        <van-nav-bar title="详情" fixed :border="false" left-arrow left-text="返回" @click-left="onClickLeft" />
        <div class="recruit-sp" v-if="info.rows">
            <div class="job-banner">
                <h1 class="name">
                    <span class="salary">{{ info.rows[0].salary }}</span>
                    <p class="job-title">{{ info.rows[0].postName }}</p>
                </h1>
                <!-- <p>
                    <a class="text-city" href="/wuxi/">无锡</a>
                    <em class="vline"></em>3-5年<em class="vline"></em>大专
                </p> -->
                <div class="job-tags">
                    <span>{{ info.rows[0].bonusPoints }}</span>
                    <span>{{ info.rows[0].peopleNum }}人</span>
                </div>
                <div class="t-deliveryChannel">
                    {{ info.rows[0].deliveryChannel }}
                </div>
            </div>
            <div class="job-sec">
                <h3>职位描述</h3>
                <div class="text">
                    职位要求：<br>{{ info.rows[0].jobRequirements }}
                </div>
                <div class="text">
                    工作内容：<br>{{ info.rows[0].skillRequirements }}
                </div>
                <span class="position"><img src="@/assets/images/position.png" alt=""> {{ info.rows[0].city }}</span>
            </div>
        </div>
    </div>
</template>
<script>
import request from '@/request/api.js';
import { reactive, toRefs, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
export default {
    setup() {
        const router = useRouter();
        const route = useRoute();
        const onClickLeft = () => {
            router.go(-1);
        }
        const pageData = reactive({
            params: {
                time: '10j9adlq53ao0',
                page: 1,
                limit: 10,
                postName: '',
                id: route.query.id || ''
            },
            info: [],
        });
        const postName = ref('');
        const getList = async () => {
            pageData.params.postName = postName.value;
            const { data } = await request.recruitList(pageData.params);
            if (data) {
                pageData.info = data;
                console.log(pageData.info);

            }
        }
        getList();
        return {
            onClickLeft,
            ...toRefs(pageData),
        }
    }
}
</script>
<style lang="scss" scoped>
.detail-box-r {
    .recruit-sp {
        padding-top: 46px;

        .job-banner {
            background-color: #37c2bc;
            color: #fff;
            padding: 15px 18px
        }

        .job-banner .company {
            padding: 0
        }

        .job-banner .company span {
            margin-right: 10px;
            vertical-align: middle
        }

        .job-banner .company .job-medium-icon2 {
            width: 46px;
            vertical-align: middle
        }

        .job-banner .name {
            font-size: 19px
        }

        .job-banner .name .salary {
            float: right;
            font-size: 20px
        }

        .job-banner .name .job-title {
            margin-right: 76px;
            font-size: 19px;
            line-height: 22px
        }

        .job-banner .name .job-medium-icon2 {
            height: 16px;
            display: inline-block;
            vertical-align: -1px
        }

        .job-banner p {
            font-size: 12px;
            padding-bottom: 5px
        }

        .job-banner p .text-city {
            color: #fff
        }

        .job-banner .vline {
            background: #fff;
            height: 10px
        }

        .job-banner .time {
            font-size: 10px;
            margin: 3px 0 -10px;
            opacity: .6
        }

        .job-tags {
            position: relative;
            padding-right: 75px
        }

        .t-deliveryChannel {
            font-weight: bold;
        }

        .job-tags .time,
        .job-tags span {
            display: inline-block;
            font-size: 11px;
            border: 1px #fff solid;
            color: #fff;
            border-radius: 10px;
            padding: 0 8px;
            height: 22px;
            line-height: 22px;
            margin-right: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 185px
        }

        .job-tags .time {
            position: absolute;
            right: 0;
            top: -30px;
            font-size: 12px;
            border: 0;
            margin-right: 0;
            padding: 0;
            font-style: normal
        }

        .job-tags span+.time {
            top: 3px
        }

        .job-sec {
            padding: 0 10px;

            .position {
                display: flex;
                align-items: center;
                color: #7e8793;
                padding-top: 0.4rem;
                font-size: 12px;

                img {
                    width: 0.35rem;
                    height: 0.35rem;
                    margin-right: 0;
                }
            }

            h3 {
                color: #414a60;
                font-weight: 700;
                position: relative;
                line-height: 44px;
                font-size: 15px
            }

            h3:after {
                content: '';
                width: 15px;
                height: 1px;
                background-color: #62d5c8;
                position: absolute;
                left: 0;
                bottom: 0
            }

            .text {
                padding-top: 11px;
                line-height: 26px;
                color: #7e8793;
                font-size: 15px;
            }
        }
    }
}
</style>
<style lang="scss">
.detail-box-r {
    .van-nav-bar__title {
        color: #fff;
    }
}
</style>
