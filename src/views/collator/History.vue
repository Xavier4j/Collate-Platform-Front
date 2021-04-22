<template>
  <v-container style="min-height:600px"> </v-container>
</template>

<script>
export default {
  name: "History",
  data() {
    return {
      model: 0,
      colors: ["primary", "secondary", "yellow darken-2", "red", "orange"],
      courseList: [],
      loading: false, //加载项
      //分页
      current: 1,
      size: 15,
      //总页数
      pages: 0,
    };
  },
  methods: {
    getCourseList() {
      this.loading = true;
      this.$api
        .searchCourseList({
          current: this.current,
          size: this.size,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.pages = res.data.data.pages;
            if (this.current <= this.pages) {
              this.current++;
            }
            this.courseList.push(...res.data.data.records);
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          // this.$message.error("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    loadMore() {},
  },
  created() {},
  mounted() {},
};
</script>
