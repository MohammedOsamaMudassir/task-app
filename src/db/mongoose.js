const mongoose = require('mongoose');
const validator = require('validator')

mongoose.connect(process.env.MONGODB_URL);



/********************************************   Notes ***************************************** */

//mongoose converts datatype names to lowercase and saves

/* validation and sanitization */
//The first is data validation, and the second is data SANITISATION. so with validation, we can enforce that the data conforms to some rules.
//Data Sanitisation allows us to alter the data before saving it. An example of that would be removing empty spaces around the user's name.
//if we leave required as it is, it is set as false. we can crate an object without it. if true then it will be an error
//we can make our own validators using functions
//trim takes out extra spaces at beginning or end. same for lowecase and default

/* ***********************rest api ********************************************************* */
//aka restful api
// an api is a set of tools that allow us to build something

//there are three main pieces in a request to server. First up line number one, this is known as the request line. This contains the HTTP method being used, the path and the HTTP protocol. In this case, we know that the combination of post with forward slash tasks means that we're trying to create a new task resource. Now, after that request line, we have as many request headers as we need.
//Here we have three except connection and authorization.
//Headers are nothing more than key value pairs which allow you to attach meta information to the request. So here we are using except to say that we're expecting JSON data back, which is what we'll get.
//After we're done with the headers, we have an empty line followed by the request body. So when we post data to forward slash tasks, we have to provide that data and we provide it as JSON right inside of the request body. Down below I have the following where I set up description giving it the value of order new drill bits.

//Now, once the server gets this request, it's going to be able to parse it and Express does great work.
//And it sends back a response which looks quite similar to the request. Here we have the status line which contains the protocol followed by the status code, followed by a text representation of the status code.
//Next up, we do indeed have an empty line followed by the response body, which in this case is the complete task with the ID and completed values set up. And right here we have the description, we provide it.

/* *********************** ********************************************************* */
//user and tasks are exported to their respective files