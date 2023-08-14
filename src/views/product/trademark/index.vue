<template>
  <el-card class="box-card">
    <!-- 添加按钮 -->
    <el-button type="primary" @click="addButtonFn">
      <SvgIcon class="svg" name="add" />
      品牌管理
    </el-button>
    <!-- 表格 -->
    <el-table :border="true" :data="trademarkArr">
      <el-table-column label="序号" width="100" :align="'center'" type="index"/>
      <el-table-column label="品牌名称" prop="tmName"/>
      <el-table-column label="品牌LOGO">
        <template #="{row,column,$index}">
          <img :src="row.logoUrl" alt="资源有误">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #="{row,column,$index}">
          <!-- 编辑按钮 -->
          <el-button type="primary" @click="updateTrademark(row)">
            <SvgIcon class="svg no_margin" name="bianji"/>
          </el-button>
          <!-- 气泡确认框 -->
          <el-popconfirm 
            title="确定删除吗？"
            width="200"
            @confirm="delTrademark(row.id)"
          >
            <template #reference>
              <!-- 删除按钮 -->
              <el-button type="primary">
                <SvgIcon class="svg no_margin" name="shanchu"/>
              </el-button>
            </template>
          </el-popconfirm>
        </template>
        
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="page_current"
      v-model:page-size="page_size"
      :page-sizes="[3, 5, 9, 10]"
      :background="true"
      layout="prev, pager, next,jumper,->, sizes,total"
      :total="page_total"
    />
    <!-- 对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="operationState"
      :before-close="handleClose"
      width="50%"
    >
      <el-form 
        label-width="120px"
        :model="trademarkParams"
        :rules="rules"
        style="width: 80%;"
        ref="tradeForm"
      >
        <el-form-item label="品牌名称：" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO：" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="http://sph-api.atguigu.cn/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <SvgIcon name="add"/>
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">
            取消
          </el-button>
          <el-button type="primary" @click="confirm">
            确定
          </el-button>
        </span>
      </template>
  </el-dialog>
  </el-card>
</template>
  
<script setup>
import { ElMessage } from "element-plus";
import { ref,onMounted,watch,reactive,computed,nextTick} from "vue"
//导入品牌API接口
import {getTrademark,addTrademark,reqTrademark} from "@/api/product/trademark/index"
let page_current=ref(1)//当前页
let page_size=ref(3)//每页显示数量
let page_total=ref(3)//总页数
let trademarkArr=ref([])//品牌数据
let dialogVisible=ref(false)//控制对话框显示
let trademarkParams=reactive({//品牌属性
    id:0,
    tmName:"",
    logoUrl:""
})
//获取表单实例
let tradeForm=ref()
//当前操作状态是修改品牌|添加品牌
let operationState=computed(()=>{
  if(trademarkParams.id==0){
    return "添加品牌"
  }else{
    return "修改品牌"
  }
})
//获取品牌数据函数
let getTrademarkArr=async()=>{
  let result=await getTrademark(page_current.value,page_size.value)
    if(result.code==200){ //如果获取成功
      page_total.value=result.data.total//获取总页数
      trademarkArr.value=result.data.records//获取品牌数据
      if(trademarkArr.value[0].tmName=="小米"){
        trademarkArr.value[0].logoUrl="http://"+trademarkArr.value[0].logoUrl
      }
    }
}
onMounted( ()=>{
  getTrademarkArr()//调用“获取品牌数据”函数
})
//监听当前页和每页显示数量
watch([page_current,page_size],(newValue,oldValue)=>{
  //发生改变，重新调用“获取品牌数据”函数
  if(newValue[1]!=oldValue[1]){//如果是“每页显示数量”发生改变
    // 重置页码器到第1页
    page_current.value=1
  }
    getTrademarkArr()//重新调用“获取品牌数据”函数
})
//对话框关闭按钮回调
let handleClose=(done)=>{
  //清除表单校验提醒
  nextTick(()=>{
    tradeForm.value.clearValidate()
  })
  done()//关闭对话框
}
//对话框取消按钮
let cancel =()=>{
  //隐藏对话框
  dialogVisible.value=false
  //清除表单校验提醒
  nextTick(()=>{
    tradeForm.value.clearValidate()
  })
}
//对话框确定按钮
let confirm =async()=>{
  try {
    //校验表单
    await tradeForm.value.validate()
    //发送添加品牌接口
    let result=await addTrademark(trademarkParams)
    if(result.code==200){
      ElMessage({
        type:"success",
        message:operationState.value+"成功"
      })
    }else{
      ElMessage({
        type:"error",
        message:operationState.value+"失败"
      })
    }
    //隐藏对话框
    dialogVisible.value=false
    //重新渲染界面
    getTrademarkArr()
  } catch (error) {
    
  }
}
//添加品牌按钮
let addButtonFn=()=>{
  //显示对话框
  dialogVisible.value=true
  //清空表单数据
  trademarkParams.id=0
  trademarkParams.tmName=""
  trademarkParams.logoUrl=""
}
// 修改品牌按钮
let updateTrademark=(row)=>{
  //显示对话框
  dialogVisible.value=true
  //更新当前trademarkParams
  Object.assign(trademarkParams, row);

}
// 上传图片成功之前的回调
let beforeAvatarUpload =(rawFile)=>{
  console.log(rawFile)
    //限制文件为jpg|gif|png
    if(!(rawFile.type=="image/jpeg"||rawFile.type=="image/gif"||rawFile.type=="image/png")){
      ElMessage({
        message: '上传文件格式必须为jpg|gif|png',
        type: 'error',
      })
      return false//停止上传
    }else if(rawFile.size/1024/1024>4){//限制文件大小<=4Mb
      ElMessage({
        message: '上传文件大小需要小于4M',
        type: 'error',
      })
      return false//停止上传
    }
    return true//继续上传
}
// 上传图片成功之后的回调
let handleAvatarSuccess =(response,uploadFile)=>{
    //修改对话框的图片地址
    trademarkParams.logoUrl=response.data
}
//品牌名的校验规则
let validatorTmName=(rule,value,callback)=>{
  //value去除空格后长度>=2
  if(/^.{2,}$/.test(value.trim())){
      callback()//通过检验
  }else{
      callback(new Error("长度小于2"))
  }
}
//品牌图片的验证
let validatorLogoUrl=(rule,value,callback)=>{
  if(value){
    callback()//通过检验
  }else{
    callback(new Error("图片不能为空"))
  }
}
//表单校验规则
const rules=reactive({
  tmName:[
    {required:true,trigger:"blur",validator:validatorTmName}
  ],
  logoUrl:[
    {required:true,validator:validatorLogoUrl}
  ]
})

//删除按钮的气泡框的确认按钮回调
let delTrademark=async(id)=>{
  //发送删除接口
  let result =await reqTrademark(id)
  if(result.code==200){
    //提示删除成功
    ElMessage({
      type:"success",
      message:"删除成功"
    })
    //重新渲染页面
    getTrademarkArr()
    //如果为最后一个，就翻到前一页
    if(trademarkArr.value.length<=1){
      page_current.value-=1
    }

  }else{
    //提示删除失败
    ElMessage({
      type:"error",
      message:"删除失败，"+result.data
    })
  }
}

</script>
<script>
export default {
  name:"tradeMark"
}
</script>
<style lang="scss" scoped>
.svg {
  width: 15px;
  height: 15px;
  fill: white;
  margin-right: 10px;
  &.no_margin{
    margin: 0;
  }
}
.el-table{
  margin: 20px 0;
}
img{
  width: 100px;
}
</style>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
  