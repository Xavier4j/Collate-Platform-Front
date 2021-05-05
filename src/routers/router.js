import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      component: () => import("@/views/Login"),
    },
    {
      path: "/",
      component: () => import("@/views/CollatorIndex"),
      children: [
        {
          name: "Collate",
          path: "/",
          component: () => import("@/views/collator/Collate"),
          meta: {
            requireAuth: true, //添加该字段，表示访问该页面需要登录
          },
        },
        {
          name: "History",
          path: "history",
          component: () => import("@/views/collator/History"),
          meta: {
            requireAuth: true, //添加该字段，表示访问该页面需要登录
          },
        },
        {
          name: "Search",
          path: "search",
          component: () => import("@/views/collator/Search"),
          meta: {
            requireAuth: true, //添加该字段，表示访问该页面需要登录
          },
        },
        {
          name: "Profile",
          path: "profile",
          component: () => import("@/views/profile/Profile"),
          meta: {
            requireAuth: true, //添加该字段，表示访问该页面需要登录
          },
          children: [
            {
              name: "Information",
              path: "info",
              component: () => import("@/views/profile/Information"),
            },
            {
              name: "Account",
              path: "account",
              component: () => import("@/views/profile/Account"),
            },
            {
              path: "*",
              redirect: "info",
            },
          ],
        },
      ],
    },
    //以下为管理员端
    {
      path: "/admin",
      component: () => import("@/views/AdminIndex"),
      meta: {
        requireAuth: true, //添加该字段，表示访问该页面需要登录
        requireAdminAuth: true, //添加该字段，表示访问该页面需要登录管理员账号
      },
      children: [
        {
          name: "Collate",
          path: "collate",
          component: () => import("@/views/admin/Collate"),
        },
        {
          name: "User",
          path: "user",
          component: () => import("@/views/admin/User"),
        },
        {
          name: "Admin Profile",
          path: "profile",
          component: () => import("@/views/profile/Information"),
        },
        {
          name: "Admin Account",
          path: "account",
          component: () => import("@/views/profile/Account"),
        },
      ],
    },
    {
      path: "/admin/*",
      redirect: "/admin/collate",
    },
    {
      path: "/*",
      redirect: "/",
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    console.log(to);
    console.log(from);
    console.log(savedPosition);
    // return 期望滚动到哪个的位置
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});
