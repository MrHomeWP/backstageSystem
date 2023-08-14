import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//引入mock插件
import { viteMockServe } from 'vite-plugin-mock'
//引入node里path模块
import path from 'path'
//导入svg插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig(({command} )=>{
  return{
    base: './',
    //配置全局svg插件
    plugins: [vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        localEnabled:true,//保证开发阶段可以使用mock接口
      }),
    ],
    //路径配置，@代替src
    resolve:{
      alias:{
        "@":path.resolve(__dirname,"./src")
      }
    },
    //配置全局sass
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    //配置代理服务器
    server:{
      proxy:{
        "/test":{
          //目标服务器
          // target: 'http://127.0.0.1:3077',
          target: 'http://sph-api.atguigu.cn',
          //是否修改host字段
          changeOrigin: true,
          //重写接口，去除/test
          rewrite: (path) => path.replace(/^\/test/, ''),
        }
      }
    }
  }
})
