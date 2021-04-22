<template>
  <v-app>
    <v-card tile>
      <v-toolbar color="#5c6795" dark flat>
        <v-toolbar-title>照片核对平台</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Search"
          class="hidden-sm-and-down mr-10"
          placeholder="搜索（姓名/学号/身份证号）"
          @change="toSearch"
          style="max-width: 500px"
        />
        <v-btn class="ma-3" text v-if="!token" to="login">登录/注册</v-btn>
        <v-menu v-else offset-y transition="slide-y-transition" bottom>
          <template v-slot:activator="{ on }">
            <v-btn class="ml-3 mr-2" icon large v-on="on">
              <v-avatar size="54px">
                <v-img :src="avatar_url" alt="请登录" />
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              @click="goTo(item.to)"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <template v-slot:extension>
          <v-tabs align-with-title>
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab
              v-for="(item, index) in tabItems"
              v-show="index < 2"
              :key="index"
              :to="item.path"
            >
              <v-icon>{{ item.icon }}</v-icon>
              {{ item.title }}
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items style="background-color: #f9f9f9">
        <router-view :key="$route.fullPath" />
      </v-tabs-items>
    </v-card>

    <Footer />

    <back-to-top />
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "CollatorIndex",
  components: {
    Footer: () => import("@/components/Footer"),
    BackToTop: () => import("@/components/BackToTop"),
  },
  data: () => ({
    tabItems: [
      { title: "开始核对", path: "/", icon: "mdi-image-edit" },
      { title: "历史核对", path: "/history", icon: "mdi-history" },
      { title: "个人中心", path: "/profile", icon: "mdi-account-details" },
      { title: "搜索结果", path: "/search", icon: "mdi-search" },
      // { title: "课程内容", path: "/course", icon: "mdi-course" },
      // { title: "公告查看", path: "/post/view", icon: "mdi-post" },
      // { title: "考试内容", path: "/exam/view", icon: "mdi-exam" },
      // { title: "考试结果", path: "/exam/result", icon: "mdi-exam" },
    ],
    messages: 0,
    id_of_setinterval: "",
    items: [
      { title: "个人中心", to: "/profile/info" },
      { title: "账号设置", to: "/profile/account" },
      { title: "退出登录", to: "logout" },
    ],
  }),
  computed: {
    ...mapState(["drawer", "token", "avatar_url"]),
    search: {
      get() {
        return this.$store.state.search;
      },
      set(val) {
        this.$store.commit("SET_SEARCH", val);
      },
    },
  },
  methods: {
    ...mapMutations({
      setDrawer: "SET_DRAWER",
    }),
    toSearch() {
      if (!this.search) {
        console.log("return");
        return;
      }
      this.$router
        .push({
          path: "search",
          query: {
            search: this.search,
          },
        })
        .catch(() => {});
      this.setDrawer(false);
    },
    changeTab(item) {
      console.log(item);
      this.$router.push({
        path: this.tabItems[item].path,
      });
    },
    goTo(to) {
      if (to == "logout") {
        this.$store.dispatch("LOGOUT");
        this.$router.push({
          path: "/login",
        });
      } else {
        this.setDrawer(false);
        this.$router.push({
          path: to,
        });
      }
    },
  },
  created() {},
};
</script>
