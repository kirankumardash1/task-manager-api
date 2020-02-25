// CRUD
// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient

// const connectionURL = 'mongodb://127.0.0.1:27017';
// const databaseName = 'task-manager';

// MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
//     if(error){
//         return console.log('Unable to connect to the database');
        
//     }
//     const db = client.db(databaseName);
//     db.collection('tasks').insertMany([
//         {
//             description:'get milk',
//             completed:true
//         }, {
//             description:'get hair cut',
//             completed:false
//         },{
//             description:'pay bill',
//             completed:true
//         }
//     ],(error,result)=>{
//         if(error){
//             return console.log('unable to insert data');
            
//         }
//         console.log(result.ops);
        
//     })



//     db.collection('usersone').insertOne({
//         name: 'Kiran',
//         age: 25
//     }, (error, result) => {
//         if (error) {
//             return console.log('Unable to insert user');

//         }
//         console.log(result.ops);

//     })
//     db.collection('usersone').insertMany([
//         {
//             name:'shank',
//             age:34
//         }, {
//             name:'hans',
//             age:23
//         }
//     ],(error,result)=>{
//             if(error){
//                 return console.log('unable to add the document');
//             }
//             console.log(result.ops);
            

//         })
        

// })
const mongodb = require('mongodb');
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

mongodb.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log('Unable to connect to database');
        
    }
    const db = client.db(databaseName);

    // db.collection('users').updateMany({ name:'Dan'},
    //     {
    //         $set:{
    //             name:'Danel'
    //         }
    //     }
    // ).then((result)=>{
    //     console.log(result.modifiedCount);
        
    // }).catch((error)=>{
    //     console.log(error);
        
    // })(

    db.collection('tasks').deleteMany({completed:true}).then((result)=>{
        console.log('Data deleted successfully'+result); 
    }).catch((error)=>{
        console.log('unable to delete the data');
        
    })
})
