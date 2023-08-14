<template>
  <div class="layout_container">
    <!-- 左侧菜单栏 -->
    <div class="layout_slider" :class="{ fold: settingStore.fold }">
      <!-- logo部分 -->
      <Logo></Logo>
      <!-- 菜单部分 -->
      <el-scrollbar>
        <el-menu 
          active-text-color="#87ceeb"
          background-color="#00152b"
          text-color="#fff" 
          :collapse-transition="true"
          :default-active="$route.fullPath"
          :collapse="settingStore.fold"
        >
          <Menu :menuList="userStore.routesData"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabber" :class="{ fold: settingStore.fold }">
      <Tabbar></Tabbar>
    </div>
    <!-- 内容 -->
    <div class="layout_main" :class="{ fold: settingStore.fold }" >
      <Main></Main>
    </div>
  </div>
</template>

<script setup>
import Logo from "./components/logo.vue"
import Menu from "./components/Menu.vue"
import Main from "./components/Main.vue"
import Tabbar from "./components/Tabbar.vue"
//获取仓库内的路由数据
import useUserStore from "@/store/modules/users"
let userStore = useUserStore()



//获取setting仓库内的数据
import useSettingStore from "@/store/modules/setting"
let settingStore = useSettingStore()

//获取当前路由
import { useRoute } from "vue-router"
let $route=useRoute()

</script>

<style lang="scss" scoped>
.layout_container {
  display: flex;
  width: 100%;
  height: 100vh;

  // 左侧菜单栏
  .layout_slider {
    width: $layout_slider_width;
    height: 100vh;
    background-color: $layout_slider_bgColor;
    transition: all .3s;

    &.fold {
      width: $layout_slider_min_width;
    }

    .el-scrollbar {
      color: white;
      height: calc(100vh - 90px);

      .el-menu {
        border: 0;
      }
    }
  }

  // 顶部导航
  .layout_tabber {
    position: fixed;
    top: 0px;
    right: 0px;
    height: $layout_tabbar_height;
    width: calc(100% - $layout_slider_width);
    transition: all .3s;

    &.fold {
      width: calc(100% - $layout_slider_min_width);
    }
  }

  // 内容
  .layout_main {
    margin-top: $layout_tabbar_height;
    padding: 20px;
    overflow: auto; //超出部分显示出滚动条
    width: calc(100% - $layout_slider_width);
    height: calc(100vh - $layout_tabbar_height);
    background-color: white;
    transition: all .3s;
    &.fold {
      width: calc(100% - $layout_slider_min_width);
    }
  }
}
</style>
