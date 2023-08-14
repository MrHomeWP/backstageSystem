//引入pinia创建小仓库方法
import {defineStore} from "pinia"
//引入user的API接口
import { regLogin,userInfo,logout } from "@/api/user"
//引入路由器
import router from "@/router/index.js"
//引入路由数据routes
import {constantRoutes,asyncRoutes} from "@/router/routes.js"
//引入lodash的深拷贝方法
import cloneDeep from "lodash/cloneDeep"
//递归过滤路由的函数
let filterRouters = (baseRouters,criteriaArr)=>{
    //返回过滤数组
    return baseRouters.filter(v1=>{
        //判断包不包含该路由
        let flag=criteriaArr.some(v2=>{
            return v1.name == v2
        })
        //如果有flag为true就返回
        if(flag){
            //如果有子路由
            if(v1.children&&v1.children.length>0){
                //过滤子路由
                v1.children=filterRouters(v1.children,criteriaArr)
            }
            return true
        }
    })
}
//选择式API创建小仓库
let useUserStore = defineStore("user",{
    //仓库数据
    state:()=>{
        return{
            token:localStorage.getItem("TOKEN"),
            routesData:[],//路由权限
            buttonData:[],//按钮权限
            userData:{},//用户数据
        }
    },
    //仓库方法
    actions:{
        //登录方法
        async loginUser(userInfo){
            //调用登录API
            let result=await regLogin(userInfo)
            //登录成功
            if(result.code==200){
                //保存token
                this.token=result.data
                localStorage.setItem("TOKEN",result.data)

                //获取用户信息
                await this.getUserInfo()
                
                return "ok"
            }else{//登录失败
                //返回一个错误promise
                return Promise.reject(new Error(result.data))
            }
        },
        //退出登录方法
        async logout(){
            //调用退出登录API
            let result = await logout();
            if(result.code==200){//退出登录成功
                //清除用户相关数据
                this.userData=""
                //清除localStorage的token
                localStorage.removeItem("TOKEN")
                //清除仓库的token
                this.token=""
                return "ok"
            }else{//退出登录失败
                return Promise.reject(new Error(result.message))
            }

            
        },
        //获取用户信息方法
        async getUserInfo(){
            //调用获取用户信息API
            let result = await userInfo()
            //如果获取用户信息成功
            if(result.code==200){
                //保存当前用户信息到仓库
                this.userData=result.data
                //保存按钮权限信息
                this.buttonData=result.data.buttons

                //根据“用户权限信息”过滤路由
                let filterData=filterRouters(cloneDeep(asyncRoutes),this.userData.routes)
                this.routesData=[...constantRoutes,...filterData]//基础信息+过滤后的信息
                //添加路由
                filterData.forEach(v=>{
                    router.addRoute(v)
                })
                return "ok"
            }else{//获取用户信息失败
                //返回一个错误的promise
                return Promise.reject(new Error(result.message))
            }
        }
    },
    //计算属性
    getters:{

    }
})

export default useUserStore