<template>
	<div>
		<!-- 顶部搜索 -->
		<el-card>
			<el-form class="form">
				<el-form-item label="用户名:">
					<el-input placeholder="请输入搜索的用户名" v-model="searchInfo" style="width: 200px"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="searchUser" :disabled="searchInfo?false:true">搜索</el-button>
					<el-button @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<!-- 搜索结果 -->
		<el-card style="margin-top: 10px">
			<el-button type="primary" @click="addUser" v-hasAccess="'btn.User.add'">添加用户</el-button>
			<el-button type="danger" :disabled="DelIdArr.length ? false : true" @click="delBatch" v-hasAccess="'btn.User.remove'">批量删除</el-button>
			<!-- 表格展示用户数据 -->
			<el-table border :data="usersArr" style="margin: 20px 0" @select="selectHandler">
				<el-table-column type="selection" />
				<el-table-column type="index" label="#" align="center"></el-table-column>
				<el-table-column label="id" align="center" prop="id"></el-table-column>
				<el-table-column label="用户名字" align="center" prop="name"></el-table-column>
				<el-table-column label="用户名称" align="center" prop="username"></el-table-column>
				<el-table-column
					label="用户角色"
					align="center"
					prop="roleName"
					show-overflow-tooltip
				></el-table-column>
				<el-table-column
					label="创建时间"
					align="center"
					prop="createTime"
					show-overflow-tooltip
				></el-table-column>
				<el-table-column
					label="更新时间"
					align="center"
					prop="updateTime"
					show-overflow-tooltip
				></el-table-column>
				<el-table-column label="操作" align="center" width="300">
					<template #="{ row, column, $index }">
						<!-- 分配角色按钮 -->
						<el-button  v-hasAccess="'btn.User.assgin'" size="small" @click="assignRoles(row)">
							<SvgIcon class="svg user" name="user" />
							<span>分配角色</span>
						</el-button>
						<!-- 编辑按钮 -->
						<el-button  v-hasAccess="'btn.User.update'" size="small" type="primary" @click="updateUser(row)">
							<SvgIcon class="svg" name="bianji" />
							<span>编辑</span>
						</el-button>
						<!-- 删除按钮 -->
						<el-popconfirm  v-hasAccess="'btn.User.remove'" title="确定删除吗？" @confirm="deleteUser(row)">
							<template #reference>
								<el-button size="small" type="danger">
									<SvgIcon class="svg" name="shanchu" />
									<span>删除</span>
								</el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页器 -->
			<el-pagination
				v-model:current-page="currentPage"
				v-model:page-size="pageSize"
				:page-sizes="[5, 10, 30, 50]"
				:background="true"
				layout=" prev, pager, next, jumper,->,sizes,total"
				:total="total"
				@size-change="getUserList(1)"
				@current-change="getUserList()"
			/>
		</el-card>

		<!-- Drawer抽屉-展示修改|添加用户界面 -->
		<el-drawer v-model="drawerShow">
			<template #header>
				<h4>{{ drawerTitle }}</h4>
			</template>
			<template #default>
				<el-form :model="userInfo" :rules="rules" ref="formRef">
					<el-form-item label="用户姓名" prop="name">
						<el-input v-model="userInfo.name" placeholder="请输入用户的姓名"></el-input>
					</el-form-item>
					<el-form-item label="用户昵称" prop="username">
						<el-input v-model="userInfo.username" placeholder="请输入用户的昵称"></el-input>
					</el-form-item>
					<el-form-item v-if="drawerTitle == '添加用户'" label="用户密码" prop="password">
						<el-input v-model="userInfo.password" placeholder="请输入用户的密码"></el-input
					></el-form-item>
				</el-form>
			</template>
			<template #footer>
				<div style="flex: auto">
					<el-button @click="cancelClick">取消</el-button>
					<el-button type="primary" @click="confirmClick">确定</el-button>
				</div>
			</template>
		</el-drawer>

		<!-- Drawer抽屉-展示分配角色界面 -->
		<el-drawer v-model="drawerShow2">
			<template #header>
				<h4>分配角色</h4>
			</template>
			<template #default>
				<el-form label-width="100">
					<!-- 用户名 -->
					<el-form-item label="用户名">
						<el-input :disabled="true" v-model="userInfo.username"></el-input>
					</el-form-item>
					<!-- 用户角色 -->
					<el-form-item label="职位列表" class="lineFeed">
						<el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
							>全选</el-checkbox
						>
						<br />
						<el-checkbox-group v-model="checkedArr" @change="handleCheckedCitiesChange">
							<el-checkbox v-for="v in checkArr" :key="v" :label="v">{{ v.roleName }}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-form>
			</template>
			<template #footer>
				<div style="flex: auto">
					<el-button @click="roleCancel">取消</el-button>
					<el-button type="primary" @click="roleConfirm">确定</el-button>
				</div>
			</template>
		</el-drawer>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import {
	reqGetUserList,
	reqAddOrUpdateUser,
	reqGetRoles,
	reqUpdateRoles,
	reqDelUser,
	reqBatchDelUser
} from '@/api/acl/user/index';
//导入用户管理的相关API接口
import { ElMessage } from 'element-plus';
//获取当前登录用户信息
import useUserStore from '@/store/modules/users';
let userStore = useUserStore();
//当前页
let currentPage = ref(1);
//每页展示数量
let pageSize = ref(5);
//总数量
let total = ref(10);
//已有用户数据
let usersArr = ref([]);
// 控制Drawer组件显示（添加|修改角色的界面）
let drawerShow = ref(false);
//控制Drawer组件的标题
let drawerTitle = ref();
//添加|修改用户的数据
let userInfo = reactive({
	id: null,
	name: '',
	username: '',
	password: '',
});
//判断是否修改自己
let flagMyself = ref(false);
//获取表单实例
let formRef = ref();
//组件一挂载完毕,就获取用户数据
onMounted(() => {
	getUserList();
});
//获取已有用户数据的函数
const getUserList = async (init) => {
	//如果有传参，就初始化到第一页
	if (init) currentPage.value = 1;
	let result = await reqGetUserList(currentPage.value, pageSize.value,searchInfo.value);
	if (result.code == 200) {
		usersArr.value = result.data.records;
		total.value = result.data.total;
	}
};
// 添加用户按钮回调
const addUser = () => {
	//显示Drawer
	drawerShow.value = true;
	//显示标题为"添加用户"
	drawerTitle.value = '添加用户';
	//清空表单数据
	Object.assign(userInfo, {
		id: null,
		name: '',
		username: '',
		password: '',
	});
	nextTick(() => {
		//第一次添加用户，是没有form表单实例，需要nextTick
		//清除表单的上一次校验
		formRef.value.resetFields();
	});
};
// 删除用户按钮的回调
const deleteUser = async (row) => {
	let result = await reqDelUser(row.id);
	if (result.code == 200) {
		ElMessage({ type: 'success', message: '删除成功' });
		// 重新获取用户数据
		if (usersArr.value.length <= 1) currentPage.value -= 1; //如果只剩下一个用户，删除后翻到上一页
		getUserList();
	} else {
		ElMessage({ type: 'error', message: '删除失败:' + result.data });
	}
};
//批量删除的id数组
let DelIdArr = ref([]);
// 表格复选框回调
const selectHandler = (selection, row) => {
	//更新当前选中的id
	DelIdArr.value = selection.map((v, i, arr) => {
		//只映射id，其他数据不需要
		return v.id;
	});
};
//批量删除按钮的回调
const delBatch = async () => {
	let result = await reqBatchDelUser(DelIdArr.value);
	if (result.code == 200) {
		ElMessage({ type: 'success', message: '批量删除成功' });
		//重新获取用户数据
		getUserList();
	} else {
		ElMessage({ type: 'error', message: '批量删除失败' });
	}
};
//编辑用户按钮回调
const updateUser = (row) => {
	//显示Drawer
	drawerShow.value = true;
	//显示标题为"更新用户"
	drawerTitle.value = '更新用户';
	//获取修改用户的id、username、name
	Object.assign(userInfo, row);
	//判断是不是修改自己
	flagMyself.value = row.username === userStore.userData.name ? true : false;
	//清除表单的上一次校验
	formRef.value.resetFields();
};
//drawer抽屉里的确定按钮回调
const confirmClick = async () => {
	//发送请求前，校验表单数据
	await formRef.value.validate();
	//发送修改|添加请求
	let result = await reqAddOrUpdateUser(userInfo);
	if (result.code == 200) {
		ElMessage({ type: 'success', message: userInfo.id ? '修改成功' : '添加成功' });
		//重新获取数据
		getUserList(userInfo.id ? null : 1);
		//刷新页面，解决修改自己username的问题
		if (flagMyself.value) window.localtion.reload();
	} else {
		ElMessage({ type: 'error', message: (userInfo.id ? '修改失败:' : '添加失败:') + result.data });
	}
	//关闭Drawer
	drawerShow.value = false;
};
// drawer抽屉里的取消按钮回调
const cancelClick = () => {
	//关闭Drawer
	drawerShow.value = false;
};
//name的具体校验规则
let validatorName = (rule, value, callback) => {
	if (value.trim().length < 5) {
		callback(new Error('姓名不能少于5'));
	} else {
		callback();
	}
};
//username的具体校验规则
let validatorUsername = (rule, value, callback) => {
	if (value.trim().length < 5) {
		callback(new Error('昵称不能少于5'));
	} else {
		callback();
	}
};
//username的具体校验规则
let validatorPassword = (rule, value, callback) => {
	if (value.trim().length < 6) {
		callback(new Error('密码不能少于6'));
	} else {
		callback();
	}
};
//表单的校验规则
let rules = reactive({
	name: [{ required: true, trigger: 'blur', validator: validatorName }],
	username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
	password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
});

// 控制Drawer组件显示（分配角色的界面）
let drawerShow2 = ref(false);
//分配角色的按钮回调
let assignRoles = async (row) => {
	// 显示对应的Drawer
	drawerShow2.value = true;
	//获取当前用户的信息
	Object.assign(userInfo, row);
	//发送请求获取用户的角色信息
	let result = await reqGetRoles(row.id);
	if (result.code == 200) {
		//获取所属角色
		checkedArr.value = result.data.assignRoles;
		//获取所有角色
		checkArr.value = result.data.allRolesList;
	}
};
let checkAll = ref(false); //控制全选框的值
let isIndeterminate = ref(true); //控制全选框的样式,true:-，false:√
let checkedArr = ref(['2', '4']); //已选内容
let checkArr = ref(['1', '2', '3', '4']); //可选内容
// 全选框按钮的回调
let handleCheckAllChange = () => {
	//如果checkAll为true：就全选，false:全不选
	checkedArr.value = checkAll.value ? checkArr.value : [];
	//改为√样式
	isIndeterminate.value = false;
};
// 每个复选框按钮的回调
let handleCheckedCitiesChange = (value) => {
	const checkedCount = value.length;
	//如果全选，全选框的值为true
	checkAll.value = checkedCount === checkArr.value.length;
	//如果没全选，且有选择一些，全选框样式为-
	isIndeterminate.value = checkedCount > 0 && checkedCount < checkArr.value.length;
};
//取消按钮回调（分配角色的界面）
const roleCancel = () => {
	//关闭界面
	drawerShow2.value = false;
};
//确定按钮回调（分配角色的界面）
const roleConfirm = async () => {
	//发送请求提交修改
	let result = await reqUpdateRoles({
		roleIdList: checkedArr.value.map((v, i, arr) => {
			//映射id，其他数据不要
			return v.id;
		}),
		userId: userInfo.id,
	});
	if (result.code == 200) {
		ElMessage({ type: 'success', message: '分配角色成功' });
		//重新获取用户信息
		getUserList();
	} else {
		ElMessage({ type: 'error', message: '分配角色失败' });
	}
	//关闭drawer抽屉（分配角色的界面）
	drawerShow2.value = false;
};

// 搜索用户按钮回调
let searchInfo = ref();
const searchUser = async () => {
	//发送搜索请求
	let result = await reqGetUserList(currentPage.value, pageSize.value, searchInfo.value);
	if (result.code == 200) {
		usersArr.value = result.data.records;
		total.value = result.data.total;
	}
};
//重置按钮回调
const reset = ()=>{
    //清空搜索框
    searchInfo.value=null
    //重新获取数据
    getUserList(1)
}
</script>

<style lang="scss" scoped>
.user {
	fill: inherit;
}
.form {
	display: flex;
	justify-content: space-between;
}
</style>
<style>
.form .el-form-item {
	margin-bottom: 0;
}
.lineFeed .el-form-item__content {
	display: block;
}
</style>
