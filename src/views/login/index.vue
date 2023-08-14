<template>
  <div class="box_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form :model="userInfo" :rules="rules" ref="loginFrom">
          <h1>Hello</h1>
          <p>欢迎来到homewp后台管理系统</p>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="userInfo.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input prop="password" type="password" :prefix-icon="Lock" v-model="userInfo.password"
              show-password></el-input>
          </el-form-item>
          <el-button @click="loginFn" class="login_btn" type="primary">登录</el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue"
import { User, Lock } from "@element-plus/icons-vue"
import { ElNotification } from "element-plus"
import { useRouter, useRoute } from "vue-router"
import { getTime } from "@/utils/time"
let $router = useRouter()
let $route = useRoute()
let userInfo = reactive({
  username: "admin",
  password: "atguigu123"
})
//获取表单dom
let loginFrom = ref()//注意：变量名要和ref的属性值相同
//validatorUsername规则
let validatorUsername = (rules, value, callback) => {
  if (/^[a-zA-Z0-9_]{5,10}$/.test(value)) {//正则：数字字母下划线组合，长度5-10
    callback()//规则放行
  } else {
    callback(new Error("用户名不符合规则"))//传递一个错误的信息
  }
}

//定义规则
const rules = {
  username: [
    // { required: true, message: '不能为空', trigger: 'blur' },
    // { min: 5, max: 10, message: '长度5-10之间', trigger: 'blur' },
    //自定义校验规则
    { validator: validatorUsername, trigger: "change" }//当输入框改变时触发
  ],
  password: [
    { required: true, message: '不能为空', trigger: 'blur' },
    { min: 5, max: 10, message: '长度5-10之间', trigger: 'blur' },
  ]
}
//引入登录仓库
import useUserStore from "@/store/modules/users"
let userStore = useUserStore()
//登录按钮
const loginFn = () => {
  //保证所有表单数据验证通过在
  loginFrom.value.validate(async (valid, fields) => {
    if (!valid) return //校验失败，停止后面的操作
    try {//promise请求成功
      await userStore.loginUser(userInfo)//使用登录函数，并传递用户信息
      //跳转到首页
      //如果路由器有query.redirect（退出登录的路由信息）
      $router.push({ path: $route.query.redirect || "/" })
      //Element-Plus提示登录成功
      ElNotification({
        type: "success",
        title: "欢迎回来",
        message: `Hi,${getTime()}好！`
      })
    } catch (error) {//promise请求失败
      //Element-Plus提示登录失败
      ElNotification({
        type: "error",
        title: "登录失败",
        message: error.message
      })
    }
  })


}
</script>

<style lang="scss" scoped>
.box_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .el-row {
    .el-col {

      .el-form {
        margin-top: 30vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 500px;
        height: 300px;
        background: url("@/assets/images/login_form.png");
        padding: 40px;

        h1 {
          font-size: 40px;
          color: white;
        }

        p {
          color: white;
        }
      }
    }
  }

  .login_btn {
    color: white;
    width: 100%;
  }
}
</style>
