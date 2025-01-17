import { FacebookFilled, GoogleCircleFilled, LockOutlined, TwitterCircleFilled, UserOutlined } from '@ant-design/icons'
import { Button, Input, notification } from 'antd'
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import "./index.scss"
import { useDispatch } from 'react-redux'
import { login } from '../../service/authService'
import Cookies from "js-cookie";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user,setUser] = useState({
    username : "",
    password : ""
  });
  const [errors,setErrors] = useState({
    username : "",
    password : ""
  });

  const handleChange = (e) => {
    const {name,value} = e.target;
    setUser({
      ...user,
      [name] : value
  })
    if (value) {
      setErrors({ ...errors, [name]: "" });
    }
  }

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      password: "",
    };

    if (!user.username) {
      newErrors.username = "Tên đăng nhập không được để trống";
      isValid = false;
    }
    if (!user.password) {
      newErrors.password = "Mật khẩu không được để trống";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e)=> {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(login({
      username : user.username,
      password : user.password
    }))
    .unwrap()
    .then((response) => {
      const userData = response?.data;
      const roles = userData?.roles;
      const token = userData?.accessToken;
      localStorage.setItem("user",JSON.stringify(userData));
      Cookies.set('token', token, { path: '/' })

      if (roles.includes("ROLE_ADMIN")) {
        navigate("/admin");
      } else if (roles.includes("ROLE_USER")) {
        navigate("/");
      }

      notification.success({
      message : "Thành công",
      description : "Đăng nhập thành công"
      })
    })
    .catch(() => {
      notification.error({
        message: "Thất bại",
        description: "Đăng nhập thất bại.",
      });
    });
  }

  return (
    <>
    <div className="container-login">
      <div className="form-wrapper">
        <h2 className="title">Đăng nhập</h2>
        <form className="form" 
        onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Tên đăng nhập
            </label>
            <Input
              onChange={handleChange}
              name="username"
              className="form-input"
              placeholder="Nhập tên đăng nhập của bạn"
              prefix={<UserOutlined />}
              // value={user.username}
            />
            {errors.username && <small className="error">{errors.username}</small>}
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mật khẩu
            </label>
            <Input
              onChange={handleChange}
              name="password"
              className="form-input"
              type="password"
              placeholder="Nhập mật khẩu của bạn"
              prefix={<LockOutlined />}
              // value={user.password}
            />
            {errors.password && <small className="error">{errors.password}</small>}
          </div>
          <div className="forgot-password">
            <a href="#">Quên mật khẩu?</a>
          </div>
          <Button className="button" htmlType="submit" type="primary">
            ĐĂNG NHẬP
          </Button>
        </form>
        <div className="social-login-text">Hoặc đăng nhập bằng</div>
        <div className="social-login">
          <button className="social-button">
            <FacebookFilled style={{ color: "blue" }} />
          </button>
          <button className="social-button">
            <TwitterCircleFilled style={{ color: "#2DA7EE" }} />
          </button>
          <button className="social-button">
            <GoogleCircleFilled style={{ color: "#D64F44" }} />
          </button>
        </div>
        <div className="sign-up">
          Hoặc đăng ký <NavLink to="/register">Tạo tài khoản mới</NavLink><br /><br />
        </div>
      </div>
    </div>
    </>
  )
}
