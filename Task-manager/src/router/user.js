const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const multer = require('multer');
const {sendWelcomeEmail,sendCancelemail} = require('../emails/account');
//const sharp = require('sharp');

// router.get('/test',(req,res)=>{
//     res.send('Router form a new file');
// })


router.post('/users',async(req,res)=>{
    try{
        const user = new User(req.body);
        await user.save();
        sendWelcomeEmail(user.email,user.name);
        const token = await user.getauthorizationtoken();
        res.status(201).send({user,token});
    }catch(e){
        res.status(400).send(e.message);
    }
});


router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredential(req.body.email,req.body.password);
        const token = await user.getauthorizationtoken();
        res.send({user,token});  
    } catch(e){
        res.status(404).send(e.message);
    }
})


router.get('/users/me',auth, async(req,res)=>{
    try{
       //const users = await  User.find({});
       res.send(req.user)
    }catch(e){
        res.status(500).send(e.message);
    }
})

router.get('/users/:id',async(req,res)=>{
    try{
        const _id = req.params.id;
        const user =await User.findById(_id);
        if(!user){
            return res.status(404).send({_id:"not found"});
        }
        res.send(user);
    }catch(e){
        res.status(500).send(e);
    }
})

router.patch('/users/me',auth,async(req,res)=>{ 
    const updates = Object.keys(req.body);
    const allowedupdates = ['name','password','email','age'];
    const isValidOperation = updates.every((update)=>{
       return allowedupdates.includes(update);
    });
    if(! isValidOperation){
        return res.status(400).send({"error":"Properties not found"});
    }
    try{    
   // const user = await User.findById(req.params.id);
    updates.forEach(async(update)=>{
    req.user[update] = req.body[update];
    });
    await req.user.save();
    
    //const user =  await User.findByIdAndUpdate(req.params.id,req.body,{new: true,runValidators:true,})
    // if(!user){
    //     return res.status(404).send('Unable to find the id');
    // }
    res.send(req.user) 
    }  catch(e){
        res.status(400).send(e);
    }
});


router.delete('/users/me',auth,async(req,res)=>{
    try{
        //old code
        // const user = await User.findByIdAndDelete(req.user._id);
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove();
        sendCancelemail(req.user.email,req.user.name);
        res.send(req.user);
    }catch(e){
        res.status(500).send(e.message);
    }
});


const upload = multer({
    //dest : 'images',
    limits :{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(! file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return cb(new Error('Please provid a .png or jpg format'));
        }
        cb(undefined,true);
    }
})

router.post('/users/me/avatar',auth,upload.single('profilepic'),async(req,res)=>{
    
//    const buffer = await sharp (req.file.buffer).resize({width: 250,height:250}).png().toBuffer();
//    req.user.avatar = buffer 
    req.user.avatar = req.file.buffer
   await req.user.save();
    res.send()
},(error,req,res,next)=>{
   res.status(400).send({'Error':error.message});
})

router.get('/users/:id/avatar',async(req,res)=>{
try{
    const user = await User.findById(req.params.id);
    
if(!user || !user.avatar){
    console.log('inside if');
    throw new Error();
}
res.set({'Content-Type':'image/png '});
res.send(user.avatar)

}catch(e){
    res.status(500).send();
}
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save();
    res.send();
})

router.post('/users/logout',auth,async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token    ;
        })
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save();
        
        res.send();

    } catch(e){
        res.status(500).send();
    }
})

module.exports = router;