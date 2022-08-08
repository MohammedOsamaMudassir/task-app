//crud

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient; //The Mongo client is going to give us access to the function necessary to connect to the database so we can perform our four basic CRUD operations.
const ObjectID = mongodb.ObjectId;  //to generate our own object ids

// we have to define the connection URL in the database we're trying to connect to.
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

//make our own id
// const id = new ObjectID();
// console.log(id);
// console.log(id.getTimestamp());

//we can now use Mongo client to connect to the server.
MongoClient.connect(connectionURL, {useNewUrlParser : true}, (error, client) => {
    if(error){
        return console.log('Unable to connect to the database!');
    }
    
    const db = client.db(databaseName);
    /*db.collection('users').insertOne({             //insert operations
        //_id : id                                   //we can put our own id like this
        name: 'Osama',
        age: 22
    }, (error, result) => {
        if(error){
            return console.log('unable to insert user')
        }
        console.log(result)
        console.log(result.ops);
    })

    db.collection('users').insertMany([
    {
        name : 'aman',
        age : 22
    },
    {
        name : 'chandan',
        age : 23
    }, (error, result) => {
        if(error) return console.log('unable to insert users');
        console.log(result);
    }])

    db.collection('tasks').insertMany([
    {
        description : 'this is the first task',
        completed : false
    },
    {
        description : 'this is the second task',
        completed : false
    },
    {
        description : 'this is the third task',
        completed : true
    }, (error, result) => {
        if(error) return console.log('unable to insert tasks');
        console.log(result);
    }])


    db.collection('users').findOne({_id : new ObjectID('62ebcc2709b45eba01c5162a')}, (error, user) => {                //read operations
        if(error) return console.log('user not found');
        console.log(user);
    })

    db.collection('users').find({name : 'Osama'}).toArray((error, users) => {
        console.log(users.length);
        console.log(users);
    })

    db.collection('tasks').findOne({_id : new ObjectID('62ebcc2709b45eba01c5162d')}, (error, task) => {
        if(error) return console.log('task not found');
        console.log(task);
    })

    db.collection('tasks').find({completed:false}).count((error, count) => {
        console.log(count);
    })*/

    /*db.collection('users').updateOne({                                  //updating
        _id : new ObjectID('62eb8bbb2101cb58deb1a144')
    },{
        $set : {
            name : 'Mudassir'
        }
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error)
    })

    db.collection('tasks').updateMany({
        completed : false
    },{
        $set : {
            completed : true
        }
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error);
    })*/

    db.collection('users').deleteMany({                      //delete operation
        name : 'Osama'
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error);
    })
});

// at times you'll only have one connection, but you'll see a message saying you have five or six open connections. That's because when we connect with MongoDB, it uses a connection pool, so there's actually more connections that are opened behind the scenes. Even though we've only called Connect Once, that makes sure that our Node.js application can still communicate quickly, even if we're trying to perform a lot of operations at the same time.

//now get a referenct to a database we want to manipulate (task-manager)
//The next thing we need to do before we can insert a document is figure out which collection we're trying to insert the document into.

//to insert data in users collection use collection function. It takes name of collection and data
//insert one is asynchronous. we can add a callback function to see if inserted properly. We can insert a single document using it. same for insert many

/***************************************************************************** */ 
//read commands

//in mongodb ids are guids globally unique identifiers
//one of its main goals, which is the ability to scale well in a distributed system. So we have multiple database servers running instead of just one allowing us to handle heavy traffic where we have a lot of queries coming in with MongoDB and G2 IDs, there's no chance of an ID collision across those database servers with an auto incrementing integer.

//create object id using objectid function. it has 3 parts : timestamp, random no and a serial no. we can get time stamp from it
//ids are actually binary strings. we can see them using id.toHexString().length. if we do that their length will increase from 12 to 24

//find and find one are used to fetch data
//searching for a document that does not exist is not an error. It gives null. findone will return first matched document
//if we want to search by id we have to providee that object id function
//find will return a pointer, not an object. we can do much with it. its return value is cursor. we can convert it to to array. we can use it just to count using .count(). extra mem will not be wasted

/***************************************************************************** */ 
//update commands

//we can use update one and update many

/***************************************************************************** */ 
//Delete commands
//deletemany and deleteone are used
