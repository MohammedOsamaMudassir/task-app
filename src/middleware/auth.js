const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')      //we can access headers using this way
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) throw new Error()

        req.token = token             //we do this so as when we logout, we dont want to logout of all devices. we just want to delete one token

        req.user = user
        next()
        //console.log(token)
    } catch (e) {
        res.status(401).send({ error: 'Authenticate yourself' })
    }
}

module.exports = auth;


//Now, the whole authentication process starts with the client taking that authentication token that they get from signing up or logging in and providing it with the request they're trying to perform.

//Now when we work with headers, we can provide them as part of the request. So sending them from the client to the server and we can also have headers sent back as part of the response so the server can send back some headers to the original requester. In this case, we want to set up headers that get sent as part of the request.

//The authorization header is going to have the following value. It's going to start off with bearer. So b e a r e r that is a capital B followed by a space followed by the token. So this is known as a bearer token in which the client provides the token with the request they're trying to perform. And this is all the client is going to need to do to actually provide the information necessary to get authenticated.

//So the next thing we want to do is get the JWT out of that header and we want to go ahead and verify that it's correct using the same secret we used when we generated it.