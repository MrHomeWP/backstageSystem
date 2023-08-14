<template>
  <div class="logo_box">
    <img :src="logoInfo.src" alt="">
    <p v-show="!settingStore.fold">{{ logoInfo.title }}</p>
  </div>
</template>

<script setup>
import { logoInfo } from "@/setting.js"
//引入setting仓库
import useSettingStore from "@/store/modules/setting";
let settingStore=useSettingStore()


</script>

<style lang="scss" scoped>
.logo_box {
  display: flex;
  align-items: center;
  height: 50px;
  overflow: hidden;
  margin: 0 20px;
  p {
    color: white;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
