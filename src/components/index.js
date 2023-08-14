//引入组件
import SvgIcon from "./SvgIcon/index.vue"//svgicon组件

import Category from "./Category/index.vue"//引入分类category组件
//把所有组件封装成对象
let allGlobalComponets = {SvgIcon,Category}
//对外暴露插件对象
export default{
    install(app){
        //循环allGlobalComponets对象
        Object.keys(allGlobalComponets).forEach(key=>{
            //注册为全局组件
            app.component(key,allGlobalComponets[key])
        })
    }
}