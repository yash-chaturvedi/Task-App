const mongoose = require('mongoose')

const url = "mongodb+srv://zeref:12349876@tasks.qawjq.mongodb.net/database?retryWrites=true&w=majority";

mongoose.connect(url, {
    useCreateIndex: true, 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false,
})
