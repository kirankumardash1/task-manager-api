require('../src/db/mongoose');
const Tasks = require('../src/models/tasks');

Tasks.findByIdAndRemove('5e4db961aa0a2a2ae0b81b17').then((deletedtask)=>{
    console.log(deletedtask)
   return  Tasks.count({Completed:false})
}).then((unfinishedtask)=>{
    console.log(unfinishedtask);
    
}).catch((e)=>{
    console.log(e);
    
})