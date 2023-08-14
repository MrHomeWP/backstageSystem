//引入二次封装的axios
import request from "@/utils/request";

//根据页码和数量获取sku数据
export const reqGetSkuInfo = (page,limit)=>request({
    method:"get",
    url:`/admin/product/list/${page}/${limit}`
})

//上架商品
export const reqSale =(skuId)=>request({
    methode:"get",
    url:`/admin/product/onSale/${skuId}`
})
//下架商品
export const reqUnshelve =(skuId)=>request({
    methode:"get",
    url:`/admin/product/cancelSale/${skuId}`
})
// 获取sku详细数据
export const reqGetSkuDetail = (skuId)=>request({
    method:"get",
    url:`/admin/product/getSkuInfo/${skuId}`
})
//删除sku
export const reqDelSku= (skuId)=>request({
    method:"delete",
    url:`/admin/product/deleteSku/${skuId}`
})