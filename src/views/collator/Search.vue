<template>
  <v-container>
    搜索结果
  </v-container>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      tabs: "",
      items: [
        {
          id: "",
          title: "综合",
        },
        {
          id: "",
          title: "用户",
        },
        {
          id: "",
          title: "帖子",
        },
      ],
      all: {
        userList: [],
        postList: [],
        //是否查询过
        status: false,
      },
      userLoading: false,
      userList: [],
      userPageNum: 1,
      userPageSize: 18,
      postLoading: false,
      postList: [],
      postPageNum: 1,
      postPageSize: 18,
    };
  },
  computed: {
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
    changeTab(tabs) {
      if (tabs == 0) {
        if (!this.all.status) {
          this.searchAll(this.search);
        }
      } else if (tabs == 1) {
        this.searchUser(this.search, this.userPageNum, this.userPageSize);
      } else if (tabs == 2) {
        this.searchPost(this.search, this.postPageNum, this.postPageSize);
      }
    },
    handleChangeTab(tabs) {
      this.tabs = tabs;
    },
    toPostView(id) {
      this.$router.push({
        path: "post",
        query: {
          id: id,
        },
      });
    },
    searchAll(search) {
      this.$api
        .search({
          search: search,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.all.status = true;
            this.all.userList = res.data.data.userPageInfo.list;
            this.all.postList = res.data.data.postPageInfo.list;
            this.all.postList.forEach((item) => {
              item.show = false;
            });
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          // this.$message.error("获取数据失败！");
          console.log(err);
        });
    },
    searchUser(search, pageNum, pageSize) {
      this.userLoading = true;
      this.$api
        .searchUser({
          search: search,
          pageNum: pageNum,
          pageSize: pageSize,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.userList = res.data.data.list;
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          // this.$message.error("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.userLoading = false;
        });
    },
    searchPost(search, pageNum, pageSize) {
      this.postLoading = true;
      this.$api
        .searchPost({
          search: search,
          pageNum: pageNum,
          pageSize: pageSize,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.postList = res.data.data.list;
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          // this.$message.error("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.postLoading = false;
        });
    },
  },
  watch: {
    $route(to, from) {
      if (from.path == "/search" && to.path == "/search") {
        this.$router.go(0);
      }
    },
  },
  created() {
    console.log("created");
  },
  mounted() {
    console.log("mounted");
    this.search = this.$route.query.search;
  },
};
</script>
