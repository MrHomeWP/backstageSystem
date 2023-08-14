<template>
	<div>
		<el-form>
			<el-form-item label="SPU名称">
				<el-input placeholder="请输入SPU名称" v-model="FullSpuData.spuName"></el-input>
			</el-form-item>
			<el-form-item label="SPU品牌">
				<el-select placeholder="请选择你的品牌" v-model="FullSpuData.tmId">
					<el-option v-for="v in SpuBrand" :key="v.id" :label="v.tmName" :value="v.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="SPU描述">
				<el-input type="textarea" placeholder="请输入SPU描述" v-model="FullSpuData.description"></el-input>
			</el-form-item>
			<el-form-item label="SPU图标">
				<!-- 上传图片插件 -->
				<el-upload
					v-model:file-list="SpuImageList"
					action="http://sph-api.atguigu.cn/admin/product/fileUpload"
					list-type="picture-card"
					:on-preview="handlePictureCardPreview"
				>
					<el-icon>
						<Plus />
					</el-icon>
				</el-upload>
				<!-- 上传图片插件-图片放大展示dom -->
				<el-dialog v-model="dialogVisible">
					<img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%" />
				</el-dialog>
			</el-form-item>
			<el-form-item label="SPU销售属性">
				<el-select :placeholder="unselectedSale.length<SpuAllSale.length?`还可选择${SpuAllSale.length-SpuOwnSale.length}个`:'暂无可选'" v-model="chooseSale">
					<el-option v-for="v in unselectedSale" :key="v.id" :label="v.name" :value="v.name"></el-option>
				</el-select>
				<el-button :disabled="unselectedSale.length&&chooseSale?false:true" type="primary" style="margin-left: 20px;" @click="addSale">
					<SvgIcon class="svg no_margin" name="add" />
					添加属性
				</el-button>
				<el-table border :data="SpuOwnSale" style="margin: 10px 0;">
					<el-table-column label="序号" type="index" width="80"></el-table-column>
					<el-table-column label="销售属性名字" prop="saleAttrName"></el-table-column>
					<el-table-column label="销售属性值">
						<template #="{ row, column, $index }">
							<el-tag
								v-for="tag in row.spuSaleAttrValueList"
								:key="tag.id"
								class="mx-1"
								closable
								@close="handleClose(row,$index)"
							>
								{{ tag.saleAttrValueName }}
							</el-tag>
                            <!-- 添加时的input -->
                            <el-input v-focus @blur="addSaleArrValue(row)" v-model="row.SaleArrValue" v-if="row.flag" placeholder="请输入属性值" type="small" style="width:100px"></el-input>
                            <!-- 添加tag按钮 -->
                            <el-button @click="showEdit($event,row)" v-else type="success" size="small">
                                <SvgIcon class="svg no_margin" name="add"/>
                            </el-button>
						</template>
					</el-table-column>
					<el-table-column label="操作">
                        <template #="{row,$index}">
                            <!-- 删除销售属性按钮 -->
                            <el-button type="danger" size="small" @click="delSale($index)">
                                <SvgIcon class="svg no_margin" name="shanchu"/>
                            </el-button>
                        </template>
                    </el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="save">保存</el-button>
				<el-button @click="closeView">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup>
import { ref, reactive,computed } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
//导入获取品牌数据的接口
import { reqGetSpuBrand, reqGetSpuImageList, reqGetSpuSale, reqGetSpuOwnSale,reqAddOrUpdateSpu } from '@/api/product/spu/index';
let SpuBrand = reactive({}); //SPU品牌数据
let SpuImageList = ref(); //SPU图片数据
let SpuAllSale = reactive([]); //SPU所有销售属性数据
let SpuOwnSale = reactive([]); //SPU已有销售属性数据
//当前选择的销售属性
let chooseSale =ref()
//获取父组件控制界面显示的回调
let $emit = defineEmits(['controlViewState']);
//关闭界面
const closeView = () => {
	$emit('controlViewState', {state:1});
};
//需要提交的SPU完整数据
let FullSpuData = reactive({
	id: null, //SPU的id
	category3Id: null, //SPU所属三级目录的ID
	description: null, //SPU详细描述
	spuName: null, //SPU名
	tmId: null, //所属品牌ID
	spuImageList: [], //SPU的图片数组
	spuSaleAttrList: [
		//SPU的属性数组
	],
});
//修改SPU时------获取SPU完整数据回调
const getFullSpuData = async (SpuData) => {
	//获取SPU基础数据
	Object.assign(FullSpuData, SpuData);
	//获取SPU品牌数据
	let result1 = await reqGetSpuBrand();
	if (result1.code == 200) {
		Object.assign(SpuBrand, result1.data);
	}
	//获取SPU图片数据
	let result2 = await reqGetSpuImageList(SpuData.id);
	if (result2.code == 200) {
		//过滤一下图片数据
        SpuImageList.value=result2.data.map((v, i, arr) => {
            return {
                name: v.imgName,
                url: v.imgUrl,
            };
        })

	}
	//获取SPU所有销售属性数据
	let result3 = await reqGetSpuSale();
	if (result3.code == 200) {
		Object.assign(SpuAllSale, result3.data);
	}
	//获取SPU已有销售属性数据
	let result4 = await reqGetSpuOwnSale(SpuData.id);
	if (result4.code == 200) {
        Object.assign(SpuOwnSale, result4.data);
	}
};
//添加SPU是-------获取select数据
const getBaseSelect = async(C3Id)=>{
    //1)----清空数据
    //清空基础数据
    Object.assign(FullSpuData,{
        id: null, //SPU的id
        category3Id: C3Id, //SPU所属三级目录的ID
        description: null, //SPU详细描述
        spuName: null, //SPU名
        tmId: null, //所属品牌ID
        spuImageList: [], //SPU的图片数组
        spuSaleAttrList: [
            //SPU的属性数组
        ],
    })
    //清空图片数据
    SpuImageList.value=[]
    //清空已有SPU销售属性数据
    SpuOwnSale=reactive([])
    //2)----获取select数据
    //获取SPU品牌数据
    let result1 = await reqGetSpuBrand();
	if (result1.code == 200) {
		Object.assign(SpuBrand, result1.data);
	}
    //获取SPU所有销售属性数据
    let result3 = await reqGetSpuSale();
	if (result3.code == 200) {
		Object.assign(SpuAllSale, result3.data);
	}
}
defineExpose({ getBaseSelect,getFullSpuData }); //方法暴露给父组件
//upload图片上传插件的放大镜回调
let dialogVisible = ref(false); //控制放大后图片的显示
let dialogImageUrl = ref(); //放大后图片的路径
let handlePictureCardPreview = (file) => {
	dialogVisible.value = true; //显示图片
	dialogImageUrl.value = file.url; //图片的地址
};

//tag删除按钮回调
let handleClose=(row,$index)=>{
    row.spuSaleAttrValueList.splice($index,1)
}

//计算出剩余的销售属性
let unselectedSale=computed(()=>{
    return SpuAllSale.filter((v1)=>{//过滤所有销售属性
        return SpuOwnSale.every((v2)=>{
            return v1.name!==v2.saleAttrName//如果每个不相同,返回true
        })
    }) 
})

// 添加销售属性按钮回调
let addSale=()=>{
    SpuOwnSale.push({
        baseSaleAttrId:SpuAllSale.find(v=>v.name==chooseSale.value).id,
        saleAttrName:chooseSale.value,
        spuSaleAttrValueList:[]
    })
    //清空当前select选项
    chooseSale.value=null
}
// 删除销售属性按钮回调
let delSale=($index)=>{
    SpuOwnSale.splice($index,1)
}

//添加属性值按钮的回调
let showEdit=($event,row)=>{
    //显示input,隐藏button
    row.flag=true
    //追加属性
    row.SaleArrValue=""
}
//添加属性值input失去焦点的回调
let addSaleArrValue=(row)=>{
    // 获取需要属性
    const {SaleArrValue,baseSaleAttrId} = row
    //如果为空
    if(!SaleArrValue.trim()){
        ElMessage({
            type:"error",
            message:"不能为空"
        })
        return
    }
    //如果重复
    let repeat = row.spuSaleAttrValueList.find(v=>{
        return v.saleAttrValueName==SaleArrValue
    })
    if(repeat){
        ElMessage({
            type:"error",
            message:"不能重复"
        })
        return
    }
    //追加到SpuOwnSale里
    row.spuSaleAttrValueList.push({
        saleAttrValueName:SaleArrValue,
        baseSaleAttrId
    })
    //清空input
    row.SaleArrValue=""
    //隐藏input,显示button
    row.flag=false
}

// input的自定义指令-实现input聚焦
const vFocus={
    mounted(el){
        el.querySelector("input").focus()
    }
}

//保存按钮的回调
const save=async ()=>{
    //1)-----获取数据-----
    //获取图片数据
    FullSpuData.spuImageList=SpuImageList.value.map((v,i,arr)=>{
        return{
            imgName:v.name,
            imgUrl:v.response&&v.response.data||v.url
        }
    })
    //获取SPU销售属性数据
    FullSpuData.spuSaleAttrList=SpuOwnSale
    //2)-----提交数据-----
    let result =await reqAddOrUpdateSpu(FullSpuData)

    if(result.code==200){//提交成功
        ElMessage({
            type:"success",
            message:FullSpuData.id?"修改成功":"添加成功"
        })
        //通知父组件切换到所有SPU页面
        $emit('controlViewState', {state:1,AddOrUpdate:FullSpuData.id?"update":"add"})
    }else{//提交失败
        ElMessage({
            type:"error",
            message:FullSpuData.id?"修改失败":"添加失败"
        })
    }

}
</script>

<style lang="scss" scoped>
.el-tag{
    margin: 5px;
}
</style>
