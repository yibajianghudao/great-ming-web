import React, { useState, useEffect } from 'react';
import "./new_homepage.css"
import axios from "axios";
import {ApiUrl} from "./config";

function Homepage({currentUser = ""}) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [
        'https://pic.imgdb.cn/item/64f682e9661c6c8e5488f618.png',
        'https://pic.imgdb.cn/item/64f682e6661c6c8e5488f5d2.png',
        // Add more image URLs here
    ];
    const [user, setUser] = useState({});
    let admin = false;

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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                (prevIndex + 1) % images.length
            );
        }, 3000); // Change image every 3 seconds

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
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
                    {currentUser ? (
                        <li class='li'><a href="http://47.236.16.156:4000/zh">ChatGPT</a></li>
                        ) : (
                        <li class='li'><a href="http://47.236.16.156:4000/zh">ChatGPT</a></li>
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


            <div class="container"> 
                <div class="left">
                    <div class="header">
                        <div class="name">
                            <img src="https://pic.imgdb.cn/item/651b3268c458853aef2b3f8f.jpg" alt="Paris"></img>
                            <h1>大明军团</h1>
                            <h2>日月昭昭，惟我大明</h2>
                        </div>
                    </div>
                </div>
                <div class="center">
                    <div className="carousel-container">
                    <img
                        src={images[currentImageIndex]}
                        alt={`Image ${currentImageIndex}`}
                        className="carousel-image"
                    />
                </div>
                </div>
                <div class="right">
                    <h1>更新公告</h1>
                    <p>修复了贷款问题，新增数据库备份与还原功能，新增ChatGPT3.5的使用，以后会发布4.0版本</p>
                    <p>修复了因为服务器在正德那边导致的经常连不上的问题，目前服务器部署在新加坡，建议关闭梯子使用，进不去服务器请联系管理重启服务器</p>
                    <p>如果遇到Bug或有什么好的建议请给江湖刀发邮件(见本页面最下方小字)，方便集中统计和军饷发放，感谢！</p>
                </div>
            </div>


            <div class="container">
                <div class="next-left">
                    <h1>商城</h1>
                </div>
                <div class="next-center">
                    <h1>热点</h1>
                    <blockquote>
                        <p><em>大古的B站视频：<a href="https://www.bilibili.com/video/BV1Cu411G7VX/?share_source=copy_web&vd_source=717e252d12ec490be1cd613be97ab875">你好，我们九周年了</a></em></p>
                    </blockquote>
                    <blockquote>
                        <p><em>大古的B站视频：<a href="https://www.bilibili.com/video/BV1Uj411o7qd/?share_source=copy_web&vd_source=717e252d12ec490be1cd613be97ab875">B门一个剑圣我说真的</a></em></p>
                    </blockquote>
                </div>
                <div class="next-right">
                <h1>兵营</h1>
                <h2>五军营</h2>
                <blockquote>
                    <p><em>营长：HW</em></p>
                </blockquote>
                <h2>神机营</h2>
                <blockquote>
                    <p><em>营长：Gustav</em></p>
                </blockquote>
                <h2>三千营</h2>
                <blockquote>
                    <p><em>营长：PBONE</em></p>
                </blockquote>
                </div>

            </div>

            <div class="footer">
                    <p>日月昭昭，惟我大明</p>
                    <p>如果在网站中发现bug，请私聊管理或给江湖刀发送邮件:w2027075535@outlook.com(强烈建议给江湖刀发邮件)</p>
            </div>
        </div>
    );
}

export default Homepage;
