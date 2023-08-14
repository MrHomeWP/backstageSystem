<template>
  <div class="container">
    <div ref="RefScreen" class="screen">
      <!-- 顶部 -->
      <Top />
      <div class="box">
        <!-- 左 -->
        <Left />
        <!-- 中 -->
        <Middle />
        <!-- 右 -->
        <Right />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted,onBeforeUnmount } from "vue";
import Top from "./components/Top.vue";
import Middle from "./components/Middle.vue";
import Left from "./components/Left.vue";
import Right from "./components/Right.vue";

// 获取screen盒子实例
let RefScreen = ref();
onMounted(() => {
  RefScreen.value.style.transform =`translate(-50%,-50%) scale(${getScale()}) `
  //监听视口
  window.addEventListener('resize', handleResize)
});

//获取比例
let getScale = (w = 1920, h = 1080) => {
  const ww = window.innerWidth / w;
  const hh = window.innerHeight / h;
  return ww < hh ? ww : hh;
};

let handleResize = () => {
  // 处理视口变化时的逻辑
  RefScreen.value.style.transform = `translate(-50%,-50%) scale(${getScale()}) `
}
onBeforeUnmount(() => {
  //删除监听视口
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background-image: url("./images/bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  .screen {
    color: #fff;
    position: fixed;
    width: 1920px;
    height: 1080px;
    top: 50%;
    left: 50%;
    transform:translate(-50%,-50%) ;
    .box {
      display: flex;
      justify-content: space-between;
      height: 100%;
    }
  }
}
</style>
