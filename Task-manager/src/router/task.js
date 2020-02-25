const exprss = require('express');
const auth = require('../middleware/auth');
const router = new exprss.Router();
const Tasks = require('../models/tasks');


router.post('/tasks',auth,async(req,res)=>{
    try{
        //const tasks = new Tasks(req.body);
        const tasks = new Tasks({
            ...req.body,
            owner: req.user._id    
        })
        await tasks.save();
        res.send(tasks);
    }catch(e){
        res.status(500).send(err);
    }
});

router.get('/tasks',auth,async(req,res)=>{
    const sort ={};
    
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1]==='desc'?-1:1
        
    }
    
    const match ={}
        if(req.query.Completed ){
           match.Completed=req.query.Completed==='true';
        }
       
    try{
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit :parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
      //const tasks= await Tasks.find({owner:req.user._id});
      res.send(req.user.tasks);
    }catch(e){
        res.status(500).send(e);
    }
    
});


router.get('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id;
try{
   //const tasks = await Tasks.findById(_id);
   const tasks = await Tasks.findOne({_id,owner:req.user._id})
    if(!tasks){
        return res.status(404).send("Task not found");
    }
    res.send(tasks);
}catch(e){
    res.status(500).send(e.message);
}
});

router.patch('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id;
    var updates = Object.keys(req.body);
    var allowedupdates = ['Completed','Description'];
    const isallowed = updates.every((update)=>{
       return allowedupdates.includes(update);
    });
    if(!isallowed){
        return res.status(404).send({'Error':'The properties is not defined'})
    }
    try{
        tasks = await Tasks.findOne({_id,owner:req.user._id});
        if(!tasks){
            return res.status(404).send('Task not found');
        }

        updates.forEach((update)=>{
            tasks[update] = req.body[update];

        })
       await tasks.save()
        //const tasks =await Tasks.findByIdAndUpdate(req.params.id,req.body,{new:true,isValidOperation:true});
       
        res.send(tasks);
    } catch(e){
        res.status(400).send(e.message);
    } 
})


router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const tasks = await Tasks.findOneAndDelete({_id:req.params.id,owner:req.user._id});
        if(!tasks){
            return res.status(404).send('Task not found');
        }
        res.send(tasks);
    } catch(e){
        res.status(500).send(e.message);
    }
})

module.exports = router;
