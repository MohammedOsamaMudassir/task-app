const express = require('express');
const router = new express.Router();
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e){
        res.status(400).send(e)
    }

    // user.save().then(()=>{              //without async await
    //     res.status(201).send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)     //response code. before sending error
    // })
    
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout',auth,  async (req, res) =>{
    try{
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth,  async (req, res) =>{
    try{
        req.user.tokens = [];
        await req.user.save()
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})


//And that is a way to get your own profile, to get the profile for the currently authenticated user. The route for this will still be get since we're getting data and it's going to be forward slash users, forward slash me. This is going to allow someone to get their own profile and there's no need to provide the ID for your own user.

//As the authentication token has that information embedded now we can go ahead and remove everything we have in the function and all we need to do is send back that user profile.
//Now, when we created the auth middleware, we assigned that to request user and we know that this function is only going to run if the user is actually authenticated, which means that right here all we need to do is use response send to send back request, dot user.

router.get('/users/me', auth,  async (req, res) => {            //code to get users using mongoose

    res.send(req.user);

    // try{
    //     const users = await User.find({})
    //     res.send(users)
    // }catch{
    //     res.status(500).send()
    // }

    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch(e => {
    //     res.status(500).send()
    // })
})

//if we want a dynamic url, we can do it using express
//So what we want to do is capture whatever value is put right here after this second forward slash and get access to it in the root handler so we can fetch the user correctly. 
//To do that, Express gives us access to something called root parameters. These are parts of the URL that are used to capture dynamic values, and it looks a little bit like this

//mongoose automatically converts string ids to object ids

//this part is commented because a user cannot be viewed by entering its id
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try{
        const user = await User.findById(_id)
        if(!user) return res.status(404).send();
        res.send(user);
        
    }catch(e){
        res.status(500).send()
    }
})


//we should be able to remove us, not another user by id. so /:id changed to /me
router.patch('/users/me', auth, async (req, res) =>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error : 'Invalid Updates'})
    }

    try{
        //modification for mongoose for using bcrypt
        //const user = await User.findById(req.params.id);
        updates.forEach((update)=> req.user[update] = req.body[update])
        await req.user.save();

        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators:true})
        //if(!user) return res.status(404).send()

        res.send(req.user);

    }catch(e){
        res.status(400).send(e);
    }
})

//we should be able to remove us, not another user by id. so /:id changed to /me
//we also dont need to check if user exists since it is /me
router.delete('/users/me', auth,  async (req, res) => {
    try{
        // const user = await User.findByIdAndDelete(req.user._id) //we can use req.user_id cuz we are using middelware.
        // if(!user) return res.status(404).send()
        await req.user.remove();
        res.send(req.user);

    }catch(e){
        res.status(500).send();
    }
})


//we will validate file size and type
const upload = multer({
    //dest : 'avatar',                          //for making it available to route handler, this is commented
    limits : {
        fileSize : 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar',auth,  upload.single('avatar'), async (req, res) =>{                  //avatar here must match that in postman
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();

    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error, req, res, next)=>{                               //object for error handling
    res.status(400).send({error : error.message})
})

//delete an avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send()
})

//get an avatar
router.get('/users/:id/avatar', async (req, res) =>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) throw new Error()

        res.set('Content-Type', 'image/png')  //for json, this will be automatically done. This is a response header. we have to change it to jpg to return buffer
        res.send(user.avatar)
    }catch (e){
        res.status(404).send()
    }
})

module.exports = router;


/* ****************************************** notes ****************************************** */
//Jwt is used for authorozn not authentication ie, we see if it is the same user that is sending all requests
//can do this usign cookie. server will see cookies and see if it is the same user. server will send the session id as a cookie. when client makes another request, server will authorize it with key stored on it
//jwt does not use cookies. it uses a web token
// it gives a token to client at login. when client makes another request, the server will authorize that token ie it will see if it has bee tampered with. it no then proceed. server will not store anything.
//client can store this cookie as a cookie
//the actual data client is looking for is stored on web token. the server just points towards it after authorizing
//data in token includes header, body(id, data, expire date/issued at), and verify signature
//first two parts are verified using third part
//verification is done using some secret key that only user has

//object argument in jwt contains data that will be embedded in your token

/* ****************************************** middleware auth ****************************************** */
//All we do is pass it in as an argument to the get method before we pass in our route. Handler So right here, the route handler is the second argument to get. We're going to go ahead and move it to the third argument position.
//And the second argument is going to be the middleware function to run, which in our case is off.
//So now when someone makes a get request to forward slash users, it's first going to run our middleware, then it'll go ahead and run the route handler Now remember, it's only ever going to run the route handler if the middleware calls that next function.
//we want to authenticate everything except login and signup

/* ****************************************** postman ****************************************** */
//So we have pre request script where we can add some JavaScript code to run before the request is sent off.
//In this case, before the login request is sent off, we also have tests. Now this runs after the response is received and in here we can write some JavaScript code to extract that token property on the body and set an environment variable whose value is equal to that token.


/* ****************************************** multer ****************************************** */
//The problem is that our root handler, this function right here, it does not get access to the file data that was uploaded. That's because Molitor runs first and it processes the image, saving the image to the Avatars directory. Now Alter does give us a way to actually access the data inside of here, and all we need to do to get that done is remove the DEST property from our options object up above.

//req.file has data about file. we can access this only when we dont have dest property

/* ****************************************** sharp ****************************************** */
//for resizing the images we send. it uses many libraries bts and converts the buffer we provide it
//we can resize, convert to png etc


/* ****************************************** postmark ****************************************** */
//close account????