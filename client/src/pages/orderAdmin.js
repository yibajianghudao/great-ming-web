import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./orderAdmin.css"
import {ApiUrl} from "./config";

function OrderAdmin({ currentUser }) {
    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({ user_name: '', product_name: '', product_price: '' });

    useEffect(() => {
        // 发送 GET 请求获取订单列表
        axios.get(`${ApiUrl}/orders`)
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleAddOrder = () => {
        // 发送 POST 请求以创建新订单
        axios.post(`${ApiUrl}/orders`, newOrder)
            .then(response => {
                // 刷新订单列表
                setOrders([...orders, response.data]);
                // 重置表单
                setNewOrder({ user_name: '', product_name: '', product_price: '' });
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleDeleteOrder = (orderId) => {
        // 发送 DELETE 请求以删除订单
        axios.delete(`${ApiUrl}/orders/${orderId}`)
            .then(() => {
                // 刷新订单列表
                setOrders(orders.filter(order => order.id !== orderId));
            })
            .catch(error => {
                console.error(error);
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
                    <li className='li'><a href="/Admin">管理员主页</a></li>
                    <li className='li'><a href="/Register">队员注册</a></li>
                    <li className='li'><a href="/ReaddateAdmin">数据读取</a></li>
                    <li className='li'><a href="/BalanceCount">军饷统计</a></li>
                    <li className='li'><a href="/Backup">数据备份</a></li>
                <li class='li'>
                        <div class="dropdown"> <a href="#" class="dropbtn">网站操作</a>
                            <div class="dropdown-content"> <a href="Development">主页操作</a> <a href="ShopAdmin">商店操作</a> <a href="OrderAdmin">订单操作</a> </div>
                        </div>
                        </li>
                
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
            <h1>订单管理界面</h1>
            {/* 订单列表 */}
            <ul className="order-list">
  {orders.map(order => (
    <li key={order.id} className="order-item">
      <span>ID: {order.id}</span>
      <span>用户名称: {order.user_name}</span>
      <span>商品名称: {order.product_name}</span>
      <span>商品价格: {order.product_price}</span>
      <button className="order-delete-button" onClick={() => handleDeleteOrder(order.id)}>删除订单</button>
    </li>
  ))}
</ul>
        </div>
    );
}

export default OrderAdmin;
