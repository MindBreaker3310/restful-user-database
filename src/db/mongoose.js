const mongoose = require('mongoose');

//連結至資料庫address/資料庫
mongoose.connect('mongodb://127.0.0.1:27017/user-manager', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})


