const multer = require('multer');
const path = require('path');
 
const cors = require('cors');

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

const { exec } = require('child_process');

//请将替换为你的Python解释器位置
// const pythonPath = process.env.REACT_APP_GreatMingWeb_PYTHON_PATH;
const pythonPath ='/usr/bin/python'

// 使用 body-parser 只解析 application/x-www-form-urlencoded 类型的数据
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Cors setting for local test. 
app.use(cors());
app.set('trust proxy', 1);
app.use(cors({
    origin: 'http://localhost:3001'
  }));
  
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow any origin
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// 原版数据库连接
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'GreatMingWeb'
});

// // Docker镜像的数据库链接(使用本地数据库而不是数据库镜像)
// const dbConfig = {
//     host: process.env.DB_HOST || '127.0.0.1',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '123456',
//     database: process.env.DB_NAME || 'GreatMingWeb',
// };
//
// const db = mysql.createConnection(dbConfig)

db.connect();

app.use('/login', (req, res) => {
    //console.log(req.body.password);


    let updateQuery = 'SELECT users.password FROM users WHERE username = ? ';
    db.query(updateQuery, [req.body.username], (err, result) => {
        //res.json(result);
        //Cheak if the password match. Also aware about if the result of the query is nothing.
        if(result != ""){
            if (req.body.password==result[0].password){
                res.send({
                token: 'pass',
                user: {
                    username: req.body.username
                    // Add other user data you want to send back here
                }
                });
            }
            else{
                res.send({
                    token: 'denied'
                });
            }
        }
        if(err) throw err;
        });



    });


    // app.get('/products', (req, res) => {
    //     //console.log("Fetching details for:", req.params.username);
    //     db.query('SELECT * FROM product', (err, results) => {
    //         if(err) throw err;
    //         res.json(results);
            
    //     });
    // });

app.post('/register', (req, res) => {
    const { username, tag, ranks, company, kills, attendance, balance, password, enrollmentTime } = req.body;

    // 在此处添加逻辑来验证用户输入，例如检查用户名是否已存在等。
    const checkUsernameQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkUsernameQuery, [username], (checkErr, checkResult) => {
        if (checkErr) {
            console.error(checkErr);
            res.status(500).json({ error: '注册时发生错误' });
        } else {
            if (checkResult.length > 0) {
                // 用户名已存在，返回错误响应
                res.status(400).json({ error: '用户名已被注册' });
            } else {
                // 用户名不存在，继续执行注册逻辑
                const insertQuery = 'INSERT INTO users (username, tag, ranks, company, kills, attendance, balance, password, enrollmentTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                db.query(
                    insertQuery,
                    [username, tag, ranks, company, kills, attendance, balance, password, enrollmentTime],
                    (insertErr, result) => {
                        if (insertErr) {
                            console.error(insertErr);
                            res.status(500).json({ error: '注册时发生错误' });
                        } else {
                            res.status(200).json({ message: '注册成功' });
                        }
                    }
                );
            }
        }
    });
});

// Fetch all user details
app.get('/users/:username', (req, res) => {
    console.log("Fetching details for:", req.params.username);
    db.query('SELECT * FROM users WHERE username = ?', [req.params.username], (err, results) => {
        if(err) throw err;
        res.json(results);
        
    });
});

// Update user details (this is just a sample for username)
app.put('/users/:id', (req, res) => {
    let updateQuery = 'UPDATE users SET username = ? WHERE id = ?';
    db.query(updateQuery, [req.body.username, req.params.id], (err, result) => {
        if(err) throw err;
        res.json({message: 'User updated successfully'});
    });
});

// 定义一个API端点以获取所有用户信息
app.get('/getAllUsers', (req, res) => {
    // 查询数据库以检索所有用户信息
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            res.status(500).json({ error: '检索用户数据时出错' });
            return;
        }

        // 将所有用户信息作为JSON响应发送
        res.json(results);
    });
});

// Update user details for all attributes based on username
app.put('/updateUser/:username', (req, res) => {
    const username = req.params.username;
    const {
        tag,
        ranks,
        company,
        kills,
        attendance,
        balance,
        enrollmentTime,
    } = req.body;

    // 构建更新查询语句
    const updateQuery = `
    UPDATE users 
    SET tag = ?,
        ranks = ?,
        company = ?,
        kills = ?,
        attendance = ?,
        balance = ?,
        enrollmentTime = ?
    WHERE username = ?
`;

    db.query(
        updateQuery,
        [tag, ranks, company, kills, attendance, balance, enrollmentTime, username],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: '更新用户时发生错误' });
            } else {
                res.status(200).json({ message: '用户信息已更新' });
            }
        }
    );
});


app.put('/updatePassword', (req, res) => {
    const username = req.body.username; 
    const newPassword = req.body.newPassword; // 新密码
  
    // 构建更新密码查询语句
    const updatePasswordQuery = `
      UPDATE users
      SET password = ?
      WHERE username = ?
    `;
  
    db.query(
      updatePasswordQuery,
      [newPassword, username],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: '更新密码时发生错误' });
        } else {
          res.status(200).json({ message: '密码已更新' });
        }
      }
    );
  });



app.delete('/deleteUser/:username', (req, res) => {
    const username = req.params.username;

    // 构建删除查询语句
    const deleteQuery = `
    DELETE FROM users 
    WHERE username = ?
    `;

    db.query(deleteQuery, [username], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: '删除用户时发生错误' });
        } else {
            res.status(200).json({ message: '用户已成功删除' });
        }
    });
});

// 获取所有商品
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            res.status(500).json({ error: '检索产品数据时出错' });
            return;
        }
        res.json(results);
    });
});

//新增商品
app.post('/products', (req, res) => {
    const { name, price, quantity, description, image_url } = req.body;
    const insertQuery = 'INSERT INTO products (name, price, quantity, description, image_url) VALUES (?, ?, ?, ?, ?)';
    db.query(
        insertQuery,
        [name, price, quantity, description, image_url],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: '创建产品时发生错误' });
            } else {
                // 返回新创建的商品数据
                const newProduct = {
                    id: result.insertId,
                    name,
                    price,
                    quantity,
                    description,
                    image_url,
                };
                res.status(200).json(newProduct);
            }
        }
    );
});

// 删除商品
app.delete('/products/:id', (req, res) => {
    const productId = req.params.id;
    const deleteQuery = 'DELETE FROM products WHERE id = ?';
    db.query(deleteQuery, [productId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: '删除产品时发生错误' });
        } else {
            // 返回成功消息
            res.status(200).json({ message: '产品已成功删除' });
        }
    });
});

// 修改商品
app.put('/products/:id', (req, res) => {
    const productId = req.params.id;
    const { name, price, quantity, description, image_url } = req.body;
    const updateQuery = `
    UPDATE products 
    SET name = ?, price = ?, quantity = ?, description = ?, image_url = ?
    WHERE id = ?
    `;
    db.query(
        updateQuery,
        [name, price, quantity, description, image_url, productId],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: '更新产品时发生错误' });
            } else {
                // 返回更新后的商品数据
                const updatedProduct = {
                    id: productId,
                    name,
                    price,
                    quantity,
                    description,
                    image_url,
                };
                res.status(200).json(updatedProduct);
            }
        }
    );
});

// 查询所有订单
app.get('/orders', (req, res) => {
    db.query('SELECT * FROM orders', (err, results) => {
        if (err) {
            res.status(500).json({ error: '检索订单数据时出错' });
            return;
        }
        res.json(results);
    });
});

// 创建新订单
app.post('/orders', (req, res) => {
    const { user_name, product_name, product_price } = req.body;
    const insertQuery = 'INSERT INTO orders (user_name, product_name, product_price) VALUES (?, ?, ?)';
    db.query(
        insertQuery,
        [user_name, product_name, product_price],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: '创建订单时发生错误' });
            } else {
                // 返回新创建的订单数据
                const newOrder = {
                    id: result.insertId,
                    user_name,
                    product_name,
                    order_date: new Date(),
                    product_price,
                };
                res.status(200).json(newOrder);
            }
        }
    );
});

app.delete('/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const deleteQuery = 'DELETE FROM orders WHERE id = ?';
    db.query(deleteQuery,[orderId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: '删除订单时发生错误' });
        } else {
            // 返回成功消息
            res.status(200).json({ message: '订单已成功删除' });
        }
    })
})



const fs = require('fs');
// 读取log文件夹下所有文件名
app.post('/getLogFiles', (req, res) => {
    const logDirectory = './client/src/python/log'; // 请替换为你的日志目录路径

    fs.readdir(logDirectory, (err, files) => {
        if (err) {
            console.error('Error reading log directory:', err);
            res.status(500).json({ error: '无法读取文件列表' });
        } else {
            res.status(200).json({ logFiles: files });
        }
    });
});

// // 上传logfile文件：
// // 配置multer来处理文件上传
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadDir = './client/src/python/log'; // 上传文件的目录
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         const originalFileName = file.originalname; //使用原始文件名
//         cb(null, originalFileName);
//     },
// });
//
// const upload = multer({ storage });
//
// // 创建文件上传的API端点
// app.post('/uploadLogFile', upload.single('logfile'), (req, res) => {
//     if (req.file) {
//         res.status(200).json({ message: '文件上传成功' });
//     } else {
//         res.status(400).json({ error: '文件上传失败' });
//     }
// });


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = req.query.path; // 从查询参数中获取路径

        // 检查是否提供了路径字符串
        if (!uploadPath) {
            return cb(new Error('未提供文件夹路径'), null);
        }

        // 确保上传目录存在
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const originalFileName = file.originalname;
        cb(null, originalFileName);
    },
});

const upload = multer({ storage });

app.post('/uploadFile', upload.single('file'), (req, res) => {
    try {
        if (req.file) {
            res.status(200).json({ message: '文件上传成功', path: req.query.path });
        } else {
            res.status(400).json({ error: '文件上传失败' });
        }
    } catch (error) {
        console.error('上传文件时发生错误：', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

//尝试给每个月份目录后面添加上传文件按钮，失败
// const storageed = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // 获取目录名参数，将文件上传到指定目录
//         const uploadDir = `./client/src/python/logreaded/${req.params.item}`;
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         const originalFileName = file.originalname;
//         cb(null, originalFileName);
//     },
// });

// const uploaded = multer({ storageed });

// // 创建文件上传的API端点，接受目录名参数
// app.post('/uploadLogFileeded/:item', uploaded.single('logfile'), (req, res) => {
//     if (req.file) {
//         res.status(200).json({ message: '文件上传成功' });
//     } else {
//         res.status(400).json({ error: '文件上传失败' });
//     }
// });

// 下载文件的API端点
app.get('/downloadLogFile/:item/:filename', (req, res) => {
    const item = req.params.item;
    const filename = req.params.filename;
    
    let filePath;
    
    if (item === 'count') {
        filePath = path.join('./client/src/python/logreaded', filename);
    } else if (item === 'ed') {
        fileitem = filename.split(' ')[0]
        filenameed = filename.split(' ')[1]
        filePath = path.join('./client/src/python/logreaded', fileitem, filenameed);
    } else if (item === 'balance') {
        filePath = path.join('./client/src/python/balancefiles', filename);
    } else {
        filePath = path.join('./client/src/python/log', filename);
    }
    res.download(filePath); // 使用res.download来触发文件下载
});
// app.get('/downloadLogFile/:filename', (req, res) => {
//     const filename = req.params.filename;
//     const filePath = path.join('./client/src/python/log', filename);
//     res.download(filePath); // 使用res.download来触发文件下载
// });
// app.get('/downloadLogFileed/:item/:filename', (req, res) => {
//     const item = req.params.item;
//     const filename = req.params.filename;
//     const filePath = path.join('./client/src/python/logreaded',item, filename);
//     res.download(filePath); // 使用res.download来触发文件下载
// });
// app.get('/downloadLogFilecount/:filename', (req, res) => {
//     const filename = req.params.filename;
//     const filePath = path.join('./client/src/python/logreaded', filename);
//     res.download(filePath); // 使用res.download来触发文件下载
// });

// 删除文件的API端点
app.delete('/deleteLogFile/:item/:filename', (req, res) => {
    const item = req.params.item;
    const filename = req.params.filename;
    let filePath;
    
    if (item === 'count') {
        filePath = path.join('./client/src/python/logreaded', filename);
    } else if (item === 'ed') {
        fileitem = filename.split(' ')[0]   // 不知道为啥这两个会报error，实际不影响功能的使用
        filenameed = filename.split(' ')[1]
        filePath = path.join('./client/src/python/logreaded', fileitem, filenameed);
    } else if (item === 'balance') {
        filePath = path.join('./client/src/python/balancefiles', filename);
    } else if (item === 'backup') {  // 备份文件删除
        filePath = path.join('./client/src/backups', filename);
    } else {
        filePath = path.join('./client/src/python/log', filename);
    }

    // 删除文件
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`删除文件 "${filename}" 出错: ${err}`);
            res.status(500).json({ error: '删除文件时发生错误' });
        } else {
            console.log(`文件 "${filename}" 已成功删除`);
            res.status(200).json({ message: '文件已成功删除' });
        }
    });
});
// app.delete('/deleteLogFile/:filename', (req, res) => {
//     const filename = req.params.filename;
//     const filePath = path.join('./client/src/python/log', filename);

//     // 删除文件
//     fs.unlink(filePath, (err) => {
//         if (err) {
//             console.error(`删除文件 "${filename}" 出错: ${err}`);
//             res.status(500).json({ error: '删除文件时发生错误' });
//         } else {
//             console.log(`文件 "${filename}" 已成功删除`);
//             res.status(200).json({ message: '文件已成功删除' });
//         }
//     });
// });
// app.delete('/deleteLogFileed/:item/:filename', (req, res) => {
//     const item = req.params.item;
//     const filename = req.params.filename;
//     const filePath = path.join('./client/src/python/logreaded', item, filename);

//     // 删除文件
//     fs.unlink(filePath, (err) => {
//         if (err) {
//             console.error(`删除文件 "${filename}" 出错: ${err}`);
//             res.status(500).json({ error: '删除文件时发生错误' });
//         } else {
//             console.log(`文件 "${filename}" 已成功删除`);
//             res.status(200).json({ message: '文件已成功删除' });
//         }
//     });
// });
// app.delete('/deleteLogFilecount/:filename', (req, res) => {
//     const item = req.params.item;
//     const filename = req.params.filename;
//     const filePath = path.join('./client/src/python/logreaded', filename);

//     // 删除文件
//     fs.unlink(filePath, (err) => {
//         if (err) {
//             console.error(`删除文件 "${filename}" 出错: ${err}`);
//             res.status(500).json({ error: '删除文件时发生错误' });
//         } else {
//             console.log(`文件 "${filename}" 已成功删除`);
//             res.status(200).json({ message: '文件已成功删除' });
//         }
//     });
// });

// API端点来获取含有文件的子目录和文件名
app.get('/subdirectoriesWithFiles', (req, res) => {
    const directoryPath = './client/src/python/logreaded'; // 指定目录路径

    // 使用fs.readdirSync获取目录中的所有子目录
    const subdirectories = fs.readdirSync(directoryPath, { withFileTypes: true });

    const directoriesWithFiles = [];

    subdirectories.forEach((item) => {
        if (item.isDirectory()) {
            // 如果是子目录，获取子目录的文件列表
            const subDirectoryPath = path.join(directoryPath, item.name);
            const subDirectoryContents = fs.readdirSync(subDirectoryPath);

            if (subDirectoryContents.length > 0) {
                const subDirectoryInfo = {
                    name: item.name,
                    files: subDirectoryContents,
                };

                directoriesWithFiles.push(subDirectoryInfo);
            }
        }
    });

    res.json(directoriesWithFiles);
});

// 每月总结文件
app.get('/txtFilesInDirectory', (req, res) => {
    const directoryPath = './client/src/python/logreaded'; // 指定目录路径

    // 使用fs.readdirSync获取目录中的文件列表
    const directoryContents = fs.readdirSync(directoryPath);

    // 使用Array.filter筛选出.txt文件
    const txtFiles = directoryContents.filter((fileName) => fileName.endsWith('.txt'));

    res.json(txtFiles);
});

// 下面是执行Python代码的api

app.post('/runPythonScript', (req, res) => {
    const { scriptPathAndName } = req.body; // 从请求体中获取脚本路径和名称的字符串
  
    if (!scriptPathAndName) {
      return res.status(400).send('Missing scriptPathAndName');
    }
  
    const [scriptPath, scriptName] = scriptPathAndName.split('/'); // 拆分路径和名称

  
    exec(`${pythonPath} ${scriptPathAndName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Python脚本执行出错: ${error}`);
        return res.status(500).send('Internal Server Error');
      }
      console.log(`Python脚本输出:\n ${stdout}`);
      res.status(200).json({ stdout });
    });
  });


// 军饷读取文件列表
app.get('/balanceFilesInDirectory', (req, res) => {
    const directoryPath = './client/src/python/balancefiles'; // 修改为指定目录路径

    // 使用fs.readdirSync获取目录中的文件列表
    const directoryContents = fs.readdirSync(directoryPath);

    // 使用Array.filter筛选出.txt文件
    const balanceFiles = directoryContents.filter((fileName) => fileName.endsWith('.txt'));

    res.json(balanceFiles);
});


// 创建 Multer 存储配置
const storage_ba = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './client/src/python/balancefiles'; // 上传文件的目录
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const originalFileName = file.originalname; // 使用原始文件名
        cb(null, originalFileName);
    },
});

const upload_ba = multer({ storage: storage_ba });

// 添加一个中间件来处理文件上传
app.post('/uploadLogFileba', upload_ba.single('logfile'), (req, res) => {
    // 记录请求
    console.log('Received a file upload request.');

    if (req.file) {
        // 记录成功的文件上传
        console.log(`File "${req.file.originalname}" uploaded successfully.`);
        res.status(200).json({ message: '文件上传成功' });
    } else {
        // 记录上传失败
        console.error('File upload failed.');
        res.status(400).json({ error: '文件上传失败' });
    }
});

// 读取军饷文件中的用户名，返回正确的用户名
app.get('/readBalanceFile/:filename', (req, res) => {
    const filename = req.params.filename;

    // 1. 读取军饷文件
    fs.readFile(`./client/src/python/balancefiles/${filename}`, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: '无法读取文件' });
        }

        // 2. 解析数据
        const lines = data.split('\n');
        const validUsernames = [];
        const invalidUsernames = [];

        lines.forEach((line) => {


            const [username, attendance , kills] = line.replace(/\r/g, '').split('    ');

            // 查询数据库以检查用户名是否有效
            const query = `
                SELECT username, company FROM users WHERE LOWER(username) = LOWER(?)
            `;

            // 这里你需要使用你的数据库查询库执行查询并获取结果
            db.query(query, [username], (err, results) => {

                if (!err && results.length) {
                    const company = results[0].company;
                    validUsernames.push({ username, company, attendance, kills });
                } else {
                    invalidUsernames.push({ username, attendance, kills });
                }

                // 判断是否处理完所有行
                if (validUsernames.length + invalidUsernames.length === lines.length) {
                    // 返回有效和无效用户名
                    res.json({ validUsernames, invalidUsernames });
                }
            });
        });
    });
});

// 更新用户的军饷数据
app.post('/increaseBalance', (req, res) => {
    const { username, count } = req.body;

    // 构建更新用户的 balance 查询语句，使用LOWER函数使查询不区分大小写
    const updateBalanceQuery = `
    UPDATE users 
    SET balance = balance + ?
    WHERE LOWER(username) = LOWER(?)
    `;

    db.query(
        updateBalanceQuery,
        [count, username],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: '更新用户 balance 时发生错误' });
            } else {
                res.status(200).json({ message: '用户 balance 已更新' });
            }
        }
    );
});

const cron = require('node-cron');

cron.schedule('0 0 1 * *', () => {
    try {
        // 在这里编写逻辑来更新队友的 balance
        db.query('SELECT * FROM users', (error, teammates) => {
            if (error) {
                console.error('查询队友时出错：', error);
                return;
            }

            teammates.forEach(teammate => {
                // 根据 teammate.ranks 计算增加的 balance
                const balanceToAdd = calculateBalanceBasedOnRanks(teammate.ranks);

                // 更新数据库中的 balance
                db.query('UPDATE users SET balance = balance + ? WHERE username = ?', [balanceToAdd, teammate.username], (err, result) => {
                    if (err) {
                        console.error(`更新用户 ${teammate.username} 的 balance 时出错：`, err);
                    }
                });
            });

            console.log('已更新所有队友的 balance');
        });
    } catch (error) {
        console.error('更新 balance 时出错：', error);
    }
});


// 根据队友的 ranks 计算增加的 balance 的逻辑
function calculateBalanceBasedOnRanks(ranks) {
    let balanceToAdd = 0;

    if (ranks.includes('YB')) {
        balanceToAdd = 1;
    }

    if (ranks.includes('BH') || ranks.includes('XW')) {
        balanceToAdd = 2;
    }

    if (ranks.includes('QH') || ranks.includes('DW')) {
        balanceToAdd = 3;
    }
    return balanceToAdd;
}

// 备份数据库
app.get('/backup/make', (req, res) => {    // 生成唯一的文件名，使用当前时间戳
    const timestamp = new Date().getTime();
    const backupFileName = `backup_${timestamp}.sql`;
    const backupFilePath = path.join('./client/src/backups', backupFileName);

    // 使用 mysqldump 备份 MariaDB 数据库
    const command = `mysqldump --host=${db.config.host} --user=${db.config.user} --password=${db.config.password} ${db.config.database} > ${backupFilePath}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('数据库备份失败: ' + error);
            res.status(500).json({ error: '数据库备份失败' });
        } else {
            console.log('数据库备份成功');
            res.json({ message: '数据库备份成功', fileName: backupFileName });
        }
    });
});
// 列出备份文件的 API 端点
app.get('/backup/list', (req, res) => {
    // const backupFolder = path.join(__dirname, 'backups');
    const backupFolder = './client/src/backups'
    // 读取备份文件夹中的备份文件列表
    fs.readdir(backupFolder, (err, files) => {
        if (err) {
            console.error(`Error reading backup files：${err}`);
            res.status(500).json({ error: 'Error listing backup files' });
        } else {
            res.json({ files });
        }
    });
});

// 下载特定备份文件的 API 端点
app.get('/backup/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join('./client/src/backups', fileName);

    // 检查文件是否存在
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// 从备份文件中还原数据库的 API 端点
app.post('/backup/restore/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join('./client/src/backups', fileName);

    // 检查文件是否存在
    if (fs.existsSync(filePath)) {
        const command = `mysql -u ${db.config.user} -p${db.config.password} -h ${db.config.host} ${db.config.database} < ${filePath}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Restore failed:${stderr}`);
                res.status(500).json({ error: 'Restore failed' });
            } else {
                console.log(`Restore successful from file:${filePath}`);
                res.json({ success: true });
            }
        });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});




app.listen(3000, () => {
    console.log('Server started on port 3000');
});