import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./homepage.css"
import "./new_homepage.css"
import "./info.css"
import "./loading.css"
import {ApiUrl} from "./config";

function Info({ currentUser }) {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true); // Added a loading state
    const [avatar, setAvatar] = useState(null);  // State to hold the selected file



    useEffect(() => {
        console.log(currentUser);
        if(currentUser) {
            axios.get(`${ApiUrl}/users/${currentUser}`)
                .then(response => {
                    setUser(response.data[0]);
                    setTimeout(() => {
                        setLoading(false);  // Set loading to false after a delay
                    }, 2000);
                })
                .catch(error => {
                    console.log(error);
                    setTimeout(() => {
                        setLoading(false);  // Also set loading to false after a delay in case of an error
                    }, 2000);
                });
        } else {
            setTimeout(() => {
                setLoading(false);  // If currentUser is not available, we also set loading to false after a delay
            }, 2000);  // If currentUser is not available, we also set loading to false to indicate no data is coming.
        }
    }, [currentUser]);

    const handleFileChange = (event) => {
        setAvatar(event.target.files[0]); // Set the selected file
    };

    const uploadAvatar = () => {
        const formData = new FormData();
        formData.append('avatar', avatar); // Use the name 'avatar' that the server expects

        axios.post(`${ApiUrl}/users/${currentUser}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            alert('Avatar uploaded successfully');
            setUser({ ...user, avatar: response.data.avatar });
        })
        .catch(error => {
            console.error('Error uploading avatar:', error);
            alert('Error uploading avatar');
        });
    };



    let admin = false;
    if (user.tag === "Admin") {
        admin = true;
    }

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
                        <div class="dropdown"> <a href="#" class="dropbtn">{currentUser}</a>
                            <div class="dropdown-content"> <a href="Development">修改信息</a> <a href="ChangePassword">修改密码</a> <a href="Development">退出登录</a> </div>
                        </div>
                        </li>
                        
                    ) : (
                        <li class="LoginInfo"><a href="Login">登录</a></li>
                    )}
            </ul>
            
            
            <div className="info">
                {/* Example data rendering */}
                {loading ? (  // 有条件地渲染加载内容
                    <div>
                        <div className="loading-spinner"></div>
                        <p>听说智祖喜欢borgo，只是不愿意表达</p>
                    </div>
                ) : (
                    <div>
                    <h1>队员信息</h1>
                    <img src={user.avatar} alt="User Avatar" />
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={uploadAvatar}>上传头像</button>

                    <table id="customers">
  <tr>
    <th>姓名</th>
    <th>{user.username}</th>
  </tr>
  <tr>
    <td>标签</td>
    <td>{user.tag}</td>

  </tr>
  <tr>
    <td>军衔</td>
    <td>{user.ranks}</td>

  </tr>
  <tr>
    <td>营</td>
    <td>{user.company}</td>

  </tr>
  <tr>
    <td>击杀</td>
    <td>{user.kills}</td>

  </tr>
  <tr>
    <td>出勤</td>
    <td>{user.attendance}</td>

  </tr>
  <tr>
    <td>军饷</td>
    <td>{user.balance}</td>

  </tr>
  <tr>
    <td>入队时间</td>
    <td>{user.enrollmentTime}</td>

  </tr>
  <tr>
    <td>账号创建时间</td>
    <td>{user.create_at}</td>

    </tr>
    </table>
    </div>
                    
                    // <table>
                    //     <thead>
                    //     <tr>
                    //         <th>姓名</th>
                    //         <th>{user.username}</th>
                    //     </tr>
                    //     </thead>
                    //     <tbody>
                    //     <tr>
                    //         <td>标签</td>
                    //         <td>{user.tag}</td>
                    //     </tr>
                    //     <tr>
                    //         <td>军衔</td>
                    //         <td>{user.ranks}</td>
                    //     </tr>
                    //     <tr>
                    //         <td>营</td>
                    //         <td>{user.company}</td>
                    //     </tr>
                    //     <tr>
                    //         <td>击杀</td>
                    //         <td>{user.kills}</td>
                    //     </tr>
                    //     <tr>
                    //         <td>出勤</td>
                    //         <td>{user.attendance}</td>
                    //     </tr>
                    //     <tr>
                    //         <td>军饷</td>
                    //         <td>{user.balance}</td>
                    //     </tr>
                    //     <tr>
                    //         <td>入队时间</td>
                    //         <td>{user.enrollmentTime}</td>
                    //     </tr>
                    //     <tr>
                    //         <td>账号创建时间</td>
                    //         <td>{user.create_at}</td>
                    //     </tr>
                    //     </tbody>
                    // </table>
                )}
                {/*<p>Username: {user.username}</p>*/}
                {/*<p>Tag: {user.tag}</p>*/}
                {/*<p>Rank: {user.ranks}</p>*/}
                {/*<p>Company: {user.company}</p>*/}
                {/*<p>Kills: {user.kills}</p>*/}
                {/*<p>Attandance: {user.attandance}</p>*/}
                {/*<p>Balance: {user.balance}</p>*/}
                {/*<p>Creat at: {user.create_at}</p>*/}
                {/* Add other data fields similarly*/}

                {/* Add edit buttons, image upload functionality, etc. */}
            </div>
            </div>
        </div>
    );
}

export default Info;
