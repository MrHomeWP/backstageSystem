// 顶部导航的相关配置属性

//导入创建小仓库方法
import { defineStore} from "pinia"
//创建小仓库
let useSettingStore = defineStore("SettingStore",{
    state:()=>{
        return{
            fold:false,//控制菜单是否折叠
            refreshFlag:true,//控制main组件是否刷新
        }
    },
    actions:{

    },
    getters:{

    }
})

export default useSettingStore