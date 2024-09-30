<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <van-config-provider theme="dark">
    <div class="welfare-index">
        <RouterView />
    </div>
  </van-config-provider>
</template>

<style scoped>
:deep(.van-nav-bar) {
  background: transparent!important;
}
:deep(.van-cell) {
  background: transparent!important;
}
.welfare-index {
    background-color: #073936;
    height: 100vh;
}
</style>
