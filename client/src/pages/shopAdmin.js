import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './shopAdmin.css'; // Import the CSS file
import {ApiUrl} from "./config";

function ShopAdmin({ currentUser }) {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', quantity: '', description: '', image_url: '' });
    const [editProduct, setEditProduct] = useState({ id: '', name: '', price: '', quantity: '', description: '', image_url: '' });
    useEffect(() => {
        // 发送 GET 请求获取商品列表
        axios.get(`${ApiUrl}/products`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleAddProduct = () => {
        // 发送 POST 请求以添加新商品
        axios.post(`${ApiUrl}/products`, newProduct)
            .then(response => {
                // 刷新商品列表
                setProducts([...products, response.data]);
                // 重置表单
                setNewProduct({ name: '', price: '', quantity: '' , description: '', image_url: '' });
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleDeleteProduct = (productId) => {
        // 发送 DELETE 请求以删除商品
        axios.delete(`${ApiUrl}/products/${productId}`)
            .then(() => {
                // 刷新商品列表
                setProducts(products.filter(product => product.id !== productId));
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleEditProduct = () => {
        // 发送 PUT 请求以编辑商品
        axios.put(`${ApiUrl}/products/${editProduct.id}`, editProduct)
            .then(response => {
                // 刷新商品列表
                setProducts(products.map(product => (product.id === editProduct.id ? response.data : product)));
                // 重置编辑表单
                setEditProduct({ id: '', name: '', price: '', quantity: '', description: '', image_url: '' }); // 重置编辑表单的值
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
            <h1>大明军团商城管理界面</h1>
        <div className="Shopcontainer">
            {/* 新增商品表单 */}
            <div className="form-container">
                <h2 className="h2">新增商品</h2>
                <p>为了保证不出问题，请填写完所有属性</p>
                <div>
                    <input
                        type="text"
                        placeholder="商品名称"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="价格"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="数量"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="商品介绍"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="图片链接"
                        value={newProduct.image_url}
                        onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                    />  
                    <button className="button" onClick={handleAddProduct}>新增</button>
                </div>
            </div>

            {/* 商品列表 */}
            <div className="Shopcontainer">
            <h2 className="h2">商品列表</h2>
            <ul className="product-list">
                {products.map(product => (
                    <li className="product-item" key={product.id}>
                        <span>ID: {product.id}</span>
                        <span>名称: {product.name}</span>
                        <button className="delete-button" onClick={() => handleDeleteProduct(product.id)}>删除</button>
                        <button className="edit-button" onClick={() => setEditProduct(product)}>编辑</button>
                    </li>
                ))}
            </ul>
            </div>

            {/* 编辑商品表单 */}
            {editProduct.id && (
                <div className="form-container">
                    <h2 className="h2">编辑商品</h2>
                    <p>图片可以上传到图床：https://www.superbed.cn/获得链接</p>
                    <input
                        type="text"
                        placeholder="商品名称"
                        value={editProduct.name}
                        onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="价格"
                        value={editProduct.price}
                        onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="数量"
                        value={editProduct.quantity}
                        onChange={(e) => setEditProduct({ ...editProduct, quantity: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="商品介绍"
                        value={editProduct.description}
                        onChange={(e) => setNewProduct({ ...editProduct, description: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="图片链接"
                        value={editProduct.image_url}
                        onChange={(e) => setNewProduct({ ...editProduct, image_url: e.target.value })}
                    />
                    <button className="button" onClick={handleEditProduct}>保存</button>
                </div>
            )}
        </div>
        </div>
    );
}

export default ShopAdmin;
