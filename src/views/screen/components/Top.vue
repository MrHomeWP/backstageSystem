<template>
  <div class="top">
    <!-- 左边 -->
    <div class="left">
      <button @click="backFn">首页</button>
    </div>
    <!-- 中间 -->
    <div class="middle">智慧旅游可视化大数据平台</div>
    <!-- 右边 -->
    <div class="right">
      <button>统计报告</button>
      <span class="time">当前时间:{{ time }}</span>
    </div>
  </div>
</template>

<script setup>
import moment from "moment";
import { ref, onMounted, onBeforeUnmount } from "vue";
import {useRouter} from "vue-router"
let $router=useRouter()
let backFn = ()=>{
  $router.push("/")
}
let time = ref(moment().format("YYYY年MM月DD日 hh:mm:ss"));
let timer =ref(0)
//组件挂载完毕，打开定时器
onMounted(() => [
  (timer = setInterval(() => {
    time.value = moment().format("YYYY年MM月DD日 hh:mm:ss");
  }, 1000)),
]);
//组件销毁时，清除定时器
onBeforeUnmount(() => {
  clearInterval(timer.value);
});
</script>

<style lang="scss" scoped>
button {
  outline: none;
  border: none;
  cursor: pointer;
}
.top {
  display: flex;
  color: #28fafd;
  .left {
    flex: 3;
    display: flex;
    justify-content: right;
    height: 40px;
    background-image: url("../images/dataScreen-header-left-bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    button {
      width: 140px;
      height: 45px;
      background-image: url("../images/dataScreen-header-btn-bg-l.png");
      background-repeat: no-repeat;
      background-size: cover;
      background-color: transparent;
    }
  }
  .middle {
    flex: 4;
    text-align: center;
    line-height: 70px;
    font-size: 30px;
    height: 70px;
    background-image: url("../images/dataScreen-header-center-bg.png");
    background-repeat: no-repeat;
    background-size: cover;
  }
  .right {
    flex: 3;
    display: flex;
    justify-content: space-between;
    height: 40px;
    background-image: url("../images/dataScreen-header-left-bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    button {
      width: 145px;
      height: 45px;
      background-image: url("../images/dataScreen-header-btn-bg-r.png");
      background-repeat: no-repeat;
      background-size: cover;
      background-color: transparent;
    }
    .time{
      font-size:18px;
      line-height: 35px ;
      margin-right: 100px;
    }
  }
}
</style>
