<template>
	<div>
		<!-- 3层分类select -->
		<Category :scene="scene" :state="1" />
		<!-- SPU展示界面 -->

		<el-card style="margin: 10px 0">
			<!-- 所有SPU数据界面 -->
			<div v-show="viewState == 1">
				<!-- 添加SPU按钮 -->
				<el-button type="primary" :disabled="CategoryStore.C3Id ? false : true" @click="addSPU">
					<SvgIcon class="svg no_margin" name="add" />
					添加SPU
				</el-button>
				<!-- 数据展示表格 -->
				<el-table border style="margin: 10px 0" :data="SpuData.records">
					<el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
					<el-table-column label="SPU名称" prop="spuName"></el-table-column>
					<el-table-column label="SPU描述" prop="description"></el-table-column>
					<el-table-column label="SPU操作">
						<template #="{ row, column, $index }">
							<!-- 添加SKU按钮 -->
							<el-button type="primary" @click="addSku(row)">
								<SvgIcon class="svg no_margin" name="add" />
							</el-button>
							<!-- 编辑按钮 -->
							<el-button type="primary" @click="updateSPU(row)">
								<SvgIcon class="svg no_margin" name="bianji" />
							</el-button>
							<!-- 查看按钮 -->
							<el-button type="primary" @click="showSku(row)">
								<SvgIcon class="svg no_margin" name="chakan" />
							</el-button>
							<!-- 删除按钮 -->
							<el-popconfirm title="确认删除吗?" @confirm="delSpu(row)">
								<template #reference>
									<el-button type="primary">
										<SvgIcon class="svg no_margin" name="shanchu" />
									</el-button>
								</template>
							</el-popconfirm>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页器 -->
				<el-pagination
					v-model:current-page="page_current"
					v-model:page-size="page_size"
					:page-sizes="[3, 5, 8, 10]"
					background
					layout="prev, pager, next, jumper,->,sizes,total"
					:total="mes_total"
					@current-change="getSpuData()"
					@size-change="getSpuData(1)"
				/>
			</div>
			<!-- 添加|修改SPU界面 -->
			<SpuForm ref="spu" v-show="viewState == 2" @controlViewState="controlViewState" />
			<!-- 添加SKU界面 -->
			<SkuForm ref="sku" v-show="viewState == 3" @controlViewState="controlViewState" />
			<!-- 所有sku展示界面 -->
			<el-dialog v-model="dialogTableVisble" title="SKU列表">
				<el-table :data="skuInfo">
					<el-table-column label="SKU名字" prop="skuName"></el-table-column>
					<el-table-column label="SKU价格" prop="price"></el-table-column>
					<el-table-column label="SKU重量" prop="weight"></el-table-column>
					<el-table-column label="SKU图片">
						<template #="{ row, column, $index }">
							<img :src="row.skuDefaultImg" style="width: 100px" />
						</template>
					</el-table-column>
				</el-table>
			</el-dialog>
		</el-card>
	</div>
</template>

<script setup>
import { ref, watch, reactive,onBeforeUnmount } from 'vue';
// 引入spu界面和sku界面的组件
import SpuForm from './SpuForm.vue';
import SkuForm from './SkuForm.vue';

//导入SPU的API接口
import { reqGetSpuData, reqGetSkuInfo,reqDelSpu } from '@/api/product/spu';
//控制分类select是否可用,1:可用,0:不可用
let scene = ref(1);
//控制SPU展示界面的显示,1:所有SPU数据,2:添加|修改SPU,3:添加sku
let viewState = ref(1);
//当前页码
let page_current = ref(1);
//每页显示数量
let page_size = ref(3);
//总数量
let mes_total = ref(1);
//SPU数据
let SpuData = reactive({
	records: [],
});
//SKU数据
let skuInfo = ref();
//控制dialog对话框的显示
let dialogTableVisble = ref(false);
//获取SpuForm子组件实例
let spu = ref();
// 获取SkuForm子组件实例
let sku = ref();
//获取分类的仓库
import useCategoryStore from '@/store/modules/category';
import { ElMessage } from 'element-plus';
let CategoryStore = useCategoryStore();

//监听三级分类的id
watch(
	() => CategoryStore.C3Id,
	(newV, oldV) => {
		if (newV != null) {
			//获取当前分类的数据
			getSpuData();
		}
	}
);
//获取当前分类SPU数据函数
let getSpuData = async (init) => {
	if (init) {
		//有init,表示初始化到第一页
		page_current.value = 1;
	}
	let result = await reqGetSpuData(page_current.value, page_size.value, CategoryStore.C3Id);
	if (result.code == 200) {
		Object.assign(SpuData, result.data); //获取数据
		mes_total = SpuData.total; //获取总数量
	}
};

//添加SPU按钮的回调
let addSPU = () => {
	//显示"添加|修改SPU"界面
	viewState.value = 2;
	//禁用三级分类select
	scene.value = 0;
	//调用子组件,获取select数据
	spu.value.getBaseSelect(CategoryStore.C3Id); //传递3级分类ID,添加SPU的时候需要
};
//修改SPU按钮的回调
let updateSPU = (row) => {
	//显示"添加|修改SPU"界面
	viewState.value = 2;
	//禁用三级分类select
	scene.value = 0;
	//调用子组件的获取完整SPU数据的回调
	spu.value.getFullSpuData(row); //传递SPU基础数据
};
//添加SKU按钮的回调
const addSku = (row) => {
	console.log('添加SKU按钮的回调');
	//显示"添加SKU"界面
	viewState.value = 3;
	//禁用三级分类select
	scene.value = 0;
	//调用子组件的获取基础SKU数据的回调
	sku.value.getBaseData(row); //传递spu的数据
};

//子组件控制父组件显示回调
const controlViewState = (data) => {
	//关闭"添加|修改SPU"界面,显示所有SPU数据
	viewState.value = data.state;
	//开放三级分类select
	scene.value = 1;
	//重新获取所有SPU数据
	if (data.AddOrUpdate == 'add') {
		//如果是添加
		getSpuData(1); //重新获取SPU数据的同时,初始到第一页
	} else {
		//如果是修改
		getSpuData();
	}
};
//查看SKU按钮回调
const showSku = async (row) => {
	//展示对话框
	dialogTableVisble.value = true;
	//获取数据
	let result = await reqGetSkuInfo(row.id);
	if (result.code == 200) {
		skuInfo.value = result.data;
	}
};

//删除SPU----Popcomfirm气泡确认框的确认按钮回调
let delSpu =async (row)=>{
  let result = await reqDelSpu(row.id)
  if(result.code==200){
      ElMessage({
        type:"success",
        message:"删除成功"
      })
      //如果是最后一页的最后一个,则翻到前一页
      if(SpuData.records.length<=1) page_current-=1
      //重新获取SPU数据
      getSpuData()
  }else{
    ElMessage({
        type:"error",
        message:"删除失败:"+result.data
      })
  }
}

//组件销毁时,清空仓库
onBeforeUnmount(()=>{
  //清空品牌属性仓库
  CategoryStore.$reset()
})
</script>

<style lang="scss" scoped></style>
