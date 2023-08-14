<template>
    <div class="left">
        <!-- 菜单折叠按钮 -->
        <SvgIcon class="svg father" :name="nameFole" @click="MenuFold" />
        <!-- 面包屑 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item 
            v-for="(v,i) in $route.matched"
            :key="i" 
            v-show="v.meta.title" 
            :to="v.path"
        >
                <div class="el-breadcrumb__inner-box">
                    <SvgIcon class="svg" :name="v.meta.svgName" />
                    <span>{{ v.meta.title }}</span>
                </div>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script setup>
import {ref } from "vue"
//获取当前路由
import { useRoute } from "vue-router"
const $route = useRoute()

let nameFole =  ref("zhankai")
//引入setting仓库
import useSettingStore from "@/store/modules/setting.js"
let SettingStore = useSettingStore()
//菜单折叠按钮
const MenuFold=()=>{
    //修改仓库fold值
    SettingStore.fold = !SettingStore.fold
    //修改图片name值
    if(nameFole.value=="zhankai"){
        nameFole.value="zhedie"
    }else{
        nameFole.value="zhankai"
    }
}
</script>

<style lang="scss" scoped>
.left {
    height: 50px;
    display: flex;
    align-items: center;

    .svg {
        width: 20px;
        height: 20px;
        fill:#666;
    }

    .svg.father {
        margin-right: 20px;
    }

    .el-breadcrumb {
        span.el-breadcrumb__item {
            .el-breadcrumb__inner {
                .el-breadcrumb__inner-box {
                    display: flex;
                    align-items: center;

                    .svg {
                        margin-right: 5px;
                    }
                }
            }
        }
    }
}
</style>
