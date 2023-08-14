<template>
	<el-form label-width="100px">
		<el-form-item label="SKU名称">
			<el-input v-model="skuFullData.skuName" placeholder="SKU名称"></el-input>
		</el-form-item>
		<el-form-item label="价格(元)">
			<el-input v-model="skuFullData.price" placeholder="价格(元)"></el-input>
		</el-form-item>
		<el-form-item label="重量(g)">
			<el-input v-model="skuFullData.weight" placeholder="重量(g)"></el-input>
		</el-form-item>
		<el-form-item label="SKU描述">
			<el-input v-model="skuFullData.skuDesc" type="textarea" placeholder="SKU描述"></el-input>
		</el-form-item>
		<el-form-item label="平台属性">
			<el-form :inline="true" label-width="100">
				<el-form-item v-for="v1 in skuProperty" :label="v1.attrName" :key="v1.id">
					<el-select v-model="v1.currentId">
						<el-option
							v-for="v2 in v1.attrValueList"
							:label="v2.valueName"
							:value="v2.id"
							:key="v2.id"
						></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</el-form-item>
		<el-form-item label="销售属性">
			<el-form :inline="true">
				<el-form-item v-for="v1 in skuSale" :label="v1.saleAttrName" :key="v1.id">
					<el-select v-model="v1.currentId">
						<el-option
							v-for="v2 in v1.spuSaleAttrValueList"
							:label="v2.saleAttrValueName"
							:value="v2.id"
							:key="v2.id"
						></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</el-form-item>

		<el-form-item label="图片名称">
			<el-table ref="table" border :data="skuImgList">
				<el-table-column type="selection" align="center" width="80" />
				<el-table-column label="图片">
					<template #="{ row, column, $index }">
						<img :src="row.imgUrl" style="width: 200px" />
					</template>
				</el-table-column>
				<el-table-column label="名称" prop="imgName"></el-table-column>
				<el-table-column label="操作">
					<template #="{ row, column, $index }">
						<el-button type="primary" @click="chooseImg(row)">设置默认</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="saveSku()">保存</el-button>
			<el-button @click="close">取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup>
import { ref } from 'vue';
//引入Category仓库
import useCategoryStore from '@/store/modules/category';
let CategoryStore = useCategoryStore();
//引入API接口
import { reqGetSpuImageList, reqGetSpuOwnSale, reqAddSku } from '@/api/product/spu/index';
import { ElMessage } from 'element-plus';
let skuProperty = ref(); //该分类的平台属性
let skuSale = ref(); //该SPU已有的销售属性
let skuImgList = ref(); //该SPU图片
//需要提交的数据
let skuFullData = ref({
	category3Id: 0, //三级分类ID
	spuId: 0, //SPU的ID
	tmId: 0, //SPU的品牌Id
	skuName: null, //sku名称
	price: null, //价格
	weight: null, //重量
	skuDesc: null, //sku描述
	skuAttrValueList: [
		//平台属性
	],
	skuSaleAttrValueList: [
		//销售属性
	],
	skuDefaultImg: null, //sku图片地址
});
//获取table实例
let table = ref();
//获取父组件的自定义事件
let $emit = defineEmits(['controlViewState']);
//取消按钮回调
const close = () => {
	//关闭当前组件,显示"所有SPU数据"界面
	$emit('controlViewState', { state: 1 });
};
//获取基础数据的回调
const getBaseData = async (spu) => {
	//清空数据
	skuFullData.value = {
		category3Id: 0, //三级分类ID
		spuId: 0, //SPU的ID
		tmId: 0, //SPU的品牌Id
		skuName: null, //sku名称
		price: null, //价格
		weight: null, //重量
		skuDesc: null, //sku描述
		skuAttrValueList: [
			//平台属性
		],
		skuSaleAttrValueList: [
			//销售属性
		],
		skuDefaultImg: null, //sku图片地址
	};
	//获取三级分类ID、spuId、tmId
	skuFullData.value.category3Id = CategoryStore.C3Id;
	skuFullData.value.spuId = spu.id;
	skuFullData.value.tmId = spu.tmId;

	//获取该分类的平台属性
	await CategoryStore.getCategoryData();
	let result1 = CategoryStore.CategoryData;
	skuProperty.value = result1;
	//获取该SPU已有的销售属性
	let result2 = await reqGetSpuOwnSale(spu.id);
	skuSale.value = result2.data;
	//获取该SPU的图片
	let result3 = await reqGetSpuImageList(spu.id);
	skuImgList.value = result3.data;
};
defineExpose({ getBaseData }); //暴露给父组件
//"设置默认"按钮的回调
const chooseImg = (row) => {
	//清除所有选项
	table.value.clearSelection();
	//选中当前复选框
	table.value.toggleRowSelection(row, true);
	//选中当前选项
	skuFullData.value.skuDefaultImg = row.imgUrl; //获取图片地址
};
//保存按钮的回调
let saveSku = async () => {
	//1)-------整理数据
	//整理平台属性
	skuFullData.value.skuAttrValueList = skuProperty.value
		.filter((v, i, arr) => {
			//先过滤有选择select
			return v.currentId ? true : false;
		})
		.map((v, i, arr) => {
			//映射键名
			if (v.currentId) {
				return {
					attrId: v.id,
					valueId: v.currentId,
				};
			}
		});
	//整理销售属性
	skuFullData.value.skuSaleAttrValueList = skuSale.value
		.filter((v, i, arr) => {
			//先过滤有选择select
			return v.currentId ? true : false;
		})
		.map((v, i, arr) => {
			//映射键名
			if (v.currentId) {
				return {
					saleAttrId: v.id,
					saleAttrValueId: v.currentId,
				};
			}
		});
	//2)-------发送请求
	let result = await reqAddSku(skuFullData.value);
	if (result.code == 200) {
		ElMessage({
			type: 'success',
			message: '添加SKU成功',
		});
		//显示"所有SPU数据"界面
		$emit('controlViewState', { state: 1 });
	} else {
		ElMessage({
			type: 'success',
			message: '添加SKU成功',
		});
	}
};
</script>

<style lang="scss" scoped></style>
