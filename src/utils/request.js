//引入axios
import axios from 'axios'
//引入消息提醒element组件
import { ElMessage } from 'element-plus';
//引入users仓库
import useUserStore from '@/store/modules/users';

//创建axios兄弟request
let request = axios.create({
    // baseURL:"http://127.0.0.1:3077",//给所有请求加上基础路径
    baseURL:"http://sph-api.atguigu.cn",//给所有请求加上基础路径
    timeout:5000,//请求超过5秒，请求失败
});
//请求拦截器
request.interceptors.request.use((config)=>{
    //获取localStorage的token
    let userStore = useUserStore()
    
    if(userStore.token){//如果有token
        config.headers.token  =userStore.token//给所有请求添加token
    }   
    return config;//返回配置对象
})
//响应拦截器
request.interceptors.response.use((response)=>{
    //简化返回的数据
    return response.data
},(error)=>{//请求失败
    let message=""
    let status=error.response.status||null//获取http状态码
    switch(status){
        case 401:
            message="token过期"
            break;
        case 403:
            message="无权访问"
            break;
        case 404:
            message="请求地址错误"
            break;
        case 500:
            message="服务器错误"
            break;
        default:
            message="网络错误"
            break;
    }
    //提示错误信息
    ElMessage({
        type:"error",
        message
    })
    return Promise.reject(error)//返回promise错误对象
})
export default request//暴露二次封装好的axios