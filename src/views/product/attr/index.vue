<template>
  <div>
    <!-- 1/2/3级分类 -->
    <Category :scene="scene" />
    <!-- 分类数据界面 -->
    <el-card style="margin: 10px 0;">
      <!-- 该分类数据界面 -->
      <div v-show="scene">
        <!-- 添加按钮 -->
        <el-button type="primary" :disabled="CategoryStore.C3Id ? false : true" @click="addProperty">
          <SvgIcon class="svg" name="add" />
          添加属性
        </el-button>
        <!-- 表格展示数据 -->
        <el-table border style="margin-top: 20px;" :data="CategoryStore.CategoryData">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性名称" width="150" prop="attrName">
          </el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, column, $index }">
              <el-tag v-for="v in row.attrValueList" :key="v.id">
                {{ v.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #="{row,column,$index}">
              <!-- 编辑按钮 -->
              <el-button type="primary" @click="updateTrademark(row)">
                <SvgIcon class="svg no_margin" name="bianji" />
              </el-button>
              <!-- 气泡确认框 -->
              <el-popconfirm title="确定删除吗?" @confirm="delTrademark(row.id)">
                <template #reference>
                  <!-- 删除按钮 -->
                  <el-button type="primary">
                    <SvgIcon class="svg no_margin" name="shanchu" />
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性界面 -->
      <div v-show="!scene">
        <!-- 表单部分 -->
        <el-form>
          <el-form-item label="属性名称">
            <el-input class="input1" placeholder="请输入属性名称" v-model="PropertyArr.attrName"></el-input>
          </el-form-item>
        </el-form>
        <!-- 添加属性|取消按钮 -->
        <el-button type="primary" :disabled="PropertyArr.attrName?false:true"  @click="addValueName">
          <SvgIcon class="svg" name="add" />
          添加属性值
        </el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
        <!-- 表格部分 -->
        <el-table border :data="PropertyArr.attrValueList">
          <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{row,$index}">
              <!-- 编辑模式-显示input -->
              <el-input v-focus v-if="row.flag" @blur="saveInput($index)" v-model="row.valueName" placeholder="请输入属性值"></el-input>
              <!-- 查看模式-显示div -->
              <div v-else @click="updateInput($index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{row,column,$index}">
              <!-- 删除属性值按钮 -->
              <el-button type="danger" @click="delAttrValueList($index)">
                <SvgIcon class="svg no_margin" name="shanchu"/>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 保存|取消按钮 -->
        <el-button type="primary" @click="saveProperty" :disabled="PropertyArr.attrValueList.length<=0?true:false">确定</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </div>
    </el-card>

  </div>
</template>

<script setup>
import { ref,reactive,onBeforeUnmount } from "vue"
import { ElMessage } from "element-plus";
// 导入品牌属性的接口
import {reqAddOrUpdateProperty,reqDelProperty} from "@/api/product/attr/index.js"
//引入品牌属性store
import useCategoryStore from "@/store/modules/category.js"
let CategoryStore = useCategoryStore()

let scene = ref(1)//控制是否显示"添加属性界面",true:不显示，false:显示
// 属性值对象
let PropertyArr=reactive({
  attrName: "",//属性名
  attrValueList: [//属性值数组
  ],
  categoryId: "",//3级分类ID
  categoryLevel: 3//固定为3级分类
})
//添加属性按钮回调
let addProperty= ()=>{
  //清空原来的属性值对象
  Object.assign(PropertyArr,{
    attrName: "",//属性名
    attrValueList: [//属性值数组
    ],
    categoryId: "",//3级分类ID
    categoryLevel: 3//固定为3级分类
  })
  // 显示"添加属性"界面
  scene.value=false
}
// 取消按钮回调
let cancel = ()=>{
  //隐藏"添加属性"界面
  scene.value=true
}
// 添加属性值按钮
let addValueName=()=>{
  PropertyArr.attrValueList.push({
    valueName:"",
    flag:true//当前属性值为编辑模式
  })
}
// 编辑属性按钮
let updateTrademark =(row)=>{
  // 显示"添加属性"页面
  scene.value=false
  //修改PropertyArr
  Object.assign(PropertyArr,JSON.parse(JSON.stringify(row)))
  
}
// 删除属性气泡的确认按钮回调
let delTrademark=async (id)=>{
  //调用删除属性接口
  let result =await reqDelProperty(id)
  if(result.code==200){
    ElMessage({
      type:"success",
      message:"删除成功"
    })
    //重新获取数据
    CategoryStore.getCategoryData()
  }else{
    ElMessage({
      type:"success",
      message:"删除失败"
    })
  }
}
//确定提交按钮回调
let saveProperty =async ()=>{
  //更新当前3级分类id
  PropertyArr.categoryId=CategoryStore.C3Id
  //调用接口提交当前数据
  let result = await reqAddOrUpdateProperty(PropertyArr)
  if(result.code==200){
    //提示成功
    ElMessage({
      type:"success",
      message:PropertyArr.id?"修改成功":"添加成功"
    })
    //重新获取当前分类的属性值
    CategoryStore.getCategoryData()
  }else{
    //提示失败
    ElMessage({
      type:"success",
      message:PropertyArr.id?"修改成功":"添加成功"
    })
  }
  //关闭"添加属性"界面
  scene.value=false
}
//属性值input失去焦点回调
let saveInput=($index)=>{
  //获取修改后的属性值
  let temp=PropertyArr.attrValueList[$index].valueName
  //保存的属性值不能为空
  if(!temp.trim()){
    ElMessage({
      type:"error",
      message:"属性值不能为空"
    })
    //删除当前属性值
    PropertyArr.attrValueList.splice($index,1)
    return
  }
  //保存的属性值不能重复
  let repeatFlag=PropertyArr.attrValueList.some((v,i,arr)=>{
      return v.valueName===temp&&i!=$index//值相同,索引不同
  })
  if(repeatFlag){
    ElMessage({
      type:"error",
      message:"属性值不能重复"
    })
    //删除当前属性值
    PropertyArr.attrValueList.splice($index,1)
    return
  }
  //属性值切换为-查看模式
  PropertyArr.attrValueList[$index].flag=false
}
//属性值单击时的回调
let updateInput=($index)=>{
  //属性值切换为-编辑模式
  PropertyArr.attrValueList[$index].flag=true
}
//自定义指令v-focus
const vFocus = {
  //元素或组件更新时调用
  updated(el) {
    el.querySelector("input").focus()
  },
};
//删除属性值按钮回调
let delAttrValueList = ($index)=>{
  PropertyArr.attrValueList.splice($index,1)
}
//组件销毁时,清空仓库
onBeforeUnmount(()=>{
  //清空品牌属性仓库
  CategoryStore.$reset()
})
</script>

<style lang="scss" scoped>
.svg {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  fill: white;

  &.no_margin {
    margin: 0;
  }
}

.el-tag {
  margin: 5px;
}

.input1 {
  width: 250px;
}
.el-table{
  margin: 10px 0;
}
</style>
  