import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {ApiUrl} from "./config";

export default function ShopAfter({ currentUser }) {
    const [user, setUser] = useState({});
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
    return (
        <div>
            <h1>{ currentUser }，你订单已成功创建！</h1>
            <h2>请联系管理员(大古)进行商品的发放</h2>
            <h2>你现在的余额为:{user.balance}</h2>
            <Link to="/">返回主页</Link>
        </div>
    );
};
