//基础路由
export const constantRoutes = [
  //登录路由
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    name: "login",
    meta: {
      title: "登录",
      hidden: true,
    },
  },
  //首页路由
  {
    path: "/home",
    component: () => import("@/views/home/index.vue"),
    name: "home",
    meta: {
      title: "",
      hidden: false,
    },
    redirect: "/home/homePage", //重定向路由
    children: [
      {
        path: "/home/homePage",
        component: () => import("@/views/home/HomePage.vue"),
        name: "homePage",
        meta: {
          title: "首页",
          hidden: false,
          svgName: "home",
        },
      },
    ],
  },
  //404路由
  {
    path: "/404",
    component: () => import("@/views/404/index.vue"),
    name: "404",
    meta: {
      title: "404路由",
      hidden: true,
    },
  },
  // 数据大屏路由
  {
    path: "/screen",
    component: () => import("@/views/screen/index.vue"),
    name: "Screen",
    meta: {
      title: "数据大屏",
      svgName: "screen",
    },
  },

  //重定向到首页
  {
    path: "/:pathMatch(.*)*", //表示任意路径
    redirect: "/home", //重定向到"/login"路由
    name: "Any",
    meta: {
      title: "重定向路由",
      hidden: true,
    },
  },
];
//权限路由
export const asyncRoutes = [
  //权限管理路由
  {
    path: "/acl",
    component: () => import("@/views/home/index.vue"),
    name: "Acl",
    meta: {
      title: "权限管理",
      svgName: "alc",
    },
    redirect: "/acl/user",
    children: [
      {
        path: "/acl/user",
        component: () => import("@/views/Acl/user/index.vue"),
        name: "User",
        meta: {
          title: "用户管理",
          svgName: "user",
        },
      },
      {
        path: "/acl/role",
        component: () => import("@/views/Acl/role/index.vue"),
        name: "Role",
        meta: {
          title: "角色管理",
          svgName: "role",
        },
      },
      {
        path: "/acl/permission",
        component: () => import("@/views/Acl/permission/index.vue"),
        name: "Permission",
        meta: {
          title: "菜单管理",
          svgName: "permission",
        },
      },
    ],
  },
  //商品管理
  {
    path: "/product",
    component: () => import("@/views/home/index.vue"),
    name: "Product",
    meta: {
      title: "商品管理",
      svgName: "product",
    },
    redirect: "/product/trademark",
    children: [
      {
        path: "/product/trademark",
        component: () => import("@/views/product/trademark/index.vue"),
        name: "Trademark",
        meta: {
          title: "品牌管理",
          svgName: "trademark",
        },
      },
      {
        path: "/product/attr",
        component: () => import("@/views/product/attr/index.vue"),
        name: "Attr",
        meta: {
          title: "属性管理",
          svgName: "attr",
        },
      },
      {
        path: "/product/spu",
        component: () => import("@/views/product/spu/index.vue"),
        name: "Spu",
        meta: {
          title: "SPU管理",
          svgName: "spu",
        },
      },
      {
        path: "/product/sku",
        component: () => import("@/views/product/sku/index.vue"),
        name: "Sku",
        meta: {
          title: "SKU管理",
          svgName: "sku",
        },
      },
    ],
  },
];


