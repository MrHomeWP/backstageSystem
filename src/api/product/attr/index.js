//导入二次封装的axios
import request from "@/utils/request"

//获取1级分类的接口
export const reqGetC1Arr= ()=>request({
    method:"get",
    url:`/admin/product/getCategory1`
})

//获取2级分类的接口
export const reqGetC2Arr= (category1Id)=>request({
    method:"get",
    url:`/admin/product/getCategory2/${category1Id}`
})

//获取3级分类的接口
export const reqGetC3Arr= (category2Id)=>request({
    method:"get",
    url:`/admin/product/getCategory3/${category2Id}`
})

//获取当前分类数据接口
export const reqGetCategoryData=(id1,id2,id3)=>request({
    method:"get",
    url:`/admin/product/attrInfoList/${id1}/${id2}/${id3}`
})

//添加|修改属性接口
export const reqAddOrUpdateProperty=(data)=>request({
    method:"post",
    url:"/admin/product/saveAttrInfo",
    data
})

// 删除属性接口
export const reqDelProperty=(attrId)=>request({
    method:"delete",
    url:`/admin/product/deleteAttr/${attrId}`
})