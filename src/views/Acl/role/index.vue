<template>
	<div>
		<!-- 顶部搜索 -->
		<el-card>
			<el-form class="form">
				<el-form-item label="职位搜索">
					<el-input
						placeholder="请输入职位"
						v-model="SearchRoleName"
						@keydown.enter="getRoleList(1)"
					></el-input>
				</el-form-item>
				<el-form-item>
					<!-- 搜索按钮 -->
					<el-button type="primary" :disabled="SearchRoleName ? false : true" @click="getRoleList(1)"
						>搜索</el-button
					>
					<!-- 重置按钮 -->
					<el-button @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<!-- 底部数据展示 -->
		<el-card style="margin-top: 20px">
			<!-- 添加职位按钮 -->
			<el-button type="primary" @click="addRole">
				<SvgIcon class="svg" name="add" />
				<span>添加职位</span>
			</el-button>
			<!-- 表格展示数据 -->
			<el-table class="role" border style="margin: 20px 0" :data="RoleInfoArr">
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column label="ID" prop="id"></el-table-column>
				<el-table-column label="职位名称" prop="roleName"></el-table-column>
				<el-table-column label="创建时间" prop="createTime"></el-table-column>
				<el-table-column label="更新时间" prop="updateTime"></el-table-column>
				<el-table-column label="操作" width="300">
					<template #="{ row, column, $index }">
						<!-- 分配权限按钮 -->
						<el-button size="small" @click="updatePermission(row)">
							<SvgIcon class="svg black" name="user" />
							分配权限
						</el-button>
						<!-- 编辑按钮 -->
						<el-button size="small" type="primary" @click="updateRole(row)">
							<SvgIcon class="svg" name="bianji" />
							编辑
						</el-button>
						<!-- 删除按钮 -->
						<el-popconfirm title="确定删除吗?" @confirm="delRole(row)">
							<template #reference>
								<el-button size="small" type="danger">
									<SvgIcon class="svg" name="shanchu" />
									删除
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
				:page-sizes="[10, 20, 30, 40]"
				:background="true"
				layout=" prev, pager, next, jumper,->,sizes,total"
				:total="total"
				@size-change="getRoleList(1)"
				@current-change="getRoleList()"
			/>
		</el-card>

		<!-- 添加|修改角色Dialog对话框 -->
		<el-dialog v-model="DialogVisible">
			<!-- 标题插槽 -->
			<template #header>
				{{ RoleInfo.id ? '修改职位' : '添加职位' }}
			</template>
			<!-- 内容部分 -->
			<el-form :model="RoleInfo" :rules="rules" ref="RefForm">
				<el-form-item label="职位名称" prop="roleName">
					<el-input v-model="RoleInfo.roleName" placeholder="请输入职位名称"></el-input>
				</el-form-item>
			</el-form>

			<!-- 底部插槽 -->
			<template #footer>
				<el-button @click="cancel">取消</el-button>
				<el-button type="primary" @click="confirm">确定</el-button>
			</template>
		</el-dialog>

		<!-- 分配权限的Drawer抽屉 -->
		<el-drawer v-model="drawer">
			<!-- 标题 -->
			<template #header>
				<h4>分配权限</h4>
			</template>
			<!-- 内容 -->
			<template #default>
				<!-- 树形控件 -->
				<el-tree
					:data="permissionArr"
					show-checkbox
					node-key="id"
					default-expand-all
					:default-checked-keys="checkedArr"
					:props="defaultProps"
					ref="tree"
				/>
			</template>
			<!-- 底部 -->
			<template #footer>
				<div style="flex: auto">
					<el-button @click="cancelClick">取消</el-button>
					<el-button type="primary" @click="confirmClick">确定</el-button>
				</div>
			</template>
		</el-drawer>
	</div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
//导入角色管理相关的API接口
import {
	reqGetRoleList,
	reqAddOrUpdateRole,
	reqGetPermissionList,
	reqUpdatePermision,
	reqDelRole,
} from '@/api/acl/role/index.js';
import { ElMessage } from 'element-plus';
//当前页
let currentPage = ref(1);
//每页显示数量
let pageSize = ref(10);
//总数量
let total = ref(11);
//搜索框数据
let SearchRoleName = ref();
//角色列表的数据
let RoleInfoArr = ref([]);
//控制添加|修改角色的Dialog
let DialogVisible = ref(false);
//组件已挂载完成，就是获取数据
onMounted(() => {
	getRoleList();
});
//获取角色列表函数
let getRoleList = async (init) => {
	// 有传参，就初始化到第一页
	if (init) currentPage.value = 1;
	//发送请求
	let result = await reqGetRoleList(currentPage.value, pageSize.value, SearchRoleName.value);
	if (result.code == 200) {
		//更新数据
		RoleInfoArr.value = result.data.records;
		total.value = result.data.total;
	}
};
//重置按钮回调
const reset = () => {
	//清空搜索框
	SearchRoleName.value = '';
	//重新获取角色列表
	getRoleList();
};

//获取表单实例
let RefForm = ref();
// 单个角色信息
let RoleInfo = reactive({
	id: null,
	roleName: null,
});
// 自定义角色名的校验规则
let validatorRoleName = (rule, value = '', callback) => {
	if (!value) {
		callback(new Error('不能为空'));
	} else if (value.trim().length <= 2) {
		callback(new Error('长度不小于2'));
	}

	callback();
};
// 表单验证规则
const rules = reactive({
	roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
});
// 添加角色按钮的回调
const addRole = () => {
	//显示Dialog
	DialogVisible.value = true;
	//清空数据
	Object.assign(RoleInfo, {
		id: null,
		roleName: null,
	});
	//清除上次规则
	RefForm.value.resetFields();
};
// 修改角色按钮的回调
const updateRole = (row) => {
	//显示Dialog
	DialogVisible.value = true;
	//获取角色的数据
	Object.assign(RoleInfo, row);
	//清除上次规则
	RefForm.value.resetFields();
};
// 取消按钮的回调
const cancel = () => {
	//隐藏Dialog
	DialogVisible.value = false;
};
// 确认按钮的回调
const confirm = async () => {
	//发送前，验证表单
	await RefForm.value.validate();
	//发送请求
	let result = await reqAddOrUpdateRole(RoleInfo);
	if (result.code == 200) {
		ElMessage({ type: 'success', message: RoleInfo.id ? '修改成功' : '添加成功' });
		// 重新获取角色列表
		getRoleList(RoleInfo.id ? null : 1); //添加，就传参1，表示初始化到第一页
	} else {
		ElMessage({ type: 'error', message: RoleInfo.id ? '修改失败' : '添加失败' });
	}
	//隐藏Dialog
	DialogVisible.value = false;
};

//删除角色按钮回调
const delRole = async (row)=>{
  let result = await reqDelRole(row.id)
  if(result.code==200){
    ElMessage({type:"success",message:"删除成功"})
    //重新获取角色列表
    //如果删除的是最后一个,则删除后,翻到前一页
    if(RoleInfoArr.value.length<=1) currentPage.value-=1
    getRoleList()
  }else{
    ElMessage({type:"error",message:"删除失败"})
  }
}

//所有权限数据
let permissionArr = ref([]);
//已有权限
let checkedArr = ref([]);
//控制分配权限Drawer界面的显示
let drawer = ref(false);
//分配权限按钮的回调
let updatePermission = async (row) => {
	//显示界面
	drawer.value = true;
	// 获取角色信息
	Object.assign(RoleInfo, row);
	//获取该角色权限
	let result = await reqGetPermissionList(RoleInfo.id);
	if (result.code == 200) {
		permissionArr.value = result.data;
		//获取所有已有权限的id
		checkedArr.value = recursionGetDeepId(permissionArr.value, []);
	}
};
// 递归获取所有最深层级,已有权限的id
const recursionGetDeepId = (oldArr, newArr) => {
	oldArr.forEach((v) => {
		if (v.select && v.children.length <= 0) {
			//如果是已有权限,且是最深层级
			newArr.push(v.id);
		}
		if (v.children && v.children.length > 0) {
			//否则就递归下一层
			recursionGetDeepId(v.children, newArr);
		}
	});

	return newArr;
};

// 取消分配权限按钮的回调
const cancelClick = () => {
	//关闭界面
	drawer.value = false;
};
//获取树形组件的实例
let tree = ref();
// 确定分配权限按钮的回调
const confirmClick = async () => {
	//整理数据
	let arr1 = tree.value.getCheckedKeys(); //已选择的最深层级id
	let arr2 = tree.value.getHalfCheckedKeys(); //半选择的父级id
	let permissionId = [...arr1, ...arr2];
	//发送请求
	let result = await reqUpdatePermision(RoleInfo.id, permissionId);
	if (result.code == 200) {
		ElMessage({ type: 'success', message: '修改成功' });
	} else {
		ElMessage({ type: 'error', message: '修改失败' });
	}
	// 关闭界面
	drawer.value = false;
};
// 树形控件的显示数据
const defaultProps = {
	children: 'children',
	label: 'name',
};
</script>

<style lang="scss" scoped>
.form {
	display: flex;
	justify-content: space-between;
}
.svg.black {
	fill: inherit;
}
</style>
<style>
.el-table.role .cell {
	text-align: center;
}
</style>
