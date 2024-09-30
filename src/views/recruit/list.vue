<template>
    <van-search v-model="postName" show-action class="search-top" placeholder="请输入搜索关键词">
        <template #action>
            <div @click="onSearch">搜索</div>
        </template>
    </van-search>

    <div class="page-home">
        <div class="job-recommend">
            <div class="sub-name">
                <h4 id="bubble-title">热招职位</h4>
            </div>
            <div class="job-list job-list-new">
                <ul>
                    <li class="item" v-for="(item, index) in info.rows" :key="item"
                        @click="go({ path: 'detail', query: { id: item.id } })">
                        <a href="javascript:void(0)">
                            <div class="title">
                                <span class="title-text">{{ item.postName }}</span>
                                <span class="salary">{{ item.salary }}</span>
                            </div>
                            
                            <div class="labels">
                                <span v-if="item.bonusPoints">{{ item.bonusPoints }}</span>
                                <!-- <span>{{ item.deliveryChannel }}</span> -->
                                <span>{{ item.peopleNum }}人</span>
                            </div>
                            <div class="text">
                                职位要求：<br>{{ item.jobRequirements }}
                            </div>
                            <!-- <div class="name">
                                <span class="company"><img src="@/assets/images/position.png" alt=""> {{ item.city }}</span>
                            </div> -->
                            <div class="recruiter">
                                <div class="user-wrap">
                                    <!-- <img src="@/assets/images/favicon.png" alt=""> -->
                                    <div class="name">{{ item.deliveryChannel }}</div>
                                    
                                    <span class="position"><img src="@/assets/images/position.png" alt=""> {{ item.city }}</span>
                                </div>
                                <div class="btn-chat">查看详情</div>
                            </div>
                        </a>
                    </li>


                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import request from '@/request/api.js';
import { reactive, toRefs, watch, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const pageData = reactive({
            params: {
                time: '10j9adlq53ao0',
                page: 1,
                limit: 50,
                postName: '',
            },
            info: [],
        });
        const postName = ref('');
        const getList = async () => {
            pageData.params.postName = postName.value;
            const { data } = await request.recruitList(pageData.params);
            if (data) {
                console.log(data);

                pageData.info = data;
            }
        }
        getList();

        const onSearch = () => {
            if (postName.value == '') {
                return;
            }
            getList();
        }

        watch(postName, (newValue, oldValue) => {
            if (!newValue) {
                getList();
            }
        }, true);

        const go = str => {
            router.push(str);
        }
        return {
            ...toRefs(pageData),
            getList,
            onSearch,
            postName,
            go
        }
    }
}
</script>
<style lang="scss" scoped>
.page-home {

    background-color: #f7f7f7;

    .job-recommend {
        .sub-name {
            padding: 0.2rem;
            background-color: #fff;

            h4 {
                font-weight: bold;
                font-size: 0.42rem;
            }
        }

        .job-list {
            ul {
                .item {
                    padding: 0.2rem;
                    margin-bottom: 6px;
                    height: auto;
                    background: #fff;

                    .title {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 7px;
                    }

                    .title-text {
                        font-size: 18px;
                        font-weight: 500;
                        color: #333;
                        line-height: 25px;
                        padding-right: 20px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        word-break: break-all;
                    }

                    .salary {
                        font-size: 18px;
                        color: #f37b4f;
                        line-height: 22px;
                        flex-shrink: 0;
                        font-family: kanzhun-Regular, kanzhun;
                    }

                    .name {
                        display: flex;
                        margin-bottom: 9px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        word-break: break-all;
                        font-weight: bold;
                        .company {
                            display: flex;
                            align-items: center;
                            img {
                                width: 0.4rem;
                            }
                        }
                    }

                    .name span {
                        font-size: 14px;
                        font-weight: 300;
                        color: #666;
                        line-height: 20px;
                        margin-right: 10px;
                        flex-shrink: 0
                    }

                    .labels {
                        display: flex;
                        margin-bottom: 11px;
                        flex-wrap: wrap
                    }

                    .labels span {
                        display: inline-block;
                        padding: 3px 7px;
                        font-size: 12px;
                        color: #666;
                        line-height: 17px;
                        background: #f5f5f5;
                        border-radius: 3px;
                        margin-right: 6px;
                        margin-bottom: 5px
                    }

                    .text {
                        padding-bottom: 11px;
                        line-height: 26px;
                        color: #7e8793;
                        font-size: 15px;
                    }

                    .recruiter {
                        display: flex;
                        align-items: center;
                        justify-content: space-between
                    }

                    .recruiter .user-wrap {
                        display: flex;
                        align-items: center;
                        .position {
                            display: flex;
                            align-items: center;
                            color: #7e8793;
                            padding-left: 0.2rem;
                            font-size: 12px;
                            img {
                                width: 0.35rem;
                                height: 0.35rem;
                                margin-right: 0;
                            }
                        }
                    }

                    .recruiter img {
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        margin-right: 8px
                    }

                    .recruiter .name {
                        font-size: 12px;
                        color: #333;
                        line-height: 17px;
                        margin-bottom: 0
                    }

                    .recruiter .btn-chat {
                        width: 100px;
                        height: 30px;
                        background: #37c2bc;
                        border-radius: 15px;
                        font-size: 13px;
                        color: #fff;
                        line-height: 30px;
                        text-align: center;
                        float: right
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
.search-top {
    .van-search__action {
        color: #fff;
    }

    .van-search__field {
        background-color: #fff !important;
        padding: 0 !important;
    }
}

.van-search.search-top {
    background: #3db3ae;
}

* {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

.van-search__action:active {
    background-color: #3db3ae !important;
}
</style>
