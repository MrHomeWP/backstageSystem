<template>
    <div class="right">
        <!-- 刷新按钮 -->
        <el-button size="small">
            <SvgIcon class="svg no_margin" name="shuaxin" @click="refreshFn" />
        </el-button>
        <!-- 全屏按钮 -->
        <el-button size="small">
            <SvgIcon class="svg no_margin" name="quanpin" @click="fullScreen" />
        </el-button>
        <!-- 主题颜色设置按钮 -->
        <el-button size="small">
            <SvgIcon class="svg no_margin" name="shezhi" />
        </el-button>
        <!-- 用户头像 -->
        <img :src="userStore.userData.avatar" alt="">
        <!-- 退出登录下拉菜单 -->
        <el-dropdown>
            <span class="el-dropdown-link">
                <span>{{ userStore.userData.name }}</span>
                <el-icon class="el-icon--right">
                    <SvgIcon class="svg no_margin" name="down" />
                </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="logoutFn">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup>
import { } from "vue"
//引入路由和路由器
import { useRouter,useRoute } from "vue-router";
let $router=useRouter()//路由
let $route=useRoute()//路由器
//获取users仓库
import useUserStore from "@/store/modules/users.js"
let userStore = useUserStore()
// 获取setting仓库
import useSettingStore from "@/store/modules/setting.js"
const settingStore = useSettingStore()
//刷新按钮回调
const refreshFn= ()=>{
    settingStore.refreshFlag=!settingStore.refreshFlag
}
//全屏按钮回调
const fullScreen=()=>{
    let full = document.fullscreenElement//获取当前是否全屏
    if(full){//如果当前为全屏
        //退出全屏
        document.exitFullscreen()
    }else{
        //进入全屏
        document.documentElement.requestFullscreen()
    }
}
//退出登录回调
const logoutFn=async ()=>{
    //清除users仓库和用户相关的数据
    await userStore.logout()
    //跳转回登录页面，并携带当前路由信息
    $router.push({
        path:"/login",
        query:{
            redirect:$route.fullPath//当前路由信息
        }
    })
}
</script>

<style lang="scss" scoped>
.svg {
    width: 15px;
    height: 15px;
    fill: #666 ;
}
.right {
    display: flex;
    align-items: center;

    .el-button {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        
    }

    img {
        width:40px;
        height:40px;
        margin: 0 20px;
        border-radius: 50%;
    }

    .el-dropdown {
        span.el-dropdown-link {
            display: flex;
        }
    }

}
</style>
