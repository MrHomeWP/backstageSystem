import { createApp } from 'vue'
import App from './App.vue'
//引入所有组件和样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'//国际化配置
//引入全局样式
import "@/styles/index.scss"
// svg插件配置代码
import 'virtual:svg-icons-register'
let app=createApp(App)
//注册全局插件
import globalComponets from "./components/index"
app.use(globalComponets)

//引入并使用路由  
import router from "./router/index.js"
app.use(router)

//引入并使用路由守卫
import '@/router/permissions'

//使用全局自定义指令
import {hasAccess} from "@/directives/hasAccess.js"
hasAccess(app)

//使用ElementPlus插件
app.use(ElementPlus, {
  locale: zhCn,//使用国际化中文
})

//使用pinia大仓库
import store from "@/store/index.js"
app.use(store)


app.mount('#app')

//测试无实现解决跨域的服务器
// import axios from 'axios'
// axios({
//   method:"post",
//   url:"http://localhost:5173/test/api/regiser",
//   data:{
//     username:"admin3",
//     password:"123465"
//   }
// }).then(res=>{
//     console.log(res)
// },err=>{
//   console.log(err)
// })