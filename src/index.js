const express = require('express');

//確保database有在運行
require('./db/mongoose.js');
const userRouter = require('./routers/userRouter.js')

const app = express();
const port = process.env.PORT || 3000;

// It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());
app.use(userRouter);


//加密練習
// const bcrypt = require('bcryptjs')
// const myFunction = async ()=>{
//     const password = 'Red123456'
//     const hashPassword = await bcrypt.hash(password, 8);
//     console.log(password);
//     console.log(hashPassword);
// }
// myFunction()


app.listen(port, ()=>{
    console.log('server is up on port 3000');
})
