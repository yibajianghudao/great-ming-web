import React, { useState, useEffect } from 'react';
import './shopAdmin.css'; // Import the CSS file
import axios from "axios";
import {ApiUrl} from "./config";

function ChangePassword({ currentUser }) {
    const [user, setUser] = useState({});
    let admin = false;

    const [passwordData, setPasswordData] = useState({
        username: currentUser.username, // 从当前用户获取用户名
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        console.log(currentUser);
        if (currentUser) {
            axios.get(`${ApiUrl}/users/${currentUser}`)
                .then(response => {
                    setUser(response.data[0]);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [currentUser]);
    if (user.tag === "Admin") {
        admin = true;
    }

    const handlePasswordChange = () => {
        // 首先检查旧密码是否正确
        if (passwordData.oldPassword !== user.password) {
            alert('旧密码不正确');
            return;
        }

        // 发送API请求
        const url = `${ApiUrl}/updatePassword`;
        fetch(url, { // 不再需要在URL中包含用户名
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username: currentUser, // 将用户名包含在请求体中
                newPassword: passwordData.newPassword 
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message); // 根据API响应显示消息
                // 清空表单
                setPasswordData({
                    username: passwordData.username, // 保留用户名
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            })
            .catch((error) => {
                console.error(error);
                alert('更新密码时发生错误');
            });
    };

    return (
        <div>
            <div class="main-container">
            
            <div class="background-image"></div>
                <ul class='ul'>
                <li class='li'>
                    <img src="https://pic.imgdb.cn/item/651b3268c458853aef2b3f8f.jpg" alt="Paris"/>
                </li>
                {/* <li><a href="#home" class="active">大明军团</a></li> */}
                {/* <li><a href="#news">主页</a></li>
                <li><a href="#news">日历</a></li>
                <li><a href="#news">商城</a></li>
                <li><a href="#news">成员</a></li>
                <li><a href="#news">个人信息</a></li> */}
                {currentUser ? (
                        <li class='li'><a href="/">主页</a></li>
                    ) : (
                        <li class='li'><a href="/">主页</a></li>
                    )}
                    {currentUser ? (
                        <li class='li'><a href="Development">日历</a></li>
                    ) : (
                        <li class='li'><a href="Login">日历</a></li>
                    )}
                    <li class='li'><a href="Shop">商城</a></li>
                    {currentUser ? (
                        <li class='li'><a href="Development">成员</a></li>
                    ) : (
                        <li class='li'><a href="Login">成员</a></li>
                    )}
                    {currentUser ? (
                        <li class='li'><a href="Info">个人信息</a></li>
                    ) : (
                        <li class='li'><a href="Login">个人信息</a></li>
                    )}
                    {admin ? (
                        <li class='li'><a href="Admin">管理员界面</a></li>
                    ) : (
                        <li class='li'></li>
                    )}
                    {currentUser ? (
                        <li class="LoginInfo">
                        <div class="dropdown"> <a href="#" class="dropbtn">{currentUser}</a>
                            <div class="dropdown-content"> <a href="Development">修改信息</a> <a href="ChangePassword">修改密码</a> <a href="Development">退出登录</a> </div>
                        </div>
                        </li>
                        
                    ) : (
                        <li class="LoginInfo"><a href="Login">登录</a></li>
                    )}
            </ul>
            </div>
            <div className="Shopcontainer">
                {/* 修改密码表单 */}
                <div className="form-container">
                    <h2 className="h2">修改密码</h2>
                    <p>请填写完所有的信息，请注意，该网站安全性较低，请不要使用您常用的密码，推荐设置简单的6位纯数字密码</p>
                    <p>如果你忘记密码，请联系管理员重置密码</p>
                    <div>
                        <input
                            type="text"
                            placeholder="旧密码"
                            value={passwordData.oldPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="新密码"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="确认新密码"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                        <button className="button" onClick={handlePasswordChange}>修改密码</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
