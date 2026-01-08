import axios from 'axios';

// 基础配置
const baseURL = 'http://localhost:3000';  // API 的基础 URL
const timeout = 5000;  // 设置请求超时为 5 秒
const headers = {
    'Content-Type': 'application/json',  // 默认请求头
    // 'Authorization': `Bearer ${token}`, // 如果有 Token 需要添加
};

// 创建 axios 实例
const request = axios.create({
    baseURL,
    timeout,
    headers
});

// 请求拦截器
request.interceptors.request.use(
    function (config) {
        // 可以在这里做请求前的处理，例如添加 Token 或修改请求头
        // 例如：config.headers['Authorization'] = `Bearer ${getAuthToken()}`;
        console.log('Request Interceptor:', config);  // 可选：输出请求信息
        return config;
    },
    function (error) {
        // 请求错误时的处理
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    function (response) {
        console.log('Response Interceptor:', response);  // 输出响应信息
        // 如果你确认后端没有返回 code 和 message，你可以直接返回数据
        return response.data;  // 直接返回数据部分，假设 response.data 是我们需要的
    },
    function (error) {
        console.error('Response Error:', error.response || error.message);
        if (error.response) {
            // 根据不同的 HTTP 错误状态码做不同处理
            switch (error.response.status) {
                case 401:
                    // 未授权，可能需要跳转到登录页
                    break;
                case 500:
                    // 服务器内部错误
                    break;
                default:
                    break;
            }
        }
        return Promise.reject(error);  // 抛出错误
    }
);





export default request
