const express = require('express');

//確保database有在運行
require('./db/mongoose.js');
const userRouter = require('./routers/userRouter.js')
const accountRouter = require('./routers/accountRouter.js')

const app = express();
const port = process.env.PORT || 3000;

//middleware 要寫在app.use(userRouter)
// app.use((req, res, next) => {
//     if(req.method === 'GET'){
//         res.send('GET方法關閉中')
//     }else{
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('伺服器維修中...')
// })



// It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());
app.use(userRouter);
app.use(accountRouter);


app.listen(port, () => {
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

//連結不同的collection 練習
// const Account = require('./model/account.js')
// const User = require('./model/user.js')
// const myFunction = async ()=>{
//     //account -> user
//     //用account collection的_id去搜尋
//     const account = await Account.findById('60694dce4523e4590c6f92be')
//     //populate('owner')可以用owner作為外鍵搜尋，並暫時儲存到owner欄位裡(還沒save()到database)
//     await account.populate('owner').execPopulate()//加上.execPopulate()則是回傳Promise，不加是callback
//     console.log(account);

//     console.log('================================');
//     //user -> account
//     //先在user.js內建立虛擬欄位'accounts'
//     //並用user collection的_id去搜尋
//     const user = await User.findById('6068c3bf241905598066be29')
//     //populate('accounts')用先前建立的虛擬欄位'accounts'作為外鍵搜尋，並暫時儲存到accounts欄位裡(還沒save()到database)
//     await user.populate('accounts').execPopulate()
//     console.log(user.accounts);

// }
// myFunction()