const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Tasks = require('./models/tasks');
const userRouter = require('./router/user');
const taskRouter = require('./router/task');

const app = express();
const port = process.env.PORT

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port,()=>{
    console.log('server listen onport number '+port);
});
const bcrypt = require('bcryptjs');





// const myFunction= async()=>{
//     const password = 'fsdfsfd';
//     const hashPassword = await bcrypt.hash(password,8);
//     const isMatch = await bcrypt.compare(password,hashPassword)
//     console.log(isMatch);
    
// };

// myFunction();

// const myFunction= async()=>{
//  const task =  await Tasks.findById('5e52de7c303f7d277818df35');
//   await task.populate('owner').execPopulate();
//   console.log(task.owner);
  
// const user = await User.findById('5e52de69303f7d277818df33');
// await user.populate('tasks').execPopulate();
// console.log(user.tasks);

// }

// myFunction();