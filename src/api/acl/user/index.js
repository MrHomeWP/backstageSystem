//引入二次封装的axios
import request from "@/utils/request";
//获取已有用户数据或搜索
export const reqGetUserList = (page,limit,username)=>{
    if(username){//进行搜索
        return request({
            method:"get",
            url:`/admin/acl/user/${page}/${limit}?username=${username}`
        })
    }else{//获取所有
        return request({
            method:"get",
            url:`/admin/acl/user/${page}/${limit}`
        })
    }
}
//修改|添加用户
export const reqAddOrUpdateUser = (data)=>{
    if(data.id){
        //发送修改请求
        return request({
            method:"put",
            url:`/admin/acl/user/update`,
            data
        })
    }else{
        //发送添加请求
        return request({
            method:"post",
            url:`/admin/acl/user/save`,
            data
        })
    }
}

// 删除用户
export const reqDelUser = (id)=>request({
    method:'delete',
    url:`/admin/acl/user/remove/${id}`
})
//批量删除用户
export const reqBatchDelUser= (data)=>request({
    method:"delete",
    url:"/admin/acl/user/batchRemove",
    data
})
//根据id获取用户所属角色和所有角色信息
export const reqGetRoles = (adminId)=>request({
    method:'get',
    url:`/admin/acl/user/toAssign/${adminId}`
})

//修改用户所属角色
export const reqUpdateRoles = (data)=>request({
    method:"post",
    url:"/admin/acl/user/doAssignRole",
    data
})