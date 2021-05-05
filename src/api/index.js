import axios from "axios";
axios.defaults.timeout = 100000; // 重新请求时间
axios.defaults.headers.Accept = "application/json";

const UPLOAD_URL = "http://localhost:8098";
const POST_URL = "http://localhost:8098";

// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    sessionStorage.getItem("$_authentication");
    console.log(`${new Date().getHours()}:${new Date().getMinutes()}`);
    console.log(config);
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error(error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  (response) => {
    console.log(`${new Date().getHours()}:${new Date().getMinutes()}`);
    console.log(response);
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    console.error(error);
    console.error(error.request);
    return Promise.reject(error.request);
  }
);

export default {
  /**
   * 上传文件
   * @param {*} params
   */
  uploadFile(data) {
    let config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return axios.post(`${UPLOAD_URL}/upload`, data, config);
  },
  /**
   * 登陆并获取用户信息
   * @param {*} params
   */
  logIn(params) {
    return axios.post(`${POST_URL}/user/login`, params);
  },
  /**
   * 注册并获取用户信息
   * @param {*} params
   */
  signUp(params) {
    return axios.post(`${POST_URL}/user/signup`, params);
  },
  /**
   * 批量注册
   * @param {*} params
   */
  signUpBatch(params) {
    return axios.post(`${POST_URL}/user/signup-batch`, params);
  },
  /**
   * 修改密码
   * @param {*} params
   */
  updatePassword(params) {
    return axios.get(`${POST_URL}/user/update-password`, { params: params });
  },
  /**
   * 查询用户信息
   * @param {*} params
   */
  getUserProfile(params) {
    return axios.get(`${POST_URL}/user/select`, { params: params });
  },
  /**
   * 修改用户信息
   * @param {*} params
   */
  editUserProfile(params) {
    return axios.post(`${POST_URL}/user/update-profile`, params);
  },
  // /**
  //  * 查询总任务量
  //  * @param {*} params
  //  */
  // countTotal(params) {
  //   return axios.get(`${POST_URL}/student/count-total`, { params: params });
  // },
  // /**
  //  * 查询已完成任务量
  //  * @param {*} params
  //  */
  // countCompleted(params) {
  //   return axios.get(`${POST_URL}/student/count-completed`, { params: params });
  // },
  /**
   * 获取任务
   * @param {*} params
   */
  getTask(params) {
    return axios.get(`${POST_URL}/student/get-task`, { params: params });
  },
  /**
   * 获取上一个任务
   * @param {*} params
   */
  getLastTask(params) {
    return axios.get(`${POST_URL}/student/get-last-task`, { params: params });
  },
  /**
   * 获取下一个任务
   * @param {*} params
   */
  getNextTask(params) {
    return axios.get(`${POST_URL}/student/get-next-task`, { params: params });
  },
  /**
   * 获取历史任务
   * @param {*} params
   */
  getHistoryTaskList(params) {
    return axios.get(`${POST_URL}/student/get-history`, { params: params });
  },
  /**
   * 核对
   * @param {*} params
   */
  collate(params) {
    return axios.get(`${POST_URL}/collate/collate`, { params: params });
  },
  /**
   * 查询学生列表（核对人员使用，含核对结果）
   * @param {*} params
   */
  searchStudentWithResult(params) {
    return axios.get(`${POST_URL}/student/search-with-result`, {
      params: params,
    });
  },
  /**
   * 查询学生列表（管理员使用，含所有核对人员的核对结果）
   * @param {*} params
   */
  searchStudentWithAllResult(params) {
    return axios.get(`${POST_URL}/student/search-with-all-result`, {
      params: params,
    });
  },
  /**
   * 查询核对人员列表（含模糊查询）
   * @param {*} params
   */
  getUserList(params) {
    return axios.get(`${POST_URL}/user/search`, { params: params });
  },
  /**
   * 查询核对人员数量
   * @param {*} params
   */
  countCollator(params) {
    return axios.get(`${POST_URL}/user/count-collator`, { params: params });
  },
  /**
   * 导出核对结果为Excel
   * @param {*} params
   */
  exportResult(params) {
    return axios.get(`${POST_URL}/collate/export`, { params: params });
  },
};
