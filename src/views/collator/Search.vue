<template>
  <v-container style="min-height:600px">
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
            <th style="font-size:15px;" class="text-left">录取照片</th>
            <th style="font-size:15px;" class="text-left">入学采集照片</th>
            <th style="font-size:15px;" class="text-left">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(studentWithResult, index) in studentWithResultList"
            :key="index"
          >
            <td>{{ studentWithResult.name }}</td>
            <td>
              {{ studentWithResult.gender }}
            </td>
            <td>
              {{ studentWithResult.id }}
            </td>
            <td>
              {{ studentWithResult.candidateNumber }}
            </td>
            <td>
              {{ studentWithResult.idCardNumber }}
            </td>
            <td>
              {{ studentWithResult.province }}
            </td>
            <td>
              {{ studentWithResult.phone }}
            </td>
            <td>
              {{ studentWithResult.faculty }}
            </td>
            <td>
              {{ studentWithResult.major }}
            </td>
            <td>
              <v-img
                class="ma-2"
                max-height="150"
                max-width="150"
                :src="studentWithResult.admissionPhotoUrl"
                alt="录取照片"
              />
            </td>
            <td>
              <v-img
                class="ma-2"
                max-height="150"
                max-width="150"
                :src="studentWithResult.entrancePhotoUrl"
                alt="入学采集照片"
              />
            </td>
            <td>
              <span
                v-if="
                  studentWithResult.admissionPhotoUrl == null ||
                    studentWithResult.entrancePhotoUrl == null
                "
                >照片不全</span
              >
              <span v-else-if="studentWithResult.result == null">未核对</span>
              <v-switch
                v-model="studentWithResult.result"
                v-else
                :label="studentWithResult.result ? '核对一致' : '核对不一致'"
                color="success"
                hide-details
                @change="
                  collate(studentWithResult.id, studentWithResult.result)
                "
              ></v-switch>
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
import { mapState } from "vuex";
export default {
  name: "History",
  data() {
    return {
      studentWithResultList: [],
      //分页
      current: 1,
      size: 15,
      //总页数
      pages: 0,
    };
  },
  computed: {
    ...mapState(["token"]),
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
    searchStudentWithResult() {
      this.loading = true;
      this.$api
        .searchStudentWithResult({
          search: this.search,
          userId: this.token,
          current: this.current,
          size: this.size,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.studentWithResultList = res.data.data.records;
            this.pages = res.data.data.pages;
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
    collate(studentWithResultId, result) {
      this.$api
        .collate({
          studentId: studentWithResultId,
          collator: this.token,
          result: result,
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
        .finally(() => {});
    },
    changePage(page) {
      console.log(page);
      this.searchStudentWithResult();
    },
  },
  created() {},
  mounted() {
    this.search = this.$route.query.search;
    this.searchStudentWithResult(this.search);
  },
};
</script>
