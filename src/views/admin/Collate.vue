<template>
  <v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        solo
        hide-details
        prepend-inner-icon="mdi-magnify"
        class="hidden-sm-and-down mr-10"
        placeholder="搜索（姓名/学号/身份证号）"
        @change="reGetStudentList"
        style="max-width:500px"
      />
      <v-spacer></v-spacer>
      <v-btn class="mr-10" color="primary" @click="exportResult"
        >导出结果</v-btn
      >
    </v-card-actions>

    <v-tabs
      v-model="tab"
      @change="changeTab"
      color="deep-purple accent-4"
      centered
    >
      <v-tab v-for="item in items" :key="item.tab" style="font-size:16px">
        {{ item.tab }}
      </v-tab>
    </v-tabs>
    <v-simple-table style="background:none">
      <template v-slot:default>
        <thead>
          <tr>
            <th style="font-size:15px;" class="text-left">姓名</th>
            <th style="font-size:15px;" class="text-left">性别</th>
            <th style="font-size:15px;" class="text-left">学号</th>
            <th style="font-size:15px;" class="text-left">考生号</th>
            <th style="font-size:15px;" class="text-left">身份证号</th>
            <th style="font-size:15px;" class="text-left">省份</th>
            <th style="font-size:15px;" class="text-left">手机号</th>
            <th style="font-size:15px;" class="text-left">院系</th>
            <th style="font-size:15px;" class="text-left">专业</th>
            <th style="font-size:15px;" class="text-center">
              状态（一致/不一致/核对人员数）
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(studentWithAllResult, index) in studentWithAllResultList"
            :key="index"
          >
            <td>{{ studentWithAllResult.name }}</td>
            <td>
              {{ studentWithAllResult.gender }}
            </td>
            <td>
              {{ studentWithAllResult.id }}
            </td>
            <td>
              {{ studentWithAllResult.candidateNumber }}
            </td>
            <td>
              {{ studentWithAllResult.idCardNumber }}
            </td>
            <td>
              {{ studentWithAllResult.province }}
            </td>
            <td>
              {{ studentWithAllResult.phone }}
            </td>
            <td>
              {{ studentWithAllResult.faculty }}
            </td>
            <td>
              {{ studentWithAllResult.major }}
            </td>
            <td class="text-center">
              {{ studentWithAllResult.same }}/{{
                studentWithAllResult.different
              }}/{{ studentWithAllResult.total }}
              <!-- <v-chip
                :color="studentWithAllResult.result ? 'green' : 'red'"
                text-color="white"
              >
                {{ studentWithAllResult.result ? "核对一致" : "核对不一致" }}
              </v-chip> -->
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- 分页 -->
    <div class="text-center my-3">
      <v-pagination
        v-model="current"
        :length="pages"
        total-visible="10"
        @input="changePage"
      ></v-pagination>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Student",
  data() {
    return {
      //搜索
      search: "",
      //检索条件
      tab: 0,
      items: [
        { tab: "所有学生" },
        { tab: "核对成功学生" },
        { tab: "核对失败学生" },
      ],
      //数据
      studentWithAllResultList: [],
      collatorNum: "",
      //分页
      current: 1,
      size: 15,
      //总页数
      pages: 0,
    };
  },
  methods: {
    reGetStudentList() {
      this.current = 1;
      this.getStudentList();
    },
    changeTab(value) {
      console.log(value);
      this.reGetStudentList();
    },
    getStudentList() {
      this.$api
        .searchStudentWithAllResult({
          search: this.search,
          condition: this.tab,
          current: this.current,
          size: this.size,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.studentWithAllResultList = res.data.data.records;
            this.pages = res.data.data.pages;
          } else {
            this.$toast({
              color: "error",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "系统异常,请稍后重试!",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {});
    },
    countCollator() {
      this.$api
        .countCollator()
        .then((res) => {
          if (res.data.code == 200) {
            this.collatorNum = res.data.data;
          } else {
            this.$toast({
              color: "error",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "系统异常,请稍后重试!",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {});
    },
    exportResult() {
      this.$api
        .exportResult()
        .then((res) => {
          if (res.data.code == 200) {
            this.$toast({
              color: "success",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top",
            });

            var a = document.createElement("a"); // 生成一个a元素

            var event = new MouseEvent("click"); // 创建一个单击事件

            a.download = name || "photo"; // 设置图片名称

            a.href = res.data.data; // 将生成的URL设置为a.href属性

            a.dispatchEvent(event); // 触发a的单击事件
          } else {
            this.$toast({
              color: "success",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "导出失败，请稍后重试！",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {});
    },
    changePage(page) {
      console.log(page);
      this.getStudentList();
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
  mounted() {
    this.getStudentList();
    this.countCollator();
  },
};
</script>

<style lang="scss" scoped>
.active {
  background-color: rgb(189, 109, 189);
  color: white !important;
}
</style>
