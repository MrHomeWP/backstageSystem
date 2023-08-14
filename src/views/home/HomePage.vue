<template>
  <div>
    <el-card>
      <div class="box">
        <img :src="userStore.userData.avatar" alt="">
        <div>
          <h3>{{ getTime() }}好~{{ userStore.userData.name }}</h3>
          <p>Vue-admin</p>
        </div>
      </div>
    </el-card>
    <div class="box2">
      <SvgIcon class="svgs" name="welcome"/>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue"
import useUserStore from "@/store/modules/users.js"
import {getTime} from "@/utils/time"
let userStore = useUserStore()
</script>

<style lang="scss" scoped>
.box{
  display:flex;
  img{
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  div{
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 20px;
    h3{
      font-size: 30px;
      font-weight: bold;
    }
    p{
      margin-top: 20px;
      font-size: 20px;
      font-weight: bold;
      color: #999;
      font-style: italic;
      opacity: .5;
      
    }
  }
}
.box2{
  margin-top: 20px;
  display: flex;
  justify-content: center;
  .svgs{
  width: 500px;
  height: 300px;
}
}

</style>
