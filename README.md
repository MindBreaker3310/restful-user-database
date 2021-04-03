# restful-user-database
 
 
## 🌳環境
- **Node.js**：跨平台運行JavaScript執行環境
- **MongoDB**：非關聯式的文件導向資料庫管理系統
- **Visual Studio Code**：原始碼編輯器
- **Robo 3T**：MongoDB GUI
- **Postman**：HTTP Request工具
 
## 🚩模組 
- **express**：Node.js的web應用框架
- **mongoose**：操作mongoDB API
- **validator**：方便驗證字串是否符合形式
- **bcrypt**：使用各種算法加密字串

## 📃筆記
1. 開啟express
 ```js
 //在index.js下
 
 const mongoose = require('mongoose');
 const userRouter = require('./routers/userRouter.js')

 //確保database有在運行(2.連結至資料庫)
 require('./db/mongoose.js');

 const app = express();
 const port = process.env.PORT || 3000;

 // It parses incoming requests with JSON payloads and is based on body-parser.
 app.use(express.json());

 //使用路由
 app.use(userRouter);

 app.listen(port, ()=>{
     console.log('server is up on port 3000');
 })
 ```
2. 連結至資料庫
 ```js
 //在mongoose.js下

 const express = require('express');

 //連結至資料庫address/資料庫
 mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
     useNewUrlParser: true,
     useCreateIndex: true,
     useUnifiedTopology: true
 })
 ```
3. 建構資料模型
 ```js

 ```
