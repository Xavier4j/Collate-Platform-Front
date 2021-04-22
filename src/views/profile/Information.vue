<template>
  <v-container>
    <v-card flat min-height="500" class="ma-10" style="background:none">
      <v-row class="d-flex justify-center mb-6">
        <v-avatar size="100px">
          <v-img :src="profile.avatarUrl" />
        </v-avatar>
      </v-row>

      <v-row class="d-flex justify-center mb-2">
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="profile.name"
            :counter="16"
            outlined
            label="姓名"
            placeholder="（设置后无法改动）"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-textarea
        label="个人说明"
        placeholder="写点什么吧~"
        v-model="profile.note"
        outlined
      ></v-textarea>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" class="mr-2" @click="reset()">重 置</v-btn>

        <v-btn color="warning" @click="save()">保 存</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Information",
  data() {
    return {
      oldProfile: {},
      profile: {},
    };
  },
  methods: {
    change(file) {
      if (!file) {
        return;
      }
      console.log(file.size / 1000);
      if (file.size / 1000 > 1024) {
        this.$toast({
          color: "info",
          mode: "",
          snackbar: true,
          text: "请上传小于1M的图片",
          timeout: 2000,
          x: "right",
          y: "top",
        });
        return;
      }
      console.log(file);
      let formData = new FormData();
      formData.append("uploadFile", file);
      this.uploadFile(formData);
    },
    clear() {
      this.profile.avatarUrl = this.oldProfile.avatarUrl;
    },
    uploadFile(formData) {
      console.log(formData);
      this.$api
        .uploadFile(formData)
        .then((res) => {
          if (res.data.code == 200) {
            this.profile.avatarUrl = res.data.data;
            console.log("成功");
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        });
    },
    getUserProfile() {
      this.$api
        .getUserProfile({
          userId: sessionStorage.getItem("token"),
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.profile = res.data.data;
            //深拷贝一份对象
            this.oldProfile = JSON.parse(JSON.stringify(this.profile));
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            // this.loading = false;
          }, 500);
        });
    },
    reset() {
      this.$refs.upload.reset();
      this.profile = JSON.parse(JSON.stringify(this.oldProfile));
      console.log(this.profile);
    },
    save() {
      this.$api
        .editUserProfile(this.profile)
        .then((res) => {
          if (res.data.code == 200) {
            this.$store.commit("SET_AVATAR", this.profile.avatarUrl);
            this.$toast({
              color: "success",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top",
            });
          } else {
            console.log("获取数据失败！");
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
          console.log("获取数据失败！");
          console.log(err);
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "系统异常，请稍后重试！",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {
          setTimeout(() => {
            // this.loading = false;
          }, 500);
        });
    },
  },
  created() {
    this.getUserProfile();
  },
};
</script>
