const express = require('express');
require('./db/mongoose')     //to make mongoose run
const User =  require('./models/user')
const Task = require('./models/task')

//we cannot have all routes in the same application
//so we create router using express, setup the routes and register it with the express application
//user and task are routed to different files
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT

//middleware for authentication
//we made a seperate file for auth
// app.use((req, res, next) => {
//     res.status(503).send('Website under maintenance');
// })

app.use(express.json())   //automatically parse incoming json from post method
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=>{
    console.log('server is up on port' + port);
})


//middleware should be above routes usage
//without expresss middleware         new request ---> run route handler
//with middleware            new request ---> do something  ---> run route handler
//we must call next in (do something) if we want to move forward
//get post patch etc are methods. and /users, /tasks are paths


//for files we will use multer. it will convert data to binary format and send to the server (FORM DATA)
//key value must match with what you provided while creating mutler 
//to handle errors in multer, we  will place a callback function in routing function at the end with four arguments