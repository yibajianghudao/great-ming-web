# 大明后勤管理网站
## nginx配置：
你需要在配置文件中对端口进行配置，使客户端请求转发到3001端口，/api请求转发到3000端口（用于解决跨域请求问题）
例如:(如果该配置文件中有http{}块，server块应置于http{}中)
'''
server {
      # 监听IPV4
      listen 80 default_server;
      # 监听IPV6
      listen [::80] default_server;
      # 匹配域名
      server_name XXXX;
      # 客户端请求
      location / {proxy_pass http://127.0.0.1:3001;}
      # API请求
      location /api {proxy_pass http://127.0.0.1:3000;}
}
'''
如果你想要禁止IP直接访问的话，你可以删除listen 80/[::80] 后的default_server，然后在该配置文件中添加:
'''
server {
      listen 80 default_server;
      server_name _;
      return 403;
}
'''
## 配置:
#### package.json：

`"start2": "concurrently \"npm run server\" \"set PORT=3001 && npm run client\""`如果是Linux环境要将`set`换为`export`

#### ./.env:

`REACT_APP_GreatMingWeb_PYTHON_PATH='/path/to/python'`替换为你的Python解释器位置(如果你不知道python解释器的位置，在终端输入:`where python`)

#### ./cilent/.env:
将`REACT_APP_GreatMingWeb_API_BASE_URL=http://localhost:3000`中的`localhost修改为你的本机IP(或配置为域名)

#### `./client/src/python/LogRead.py`和`./client/src/python/logreaded/mouth.py`
需要将其中的目录换成Windows/Linux，已经写好，直接取消注释即可(其实有很简单的适配方法，着急上线，下次一定修复！)


#### 创建文件夹
读取文件和总结文件时，需要创建好对应的月份文件夹，比如0124log文件，则需要创建./client/src/python/logreaded/01文件夹
统计军饷，在上传总结好的文件之前，需要先创建./client/src/python/balancefiles/文件夹


## 使用须知：
本网站为骑砍·拿破仑战队 大明帝国 自建网站

本网站可正常运行在:

``````
Nodejs:V21.1.0
Npm:V10.2.3
``````

另外，经过测试，可在npm:V6版本下运行，nodejs未进行其他测试

#### 安装依赖顺序如下:

1. cd到./client目录下，使用`npm install`安装依赖
2. cd到根目录下，使用:`npm install`安装依赖

#### 安装报错的处理:

1. 如果没有科学上网工具，请使用:

   `npm config set registry https://registry.npm.taobao.org/`

   切换国内源为淘宝镜像源。

   执行下面的命令，确认是否切换成功。

   ```text
   npm config get registry
   ```

   如果输出：[https://registry.npm.taobao.org/](https://link.zhihu.com/?target=https%3A//registry.npm.taobao.org/)，则表示切换成功

   切换为默认源的方法：

   ```text
   npm config set registry https://registry.npmjs.org/
   npm config get registry
   ```

2. 如果安装过程中报错(该错误目前只会出现在根目录中的npm install中):

   ``````
   npm ERR! sharp: Detected globally-installed libvips v8.14.5
   npm ERR! sharp: Building from source via node-gyp
   npm ERR! gyp info it worked if it ends with ok
   npm ERR! gyp info using node-gyp@10.0.1
   ...
   npm ERR! gyp ERR! command "/usr/bin/node" "/usr/lib/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
   npm ERR! gyp ERR! cwd /home/JiangHuDao/linshi/linshi/great-ming-web/node_modules/sharp
   npm ERR! gyp ERR! node -v v21.1.0
   npm ERR! gyp ERR! node-gyp -v v10.0.1
   npm ERR! gyp ERR! not ok
   ``````

   此报错是由于sharp安装它所需要的一个依赖时不不会直接使用我们刚刚设置的国内镜像源，需要单独设置:

   注:sharp的[官方文档](https://sharp.pixelplumbing.com/install#chinese-mirror)中提到的使用npm config和环境变量均已失效

   在本项目根目录创建文件:`.npmrc`写入:

   ``````
   sharp_libvips_binary_host = https://npm.taobao.org/mirrors/sharp-libvips
   sharp_binary_host = https://npm.taobao.org/mirrors/sharp
   ``````

   然后重新npm install即可

   如果依然无法解决，请尝试使用科学上网的全局代理模式(tun模式)

3. 如果遇到:卡在`reify:prettier: timing reifyNode:node_modules/@nrwl/workspace Completed in 12729ms`(如果使用的ssh远程部署，多半会直接卡死，需要重启云服务器):

   使用:`npm insatll -g npm@6`回退到npm6版本

   另外，删除`node_models`和`package-lock.json`文件(不删除lock文件的话会卡在`build:react-router-dom: sill linkStuff react-router-dom@6.19.0 has XXX build:react-router-dom: sill linkStuff react-router-dom@6.19.0 has`)

   然后使用`npm install`即可。

   

## 数据库脚本

注意，你需要手动安装mysql或mariadb，并自行新建用户和设置密码，另外需要新建一个数据库，然后使用下面的建表脚本建表
另外，手动打开./src/server.js文件，在`const db = mysql.createConnection`此行下面配置你的信息

### users:
```mysql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(60) NOT NULL,
    tag VARCHAR(60) DEFAULT "members",
    ranks VARCHAR(60),
    company VARCHAR(60),
    kills INT DEFAULT 0,
    attendance INT DEFAULT 0,
    balance DOUBLE DEFAULT 0,
    password VARCHAR(60),
    enrollmentTime VARCHAR(60), 
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
```mysql
INSERT INTO users (username,tag,ranks,company,kills,attendance,balance,password,enrollmentTime) VALUES  ("jianghudao","Admin","QH","SQ",123,456,1234,123456,'2022-1-1');
```
### products:
```mysql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  description TEXT,
  image_url VARCHAR(255)
);
```
```mysql
INSERT INTO products (name, price, quantity, description, image_url) VALUES ('骑砍二', 199, 1, '骑砍二CDK', 'https://pic.imgdb.cn/item/64f682e9661c6c8e5488f618.png');
```

### orders:
```mysql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255), -- 用户名
    product_name VARCHAR(255), -- 商品名
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 订单创建日期和时间
    product_price DECIMAL(10, 2) -- 商品价格
);
```



## 启动方法：

在根目录运行:`npm run start2`会在本地的3000端口运行客户端，在3001端口运行服务端

#### 使用技巧

1. 将用户的标签(tag)设置为`Admin`可以使该用户登录时查看到管理员界面
2. 部分页面没有完备的刷新功能，请在点击某些按钮之后手动刷新页面

