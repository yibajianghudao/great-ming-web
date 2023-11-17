import React, { useState, useEffect } from 'react';
import axios from "axios";
import {ApiUrl} from "./config";

function Backup({ currentUser }) {
    const [backupFiles, setBackupFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);


    const handleBackup = () => {
        fetch(`${ApiUrl}/backup/make`, {
            method: 'GET'  // 使用GET请求
        })
            .then(response => response.json())
            .then(data => {
                console.log('数据库备份成功');
                // 备份成功后可以更新备份文件列表或进行其他操作
            })
            .catch(error => console.error('数据库备份失败：', error));
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // 获取备份文件列表
    useEffect(() => {
        fetch(`${ApiUrl}/backup/list`)
            .then(response => response.json())
            .then(data => setBackupFiles(data.files || []))  // 设置默认值为空数组
            .catch(error => console.error('获取备份文件列表时发生错误：', error));
    }, []);

    // 下载备份文件
    const downloadBackup = (fileName) => {
        window.open(`${ApiUrl}/backup/download/${fileName}`);
    };

    // 还原数据库
    const restoreDatabase = (fileName) => {
        fetch(`${ApiUrl}/backup/restore/${fileName}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                console.log('数据库还原成功：', data);
                // 添加其他还原成功的操作或提示
            })
            .catch(error => console.error('还原数据库时发生错误：', error));
    };

    // 删除备份文件
    const handleDeleteFile = (filename, type) => {
        axios.delete(`${ApiUrl}/deleteLogFile/${type}/${filename}`)
            .then(response => {
                console.log(`文件 "${filename}" 已成功删除`);
                // 删除文件后刷新文件列表
                // fetchLogFiles();
            })
            .catch(error => {
                console.error(`删除文件 "${filename}" 出错: ${error}`);
            });
    };
    const handleFileUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const uploadPath = './client/src/backups'; // 设置写死的文件路径

            axios.post(`${ApiUrl}/uploadFile?path=${encodeURIComponent(uploadPath)}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    console.log('文件上传成功');
                    alert('文件上传成功');
                })
                .catch(error => {
                    console.error('文件上传出错：', error);
                    alert('文件上传出错：' + error.message);
                });
        }
    };

    return (
        <div>
            <div className="main-container">

                <div className="background-image"></div>
                <ul className='ul'>
                    <li className='li'>
                        <img src="https://pic.imgdb.cn/item/651b3268c458853aef2b3f8f.jpg" alt="Paris"/>
                    </li>
                    {/* <li><a href="#home" class="active">大明军团</a></li> */}
                    <li className='li'><a href="/Admin">管理员主页</a></li>
                    <li className='li'><a href="/Register">队员注册</a></li>
                    <li className='li'><a href="/ReaddateAdmin">数据读取</a></li>
                    <li className='li'><a href="/BalanceCount">军饷统计</a></li>
                    <li className='li'><a href="/Backup">数据备份</a></li>
                    <li className='li'>
                        <div className="dropdown"> <a href="#" className="dropbtn">网站操作</a>
                            <div className="dropdown-content"> <a href="Development">主页操作</a> <a href="ShopAdmin">商店操作</a> <a href="OrderAdmin">订单操作</a> </div>
                        </div>
                    </li>

                    {currentUser ? (
                        <li className="LoginInfo">
                            <div className="dropdown"> <a href="#" className="dropbtn">{currentUser}</a>
                                <div className="dropdown-content"> <a href="Development">修改信息</a> <a href="ChangePassword">修改密码</a> <a href="Development">退出登录</a> </div>
                            </div>
                        </li>

                    ) : (
                        <li className="LoginInfo"><a href="Login">登录</a></li>
                    )}
                </ul>
            </div>

            <div>
                <h2>备份管理</h2>
                <button onClick={() => handleBackup()}>备份数据库</button>
                <h3>备份文件列表</h3>
                <ul>
                    {backupFiles.map((file, index) => (
                        <li key={index}>
                            {file}
                            <button onClick={() => downloadBackup(file)}>下载</button>
                            <button onClick={() => handleDeleteFile(file, 'backup')}>删除文件</button>
                            <button onClick={() => restoreDatabase(file)}>还原数据库</button>
                        </li>
                    ))}
                </ul>
                <div>
                    <h2>上传备份文件</h2>
                    <input type="file" accept=".sql" onChange={handleFileChange} />
                    <button onClick={handleFileUpload}>上传文件</button>
                </div>
            </div>
        </div>
    );
}

export default Backup;

