import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Helmet from "react-helmet";
import "./homepage.css"
import "./new_homepage.css"
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
        // 调用API来更新数据库中的数据，使用 editingUser 的数据
        axios.put(`${ApiUrl}/updateUser/${editingUser.username}`, editingUser)
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

    // 渲染表格行，根据用户是否正在编辑来显示不同的内容
    const renderTableRow = (user, index) => {
        if (editingUser && editingUser.id === user.id) {
            return (
                <tr key={index}>
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
        <Helmet>
            <title>大明军团管理员界面</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css" />
        </Helmet>
        <div className="homeHeader">
            <h1>大明军团</h1>
            <div className="homeNav">
                <Link to="/">主页</Link>
                <Link to="/Register">队员注册</Link>
                <Link to="/Development">数据上传</Link>
                <Link to="/Development">数据备份</Link>
                <Link to="/Development">网站操作</Link>
            </div>
            <div className="homeLogin">
                <p>{currentUser}</p>
            </div>
        </div>
            <div>
                <h2>所有用户信息：</h2>
                <p>点击属性可以按该属性进行排序</p>
                <table>
                    <thead>
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