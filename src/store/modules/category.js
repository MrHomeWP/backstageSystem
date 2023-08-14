//品牌属性子组件的仓库
import {reqGetC1Arr,reqGetC2Arr,reqGetC3Arr,reqGetCategoryData} from "@/api/product/attr/index.js"//引入获取分类接口
import {defineStore} from "pinia"//导入创建小仓库方法
//创建小仓库
let useCategoryStore =defineStore("CategoryStore",{
    state:()=>{
        return{
            C1Id:0,//一级分类id
            C1Arr:[],//一级分类数据
            C2Id:0,//二级分类id
            C2Arr:[],//二级分类数据
            C3Id:0,//三级分类id
            C3Arr:[],//三级分类数据
            CategoryData:[],//该分类数据
        }
    },
    actions:{
        //获取1级分类数据
        async getC1Arr(){
            let result = await reqGetC1Arr()
            if(result.code==200){
                this.C1Arr=result.data
            }
        },
        //获取2级分类数据
        async getC2Arr(){
            let result = await reqGetC2Arr(this.C1Id)
            if(result.code==200){
                this.C2Arr=result.data
            }
        },
        //获取3级分类数据
        async getC3Arr(){
            let result = await reqGetC3Arr(this.C2Id)
            if(result.code==200){
                this.C3Arr=result.data
            }
        },
        //获取当前分类的品牌属性数据
        async getCategoryData(){
            let result = await reqGetCategoryData(this.C1Id,this.C2Id,this.C3Id)
            if(result.code==200){
                this.CategoryData=result.data
            }
        }
    },
    getters:{

    }
})
export default useCategoryStore