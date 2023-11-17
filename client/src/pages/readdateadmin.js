import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './shopAdmin.css'; // Import the CSS file
import {ApiUrl} from "./config";

function ReaddateAdmin({ currentUser }) {
    const [logFiles, setLogFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [directoryStructure, setDirectoryStructure] = useState([]);
    const [txtFiles, setTxtFiles] = useState([]);
    useEffect(() => {
        // 发送 GET 请求获取目录结构
        axios.get(`${ApiUrl}/subdirectoriesWithFiles`)
            .then(response => {
                setDirectoryStructure(response.data);
            })
            .catch(error => {
                console.error('获取目录结构出错:', error);
            });
        axios.get(`${ApiUrl}/txtFilesInDirectory`)
        .then(response => {
            setTxtFiles(response.data);
        })
        .catch(error => {
            console.error('获取.txt文件列表出错:', error);
        });
    }, []);
    const fetchLogFiles = () => {
        axios.post(`${ApiUrl}/getLogFiles`)
            .then(response => {
                setLogFiles(response.data.logFiles);
            })
            .catch(error => {
                console.error('获取日志文件出错:', error);
            });
    };

    useEffect(() => {
        fetchLogFiles();
    }, []);


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const uploadPath = './client/src/python/log'; // 设置写死的文件路径

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

    const handleDownloadFile = (filename, type) => {
        // 创建一个下载链接并触发点击事件以下载文件
        const downloadLink = document.createElement('a');
        const downloadUrl = `${ApiUrl}/downloadLogFile/${type}/${filename}`;
    
        downloadLink.href = downloadUrl;
        downloadLink.download = filename;
        downloadLink.click();
    };

    // const handleDownloadFile = (filename) => {
    //     // 创建一个下载链接并触发点击事件以下载文件
    //     const downloadLink = document.createElement('a');
    //     downloadLink.href = `${ApiUrl}/downloadLogFile/${filename}`; // 设置下载文件的API端点
    //     downloadLink.download = filename; // 设置下载的文件名
    //     downloadLink.click();
    // };
    // const handleDownloadFileed = (filename) => {
    //     // 创建一个下载链接并触发点击事件以下载文件
    //     const downloadLink = document.createElement('a');
    //     downloadLink.href = `${ApiUrl}/downloadLogFileed/${filename}`; // 设置下载文件的API端点
    //     downloadLink.download = filename; // 设置下载的文件名
    //     downloadLink.click();
    // };
    // const handleDownloadFilecount = (filename) => {
    //     // 创建一个下载链接并触发点击事件以下载文件
    //     const downloadLink = document.createElement('a');
    //     downloadLink.href = `${ApiUrl}/downloadLogFilecount/${filename}`; // 设置下载文件的API端点
    //     downloadLink.download = filename; // 设置下载的文件名
    //     downloadLink.click();
    // };

    const handleDeleteFile = (filename, type) => {
        axios.delete(`${ApiUrl}/deleteLogFile/${type}/${filename}`)
          .then(response => {
            console.log(`文件 "${filename}" 已成功删除`);
            fetchLogFiles(); // 删除文件后刷新文件列表
          })
          .catch(error => {
            console.error(`删除文件 "${filename}" 出错: ${error}`);
          });
      };

    // const handleDeleteFile = (filename) => {
    // axios.delete(`${ApiUrl}/deleteLogFile/${filename}`)
    //     .then(response => {
    //         console.log(`文件 "${filename}" 已成功删除`);
    //         fetchLogFiles(); // 删除文件后刷新文件列表
    //     })
    //     .catch(error => {
    //         console.error(`删除文件 "${filename}" 出错: ${error}`);
    //     });
    // };
    // const handleDeleteFileed = (filename) => {
    //     axios.delete(`${ApiUrl}/deleteLogFileed/${filename}`)
    //         .then(response => {
    //             console.log(`文件 "${filename}" 已成功删除`);
    //             fetchLogFiles(); // 删除文件后刷新文件列表
    //         })
    //         .catch(error => {
    //             console.error(`删除文件 "${filename}" 出错: ${error}`);
    //         });
    //     };

    // const handleDeleteFileedcount = (filename) => {
    //     axios.delete(`${ApiUrl}/deleteLogFilecount/${filename}`)
    //         .then(response => {
    //             console.log(`文件 "${filename}" 已成功删除`);
    //             fetchLogFiles(); // 删除文件后刷新文件列表
    //         })
    //         .catch(error => {
    //             console.error(`删除文件 "${filename}" 出错: ${error}`);
    //         });
    //     };

    const renderDirectoryStructure = (structure) => (
        <ul>
            {structure.map((item, index) => (
                <li key={index}>
                        <div>
                            {item.name}

                            {item.files.length > 0 && (
                                <ul>
                                    {item.files.map((file, fileIndex) => (
                                        <li key={fileIndex}>
                                            {file}
                                            <button onClick={() => handleDownloadFile(item.name + ' ' + file, 'ed')}>下载文件</button>
                                            <button onClick={() => handleDeleteFile(item.name + ' ' + file, 'ed')}>删除文件</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                </li>
            ))}
        </ul>
    );


    const scriptLogRead = './client/src/python/LogRead.py';
    const scriptMouth = './client/src/python/logreaded/mouth.py';
    const scriptName = './client/src/python/LogRead.py';

    const runPythonScript = (scriptPathAndName) => {

        axios.post(`${ApiUrl}/runPythonScript`, { scriptPathAndName })
            .then(response => {
                console.log('Python脚本执行成功');
                // 在这里添加处理成功执行Python脚本的逻辑

                // 显示Python脚本的输出给用户
                alert(`Python脚本输出:\n ${response.data.stdout}`);
            })
            .catch(error => {
                console.error('执行Python脚本出错:', error);
                alert(`Python执行错误:\n ${error}`);
                // 在这里添加处理Python脚本执行错误的逻辑
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
            <h1>大明军团数据读取界面</h1>
            <p>请在进行操作后手动刷新页面</p>
            <div>
                <h2>日志文件列表</h2>
                <ul>
                    {logFiles.map((logFile, index) => (
                        <li key={index}>
                        {logFile}
                        <button onClick={() => handleDownloadFile(logFile)}>下载文件</button>
                        <button onClick={() => handleDeleteFile(logFile)}>删除文件</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>上传日志文件</h2>
                <input type="file" accept=".txt" onChange={handleFileChange} />
                <button onClick={handleFileUpload}>上传文件</button>
            </div>
            <div>
                <h2>读取日志文件</h2>
                <button onClick={() => runPythonScript(scriptLogRead)}>开始读取</button>
            </div>
            <div>
                <h2>已读取文件列表</h2>
                {renderDirectoryStructure(directoryStructure)}
            </div>
            <div>
                <h2>总结每月读取文件</h2>
                <button onClick={() => runPythonScript(scriptMouth)}>开始总结</button>
            </div>
            <div>
                <h2>每月总结文件列表</h2>
                <ul>
                    {txtFiles.map((txtFile, index) => (
                        <li key={index}>
                            {txtFile}
                            <button onClick={() => handleDownloadFile(txtFile, 'count')}>下载文件</button>
                            <button onClick={() => handleDeleteFile(txtFile, 'count')}>删除文件</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ReaddateAdmin;
