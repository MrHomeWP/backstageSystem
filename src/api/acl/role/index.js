//导入二次封装axios
import request from '@/utils/request';

//获取角色列表或搜索
export const reqGetRoleList = (page, limit, roleName) => {
	if (roleName) {
		//搜索角色
        return request({
			method: 'get',
			url: `/admin/acl/role/${page}/${limit}?roleName=${roleName}`,
		});
	} else {
		//获取所有角色
		return request({
			method: 'get',
			url: `/admin/acl/role/${page}/${limit}`,
		});
	}
};
//修改|添加角色
export const reqAddOrUpdateRole = (data)=>{
    if(data.id){//有id就发送修改的请求
        return request({
            method:"put",
            url:"/admin/acl/role/update",
            data
        })
    }else{//无id，就是发送添加的请求
        return request({
            method:"post",
            url:"/admin/acl/role/save",
            data
        })
    }
}
//删除角色
export const reqDelRole=(roleId)=>request({
    method:"delete",
    url:`/admin/acl/role/remove/${roleId}`
})

//获取权限数据
export const reqGetPermissionList= (roleId)=>request({
    method:"get",
    url:`/admin/acl/permission/toAssign/${roleId}`
})
// 修改权限
export const reqUpdatePermision= (roleId,permissionId)=>request({
    method:"post",
    url:`/admin/acl/permission/doAssign?roleId=${roleId}&permissionId=${permissionId}`
})