const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tasks= require('../models/tasks')



const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        email: {
            type: String,
            unique: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Please check the Email and entered again');
                }
            }
        },
        
        password:{
            type: String,
            required: true,
            validate(value){
                if(value.toLowerCase().includes('password')){
                    throw new Error ('Password cant contain "password"');
                }
            }
            
        },
        age: {
            type: Number,
            required: true,
            validate(value){
                if(value<0){
                    throw new Error ('Age cant be a negative number')
                }
            }
        },
        tokens:[
           {
            token:{
                type:String,
                required:true
            }
           }
        ],
        avatar:{
            type:Buffer
        }
    },{
        timestamps: true
    }
    );
    userSchema.virtual('tasks',{
        ref:'Tasks',
        localField:'_id',
        foreignField: 'owner'
    });
    userSchema.methods.toJSON = function(){
       const userObject = this.toObject();
       delete userObject.password;
       delete userObject.tokens;
       delete userObject.avatar;
       return userObject;
    }

    userSchema.methods.getauthorizationtoken = async function(){
        const token = jwt.sign({_id:this._id.toString()},process.env.JWT_SECRET);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }

    
    userSchema.statics.findByCredential= async(email,password)=>{
        const user = await User.findOne({email:email});
        if(!user){
            throw new Error('Unable to log in please check the email and password');
        }
        const isValid = await bcrypt.compare(password,user.password);
        if(!isValid){
            throw new Error('Unable to log in please check the email and password');
        }
        return user;
    }

    //Hash the plain text for password before saving
    userSchema.pre('save',async function(next){
        const user = this;
        
        if (user.isModified('password')){
            user.password = await bcrypt.hash(user.password,8);
           
        }

        next();
    })

    //Delete user task when user is removed
    userSchema.pre('remove',async function(next){
        Tasks.deleteMany({owner: this._id})
        next();
    })
const User = mongoose.model('User',userSchema)



module.exports = User ;
