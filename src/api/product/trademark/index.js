//引入二次封装的axios
import request from "@/utils/request";

//获取品牌数据接口
export const getTrademark=(page,limit)=>request({
    method:"get",
    url:`/admin/product/baseTrademark/${page}/${limit}`
})

//添加品牌|修改品牌接口
export const addTrademark=(data)=>{
    if(data.id){//有ID就修改品牌
        return request({
            method:"put",
            url:"/admin/product/baseTrademark/update",
            data
        })
    }else{//没ID添加品牌
        return request({
            method:"post",
            url:"/admin/product/baseTrademark/save",
            data
        })
    }
}

//删除品牌接口
export const reqTrademark=(id)=>request({
    method:"delete",
    url:`/admin/product/baseTrademark/remove/${id}`
})