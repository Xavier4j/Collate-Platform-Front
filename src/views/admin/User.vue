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
        placeholder="搜索（姓名）"
        @change="reGetUserList"
        style="max-width:500px"
      />
      <v-spacer></v-spacer>
      <!-- <v-btn text color="secondary"></v-btn> -->
      <v-btn outlined color="primary" @click="handleAdd">
        新增用户
      </v-btn>
    </v-card-actions>
    <v-simple-table style="background:none">
      <template v-slot:default>
        <thead>
          <tr>
            <th style="font-size:15px;" class="text-left">用户昵称</th>
            <th style="font-size:15px;" class="text-left">用户头像</th>
            <th style="font-size:15px;" class="text-left">姓名</th>
            <th style="font-size:15px;" class="text-left">个人说明</th>
            <th style="font-size:15px;" class="text-left">授权状态</th>
            <th style="font-size:15px;" class="text-left">任务完成度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in userList" :key="index">
            <td>{{ user.username }}</td>
            <td>
              <v-img
                class="ma-2"
                max-height="150"
                max-width="150"
                :src="user.avatarUrl"
                alt="用户头像"
              />
            </td>
            <td>
              <div style="max-width:120px">
                <v-text-field
                  v-model="user.name"
                  label="姓名"
                  placeholder="回车保存"
                  outlined
                  style="max-width:150px"
                  @change="saveUser(user)"
                >
                </v-text-field>
              </div>
            </td>

            <td>
              {{ user.note }}
            </td>
            <td>
              <v-switch
                v-model="user.isAuthorized"
                :label="user.isAuthorized ? '已授权' : '未授权'"
                color="success"
                hide-details
                @change="saveUser(user)"
              ></v-switch>
            </td>
            <td>{{ user.complete }} / {{ user.total }}</td>
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
    <v-dialog
      v-model="userDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="userDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>新增用户</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="saveUserList">
              完成
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-container class="pa-10">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card
              class="pa-5 ma-2"
              elevation="2"
              v-for="(userForm, index) in userFormList"
              :key="index"
            >
              <v-text-field
                v-model="userForm.username"
                :rules="usernameRules"
                label="用户名"
                required
              ></v-text-field>

              <v-text-field
                v-model="userForm.password"
                :counter="10"
                :rules="passwordRules"
                label="密码"
                required
              ></v-text-field>

              <v-text-field
                v-model="userForm.name"
                :counter="10"
                :rules="nameRules"
                label="姓名"
                required
              ></v-text-field>

              <div class="my-5" style="text-align:center">
                <v-btn
                  class="mx-auto ml-2"
                  color="error"
                  fab
                  @click="userFormList.splice(userForm, 1)"
                >
                  <v-icon color="white">mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-card>
          </v-form>
          <div class="my-5" style="text-align:center">
            <v-btn class="mx-auto" color="pink" fab large @click="addUser">
              <v-icon color="white">mdi-plus</v-icon>
            </v-btn>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="warning" class="mr-4" @click="reset">
              重置表单
            </v-btn>
            <v-btn color="primary" @click="saveUserList">
              完成
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
      search: "",
      userDialog: false,
      deleteDialog: false,
      valid: true,
      userFormList: [
        {
          username: "",
          password: "",
          name: "",
        },
      ],
      usernameRules: [(v) => !!v || "用户名必须填写"],
      passwordRules: [(v) => !!v || "密码必须填写"],
      nameRules: [
        (v) => !!v || "姓名必须填写",
        (v) => (v && v.length <= 16) || "姓名不能超过16个字！",
      ],
      userList: [],
      //分页
      current: 1,
      size: 15,
      //总页数
      pages: 0,
    };
  },
  methods: {
    reGetUserList() {
      this.current = 1;
      this.getUserList();
    },
    getUserList() {
      this.$api
        .getUserList({
          search: this.search,
          current: this.current,
          size: this.size,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.userList = res.data.data.records;
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
    handleAdd() {
      this.userFormList = [
        {
          username: "",
          password: "",
          name: "",
        },
      ];
      this.userDialog = true;
      // 用 this.nextTick 或者用个定时器来确保 dom 渲染并更新
      this.$nextTick(function() {
        // 打开新增弹窗前先重置表单 避免表单出现上一次新增的校验数据
        this.reset();
      });
    },
    addUser() {
      this.userFormList.push({
        username: "",
        password: "",
        name: "",
      });
    },
    saveUserList() {
      this.$api
        .signUpBatch(this.userFormList)
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
            this.userDialog = false;
            this.getUserList();
          } else {
            console.log(1);
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
    saveUser(user) {
      this.$api
        .editUserProfile(user)
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
            this.userDialog = false;
            this.getUserList();
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
    changePage(page) {
      console.log(page);
      this.getUserList();
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
    this.getUserList();
  },
};
</script>
