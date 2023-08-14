//引入二次封装的axios
import request from '@/utils/request';

//获取菜单数据
export const reqGetPermisssion = () =>
	request({
		method: 'get',
		url: '/admin/acl/permission',
	});

//添加|修改菜单
export const reqAddOrUpdatePermisssion = (data) => {
	if (data.id) {
		//有id就是修改菜单
		return request({
			method: 'put',
			url: '/admin/acl/permission/update',
			data,
		});
	} else {
		//无id就是添加菜单
		return request({
			method: 'post',
			url: '/admin/acl/permission/save',
			data,
		});
	}
};
//删除菜单
export const reqDelPermisssion = (id) =>
	request({
		method: 'delete',
		url: `/admin/acl/permission/remove/${id}`,
	});
