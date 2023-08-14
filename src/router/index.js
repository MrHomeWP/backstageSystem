//引入创建路由器函数
import {createRouter,createWebHashHistory} from "vue-router"
//创建路由器
import {constantRoutes} from "./routes"//引入routes配置
let router = createRouter({
    history:createWebHashHistory(),//设置路由模式为hash
    routes:constantRoutes
})
export default router   