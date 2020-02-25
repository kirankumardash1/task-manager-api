require('../src/db/mongoose')
const User = require('../src/models/user');


User.findByIdAndUpdate('5e4ecdceb315071dd0a55f93',{age: 1}).then((user)=>{
console.log(user);
return User.count({age:1})
}).then((result)=>{
console.log(result);

}).catch(()=>{

})