# 大明后勤管理网站
## 配置:
package.json：
`"start2": "concurrently \"npm run server\" \"set PORT=3001 && npm run client\""`
如果是Linux环境要将`set`换为`export`

./.env:
`REACT_APP_GreatMingWeb_PYTHON_PATH='/path/to/python'`替换为你的Python解释器位置
(如果你不知道python解释器的位置，在终端输入:`where python`)

./cilent/.env:
将`REACT_APP_GreatMingWeb_API_BASE_URL=http://localhost:3000`
中的`localhost修改为你的本机IP(或配置为域名)

`./client/src/python/LogRead.py`和`./client/src/python/logreaded/mouth.py`
需要将其中的目录换成Windows/Linux，已经写好，直接取消注释即可(其实有很简单的适配方法，着急上线，下次一定修复！)
## 使用须知：
本网站为骑砍·拿破仑战队 大明帝国 自建网站
## 数据库脚本
### users:
```
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
```
INSERT INTO users (username,tag,ranks,company,kills,attendance,balance,password,enrollmentTime) VALUES  ("JiangHuDao","ZhiZuMan","QH","SQ",123,456,1234,123456,'2022-1-1');
```
### products:
```
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  description TEXT,
  image_url VARCHAR(255)
);
```
```
INSERT INTO products (name, price, quantity, description, image_url) VALUES ('骑砍二', 199, 1, '骑砍二CDK', 'https://pic.imgdb.cn/item/64f682e9661c6c8e5488f618.png');
```

### orders:
```
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255), -- 用户名
    product_name VARCHAR(255), -- 商品名
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 订单创建日期和时间
    product_price DECIMAL(10, 2) -- 商品价格
);
```

