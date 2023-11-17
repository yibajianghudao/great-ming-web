import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import './components/Login.css';
import PropTypes from 'prop-types';
import Helmet from "react-helmet"
import "./Login.css"
import {ApiUrl} from "./config";

async function loginUser(credentials) {
    return fetch(`${ApiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }

export default function Login({ setToken  }) {
    const navigate = useNavigate(); // 用于导航的钩子
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [currentUser, setCurrentUser] = useState(null);

    const handleRegisterClick = () => {
        // navigate('/Register');
        navigate('/RegisterTourists');
    };
    const handleSubmit = async e => {
        e.preventDefault();
        const response = await loginUser({
          username,
          password
        });
        setToken(response);
        setCurrentUser(response.user.username); // 设置当前用户
        sessionStorage.setItem('currentUser', response.user.username);
        //console.log(response.user.username);
        //console.log(currentUser);
        // 成功登录后导航到 Home
        navigate('/');
        // 跳转后刷新页面，以重新渲染组件，显示欢迎信息
        window.location.reload();
      }

    return(
        <div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css" />
            <Helmet>
                <title>登录界面</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Helmet>
            <div className="login-wrapper">
                <fieldset>
                <h1>大明军团登录界面</h1>
                {currentUser ? <p>Logged in as: {currentUser}</p> : null}
                <form onSubmit={handleSubmit}>
                <label htmlFor="nameField">用户名</label>
                <input type="text" placeholder="请输入用户名" id="nameField" onChange={e => setUserName(e.target.value)} />

                <label htmlFor="passwordField">密码</label>
                <input type="password" placeholder="请输入密码" id="passwordField" onChange={e => setPassword(e.target.value)} />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button className="button button-primary" type="submit">登录</button>
                    <button className="button button-outline" onClick={handleRegisterClick}>去注册</button>
                </div>

                </form>
                </fieldset>
            </div>
        </div>
    )
  }
  
  Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }