const mongoose = require('mongoose');
const validator = require('validator');
//const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api';

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
}) 
// const tasks = mongoose.model('tasks',{
//     Description: {
//         type: String
//     },
//     Completed: {
//         type:Boolean
//     }
// })

