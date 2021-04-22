<template>
  <v-container style="min-height:520px">
    <v-card flat :loading="loading" style="min-height:520px">
      <div class="my-4">
        <v-progress-linear
          color="green"
          height="20"
          :value="(completed / total) * 100"
          striped
          >{{ completed }}/{{ total }}</v-progress-linear
        >
      </div>
      <v-row
        class="d-flex justify-center align-center ma-0"
        v-if="completed < total"
      >
        <v-col cols="12" sm="12" md="2" style="text-align:left">
          <div>
            <v-chip color="primary" outlined pill>
              姓名：{{ student.name }}
            </v-chip>
          </div>
          <div
            class="mt-2 text-body-2"
            style="text-align:left;display:inline-block;width:auto"
          >
            性别：{{ student.gender }}
          </div>
          <div
            class="mt-2 text-body-2"
            style="text-align:left;display:inline-block;width:auto"
          >
            学号：{{ student.id }}
          </div>
          <div
            class="mt-2 text-body-2"
            style="text-align:left;display:inline-block;width:auto"
          >
            考生号：{{ student.candidateNumber }}
          </div>
          <div
            class="mt-2 text-body-2"
            style="text-align:left;display:inline-block;width:auto"
          >
            身份证号：{{ student.idCardNumber }}
          </div>
          <div
            class="mt-2 text-body-2"
            style="text-align:left;display:inline-block;width:auto"
          >
            省份：{{ student.province }}
          </div>
          <div
            class="mt-2 text-body-2"
            style="text-align:left;display:inline-block;width:auto"
          >
            手机：{{ student.phone }}
          </div>
          <div
            class="mt-2 text-body-2"
            style="text-align:left;display:inline-block;width:auto"
          >
            院系：{{ student.faculty }}
          </div>
          <div
            class="mt-2 text-body-2"
            style="text-align:left;display:inline-block;width:auto"
          >
            专业：{{ student.major }}
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-img
            :aspect-ratio="6 / 8"
            width="300"
            :src="student.admissionPhotoUrl"
            style="margin:0 auto"
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-img
            :aspect-ratio="6 / 8"
            width="300"
            :src="student.entrancePhotoUrl"
            style="margin:0 auto"
          />
        </v-col>
        <v-col cols="12" sm="12" md="2" style="text-align:center">
          <v-btn class="ma-2" color="red" large dark @click="collate(false)">
            <v-icon left> mdi-close </v-icon>
            不一致</v-btn
          >
          <v-btn class="ma-2" color="success" large @click="collate(true)">
            <v-icon left> mdi-check </v-icon>
            <pre>一&nbsp;致</pre>
          </v-btn>
          <v-btn class="ma-2" text small @click="getLastTask">
            <pre>上一个</pre>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Collate",
  data() {
    return {
      loading: false, //加载项
      student: {
        admissionPhotoUrl: "",
        entrancePhotoUrl: "",
      },
      completed: 0,
      total: 200,
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    getTask() {
      this.loading = true;
      this.$api
        .getTask({
          userId: this.token,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.student = res.data.data.student;
            this.total = res.data.data.total;
            this.completed = res.data.data.completed;
            this.same = res.data.data.same;
          } else {
            this.$toast({
              color: "error",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 3000,
              x: "right",
              y: "top",
            });
          }
        })
        .catch((err) => {
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "系统异常，请稍后重试！",
            timeout: 3000,
            x: "right",
            y: "top",
          });
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getLastTask() {
      this.loading = true;
      this.$api
        .getLastTask({
          id: this.student.id,
          userId: this.token,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.student = res.data.data.student;
            this.total = res.data.data.total;
            this.completed = res.data.data.completed;
            this.same = res.data.data.same;
          } else {
            this.$toast({
              color: "error",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 3000,
              x: "right",
              y: "top",
            });
          }
        })
        .catch((err) => {
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "系统异常，请稍后重试！",
            timeout: 3000,
            x: "right",
            y: "top",
          });
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    collate(same) {
      this.loading = true;
      this.$api
        .collate({
          id: this.student.id,
          collator: this.token,
          same: same,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.$toast({
              color: "success",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 700,
              x: "right",
              y: "top",
            });
            this.getTask();
          } else {
            this.$toast({
              color: "error",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 3000,
              x: "right",
              y: "top",
            });
          }
        })
        .catch((err) => {
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "系统异常，请稍后重试！",
            timeout: 3000,
            x: "right",
            y: "top",
          });
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  created() {},
  mounted() {
    this.getTask();
  },
};
</script>
