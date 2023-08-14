<template>
    <el-card>
        <el-form class="form_box">
            <el-form-item label="一级分类">
                <el-select :disabled="fa.scene?false:true" placeholder="请选择分类" v-model="C1SelectValue" @change="C1Change()">
                    <el-option v-for="v in CategoryStore.C1Arr" :label="v.name" :value="v.id" :key="v.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select :disabled="fa.scene?false:true"  placeholder="请选择分类" v-model="C2SelectValue"  @change="C2Change()">
                    <el-option v-for="v in CategoryStore.C2Arr" :label="v.name" :value="v.id" :key="v.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select :disabled="fa.scene?false:true"  placeholder="请选择分类" v-model="C3SelectValue"  @change="C3Change()">
                    <el-option v-for="v in CategoryStore.C3Arr" :label="v.name" :value="v.id" :key="v.id" />
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup>
import { onMounted, ref } from "vue"
//获取分类仓库store
import useCategoryStore from "@/store/modules/category.js"
let CategoryStore = useCategoryStore()
let C1SelectValue = ref()//1级分类select的值
let C2SelectValue = ref()//2级分类select的值
let C3SelectValue = ref()//3级分类select的值
//组件挂载完毕，就获取1级分类
onMounted(() => {
    //获取1级分类数据
    CategoryStore.getC1Arr()
})
//分类1的select改变时，的回调
const C1Change = () => {
    //修改一级分类id
    CategoryStore.C1Id=C1SelectValue.value
    //清空2、3级分类数据
    CategoryStore.C2Id=null
    CategoryStore.C2Arr=null
    CategoryStore.C3Id=null
    CategoryStore.C3Arr=null
    //清空2、3级select的数据
    C2SelectValue.value=null
    C3SelectValue.value=null
    //清空分类数据
    CategoryStore.CategoryData=null
    //获取二级分类
    CategoryStore.getC2Arr()
}
//分类2的select改变时，的回调
const C2Change = () => {
    //修改二级分类id
    CategoryStore.C2Id=C2SelectValue.value
    //清空3级分类数据
    CategoryStore.C3Id=null
    CategoryStore.C3Arr=null
    //清空3级select的数据
    C3SelectValue.value=null
    //清空分类数据
    CategoryStore.CategoryData=null
    //获取三级级分类
    CategoryStore.getC3Arr()
}
//分类3的select改变时，的回调
const C3Change = () => {
    // 修改三级分类的id
    CategoryStore.C3Id=C3SelectValue.value
    //获取当前分类数据
    
    if(fa.state==1){
        
    }else{
        CategoryStore.getCategoryData()
        
    }
    
}

//获取父组件传递值
let fa = defineProps(['scene',"state"])

</script>

<style lang="scss" scoped>
.form_box {
    display: flex;

    .el-form-item {
        margin-right: 50px;
    }
}
</style>
