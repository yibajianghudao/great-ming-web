import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './shopAdmin.css'; // Import the CSS file
import {ApiUrl} from "./config";

function BalanceCount({ currentUser }) {
    const [balanceFiles, setBalanceFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [validUsernames, setValidUsernames] = useState([]);
    const [invalidUsernames, setInvalidUsernames] = useState([]);
    const [balanceResultText, setBalanceResultText] = useState(''); // 新添加的状态
    const [balanceToAdd, setBalanceToAdd] = useState(0);




    useEffect(() => {
        // 发送 GET 请求获取文件列表
        axios.get(`${ApiUrl}/balanceFilesInDirectory`)
            .then(response => {
                setBalanceFiles(response.data);
            })
            .catch(error => {
                console.error('获取文件列表出错:', error);
            });
    }, []);


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('logfile', selectedFile);

            axios.post(`${ApiUrl}/uploadLogFileba`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(response => {
                console.log('文件上传成功');
                alert('文件上传成功');
                // 或者将消息存储到状态以在页面上显示
                // updateMessage('文件上传成功');
            })
            .catch(error => {
                console.error('文件上传出错：', error);
                alert('文件上传出错：' + error.message);
            });
        }
    };

    const handleDownloadFile = (filename, type) => {
        // 创建一个下载链接并触发点击事件以下载文件
        const downloadLink = document.createElement('a');
        const downloadUrl = `${ApiUrl}/downloadLogFile/${type}/${filename}`;
    
        downloadLink.href = downloadUrl;
        downloadLink.download = filename;
        downloadLink.click();
    };

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

      const readbalanceFile = (filename) => {
        // 调用读取文件的 API
        axios.get(`${ApiUrl}/readBalanceFile/${filename}`)
            .then(response => {
                // 从 API 响应中获取数据
                const data = response.data;
                
                // 从数据中分离有效和无效用户名
                const validUsernames = data.validUsernames || [];
                const invalidUsernames = data.invalidUsernames || [];
    
                // 格式化有效用户名和无效用户名
                const formattedValidUsernames = validUsernames.map(user => {
                    return `username:${user.username},company:${user.company},attendance:${user.attendance},kills:${user.kills}\n`;
                });
    
                const formattedInvalidUsernames = invalidUsernames.map(user => {
                    return `username:${user.username},attendance:${user.attendance},kills:${user.kills}\n`;
                });

    
                // 将格式化后的数据更新到状态
                setValidUsernames(formattedValidUsernames.join('\n'));
                setInvalidUsernames(formattedInvalidUsernames.join('\n'));

                // 生成文本框内容
                const balanceText = generateBalanceText(validUsernames);
                setBalanceResultText(balanceText);
            })
            .catch(error => {
                setValidUsernames('读取文件出错: ' + error.message);
                setInvalidUsernames('读取文件出错: ' + error.message);
            });
    };

    // 新添加的函数，用于生成balance文本
    const generateBalanceText = (validUsernames) => {
        const balanceTextArray = [];
        validUsernames.forEach(user => {
            const { company, kills, username, attendance } = user;
            let balanceToAdd = 0;

            if (company === 'WJ' || company === 'SJ') {
                if (kills > 30) {
                    balanceToAdd = 1;
                }
            } else if (company === 'SQ') {
                if (kills > 50) {
                    balanceToAdd = 1;
                }
            } else if (company === 'SJP') {
                const totalSJPkills = validUsernames
                    .filter(u => u.company === 'SJP')
                    .reduce((total, u) => total + parseInt(u.kills), 0);

                if (totalSJPkills > 120) {
                    balanceToAdd = 1;
                }
            }
            if (attendance >= 3 && attendance < 6 ) {
                balanceToAdd += 1
            } else if (attendance >= 6 && attendance < 8){
                balanceToAdd += 2
            } else if (attendance >= 8) {
                balanceToAdd += 3
            }
                
                

            balanceTextArray.push(`姓名：${username},增加的军饷数：${balanceToAdd}`);
        });

        return balanceTextArray.join('\n');
    };


    // 新添加的函数，用于增加balance
    const addBalance = async (balanceFiles) => {
        const lines = balanceResultText.split('\n');
        const successMessages = [];
        const errorMessages = [];
        console.log(`for之前`)


        for (const line of lines) {
            const [username, balance] = line.replace('姓名：', '').replace('增加的军饷数：', '').split(',');
            console.log(`${username}增加军饷`)
            try {
                const response = await increaseBalanceByUsername(username, balance,balanceFiles);
                successMessages.push(`增加用户 ${username} 的 balance：${response.data}`);
                console.log(`${username}增加军饷消息`)
            } catch (error) {
                errorMessages.push(`更新用户 ${username} 的 balance 时发生错误：${error.message}`);
                console.log(`${username}增加军饷错误`)
            }
        }

        const AKlines = validUsernames.split('\n');
        for (const line of AKlines) {
            const [username, tag, attendance, kills] = line.replace('username:', '').replace('company:', '').replace('attendance:', '').replace('kills:', '').split(',');
            console.log(`${username}增加军饷`)
            try {
                const response = await increaseAK(username, attendance, kills);
                successMessages.push(`增加用户 ${username} 的 balance：${response.data}`);
                console.log(`${username}增加军饷消息`)
            } catch (error) {
                errorMessages.push(`更新用户 ${username} 的 balance 时发生错误：${error.message}`);
                console.log(`${username}增加军饷错误`)
            }
        }


        // 显示成功和错误消息
        if (successMessages.length > 0) {
            alert(`成功发放军饷！`);
        }

        if (errorMessages.length > 0) {
            alert(`更新用户时发生错误:\n${errorMessages.join('\n')}`);
        }
    };

    // 新添加的函数，用于调用API增加balance
    const increaseBalanceByUsername = (username, count,balanceFiles) => {
        return axios.post(`${ApiUrl}/increaseBalance`, {
            username,
            count,
            balanceFiles
        });
    };
    // 调用API增加出勤和击杀
    const increaseAK = (username, attendance, kills) => {
        return axios.post(`${ApiUrl}/increaseAK`, {
            username,
            attendance,
            kills
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
            <h1>大明军团军饷统计界面</h1>
            <h3>请在进行操作后手动刷新页面</h3>
            <div>
                <h2>上传军饷文件</h2>
                <input type="file" accept=".txt" onChange={handleFileChange} />
                <button onClick={handleFileUpload}>上传文件</button>
            </div>
            <div>
                <h2>军饷文件列表</h2>
                <ul>
                    {balanceFiles.map((file, index) => (
                        <li key={index}>
                            {file}
                            <button onClick={() => handleDownloadFile(file, 'balance')}>下载文件</button>
                            <button onClick={() => handleDeleteFile(file, 'balance')}>删除文件</button>
                            <button onClick={() => readbalanceFile(file)}>读取该文件</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>有效用户名</h2>
                <textarea value={validUsernames} readOnly rows="10" style={{ width: '50%', margin: '0 auto', textAlign: 'center' }}></textarea>
            </div>
            <div>
                <h2>无效用户名</h2>
                <p>如果文本中有空白行的话，会读取出一段 “username:,attendance:undefined,kills:undefined”,属于正常现象，不必理会</p>
                <textarea value={invalidUsernames} readOnly rows='10' style={{ width: '50%', margin: '0 auto', textAlign: 'center' }}></textarea>
            </div>
            <div>
                <h2>军饷发放预览</h2>
                <h3>你可以修改通过修改下面的文本来修改发放的具体信息</h3>
                <h3>点击按钮后不会有任何响应，请切换到管理员主页查看是否成功发放</h3>
                <textarea
                    value={balanceResultText}
                    rows='10'
                    style={{ width: '50%', margin: '0 auto', textAlign: 'center' }}
                    onChange={(e) => setBalanceResultText(e.target.value)}
                ></textarea>
                <div>
                <p>请不要重复点击！</p>
                <button onClick={() => addBalance(balanceFiles[0])}>发放军饷</button>
                <p>请不要重复点击！</p>
                </div>
            </div>

        </div>
    );
}

export default BalanceCount;
