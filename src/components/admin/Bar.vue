<template>
  <v-app-bar
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    src="https://picsum.photos/1920/1080?random"
    app
    color="blue darken-3"
    dark
  >
    <template v-slot:img="{ props }">
      <v-img
        v-bind="props"
        gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
      ></v-img>
    </template>
    <v-btn
      class="ma-2"
      tile
      text
      color="white"
      style="height:50px;width:50px;min-width:0px;padding:5px !important;margin: 5px !important;"
      @click.stop="setDrawer(!drawer)"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <!-- <v-app-bar-nav-icon tile outlined @click.stop="setDrawer(!drawer)" /> -->
    <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
      <span>照片核对平台</span>
    </v-toolbar-title>
    <v-spacer />
    <v-btn class="ma-3" text v-if="!token" to="/login">登录/注册</v-btn>
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
  </v-app-bar>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Bar",

  data: () => ({
    items: [
      { title: "个人中心", to: "/admin/profile" },
      { title: "账号设置", to: "/admin/account" },
      { title: "退出登录", to: "/admin/logout" },
    ],
    messages: 0,
    id_of_setinterval: "",
  }),

  computed: {
    ...mapState(["drawer", "token", "avatar_url"]),
  },
  methods: {
    ...mapMutations({
      setDrawer: "SET_DRAWER",
    }),
    goTo(to) {
      if (to == "/admin/logout") {
        this.$store.dispatch("LOGOUT");
        this.$router.push({
          path: "/login",
        });
      } else {
        if (to == "message") {
          this.messages = 0;
        }
        this.setDrawer(false);
        this.$router.push({
          path: to,
        });
      }
    },
  },
  created() {
  },
};
</script>
