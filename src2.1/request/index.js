import axios from 'axios'

const http = axios.create({
    baseURL:'http://localhost:3000/',//基准路径
    timeout:3000,//超时时间
    headers:{ //默认请求头
        "Content-Type":"application/json"
    }
})
// 请求拦截器（可选：添加 Token 等公共逻辑）
http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器（统一处理响应、错误）
http.interceptors.response.use(
  (response) => {
    return response.data; // 直接返回响应体数据
  },
  (error) => {
    // 统一处理错误（如 Token 过期、网络异常）
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);
export default http;