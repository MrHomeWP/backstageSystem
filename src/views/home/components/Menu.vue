<template>
    <template v-for="v in menuList" :key="v.path">
        <!-- 如果没有子路由 -->
        <el-menu-item v-if="!v.children && !v.meta.hidden" :index="v.path" @click="goRouter($event)">
            <el-icon><SvgIcon class="svg" :name="v.meta.svgName"/></el-icon>
            <template #title>
                {{ v.meta.title }}
            </template>
            
        </el-menu-item>
        <!-- 有子路由,但只有一个 -->
        <el-menu-item v-else-if="v.children && v.children.length === 1" :index="v.children[0].path" @click="goRouter($event)">
            <el-icon><SvgIcon class="svg" :name="v.children[0].meta.svgName"/></el-icon>
            <template #title>
                {{ v.children[0].meta.title }}
            </template>
        </el-menu-item>
        <!-- 有子路由 -->
        <el-sub-menu v-else-if="v.children && !v.meta.hidden" :index="v.path">
            <template #title>
                <el-icon><SvgIcon class="svg" :name="v.meta.svgName"/></el-icon>
                <span>{{ v.meta.title }}</span>
            </template>
            <Menu :menuList="v.children"></Menu>
        </el-sub-menu>
    </template>
</template>

<script setup>
import { } from "vue"
import { useRouter } from "vue-router"
let $router = useRouter()
//获取父组件传递的数据
defineProps(["menuList"])
//菜单按钮效果
function goRouter($event) {
    //路由跳转
    $router.push($event.index)
}
</script>
<script>
export default {//实现递归组件
    name: "Menu"
}
</script>

<style lang="scss" scoped>
.svg {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    fill: currentColor;
}
.el-icon{
    display: block;
}

.svg.is_active {
    fill: skyblue;
}
</style>
