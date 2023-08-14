//引入user仓库
import useUserStore from "@/store/modules/users"
import pinia from "@/store/index.js"
let userStore = useUserStore(pinia)

export const hasAccess =(app)=>{
    app.directive("hasAccess",{
        mounted(el,binding,vnode,prevVnode) {
            //如果用户没有该权限
            if(!userStore.buttonData.includes(binding.value)){
                el.remove()//删除该按钮
            }   
        },
    })
}