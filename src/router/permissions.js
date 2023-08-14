//引入路由器文件
import router from "@/router/index"
//引入进度条插件
import nProgress from "nprogress"
//引入进度条css样式
import "nprogress/nprogress.css"
//获取用户数据仓库
import useUserStore from "@/store/modules/users"
import pinia from "@/store/index"
let userStore = useUserStore(pinia)
//引入element组件
import { ElNotification } from "element-plus"
//全局路由前置守卫
router.beforeEach(async (to,from,next)=>{
    //进度条插件启动
    nProgress.start()
    //判断是否登录
    if(userStore.token){//已登录
        // 访问登录路由时，重定向到首页
        if(to.path=="/login"){
            next({path:"/home"})
        }else{//访问登录以外的路由
            //判断token是否过期
            try{//token没过期
                await userStore.getUserInfo()//获取登录信息
                next()//放行
            }catch(error){//token过期
                //提示token过期
                ElNotification({
                    title:"登录过期，请重新登录",
                    type:"error"
                })
                //清除当前登录信息
                await userStore.logout()
                //返回登录页面，并保存当前路由信息
                next({
                    path:"/login",//返回登录页面
                    query:{
                        redirect:to.path//保存当前路由信息
                    }
                })
            }
        }
    }else{//未登录
        if(to.path=="/login"){//如果为登录路由
            next()//放行
        }else{
            next({path:"/login"})
        }
    }
})

//全局路由后置守卫
router.afterEach((to,from)=>{
    // 进度条插件结束
    nProgress.done()
    //根据路由修改当前网页标题
    document.title="HP后台管理系统-"+to.meta.title
})