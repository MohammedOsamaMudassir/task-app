const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')

//Middleware (also called pre and post hooks) are functions which are passed control during execution of asynchronous functions.
//ie we can run some functions before or after some events occur eg just before or after a user is validated or saved etc
// we make our own schema

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    age : {
        type : Number,
        default : 0,
        validate(value) {
            if(value < 0){
                throw new Error ('Age must be a positive number');
            }
        }
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error ('Invalid Email address')
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minlength : 7,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error ('Password cannot contain the string "password"');
            }
        }
    },

    //we will include tokens as an array of objects as part of a user document
    tokens: [{
        token : {
            type : String,
            required : true
        }
    }],

    avatar: {                                      //for storing binary string data for pictures
        type : Buffer
    }
},{
    timestamps : true
})


//make a virtual property. it will not directly exist on the user. not stored on database.
//it is just for mongoose to figure out relation
userSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',         //it is reln between id and task & owner
    foreignField : 'owner'
})


//make our own function to return modified user object
//we want a raw object with user data attached
//we will remove all stuff that mongoose has there like the saving opreation etc
//bts express converts to json as we did but it does to all the object. we can delete some part of it and return
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}

//make our own function
//generate a token
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET) //payload, secret

    //add token to the user and save it ie concatenate the item on to the array
    user.tokens = user.tokens.concat({token : token})
    await user.save();
    return token;
}


//make our own function
//to check if the data provided in /users/login is correct or not.
//we check the hash of passwords using same algo
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email : email});
    if(!user)
        throw new Error('unable to login')
    
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch)
        throw new Error('unable to login')
    return user
}


//hash the plain text before saving
userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//we want to delete tasks or automatically delete tasks when user is deleted
userSchema.pre('remove', async function () {
    const user = this;
    await Task.deleteMany({owner : user._id})
    next()
})

const User = mongoose.model('User', userSchema);

//The problem is that over in Visual Studio code, we didn't get our message a second time ie while saaving while updating. So certain mongoose queries bypass more advanced features like middleware, which means that if we want to use them consistently, we just have to do a tiny bit of restructuring.

// const me = new User({
//     name : 'Mudassir',
//     age : 23,
//     email : 'mohammedosamamudassir123456@gmail.com',
//     password : 'oasasdjpassword'
// })

// me.save().then(() => {                         //wont give error if commented even if password is wrong since we are not doing anything
//     console.log(me);
// }).catch((error) => {
//     console.log(error);
// })

module.exports = User