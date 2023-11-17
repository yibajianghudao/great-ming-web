import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "./shop.css"
import "./new_homepage.css"
import {ApiUrl} from "./config";

export default function Shop({ currentUser }) {
    const [user, setUser] = useState({});
    const [products, setProducts] = useState([]); // 新增的状态变量，用于存储商品列表
    const [selectedProduct, setSelectedProduct] = useState(null); // 新增状态变量，用于存储选中的商品
    const [orderCreated, setOrderCreated] = useState(false); // 新增状态变量，用于标记订单是否已创建成功
    const navigate = useNavigate(); // 用于导航的钩子

    let admin = false;
    
    useEffect(() => {
        // 获取商品数据并更新状态变量
        axios.get(`${ApiUrl}/products`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.log(error);
            });

        // ...

    }, [currentUser]);

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


    // 处理购买按钮点击事件
    const handleBuyProduct = (product) => {
        if (user.balance < product.price) {
            alert('余额不足，无法购买该商品！');
        } else {
            setSelectedProduct(product);
            // 在此处可以创建订单并将其保存到数据库
            const newOrder = {
                user_name: currentUser,
                product_name: product.name,
                product_price: product.price,
                
            };
        
            axios.post(`${ApiUrl}/orders`, newOrder)
                .then(response => {
                    // 更新用户余额
                    const updatedBalance = user.balance - parseInt(product.price); // 价格抹去小数部分
                    // 构建包含所有字段的用户信息对象
                    const updatedUserInfo = {
                        tag: user.tag,
                        ranks: user.ranks,
                        company: user.company,
                        kills: user.kills,
                        attendance: user.attendance,
                        balance: updatedBalance,
                        enrollmentTime: new Date(user.enrollmentTime).toISOString().slice(0, 19).replace('T', ' '), // 转换日期时间格式                    balance: updatedBalance,
                        name: user.name, // 保留 name 字段
                    };
                    
                    // 更新商品数量
                    const updatedQuantity = product.quantity - 1
                    // 构建包含所有字段的商品信息对象
                    const updatedProductInfo = {
                    name: product.name,
                    price: product.price,
                    quantity: updatedQuantity, // 更新商品数量
                    description: product.description,
                    image_url: product.image_url,
                    };
                    
                    axios.put(`${ApiUrl}/products/${product.id}`, updatedProductInfo)
                    .then(() => {
                        // 发送更新用户信息的请求
                        axios.put(`${ApiUrl}/updateUser/${currentUser}`, updatedUserInfo)
                            .then(() => {
                                setOrderCreated(true);
                                alert('你订单已成功创建！请联系管理员(大古)进行商品的发放')
                                // 跳转到 /ShopAfter 界面
                                // navigate('/ShopAfter');
                                alert('请手动刷新页面，以购买其他商品')
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
            .catch(error => {
                console.error(error);
            });
        }
};
const LoginProduct = () => {
    alert('请先登录')
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
                        <div class="dropdown"> <a href="#" class="dropbtn">{currentUser},余额：{user.balance}</a>
                            <div class="dropdown-content"> <a href="Development">修改信息</a> <a href="ChangePassword">修改密码</a> <a href="Development">退出登录</a> </div>
                        </div>
                        </li>
                        
                    ) : (
                        <li class="LoginInfo"><a href="Login">登录</a></li>
                    )}
            </ul>
            </div>
            <div>
                <h1>大明军团商城</h1>
            </div>
            <div class="shopshow">
            <ul class="shopul">
  {products.map(product => (
    <li key={product.id} class="shopli">
      <div className="product-container">
        <div className="product-image">
          {product.image_url && (
            <img src={product.image_url} alt={product.name} />
          )}
        </div>
        <div className="product-details">
          <h3>{product.name}</h3>
          <p>价格: {product.price}</p>
          <p>数量: {product.quantity}</p>
          <p>介绍: {product.description}</p>
          {currentUser ? (
          <button className="buy-button" onClick={() => handleBuyProduct(product)}>购买</button>
          ) : (
            <button className="buy-button" onClick={() => LoginProduct()}>购买</button>
          )}
        </div>
        </div>
        </li>
    ))}
    </ul>

    {orderCreated && (
        <p>订单已成功创建！请手动刷新页面！</p>
        )}
        </div>
    </div>
  );
}
