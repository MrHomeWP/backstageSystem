//引入二次封装的axios
import request from "@/utils/request";

//获取SPU数据接口
export const reqGetSpuData = (page,limit,C3Id)=>request({
    method:"get",
    url:`/admin/product/${page}/${limit}?category3Id=${C3Id}`
})

//获取SPU品牌数据的接口
export const reqGetSpuBrand = ()=>request({
    method:"get",
    url:"/admin/product/baseTrademark/getTrademarkList"
})

//获取SPU图片的接口
export const reqGetSpuImageList = (spuid)=>request({
    method:"get",
    url:`/admin/product/spuImageList/${spuid}`
})
//获取所有SPU销售属性的接口
export const reqGetSpuSale = ()=>request({
    method:"get",
    url:"/admin/product/baseSaleAttrList"
})

//获取SPU已有销售属性的数据的接口
export const reqGetSpuOwnSale = (spuid)=>request({
    method:"get",
    url:`/admin/product/spuSaleAttrList/${spuid}`
})

//添加|修改SPU
export const reqAddOrUpdateSpu = (data)=>{
    if(data.id){//如果有id,就调用修改接口
        return request({
            method:"post",
            url:"/admin/product/updateSpuInfo",
            data
        })
    }else{//如果没有id,就调用添加接口
        return request({
            method:"post",
            url:"/admin/product/saveSpuInfo",
            data
        })
    }
}
//添加SKU
export const reqAddSku = (data)=>request({
    method:"post",
    url:`/admin/product/saveSkuInfo`,
    data
})
//根据spuId查看对应的所有sku信息
export const reqGetSkuInfo=(spuId)=>request({
    method:"get",
    url:`/admin/product/findBySpuId/${spuId}`
})

//根据spuId删除SPU
export const reqDelSpu=(spuId)=>request({
    method:"delete",
    url:`/admin/product/deleteSpu/${spuId}`
})
