import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    phone: '',
    password: '',
    login: '' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const phoneReg = /^1[3-9]\d{9}$/;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: '',
      login: ''
    }));
  };
  const validateForm = () => {
    let isValid = true;
    const newErrors = { phone: '', password: '', login: '' };
    if (!formData.phone) {
      newErrors.phone = '手机号不能为空';
      isValid = false;
    } else if (!phoneReg.test(formData.phone)) {
      newErrors.phone = '请输入有效的11位手机号';
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = '密码不能为空';
      isValid = false;
    } else if (formData.password.length < 4) {
      newErrors.password = '密码长度不能少于4位';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/login');
      const loginList = response.data;
      const matchedUser = loginList.find(
        user => user.phone === formData.phone && user.password === formData.password
      );
      if (matchedUser) {
        const token = `mock_token_${matchedUser.id}_${Date.now()}`;
        localStorage.setItem('token', token);
        localStorage.setItem('userPhone', matchedUser.phone);
        navigate('/publish');
      } else {
        setErrors(prev => ({
          ...prev,
          login: '手机号或密码错误'
        }));
      }
    } catch (error) {
      console.error('登录请求失败：', error);
      setErrors(prev => ({
        ...prev,
        login: '登录失败，请检查网络或稍后重试'
      }));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <h1 className="login-title">登录</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-item">
          <label htmlFor="phone" className="form-label">手机号</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`form-input ${errors.phone ? 'error-input' : ''}`}
            placeholder="请输入11位手机号"
            disabled={loading}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>
        <div className="form-item">
          <label htmlFor="password" className="form-label">密码</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`form-input ${errors.password ? 'error-input' : ''}`}
            placeholder="请输入密码"
            disabled={loading}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
        <button
          type="submit"
          className="login-btn"
          disabled={loading}
        >
          {loading ? '登录中...' : '登录'}
        </button>
        {errors.login && <span className="login-error">{errors.login}</span>}
      </form>
    </div>
  );
};
export default Login;