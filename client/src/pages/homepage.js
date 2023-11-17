import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import Helmet from "react-helmet"
import "./homepage.css"
import axios from "axios";
import {ApiUrl} from "./config";
import Admin from "./admin";

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
        <div>
            <Helmet>
                <title>大明军团主界面</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css" />
            </Helmet>
            <div className="homeHeader">
                <h1>大明军团</h1>
                <div className="homeNav">
                    <Link to="/">主页</Link>
                    {/*<Link to="/Development">日历</Link>*/}
                    {/*<Link to="/Development">商城</Link>*/}
                    {/*<Link to="/Development">成员</Link>*/}
                    {currentUser ? (
                        <Link to="/Development">日历</Link>
                    ) : (
                        <Link to="/Login">日历</Link>
                    )}
                    {currentUser ? (
                        <Link to="/Development">商城</Link>
                    ) : (
                        <Link to="/Login">商城</Link>
                    )}
                    {currentUser ? (
                        <Link to="/Development">成员</Link>
                    ) : (
                        <Link to="/Login">成员</Link>
                    )}
                    {currentUser ? (
                        <Link to="/Info">个人信息</Link>
                    ) : (
                        <Link to="/Login">个人信息</Link>
                    )}
                    {admin ? (
                        <Link to="/Admin">管理员界面</Link>
                    ) : (
                        <Link to="/Development"></Link>
                    )}
                </div>
                <div className="homeLogin">
                    {currentUser ? (
                        <p>欢迎，{currentUser}！</p>
                    ) : (
                        <Link to="/Login" className="button">登录</Link>
                    )}
                </div>
            </div>
            <div className="carousel-container">
                <img
                    src={images[currentImageIndex]}
                    alt={`Image ${currentImageIndex}`}
                    className="carousel-image"
                />
            </div>
            <div className="announcement">
                <h1>公告</h1>
                <blockquote>
                    <p><em>最新军衔制度正式出台，该文件已放入群文件中入队必读文件夹。
                        请将群内及游戏内昵称换为新军衔格式：
                        GreatMing_所属营_ID_军衔
                        新军衔详情请咨询你所属营的管理</em></p>
                </blockquote>
            </div>
            <div className="shop">
                <h1>商店</h1>
            </div>
            <div className="hotspot">
                <h1>热点</h1>
                <blockquote>
                    <p><em>大古的B站视频：<a href="https://www.bilibili.com/video/BV1Cu411G7VX/?share_source=copy_web&vd_source=717e252d12ec490be1cd613be97ab875">你好，我们九周年了</a></em></p>
                </blockquote>
                <blockquote>
                    <p><em>大古的B站视频：<a href="https://www.bilibili.com/video/BV1Uj411o7qd/?share_source=copy_web&vd_source=717e252d12ec490be1cd613be97ab875">B门一个剑圣我说真的</a></em></p>
                </blockquote>
            </div>
            <div className="greatmingimg">
            </div>
            <div className="group">
                <h1>五军营</h1>
                <blockquote>
                    <p><em>营长：HW</em></p>
                </blockquote>
                <h1>神机营</h1>
                <blockquote>
                    <p><em>营长：Gustav</em></p>
                </blockquote>
                <h1>三千营</h1>
                <blockquote>
                    <p><em>营长：PBONE</em></p>
                </blockquote>
            </div>

        </div>
    );
}

export default Homepage;
