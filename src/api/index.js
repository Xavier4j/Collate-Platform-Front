import axios from "axios";
axios.defaults.timeout = 100000; // 重新请求时间
axios.defaults.headers.Accept = "application/json";

const UPLOAD_URL = "http://10.100.81.133:8098";
const POST_URL = "http://10.100.81.133:8098";

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
   * 修改密码
   * @param {*} params
   */
  updatePassword(params) {
    return axios.get(`${POST_URL}/user/update`, { params: params });
  },
  /**
   * 查询用户信息
   * @param {*} params
   */
  getUserProfile(params) {
    return axios.get(`${POST_URL}/profile/select`, { params: params });
  },
  /**
   * 修改用户信息
   * @param {*} params
   */
  editUserProfile(params) {
    return axios.post(`${POST_URL}/profile/update`, params);
  },
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
   * 核对
   * @param {*} params
   */
  collate(params) {
    return axios.get(`${POST_URL}/collate/collate`, { params: params });
  },
};
