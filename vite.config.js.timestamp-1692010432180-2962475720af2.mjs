// vite.config.js
import { defineConfig } from "file:///D:/%E6%A1%8C%E9%9D%A2/%E7%AC%AC%E4%B8%89%E9%98%B6%E6%AE%B5/08Vue3%E9%A1%B9%E7%9B%AE/vite-project/node_modules/.pnpm/registry.npmmirror.com+vite@4.4.8_sass@1.64.2/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/%E6%A1%8C%E9%9D%A2/%E7%AC%AC%E4%B8%89%E9%98%B6%E6%AE%B5/08Vue3%E9%A1%B9%E7%9B%AE/vite-project/node_modules/.pnpm/registry.npmmirror.com+@vitejs+plugin-vue@4.2.3_vite@4.4.8_vue@3.3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { viteMockServe } from "file:///D:/%E6%A1%8C%E9%9D%A2/%E7%AC%AC%E4%B8%89%E9%98%B6%E6%AE%B5/08Vue3%E9%A1%B9%E7%9B%AE/vite-project/node_modules/.pnpm/registry.npmmirror.com+vite-plugin-mock@2.9.8_mockjs@1.1.0_vite@4.4.8/node_modules/vite-plugin-mock/dist/index.js";
import path from "path";
import { createSvgIconsPlugin } from "file:///D:/%E6%A1%8C%E9%9D%A2/%E7%AC%AC%E4%B8%89%E9%98%B6%E6%AE%B5/08Vue3%E9%A1%B9%E7%9B%AE/vite-project/node_modules/.pnpm/registry.npmmirror.com+vite-plugin-svg-icons@2.0.1_vite@4.4.8/node_modules/vite-plugin-svg-icons/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\\u684C\u9762\\\u7B2C\u4E09\u9636\u6BB5\\08Vue3\u9879\u76EE\\vite-project";
var vite_config_default = defineConfig(({ command }) => {
  return {
    base: "./",
    //配置全局svg插件
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]"
      }),
      viteMockServe({
        localEnabled: true
        //保证开发阶段可以使用mock接口
      })
    ],
    //路径配置，@代替src
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    //配置全局sass
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";'
        }
      }
    },
    //配置代理服务器
    server: {
      proxy: {
        "/test": {
          //目标服务器
          // target: 'http://127.0.0.1:3077',
          target: "http://sph-api.atguigu.cn",
          //是否修改host字段
          changeOrigin: true,
          //重写接口，去除/test
          rewrite: (path2) => path2.replace(/^\/test/, "")
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxcdTY4NENcdTk3NjJcXFxcXHU3QjJDXHU0RTA5XHU5NjM2XHU2QkI1XFxcXDA4VnVlM1x1OTg3OVx1NzZFRVxcXFx2aXRlLXByb2plY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFx1Njg0Q1x1OTc2MlxcXFxcdTdCMkNcdTRFMDlcdTk2MzZcdTZCQjVcXFxcMDhWdWUzXHU5ODc5XHU3NkVFXFxcXHZpdGUtcHJvamVjdFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovJUU2JUExJThDJUU5JTlEJUEyLyVFNyVBQyVBQyVFNCVCOCU4OSVFOSU5OCVCNiVFNiVBRSVCNS8wOFZ1ZTMlRTklQTElQjklRTclOUIlQUUvdml0ZS1wcm9qZWN0L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuLy9cdTVGMTVcdTUxNjVtb2NrXHU2M0QyXHU0RUY2XG5pbXBvcnQgeyB2aXRlTW9ja1NlcnZlIH0gZnJvbSAndml0ZS1wbHVnaW4tbW9jaydcbi8vXHU1RjE1XHU1MTY1bm9kZVx1OTFDQ3BhdGhcdTZBMjFcdTU3NTdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG4vL1x1NUJGQ1x1NTE2NXN2Z1x1NjNEMlx1NEVGNlxuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoe2NvbW1hbmR9ICk9PntcbiAgcmV0dXJue1xuICAgIGJhc2U6ICcuLycsXG4gICAgLy9cdTkxNERcdTdGNkVcdTUxNjhcdTVDNDBzdmdcdTYzRDJcdTRFRjZcbiAgICBwbHVnaW5zOiBbdnVlKCksXG4gICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XG4gICAgICAgIGljb25EaXJzOiBbcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMvYXNzZXRzL2ljb25zJyldLFxuICAgICAgICBzeW1ib2xJZDogJ2ljb24tW2Rpcl0tW25hbWVdJyxcbiAgICAgIH0pLFxuICAgICAgdml0ZU1vY2tTZXJ2ZSh7XG4gICAgICAgIGxvY2FsRW5hYmxlZDp0cnVlLC8vXHU0RkREXHU4QkMxXHU1RjAwXHU1M0QxXHU5NjM2XHU2QkI1XHU1M0VGXHU0RUU1XHU0RjdGXHU3NTI4bW9ja1x1NjNBNVx1NTNFM1xuICAgICAgfSksXG4gICAgXSxcbiAgICAvL1x1OERFRlx1NUY4NFx1OTE0RFx1N0Y2RVx1RkYwQ0BcdTRFRTNcdTY2RkZzcmNcbiAgICByZXNvbHZlOntcbiAgICAgIGFsaWFzOntcbiAgICAgICAgXCJAXCI6cGF0aC5yZXNvbHZlKF9fZGlybmFtZSxcIi4vc3JjXCIpXG4gICAgICB9XG4gICAgfSxcbiAgICAvL1x1OTE0RFx1N0Y2RVx1NTE2OFx1NUM0MHNhc3NcbiAgICBjc3M6IHtcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgc2Nzczoge1xuICAgICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiAnQGltcG9ydCBcIi4vc3JjL3N0eWxlcy92YXJpYWJsZS5zY3NzXCI7JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvL1x1OTE0RFx1N0Y2RVx1NEVFM1x1NzQwNlx1NjcwRFx1NTJBMVx1NTY2OFxuICAgIHNlcnZlcjp7XG4gICAgICBwcm94eTp7XG4gICAgICAgIFwiL3Rlc3RcIjp7XG4gICAgICAgICAgLy9cdTc2RUVcdTY4MDdcdTY3MERcdTUyQTFcdTU2NjhcbiAgICAgICAgICAvLyB0YXJnZXQ6ICdodHRwOi8vMTI3LjAuMC4xOjMwNzcnLFxuICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly9zcGgtYXBpLmF0Z3VpZ3UuY24nLFxuICAgICAgICAgIC8vXHU2NjJGXHU1NDI2XHU0RkVFXHU2NTM5aG9zdFx1NUI1N1x1NkJCNVxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICAvL1x1OTFDRFx1NTE5OVx1NjNBNVx1NTNFM1x1RkYwQ1x1NTNCQlx1OTY2NC90ZXN0XG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3Rlc3QvLCAnJyksXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRWLFNBQVMsb0JBQW9CO0FBQ3pYLE9BQU8sU0FBUztBQUVoQixTQUFTLHFCQUFxQjtBQUU5QixPQUFPLFVBQVU7QUFFakIsU0FBUyw0QkFBNEI7QUFQckMsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBQyxRQUFPLE1BQUs7QUFDeEMsU0FBTTtBQUFBLElBQ0osTUFBTTtBQUFBO0FBQUEsSUFFTixTQUFTO0FBQUEsTUFBQyxJQUFJO0FBQUEsTUFDWixxQkFBcUI7QUFBQSxRQUNuQixVQUFVLENBQUMsS0FBSyxRQUFRLFFBQVEsSUFBSSxHQUFHLGtCQUFrQixDQUFDO0FBQUEsUUFDMUQsVUFBVTtBQUFBLE1BQ1osQ0FBQztBQUFBLE1BQ0QsY0FBYztBQUFBLFFBQ1osY0FBYTtBQUFBO0FBQUEsTUFDZixDQUFDO0FBQUEsSUFDSDtBQUFBO0FBQUEsSUFFQSxTQUFRO0FBQUEsTUFDTixPQUFNO0FBQUEsUUFDSixLQUFJLEtBQUssUUFBUSxrQ0FBVSxPQUFPO0FBQUEsTUFDcEM7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLEtBQUs7QUFBQSxNQUNILHFCQUFxQjtBQUFBLFFBQ25CLE1BQU07QUFBQSxVQUNKLG1CQUFtQjtBQUFBLFVBQ25CLGdCQUFnQjtBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsUUFBTztBQUFBLE1BQ0wsT0FBTTtBQUFBLFFBQ0osU0FBUTtBQUFBO0FBQUE7QUFBQSxVQUdOLFFBQVE7QUFBQTtBQUFBLFVBRVIsY0FBYztBQUFBO0FBQUEsVUFFZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxXQUFXLEVBQUU7QUFBQSxRQUMvQztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
