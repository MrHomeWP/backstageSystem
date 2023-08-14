//导入二次封装好的axios
import request from "@/utils/request";

//登录接口函数
export const regLogin=(data)=>request({
    method:"post",
    url:"/admin/acl/index/login",
    data
})

//获取用户信息接口函数
export const userInfo=()=>request({
    method:"get",
    url:"/admin/acl/index/info"
})

//退出登录接口
export const logout=()=>request({
    method:"post",
    url:"/admin/acl/index/logout"
})