<template>
	<div>
		<!-- 表格展示菜单数据 -->
		<el-table border :data="MenuArr" row-key="id">
			<el-table-column label="名称" prop="name"></el-table-column>
			<el-table-column label="权限值" prop="code"></el-table-column>
			<el-table-column label="修改时间" prop="updateTime"></el-table-column>
			<el-table-column label="操作">
				<template #="{ row, column, $index }">
          <!-- 添加按钮 -->
					<el-button v-if="row.level < 4" @click="addMenu(row)">{{
						row.level == 3 ? '添加功能' : '添加菜单'
					}}</el-button>
          <!-- 编辑按钮 -->
					<el-button type="primary" :disabled="row.level == 1 ? true : false" @click="updateMenu(row)"
						>编辑</el-button
					>
          <!-- 删除按钮 -->
					<el-popconfirm title="确定删除吗?" @confirm="delMenu(row)">
						<template #reference>
							<el-button type="danger" :disabled="row.level == 1 ? true : false">删除</el-button>
						</template>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>
		<!-- 展示"新增|修改菜单"界面 -->
		<el-dialog v-model="dialogVisible">
			<!-- 标题部分 -->
			<template #header> 新增菜单 </template>
			<!-- 内容部分 -->
			<el-form>
				<el-form-item label="名称">
					<el-input v-model="MenuInfo.name" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="权限">
					<el-input v-model="MenuInfo.code" placeholder="请输入权限"></el-input>
				</el-form-item>
			</el-form>
			<!-- 底部按钮部分 -->
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel">取消</el-button>
					<el-button type="primary" @click="confirm">确定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
//引入菜单管理相关的API接口
import { reqGetPermisssion, reqAddOrUpdatePermisssion,reqDelPermisssion } from '@/api/acl/permission/index.js';
import { ElMessage } from 'element-plus';
//菜单数据
let MenuArr = ref([]);
//控制dialog的显示
let dialogVisible = ref(false);
//组件已挂载成功,就获取数据
onMounted(() => {
	getMenuArr();
});
//获取菜单数据函数
const getMenuArr = async () => {
	let result = await reqGetPermisssion();
	if (result.code == 200) {
		MenuArr.value = result.data;
	}
};
//菜单数据
let MenuInfo = reactive({
	id: null, //菜单id
	code: null, //权限值
	level: null, //层级
	name: null, //名称
	pid: null, //父级id
});
// 编辑菜单按钮的回调
const updateMenu = (row) => {
	//显示dialog
	dialogVisible.value = true;
	//更新当前菜单数据
	Object.assign(MenuInfo, row);
};
//添加菜单按钮的回调
const addMenu = (row) => {
	//清空上一次数据
	Object.assign(MenuInfo, {
		id: null, //菜单id
		code: null, //权限值
		level: null, //层级
		name: null, //名称
		pid: null, //父级id
	});
	//整理数据
	MenuInfo.pid = row.id;
	MenuInfo.level = row.level + 1;
	//显示dialog
	dialogVisible.value = true;
};
//取消按钮的回调
const cancel = () => {
	//隐藏dialog
	dialogVisible.value = false;
};
//确定按钮的回调
const confirm = async () => {
	//发送请求
	let result = await reqAddOrUpdatePermisssion(MenuInfo);
	if (result.code == 200) {
		ElMessage({ type: 'success', message: MenuInfo.id ? '修改成功' : '添加成功' });
		//重新获取菜单列表
		getMenuArr();
	} else {
		ElMessage({ type: 'error', message: MenuInfo.id ? '修改失败' : '添加失败' });
	}
	//隐藏dialog
	dialogVisible.value = false;
};

//删除菜单按钮回调
const delMenu = async (row)=>{
  let result = await reqDelPermisssion(row.id);
  if (result.code == 200) {
		ElMessage({ type: 'success', message:'删除成功' });
		//重新获取菜单列表
		getMenuArr();
	} else {
		ElMessage({ type: 'error', message:'删除失败' });
	}
}
</script>

<style lang="scss" scoped></style>
