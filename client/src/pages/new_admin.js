import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Helmet from "react-helmet";
import "./homepage.css"
import "./new_homepage.css"
import "./new_admin.css"
import {ApiUrl} from "./config";

export default function Admin({ currentUser }) {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true); // Added a loading state
    const [users, setUsers] = useState([]);
    const [sortColumn, setSortColumn] = useState('username'); // Initial sorting column
    const [sortDirection, setSortDirection] = useState('asc'); // Initial sorting direction
    // 用于跟踪正在编辑的用户数据
    const [editingUser, setEditingUser] = useState(null);


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
        } //else {
        //     // 如果 currentUser 不存在，你可以选择在这里采取适当的处理方式
        // }
    }, [currentUser]);

    useEffect(() => {
        axios.get(`${ApiUrl}/getAllUsers`)
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    // 管理员身份判断
    let admin = false;
    if (user.tag === "Admin") {
        admin = true;
    }

    // 处理点击表头排序事件
    const handleSort = (columnName) => {
        if (columnName === sortColumn) {
            // 如果点击的是当前排序列，则切换排序方向
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // 如果点击的是新的列，则重置排序方向为升序
            setSortColumn(columnName);
            setSortDirection('asc');
        }
    };

    // 对用户数组进行排序
    const sortedUsers = [...users].sort((a, b) => {
        const direction = sortDirection === 'asc' ? 1 : -1;
        return (a[sortColumn] < b[sortColumn] ? -1 : 1) * direction;
    });

    // 点击修改按钮时，设置正在编辑的用户
    const handleEdit = (user) => {
        setEditingUser(user);
    };

    // 保存已编辑的用户数据
    const handleSave = () => {
        // 创建一个日期对象，假设 enrollmentTime 是一个 ISO 格式的日期时间字符串
        //const formattedEnrollmentTime =new Date(user.enrollmentTime).toISOString().slice(0, 19).replace('T', ' '); // 转换日期时间格式                    balance: updatedBalance,

    
        // 将 enrollmentTimeStr 用作发送给后端的日期时间值
        const updatedUser = {
            ...editingUser,
        };
    
        // 调用API来更新数据库中的数据，使用 updatedUser 的数据
        axios.put(`${ApiUrl}/updateUser/${editingUser.username}`, updatedUser)
            .then(response => {
                // 更新用户列表或执行其他操作
                // 重新获取用户数据等
                // 在此示例中，假设更新成功后刷新用户列表
                axios.get(`${ApiUrl}/getAllUsers`)
                    .then(response => {
                        setUsers(response.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
    
                // 清除正在编辑的用户状态
                setEditingUser(null);
            })
            .catch(error => {
                console.log(error);
            });
    };
    // 处理删除用户的函数
    const handleDelete = (username) => {
        if (window.confirm(`确定要删除用户 ${username} 吗？`)) {
            // 调用API来通过用户名删除用户
            axios.delete(`${ApiUrl}/deleteUser/${username}`)
                .then(response => {
                    // 成功删除后更新用户列表
                    axios.get(`${ApiUrl}/getAllUsers`)
                        .then(response => {
                            setUsers(response.data);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    const Resetpasswd = (username) => {
      
        // 发送API请求
        // 发送API请求
        const url = `${ApiUrl}/updatePassword`;
        fetch(url, { // 不再需要在URL中包含用户名
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username: username,
                newPassword: '123456',
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message); // 根据API响应显示消息
            })
            .catch((error) => {
                console.error(error);
                alert('更新密码时发生错误');
            });
      };

    // 渲染表格行，根据用户是否正在编辑来显示不同的内容
    const renderTableRow = (user, index) => {
        if (editingUser && editingUser.id === user.id) {
            return (
                <tr key={index} className="listafter">
                    <td>
                        <input
                            type="text"
                            value={editingUser.username}
                            onChange={(e) => handleEditField('username', e.target.value)}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={editingUser.tag}
                            onChange={(e) => handleEditField('tag', e.target.value)}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={editingUser.ranks}
                            onChange={(e) => handleEditField('ranks', e.target.value)}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={editingUser.company}
                            onChange={(e) => handleEditField('company', e.target.value)}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={editingUser.kills}
                            onChange={(e) => handleEditField('kills', e.target.value)}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={editingUser.attendance}
                            onChange={(e) => handleEditField('attendance', e.target.value)}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={editingUser.balance}
                            onChange={(e) => handleEditField('balance', e.target.value)}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={editingUser.enrollmentTime}
                            onChange={(e) => handleEditField('enrollmentTime', e.target.value)}
                        />
                    </td>
                    <td>
                        <button onClick={handleSave}>保存</button>
                        <button onClick={handleCancel}>取消</button>
                        
                    </td>
                </tr>
            );
        } else {
            return (
                <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.tag}</td>
                    <td>{user.ranks}</td>
                    <td>{user.company}</td>
                    <td>{user.kills}</td>
                    <td>{user.attendance}</td>
                    <td>{user.balance}</td>
                    <td>{user.enrollmentTime}</td>
                    <td>
                        <button onClick={() => handleEdit(user)}>修改</button>
                        <button onClick={() => Resetpasswd(user.username)}>重置密码</button>
                        <button onClick={() => handleDelete(user.username)}>删除</button>
                    </td>
                </tr>
            );
        }
    };
    const handleEditField = (fieldName, value) => {
        // 在编辑用户对象的副本上进行更改
        setEditingUser((prevEditingUser) => ({
            ...prevEditingUser,
            [fieldName]: value,
        }));
    };
    // 新的处理取消保存的函数
    const handleCancel = () => {
        // 清除正在编辑的用户状态
        setEditingUser(null);
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
                <li className='li'><a href="/">主页</a></li>
                <li class='li'><a href="/Register">队员注册</a></li>
                <li class='li'><a href="/ReaddateAdmin">数据读取</a></li>
                <li class='li'><a href="/BalanceCount">军饷统计</a></li>
                <li class='li'><a href="/Backup">数据备份</a></li>
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
            <div class="table-container">
                <h2>所有队员信息：</h2>
                <p>请按ctrl+F搜索指定用户名</p>
                {/* <p>点击属性可以按该属性进行排序</p> */}
                <p>重置密码会将密码重置为123456</p>
                <table>
                    <thead id="Admincustomers">
                    <tr>
                        <th onClick={() => handleSort('username')}>姓名</th>
                        <th onClick={() => handleSort('tag')}>标签</th>
                        <th onClick={() => handleSort('ranks')}>军衔</th>
                        <th onClick={() => handleSort('company')}>营</th>
                        <th onClick={() => handleSort('kills')}>击杀</th>
                        <th onClick={() => handleSort('attendance')}>出勤</th>
                        <th onClick={() => handleSort('balance')}>军饷</th>
                        <th onClick={() => handleSort('enrollmentTime')}>入队时间</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) => renderTableRow(user, index))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}