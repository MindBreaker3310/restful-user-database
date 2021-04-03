const express = require('express');

//確保database有在運行
require('./db/mongoose.js');
const userRouter = require('./routers/userRouter.js')

const app = express();
const port = process.env.PORT || 3000;

// It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());
app.use(userRouter);


app.listen(port, ()=>{
    console.log('server is up on port 3000');
})


//加密練習
// const bcrypt = require('bcryptjs')
// const myFunction = async ()=>{
//     const password = 'Red123456'
//     const hashPassword = await bcrypt.hash(password, 8);
//     console.log(password);
//     console.log(hashPassword);
// }
// myFunction()


//json web token 練習
// const jwt = require('jsonwebtoken')
// const myFunction = async ()=>{
//     //sign一個unique的id到token
//     const token = jwt.sign({ _id: 'abc123' }, 'thisiskey')
//     console.log(token);
//     //token如下被分為三段並用base64編碼加密過 私鑰為'thisiskey'
//     //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhYmMxMjMiLCJpYXQiOjE2MTc0MzA1NjF9.QWgVHwyr2vBqXtAfpylDRb-3JS2TtR86svOhO3yQMak
//     //第一段.第二段.第三段
//     //第一段 就是header  >> {"alg":"HS256","typ":"JWT"}  alg演算法, typ格式
//     //第二段 我們傳的payload  >>  {"_id":"abc123","iat":1617428166} _id我們給的, iat(Issued at)創建的時間戳
//     //第三段 Signature
// }
// myFunction()