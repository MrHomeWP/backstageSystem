<template>
    <div class="tabbar_box">
        <!-- 左边面包屑 -->
        <Left/>
        <!-- 右边视图设置 -->
        <Right/>
    </div>
</template>

<script setup>
import Left from "@/views/home/components/Tabbar-child/Left.vue"
import Right from "@/views/home/components/Tabbar-child/Right.vue"
</script>

<style lang="scss" scoped>



.tabbar_box {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #bbb;
    padding: 0 20px;

    

}</style>
