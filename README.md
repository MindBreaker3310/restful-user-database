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
//在User.js下

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//建立一個User Schema(概要, 議程)
const userSchema = new mongoose.Schema({
    email: {
        type: String,  //資料型別
        unique: true,  //唯一性
        required: true,  //是否為必須
        trim: true,  //修剪多餘空格
        lowercase: true,  //轉換成小寫
        validate(value) {  //驗證輸入
            //用validator library 的isEmail來驗證value是否為email格式
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,  //最小長度
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('密碼裡面不能有password')
            }
        }
    }
})

//建立一個資料模型
const User = mongoose.model('User', userSchema)

module.exports = User
 ```
