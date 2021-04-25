const mongoose = require('mongoose')

const url = process.env.MONGO_URL

mongoose.connect(url, {
    useCreateIndex: true, 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false,
})
