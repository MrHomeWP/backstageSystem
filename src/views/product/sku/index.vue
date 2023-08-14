<template>
	<el-card>
		<!-- 展示SKU数据的表格部分 -->
		<el-table border :data="skuArr">
			<el-table-column type="index" label="序号" fixed="left" width="100" align="center"></el-table-column>
			<el-table-column label="名称" width="200" prop="skuName"></el-table-column>
			<el-table-column label="描述" width="300" prop="skuDesc"></el-table-column>
			<el-table-column label="图片" width="200">
				<template #="{ row, column, $index }">
					<img :src="row.skuDefaultImg" style="width: 100px" />
				</template>
			</el-table-column>
			<el-table-column label="重量" width="200" prop="weight"></el-table-column>
			<el-table-column label="价格" width="200" prop="price"></el-table-column>
			<el-table-column label="操作" fixed="right" width="250">
				<template #="{ row, column, $index }">
					<!-- 上架按钮 -->
					<el-button size="small" :type="row.isSale ? 'info' : 'success'" @click="saleOrUnshelve(row)">
						<SvgIcon class="svg no_margin" :name="row.isSale ? 'xiajia' : 'shangjia'" />
					</el-button>
					<!-- 编辑按钮 -->
					<el-button size="small" type="primary">
						<SvgIcon class="svg no_margin" name="bianji" />
					</el-button>
					<!-- 查看商品详情按钮 -->
					<el-button size="small" type="primary" @click="showSkuInfo(row)">
						<SvgIcon class="svg no_margin" name="xiangqin" />
					</el-button>
					<!-- 删除按钮 -->
					<el-popconfirm title="确定删除吗" @confirm="delSku(row)">
						<template #reference>	
							<el-button size="small" type="primary">
								<SvgIcon class="svg no_margin" name="shanchu" />
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
			:page-sizes="[3, 5, 8, 10]"
			:background="true"
			layout="prev, pager, next, jumper,->,sizes,total"
			:total="total"
			@size-change="getSkuInfo(1)"
			@current-change="getSkuInfo()"
			style="margin-top: 30px"
		/>
		<!-- Drawer抽屉 -->
		<el-drawer v-model="drawer">
			<!-- 顶部标题 -->
			<template #header>
				<h4>查看商品的详情</h4>
			</template>
			<!-- 内容部分 -->
			<template #default>
				<!-- 名称 -->
				<div class="box">
					<div class="left">名称</div>
					<div class="right">{{ skuInfo.skuName }}</div>
				</div>
				<!-- 描述 -->
				<div class="box">
					<div class="left">描述</div>
					<div class="right">{{ skuInfo.skuDesc }}</div>
				</div>
				<!-- 价格 -->
				<div class="box">
					<div class="left">价格</div>
					<div class="right">{{ skuInfo.price }}</div>
				</div>
				<!-- 平台属性 -->
				<div class="box">
					<div class="left">平台属性</div>
					<div class="right">
						<el-tag style="margin: 5px" v-for="v in skuInfo.skuAttrValueList">{{ v.valueName }}</el-tag>
					</div>
				</div>
				<!-- 销售属性 -->
				<div class="box">
					<div class="left">销售属性</div>
					<div class="right">
						<el-tag style="margin-right: 5px" v-for="v in skuInfo.skuSaleAttrValueList">{{
							v.saleAttrValueName
						}}</el-tag>
					</div>
				</div>
				<!-- 商品图片 -->
				<div class="box">
					<div class="left">商品图片</div>
					<div class="right">
						<!-- 轮播图 -->
						<el-carousel :interval="4000" type="card" height="200px">
							<el-carousel-item v-for="v in skuInfo.skuImageList" :key="v.id">
								<img :src="v.imgUrl" style="width: 100%" />
							</el-carousel-item>
						</el-carousel>
					</div>
				</div>
			</template>
		</el-drawer>
	</el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
//引入SKU相关接口
import { reqGetSkuInfo, reqSale, reqUnshelve, reqGetSkuDetail, reqDelSku } from '@/api/product/sku/index';
import { ElMessage } from 'element-plus';
//当前页
let currentPage = ref(1);
//每页展示数量
let pageSize = ref(8);
//总数量
let total = ref(10);
//所有sku的数据
let skuArr = ref([]);
//sku的详细数据
let skuInfo = ref({});
//控制抽屉的显示
let drawer = ref(false);
//组件挂载完毕就获取SKU数据
onMounted(() => {
	getSkuInfo();
});
//获取SKU数据的函数
let getSkuInfo = async (init) => {
	//如果有传参,就初始化到第一页
	if (init) currentPage.value = 1;
	let result = await reqGetSkuInfo(currentPage.value, pageSize.value);
	if (result.code == 200) {
		skuArr.value = result.data.records;
		total.value = result.data.total;
	}
};
//上下架按钮的回调
let saleOrUnshelve = async (row) => {
	if (row.isSale) {
		//下架操作
		let result = await reqUnshelve(row.id);
		if (result.code == 200) {
			ElMessage({
				type: 'success',
				message: '下架成功',
			});
			//重新获取sku数据
			getSkuInfo();
		} else {
			ElMessage({
				type: 'error',
				message: '下架失败',
			});
		}
	} else {
		//上架操作
		let result = await reqSale(row.id);
		if (result.code == 200) {
			ElMessage({
				type: 'success',
				message: '上架成功',
			});
			//重新获取sku数据
			getSkuInfo();
		} else {
			ElMessage({
				type: 'error',
				message: '上架失败',
			});
		}
	}
};
//查看商品详情按钮的回调
let showSkuInfo = async (row) => {
	//显示Drawer抽屉
	drawer.value = true;
	//获取数据
	let result = await reqGetSkuDetail(row.id);
	if (result.code == 200) {
		skuInfo.value = result.data;
	}
};
//删除按钮的回调
const delSku = async (row) => {
	let result = await reqDelSku(row.id);
	if (result.code == 200) {
		ElMessage({
			type: 'success',
			message: '删除成功',
		});
		//重新获取sku数据
		//如果是最后一页的最后一个,删除后翻到前一页
		if (skuArr.value.length <= 1) currentPage.value -= 1;
		getSkuInfo();
	} else {
		ElMessage({
			type: 'error',
			message: '删除失败:' + result.data,
		});
	}
};
</script>

<style lang="scss" scoped>
.svg {
	width: 18px;
	height: 18px;
}
.box {
	display: flex;
	margin: 20px 0;
	.left {
		width: 120px;
		text-align: right;
		padding-right: 20px;
	}
	.right {
		width: 100%;
	}
}
</style>
<!-- 轮播图样式 -->
<style scoped>
.el-carousel__item h3 {
	color: #475669;
	opacity: 0.75;
	line-height: 200px;
	margin: 0;
	text-align: center;
}

.el-carousel__item:nth-child(2n) {
	background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
	background-color: #d3dce6;
}
</style>
<style>
.box .right div.el-carousel ul.el-carousel__indicators {
	width: 100%;
	display: flex;
	justify-content: center;
}
</style>
