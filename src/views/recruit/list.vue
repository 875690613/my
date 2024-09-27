<template>
    <van-search v-model="value" show-action label="" placeholder="请输入搜索关键词" @search="onSearch">
        <template #action>
            <div @click="onClickButton">搜索</div>
        </template>
    </van-search>

    <div class="page-home-new">
        <div class="job-recommend">
            <div class="sub-name">
                <h4 id="bubble-title" title="招聘精选职位">精选职位</h4>
            </div>
            <div class="job-list job-list-new">
                <ul>
                    <li class="item">
                        <a href="/job_detail/2086ab1e1778a9c41XVz3d24FVdZ.html" ka="job_recommendation_list_1">
                            <div class="title">
                                <span class="title-text">前端开发工程师</span>
                                <span class="salary">10-15K</span>
                            </div>
                            <div class="name">
                                <span class="company">采木工业互联网科技</span>
                                <span class="workplace">无锡</span>
                            </div>
                            <div class="labels">
                                <span>3-5年</span>
                                <span>大专</span>
                                <span>小程序</span>
                                <span>ES6</span>
                                <span>CSS</span>
                            </div>
                            <div class="recruiter">
                                <div class="user-wrap">
                                    <img src="https://img.bosszhipin.com/beijin/upload/avatar/20200627/3df787ff656a92df8d5235540044b1f41e43fdd7ebdd8dfaedfd76a90c2f3975_s.jpg?x-oss-process=image/resize,w_100,limit_0"
                                        alt="">
                                    <div class="name">刘女士·人力资源总监</div>
                                </div>
                                <div class="btn-chat" position="home">立即沟通</div>
                            </div>
                        </a>
                    </li>

                </ul>
            </div>
        </div>
    </div>
</template>
<script setup>
</script>
<style scoped>
.page-home-new {
    padding: 28px 0 2px 20px
}
</style>
